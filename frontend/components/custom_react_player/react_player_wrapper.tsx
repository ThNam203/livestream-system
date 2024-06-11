import { LegacyRef } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";

export default function ReactPlayerWrapper(
  props: ReactPlayerProps & {
    playerRef: LegacyRef<ReactPlayer>;
  }
) {
  return <ReactPlayer ref={props.playerref} {...props} />;
}
