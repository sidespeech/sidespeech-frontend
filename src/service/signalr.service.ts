import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { trigger } from "../helpers/CustomEvent";
import { BASE_URL } from "../constants/constants";

let instance: SignalRService;
class SignalRService {
  public connection: HubConnection | null = null;

  static getInstance() {
    if (!instance) instance = new SignalRService();
    return instance;
  }
  connectToSignalR() {
    if (this.connection !== null) return;
    this.connection = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/signalRService`)
      .withAutomaticReconnect()
      .build();
    this.connection.on("ReceiveMessage", (data: any) => {
      console.log(data);
    });
    this.connection
      .start()
      .then((result: any) => {
        console.log("Connected!");
        this.sendMessage("coucou");
      })
      .catch((e: any) => console.log("Connection failed: ", e));
  }

  sendMessage(data: any) {
    this.connection?.send("SendMessage", data);
  }
}
export default SignalRService.getInstance();
