import { trigger } from "../helpers/CustomEvent";
import { BASE_URL } from "../constants/constants";
import { io, Socket } from "socket.io-client";

let instance: WebSocketService;
class WebSocketService {
  public socket: Socket | null = null;

  static getInstance() {
    if (!instance) instance = new WebSocketService();
    return instance;
  }
  connectToWebScoket() {
    if (this.socket !== null || !BASE_URL) return;
    this.socket = io(BASE_URL);
    this.socket.on("connect", () => {
      console.log("connected");
    });

    this.socket.on("disconnect", () => {
      console.log("disconnected");
    });

    this.socket.on("message", async (data) => {
      console.log(data);
    });
  }

  sendMessage(message: string, room: string) {
    this.socket?.emit("sendMessage", {
      message: message,
      room: message,
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
