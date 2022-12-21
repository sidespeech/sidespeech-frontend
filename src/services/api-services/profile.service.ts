import { BASE_URL } from "../../constants/constants";
import { NFT } from "../../models/interfaces/nft";
import { Profile } from "../../models/Profile";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: ProfileService;
class ProfileService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new ProfileService();
    return instance;
  }

  async getProfileById(id: string): Promise<Profile> {
    const res = await this.get(`${BASE_URL}/profile`).query({ id });
    return new Profile(res.body);
  }

  async getProfilesByUserId(id: string): Promise<Profile> {
    const res = await this.get(`${BASE_URL}/profile/user`).query({ id });
    return new Profile(res.body);
  }

  async joinSide(
    userId: string,
    sideId: string,
    role: number
  ): Promise<Profile> {
    const res = await this.post(`${BASE_URL}/profile/join`).send({
      userId,
      sideId,
      role,
    });
    return new Profile(res.body);
  }

  async updateProfile(id: string, profile: Partial<Profile>): Promise<Profile> {
    const res = await this.patch(`${BASE_URL}/profile/${id}`).send(profile);
    return new Profile(res["body"]);
  }
  async updateProfilePicture(
    id: string,
    profilePicture: NFT
  ): Promise<Profile> {
    const res = await this.put(`${BASE_URL}/profile/picture`).send({
      id: id,
      profileNftStringify: JSON.stringify(profilePicture),
    });
    return new Profile(res["body"]);
  }

  async leaveSide(profile: Profile): Promise<any> {
    const res = await this.post(`${BASE_URL}/profile/leave`).send({
      id: profile.id,
      sideId: profile.side.id,
      role: profile.role,
    });
    return res.body;
  }

  async removeProfile(id: string): Promise<any> {
    const res = await this.delete(`${BASE_URL}/profile/${id}`);
    return res.body;
  }


  async linkSafeProfile(data: any) {
    const res = await this.post(`${BASE_URL}/profile/link-safe-profile/${data['sideId']}`).send(data);
    return new Profile(res['body']);
  }

}

export default ProfileService.getInstance();
