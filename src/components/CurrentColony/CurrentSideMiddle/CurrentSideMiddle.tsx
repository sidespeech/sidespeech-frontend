import ChatComponent from "../ChatComponent/ChatComponent";
import { useMiddleSide } from "../CurrentSide";
import ChannelView from "./ChannelView";

export default function CurrentSideMiddle() {
  const {
    selectedRoom,
    selectedChannel
  } = useMiddleSide();

  return (
    <div className="middle-container-center-colony">
      {!selectedChannel && selectedRoom && (
        <ChatComponent room={selectedRoom} />
      )}
      {selectedChannel && <ChannelView />}
    </div>
  );
}
