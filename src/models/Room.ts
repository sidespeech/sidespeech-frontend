export class Room {
  id: string;
  name: string;
  messages: Message[] = [];
  constructor(_data: any) {
    this.id = _data.id;
    this.name = _data.name;
    this.messages = _data.messages;
  }

  getRoomNameForUser(username: string | undefined){
    if(!username) return "";
    const names = this.name.split("|");
    const namesExceptUsername = names.filter((a) => a !== username);
    const roomName = namesExceptUsername.join(",");
    return roomName;
  }
}

export class Message {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  constructor(_data: any) {
    this.id = _data.id;
    this.content = _data.content;
    this.sender = _data.sender;
    this.timestamp = Number.parseInt(_data.timestamp);
  }
}
