import { trigger } from "../helpers/CustomEvent";
import { WEBSOCKET_URL } from "../constants/constants";
import { io, Socket } from "socket.io-client";
import { EventType } from "../constants/EventType";
import { Announcement } from "../models/Announcement";

let instance: WebSocketService;
class WebSocketService {
  public socket: Socket | null = null;

  static getInstance() {
    if (!instance) instance = new WebSocketService();
    return instance;
  }
  connectToWebSocket() {
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
    this.socket.on("newAnnouncement", async (data) => {
      trigger(EventType.RECEIVE_ANNOUNCEMENT, data);
    });
    this.socket.on("newComment", async (data) => {
      trigger(EventType.RECEIVE_COMMENT, data);
    });
  }

  login(user: any, rooms: any) {
    this.socket?.emit("login", {
      user: { id: user.id, username: user.accounts },
      rooms: rooms,
    });
  }

  sendMessage(message: string, roomId: string, sender: string) {
    this.socket?.emit("sendMessage", {
      message: message,
      roomId: roomId,
      sender: sender,
    });
  }
  sendAnnouncement(announcement: Announcement) {
    this.socket?.emit("sendAnnouncement", {
      announcement,
      channelId: announcement.channelId,
    });
  }
  sendComment(comment: any) {
    this.socket?.emit("sendComment", {
      comment,
    });
  }

  addRoomToUsers(roomId: string, profiles: string[]) {
    this.socket?.emit("addRoomToUsers", {
      roomId,
      profiles,
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
