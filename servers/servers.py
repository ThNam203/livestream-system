from __future__ import annotations
from pathlib import Path
from multiprocessing import Process

import asyncio
import logging
import os
from asyncio import StreamReader

from pyrtmp import StreamClosedException
from pyrtmp.flv import FLVMediaType, FLVWriter
from pyrtmp.rtmp import RTMPProtocol, SimpleRTMPController, SimpleRTMPServer
from pyrtmp.session_manager import SessionManager

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

class RTMP2SocketController(SimpleRTMPController):

    def __init__(self, output_directory: str, server_port: int):
        self.output_directory = output_directory
        self.server_port = server_port

        self.SOURCE = "pipe:0"
        self.MASTER_FILE = "index.m3u8"
        self.HLS_TIME = 2
        self.CRF_P = 21
        self.PRESET_P = "ultrafast"

        self.V_RESO_0 = "640x360"
        self.V_MAX_BITRATE_0 = "365k" 
        self.V_FPS_0 = 30
        self.V_G_0 = self.HLS_TIME * self.V_FPS_0
        self.V_KEYINT_MIN_0 = self.HLS_TIME
        self.V_BUFSIZE_0 = "730k"

        self.V_RESO_1 = "1280x720"
        self.V_MAX_BITRATE_1 = "4.5M"
        self.V_FPS_1 = 60
        self.V_G_1 = self.HLS_TIME * self.V_FPS_1
        self.V_KEYINT_MIN_1 = self.HLS_TIME
        self.V_BUFSIZE_1 = "9M"

        self.V_RESO_2 = "1920x1080"
        self.V_MAX_BITRATE_2 = "7.8M"
        self.V_FPS_2 = 60
        self.V_G_2 = self.HLS_TIME * self.V_FPS_2
        self.V_KEYINT_MIN_2 = self.HLS_TIME
        self.V_BUFSIZE_2 = "15.6M"

        super().__init__()

    async def on_ns_publish(self, session, message) -> None:
        publishing_name = message.publishing_name
        saveFolder = os.path.join(self.output_directory, f"/var/www/origin/{publishing_name}")
        ffmpegLogFolder = os.path.join(self.output_directory, "ffmpeg_log")
        Path(ffmpegLogFolder).mkdir(parents=True, exist_ok=True)
        Path(saveFolder).mkdir(parents=True, exist_ok=True)
        session.state = RemoteProcessFLVWriter()

        await session.state.initialize(
            command=f'ffmpeg -re -i {self.SOURCE} \
                        -preset {self.PRESET_P} -g X -keyint_min X -sc_threshold 0 -c:v libx264 -pix_fmt yuv420p -crf {self.CRF_P} \
                        -map v:0 -s:0 {self.V_RESO_0} -r:0 {self.V_FPS_0} -maxrate:0 {self.V_MAX_BITRATE_0} -bufsize:0 {self.V_BUFSIZE_0} -g:0 {self.V_G_0} -keyint_min:0 {self.V_KEYINT_MIN_0} \
                        -map v:0 -s:1 {self.V_RESO_1} -r:1 {self.V_FPS_1} -maxrate:1 {self.V_MAX_BITRATE_1} -bufsize:1 {self.V_BUFSIZE_1} -g:1 {self.V_G_1} -keyint_min:1 {self.V_KEYINT_MIN_1} \
                        -map v:0 -s:2 {self.V_RESO_2} -r:2 {self.V_FPS_2} -maxrate:2 {self.V_MAX_BITRATE_2} -bufsize:2 {self.V_BUFSIZE_2} -g:2 {self.V_G_2} -keyint_min:2 {self.V_KEYINT_MIN_2} \
                        -map a:0 -map a:0 -map a:0 -c:a aac -b:a 128k -ac 1 -ar 44100\
                        -f hls -hls_time {self.HLS_TIME} -hls_delete_threshold 5 \
                        -hls_list_size 5 -hls_flags delete_segments \
                        -master_pl_name {self.MASTER_FILE} \
                        -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" {saveFolder}/%v/stream.m3u8',
            stdout_log=f"{ffmpegLogFolder}/{self.server_port}.stdout.log",
            stderr_log=f"{ffmpegLogFolder}/{self.server_port}.stderr.log",
        )
        session.state.write_header()
        await super().on_ns_publish(session, message)

    async def on_metadata(self, session, message) -> None:
        session.state.write(0, message.to_raw_meta(), FLVMediaType.OBJECT)
        await super().on_metadata(session, message)

    async def on_video_message(self, session, message) -> None:
        session.state.write(message.timestamp, message.payload, FLVMediaType.VIDEO)
        await super().on_video_message(session, message)

    async def on_audio_message(self, session, message) -> None:
        session.state.write(message.timestamp, message.payload, FLVMediaType.AUDIO)
        await super().on_audio_message(session, message)

    async def on_stream_closed(self, session: SessionManager, exception: StreamClosedException) -> None:
        await session.state.close()
        await super().on_stream_closed(session, exception)


class RemoteProcessFLVWriter:
    def __init__(self):
        self.proc = None
        self.stdout = None
        self.stderr = None
        self.writer = FLVWriter()

    async def initialize(self, command: str, stdout_log: str, stderr_log: str):
        self.proc = await asyncio.create_subprocess_shell(
            command,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        self.stdout = asyncio.create_task(self._read_to_file(stdout_log, self.proc.stdout))
        self.stderr = asyncio.create_task(self._read_to_file(stderr_log, self.proc.stderr))

    async def _read_to_file(self, filename: str, stream: StreamReader):
        fp = open(filename, "w")
        while not stream.at_eof():
            data = await stream.readline()
            fp.write(data.decode())
            fp.flush()
        fp.close()

    def write_header(self):
        buffer = self.writer.write_header()
        self.proc.stdin.write(buffer)

    def write(self, timestamp: int, payload: bytes, media_type: FLVMediaType):
        buffer = self.writer.write(timestamp, payload, media_type)
        self.proc.stdin.write(buffer)

    async def close(self):
        await self.proc.stdin.drain()
        self.proc.stdin.close()
        await self.proc.wait()


class SimpleServer(SimpleRTMPServer):
    def __init__(self, output_directory: str):
        self.output_directory = output_directory
        super().__init__()

    async def create(self, host: str, port: int):
        loop = asyncio.get_event_loop()
        self.server = await loop.create_server(
            lambda: RTMPProtocol(controller=RTMP2SocketController(self.output_directory, port)),
            host=host,
            port=port,
        )

async def init_server(process_port):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    server = SimpleServer(output_directory=current_dir)
    await server.create(host="0.0.0.0", port=process_port)
    await server.start()
    await server.wait_closed()

def run_server(port):
    asyncio.run(init_server(port))
    
def main():
    ports = [1936, 1937, 1938, 1939]
    processes = []
    try:
        for port in ports:
            process = Process(target=run_server, args=(port,))
            process.start()
            processes.append(process)

    except KeyboardInterrupt:
        for process in processes:
            process.terminate()
            process.join()

if __name__ == "__main__":
    main()
