import { InitialStateUser } from '../../components/OnBoarding/Steps/PublicNFTs';
import { BASE_URL } from '../../constants/constants';
import { NFT } from '../../models/interfaces/nft';
import { User } from '../../models/User';
import { BaseApiService } from './base-api.service';

// Create an API Service class
let instance: UserService;
class UserService extends BaseApiService {
	static getInstance() {
		if (!instance) instance = new UserService();
		return instance;
	}

	

	async walletConnection(accounts: any, signerMessage: any, signature: any): Promise<User> {
		const retrieveNFTs = '';
		const createUser = await this.post(`${BASE_URL}/user`)
			.send({
				accounts: accounts,
				publicNfts: retrieveNFTs,
				signerMessage: signerMessage,
				signature: signature
			})
			.set('accept', 'json');

		return new User(createUser.body);
	}

	/**
	 * @param userWallet wallet address of the user
	 * @param signerMessage message that the user has sign
	 * @param signature result signature of the message from user
	 * @returns the user
	 * @description Attempt to find an existing wallet with the wallet address and the signature of that wallet.
	 */
	async findExistingWallet(userWallet: string, signerMessage: string, signature: string) {
		const checkUser = await this.post(`${BASE_URL}/user/existing`).send({
			userWallet: userWallet,
			signerMessage: signerMessage,
			signature: signature
		});
		return checkUser.body;
	}

	/**
	 * @description check if the user is already onboarded
	 * @param accounts user wallet address
	 * @returns true if the user is already onboarded
	 */
	async findOnBoarding(accounts: string) {
		const checkUser = await this.get(`${BASE_URL}/user/onboarding/${accounts}`);

		return checkUser.body;
	}

	/**
	 * @param username username of the user
	 * @returns true if the user exist in db
	 * @description used to know if a username already exist in database to avoid conflict issues
	 */
	async findExistingUsername(username: string): Promise<boolean> {
		const checkUser = await this.get(`${BASE_URL}/user/username/${username}`);
		return checkUser.body;
	}

	/**
	 *
	 * @param address wallet address of the user
	 * @returns All user data
	 */
	async getUserByAddress(address: string): Promise<User> {
		const res = await this.get(`${BASE_URL}/user/${address}`);
		if (!res.body) throw new Error('Error');
		return new User(res.body);
	}

	/**
	 * @param username username of the user
	 * @returns user public data
	 * @description this api is used to fetch user data without sensible information so public profile can be show to unconnected users
	 */
	async getUserPublicData(username: string): Promise<User> {
		const res = await this.get(`${BASE_URL}/user/public/${username}`);
		if (!res.body) throw new Error('Error');
		return new User(res.body);
	}

	/**
	 *
	 * @param id id of the user
	 * @param updatedInfo info of the user to update
	 * @returns updated user
	 */
	async updateUser(id: string, updatedInfo: InitialStateUser): Promise<any> {
		const res = await this.patch(`${BASE_URL}/user/${id}`).send(updatedInfo);
		return new User(res['body']);
	}

	/**
	 *
	 * @param id id of the user
	 * @param updatedInfo array of new nfts to add in the user public nfts
	 * @returns updated user
	 */
	async updateUserPublicNfts(id: string, updatedInfo: NFT[]): Promise<any> {
		const res = await this.patch(`${BASE_URL}/user/saveNfts/${id}`).send(updatedInfo);
		return res['body'];
	}

	/**
	 * @param sides sides id to get users from
	 * @returns users of those sides
	 */

	async getUserFromSides(sides: string[]): Promise<any> {
		const res = await this.post(`${BASE_URL}/user/side`).send({ sides: sides });
		return res.body.users;
	}

	/**
	 * @param ids array of user ids
	 * @returns users conrresponding to given ids
	 */

	async getUsersByIds(ids: string[]): Promise<any> {
		const res = await this.post(`${BASE_URL}/user/ids`).send({ ids: ids });
		return res.body;
	}
	/**
	 *
	 * @param name username of the user
	 * @param sideId id of the side
	 * @returns
	 */

	async updateSubAdmin(name: string, sideId: string): Promise<any> {
		const res = await this.post(`${BASE_URL}/user/subadmin`).send({
			id: sideId,
			name: name
		});
		return res.body;
	}

	/**
	 * @param address wallet address of the user
	 * @returns User without any relations
	 */
	async getPartialUserByAddress(address: string): Promise<Partial<User>> {
		const res = await this.get(`${BASE_URL}/user/partial/${address}`);
		if (!res.body) throw new Error('Error');
		return new User(res.body);
	}
}

export default UserService.getInstance();
