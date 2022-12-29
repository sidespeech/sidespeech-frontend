export enum NotificationType {
    Channel,
    Private
}

export class Notification {
    public name: string;
    public creatorAddress: string;
    public id: string;
    public timestamp: string;
    public type: NotificationType;
    public sideId: string;

    constructor(_data: any) {
        this.id = _data.id;
        this.type = _data.type;
        this.timestamp = _data.timestamp;
        this.creatorAddress = _data.creatorAddress;
        this.name = _data.name;
        this.sideId = _data.sideId;
    }
}
