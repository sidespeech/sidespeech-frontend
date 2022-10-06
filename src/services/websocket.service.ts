import { trigger } from "../helpers/CustomEvent";
import { WEBSOCKET_URL } from "../constants/constants";
import { io, Socket } from "socket.io-client";
import { EventType } from "../constants/EventType";

let instance: WebSocketService;
class WebSocketService {
  public socket: Socket | null = null;

  static getInstance() {
    if (!instance) instance = new WebSocketService();
    return instance;
  }
  connectToWebScoket() {
    if (this.socket !== null || !WEBSOCKET_URL) return;
    this.socket = io(WEBSOCKET_URL + "/");
    this.socket.on("connect", () => {
      console.log("connected");
    });

    this.socket.on("disconnect", () => {
      console.log("disconnected");
    });

    this.socket.on("message", async (data) => {
      trigger(EventType.RECEIVE_MESSAGE, data);
    });
  }

  login(profile: any) {
    this.socket?.emit("login", {
      user: { id: profile.id, username: profile.username },
      rooms: profile.rooms.map((r: any) => r.id),
    });
  }

  sendMessage(message: string, roomId: string, sender: string) {
    this.socket?.emit("sendMessage", {
      message: message,
      roomId: roomId,
      sender: sender,
    });
  }

  deconnectWebsocket() {
    if (!this.socket) return;
    this.socket.off("connect");
    this.socket.off("disconnect");
    this.socket.off("message");
  }
}
export default WebSocketService.getInstance();
