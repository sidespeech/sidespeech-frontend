import { InitialStateUser } from "../../components/OnBoarding/Steps/PublicNFTs";
import { BASE_URL } from "../../constants/constants";
import { NFT } from "../../models/interfaces/nft";
import { Side } from "../../models/Side";
import { User } from "../../models/User";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: UserService;
class UserService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new UserService();
    return instance;
  }

  async walletConnection(
    accounts: any,
    signerMessage: any,
    signature: any
  ): Promise<User> {
    const retrieveNFTs = "";
    const createUser = await this.post(`${BASE_URL}/user`)
      .send({
        accounts: accounts,
        publicNfts: retrieveNFTs,
        signerMessage: signerMessage,
        signature: signature,
      })
      .set("accept", "json");

    return new User(createUser.body);
  }

  // Attempt to find an existing wallet with the wallet address and the signature of that wallet.
  async findExistingWallet(
    userWallet: string,
    signerMessage: string,
    signature: string
  ) {
    const checkUser = await this.post(`${BASE_URL}/user/existing`).send({
      userWallet: userWallet,
      signerMessage: signerMessage,
      signature: signature,
    });
    return checkUser.body;
  }

  async findOnBoarding(accounts: string) {
    const checkUser = await this.get(`${BASE_URL}/user/onboarding/${accounts}`);

    return checkUser.body;
  }

  async findExistingUsername(username: string) {
    const checkUser = await this.get(`${BASE_URL}/user/username/${username}`);
    return checkUser.body;
  }

  async getUserByAddress(address: string): Promise<User> {
    const res = await this.get(`${BASE_URL}/user/${address}`);
    if (!res.body) throw new Error("Error");
    return new User(res.body);
  }
  async getUserPublicData(username: string): Promise<User> {
    const res = await this.get(`${BASE_URL}/user/public/${username}`);
    if (!res.body) throw new Error("Error");
    return new User(res.body);
  }

  async updateUser(id: string, updatedInfo: InitialStateUser): Promise<any> {
    const res = await this.patch(`${BASE_URL}/user/${id}`).send(updatedInfo);
    return new User(res["body"]);
  }
  async updateUserPublicNfts(id: string, updatedInfo: NFT[]): Promise<any> {
    const res = await this.patch(`${BASE_URL}/user/saveNfts/${id}`).send(
      updatedInfo
    );
    return res["body"];
  }

  async getUserFromSides(sides: string[]): Promise<any> {
    const res = await this.post(`${BASE_URL}/user/side`).send({ sides: sides });
    return res.body.users;
  }

  async getUsersByIds(ids: string[]): Promise<any> {
    const res = await this.post(`${BASE_URL}/user/ids`).send({ ids: ids });
    return res.body;
  }

  async updateSubAdmin(name: string, sideId: string): Promise<any> {
    const res = await this.post(`${BASE_URL}/user/subadmin`).send({
      sideId: sideId,
      name: name,
    });
    return res.body;
  }
}

export default UserService.getInstance();
