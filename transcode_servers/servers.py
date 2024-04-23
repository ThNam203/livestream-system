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

    def __init__(self, output_directory: str):
        self.output_directory = output_directory
        self.SOURCE="pipe:0"
        self.MASTER_FILE="index.m3u8"
        self.HLS_TIME=4
        self.CRF_P=21
        self.PRESET_P="ultrafast"
        self.V_SIZE_1="960x540"
        self.V_SIZE_2="416x234"
        self.V_SIZE_3="640x360"
        self.V_SIZE_4="768x432"
        self.V_SIZE_5="1280x720"
        self.V_SIZE_6="1920x1080"
        super().__init__()

    async def on_ns_publish(self, session, message) -> None:
        publishing_name = message.publishing_name
        saveFolder = os.path.join(self.output_directory, f"hls/{publishing_name}")
        Path(saveFolder).mkdir(parents=True, exist_ok=True)
        session.state = RemoteProcessFLVWriter()
        await session.state.initialize(
            command=f'ffmpeg -re -i {self.SOURCE} \
                        -preset {self.PRESET_P} -sc_threshold 0 -c:v libx264 -pix_fmt yuv420p -crf {self.CRF_P} \
                        -map v:0 -s:0 {self.V_SIZE_1} -maxrate:0 2M -bufsize:0 4M \
                        -map v:0 -s:1 {self.V_SIZE_2} -maxrate:1 145k -bufsize:1 290k \
                        -map v:0 -s:2 {self.V_SIZE_3} -maxrate:2 365k -bufsize:2 730k \
                        -map v:0 -s:3 {self.V_SIZE_4} -maxrate:3 730k -bufsize:3 1460k \
                        -map v:0 -s:4 {self.V_SIZE_5} -maxrate:4 3M -bufsize:4 6M \
                        -map v:0 -s:5 {self.V_SIZE_6} -maxrate:5 6M -bufsize:5 12M \
                        -map a:0 -map a:0 -map a:0 -map a:0 -map a:0 -map a:0 -c:a aac -b:a 128k -ac 1 -ar 44100\
                        -f hls -hls_time {self.HLS_TIME} -hls_playlist_type event \
                        -master_pl_name {saveFolder}/{self.MASTER_FILE} \
                        -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3 v:4,a:4 v:5,a:5" {saveFolder}/stream_%v.m3u8',
            stdout_log=f"{self.output_directory}/ffmpeg.stdout.log",
            stderr_log=f"{self.output_directory}/ffmpeg.stderr.log",
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
            lambda: RTMPProtocol(controller=RTMP2SocketController(self.output_directory)),
            host=host,
            port=port,
        )


async def init_server(port, process_name):
    current_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"{process_name}")
    server = SimpleServer(output_directory=current_dir)
    await server.create(host="0.0.0.0", port=port)
    await server.start()
    await server.wait_closed()

def run_server(port, process_name):
    print(process_name, "is running")
    asyncio.run(init_server(port, process_name))
    
def main():
    # Change the number of processes as desired
    ports = [1935, 1936, 1937, 1938]
    processes = []
    for port in ports:
        process = Process(target=run_server, args=(port, str(port),))
        process.start()
        processes.append(process)
    
    # Wait for all processes to complete
    for process in processes:
        process.join()

if __name__ == "__main__":
    main()
