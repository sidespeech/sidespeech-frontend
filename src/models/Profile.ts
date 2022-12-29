import { NFT } from "./interfaces/nft";
import { Room } from "./Room";
import { GnosisSafe } from "./GnosisSafe";
import { Side } from "./Side";
import { User } from "./User";

export enum Role {
	Admin,
	User,
	subadmin
}

export enum safeRole {
	inactive,
	unsigned,
	signed,
	blacklisted,
	deleted
}

export class Profile {
	id: string;
	username: string;
	showNfts: boolean;
	role: Role;
	safeRole: safeRole;
	profilePicture: NFT;
	isBlacklisted: boolean;
	rooms: Room[];

	side: Side;
	user: User;
	safe: GnosisSafe;

	constructor(_data: any) {
		this.id = _data.id;
		this.username = _data.username;
		this.showNfts = _data.showNfts;
		this.role = _data.role;
		this.profilePicture = typeof _data.profilePicture === 'string' ? JSON.parse(_data.profilePicture) : _data.profilePicture;
		this.rooms = _data.rooms?.map((r: any) => new Room(r)) || [];
		this.side = _data.side;
		this.user = _data.user;
		this.safeRole = _data.safeRole;
		this.safe = _data.safe;
		this.isBlacklisted = _data.isBlacklisted;
	}

	/**
	 *
	 * @param id id of the user profile
	 * @returns the room if this profile has already a room created for the given id
	 */
	getRoom(id: string): Room | undefined {
		return this.rooms.find(r => r.profileIds.includes(id));
	}
}
