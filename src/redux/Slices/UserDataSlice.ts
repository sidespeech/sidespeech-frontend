import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { UserTokensData } from '../../models/UserTokensData';
import websocketService from '../../services/websocket-services/websocket.service';
import { Room } from '../../models/Room';
import { User } from '../../models/User';
import { Profile } from '../../models/Profile';
import { Side } from '../../models/Side';
import { UserCollectionsData } from '../../models/interfaces/UserCollectionsData';
import { Collection } from '../../models/interfaces/collection';
import alchemyService from '../../services/web3-services/alchemy.service';

import collectionService from '../../services/api-services/collection.service';
import userService from '../../services/api-services/user.service';
import sideService, { getSidesMetadata } from '../../services/api-services/side.service';
import _ from 'lodash';
import openseaService from '../../services/web3-services/opensea.service';
import { saveOpenseaData } from '../../hooks/useOpenseaData';
import update from 'immutability-helper';
import { Invitation } from '../../models/Invitation';

export interface UserData {
	user: User | null;
	profiles: Profile[];
	account: string | null;
	userTokens: UserTokensData | null;
	redirectTo: null;
	sides: Side[];
	authToken: string | null;
	currentProfile: Profile | undefined;
	userCollectionsData: UserCollectionsData;
	userCollectionsLoading: boolean;
	userCollectionsLoadingSides: boolean;
}

const initialState: UserData = {
	user: null,
	profiles: [],
	account: null,
	userTokens: null,
	redirectTo: null,
	authToken: null,
	sides: [],
	currentProfile: undefined,
	userCollectionsData: {},
	userCollectionsLoading: false,
	userCollectionsLoadingSides: false
};

export const flattenChannels = (array: any, key: string) => {
	return array?.reduce(function (flat: any, toFlatten: any) {
		return flat.concat(Array.isArray(toFlatten[key]) ? flattenChannels(toFlatten[key], key) : toFlatten.id);
	}, []);
};

export const refreshConnectedUser = createAsyncThunk(
	'userData/refreshConnectedUser',
	async (account: string, { dispatch, getState }) => {
		const user = await userService.getUserByAddress(account);
		dispatch(updateUser(user));
	}
);

export const fetchUserDatas = createAsyncThunk(
	'userData/fetchUserTokensAndNfts',
	async (address: string, { dispatch, getState }) => {
		const nfts = await alchemyService.getUserNfts(address);

		const collections = await alchemyService.getUserCollections(address);
		const cols = await collectionService.getManyCollectionsByAddress(collections.map(c => c.address));
		if (cols.length !== collections.length) {
			const missingCollections = _.differenceBy(collections, cols, 'address');

			await collectionService.savedCollections(missingCollections);
			const slugs: string[] = [];
			for (const collection of missingCollections) {
				const contract = await openseaService.getContractData(collection.address);
				slugs.push(contract.collection.slug);
			}
			const savedCollections = await saveOpenseaData(slugs, missingCollections);
			cols.push(...savedCollections);
		}

		const data = await getSidesCountByCollection(cols.map(elem => elem['address']));
		let res: any = {};
		for (let nft of nfts) {
			const address = nft['token_address'];
			const existingObject = res[address];

			if (existingObject) {
				existingObject.nfts.push(nft);
			} else {
				const found = cols.find((c: Collection) => c.address === address);

				if (found) {
					res[address] = found;
					res[address].nfts.push(nft);
					// Get Side Count
					if (data.sides.length) {
						const numberSides = data['sides'].filter((item: Side) => {
							return item['collectionSides'].find((coll: any) => coll['collectionId'] === address);
						});

						res[address]['sideCount'] = numberSides.length;
					} else {
						res[address]['sideCount'] = 0;
					}
				}
			}
		}
		return res;
	}
);

export const updateSidesByUserCollections = createAsyncThunk(
	'userData/updateSidesByUserCollections',
	async (collections: Collection[] | null, { dispatch, getState }) => {
		const state: any = getState();
		const currentUserCollection = state.user.userCollectionsData;
		Object.values(collections || currentUserCollection).forEach((coll: any) => {
			dispatch(getSidesByCollection(coll?.address));
		});
	}
);

export const getSidesByCollection = createAsyncThunk(
	'userData/getSidesByCollection',
	async (address: string, { dispatch, getState }) => {
		const response = await sideService.getSidesByCollections([address]);
		return response;
	}
);

export const getSidesCountByCollection = async (addresses: string[]) => {
	const response = await sideService.getSidesByCollections(addresses);
	return response;
};

export const addUserParsedSide = createAsyncThunk(
	'userData/addUserParsedSide',
	async (side: any, { dispatch, getState }) => {
		const state: any = getState();
		const { sides, userCollectionsData } = state.user;
		const response = await getSidesMetadata([side], userCollectionsData, sides);
		dispatch(addColony(response[0]));
		return response;
	}
);

export const userDataSlice = createSlice({
	name: 'userData',
	initialState,
	reducers: {
		connect: (state: UserData, action: PayloadAction<any>) => {
			state.user = action.payload.user;
			state.account = action.payload.account;
			let rooms = flattenChannels(state.user?.profiles, 'rooms');
			
			console.log('user Slice :', state.user)

			state.sides = action.payload.user.profiles
				? action.payload.user.profiles.map((p: Profile) => {
						p.side['profiles'] = [p];
						return p.side;
				  })
				: [];
			state.redirectTo = action.payload.redirectTo;

			rooms = rooms?.concat([...flattenChannels(state.sides, 'channels'), ...state.sides.map(s => s.id)]);

			websocketService.login(state.user, rooms);
		},
		disconnect: (state: UserData) => {
			state.user = null;
			state.account = null;
			state.userTokens = null;
			localStorage.clear();
			// websocketService.getUsersStatus();
		},
		updateUser: (state: UserData, action: PayloadAction<any>) => {
			state.user = { ...state.user, ...action.payload };
			if (state.sides && action.payload.profiles?.length) {
				state.sides = action.payload.profiles.map((p: Profile) => {
					p.side['profiles'] = [p];
					return p.side;
				});
			}
		},
		updateProfiles: (state: UserData, action: PayloadAction<Profile>) => {
			if (state.user) {
				const profiles = [...state.user?.profiles, action.payload];
				state.user = { ...state.user, profiles: profiles };
			}
		},
		addInvitationToUser: (state: UserData, action: PayloadAction<Invitation>) => {
			if (state.user) state.user.invitations = [...state.user.invitations, action.payload];
		},
		addColony: (state: UserData, action: PayloadAction<Side>) => {
			state.sides = [...state.sides, action.payload];
		},
		removeSide: (state: UserData, action: PayloadAction<string>) => {
			state.sides = state.sides.filter(side => side.id !== action.payload);
			if (state.user) {
				state.user.profiles = state.user.profiles.filter(profile => profile.side.id !== action.payload);
			}
		},
		setCurrentProfile: (state: UserData, action: PayloadAction<Side | null>) => {
			if (action.payload) {
				const userprofiles = state.user?.profiles;
				if (state.user && userprofiles) {
					const profile = userprofiles.find(p => {
						return p.side.id === action.payload?.id;
					});
					state.currentProfile = profile;
				}
			} else {
				state.currentProfile = undefined;
			}
		},
		updateCurrentProfile: (state: UserData, action: PayloadAction<Profile>) => {
			state.currentProfile = action.payload;
			if (state.user) {
				const user = { ...state.user };
				const profiles = [...user.profiles];
				const index = profiles.findIndex((p: Profile) => p.id === action.payload.id);
				if (index !== -1) {
					profiles.splice(index, 1, action.payload);
					user.profiles = profiles;
					state.user = { ...user };
				}
			}
		},
		addRoomToProfile: (state: UserData, action: PayloadAction<Room>) => {
			if (state.currentProfile) {
				const rooms = state.currentProfile.rooms;
				state.currentProfile.rooms = [...rooms, action.payload];
			}
		},
		addProfileToSide: (state: UserData, action: PayloadAction<Profile>) => {
			const index = state.sides.findIndex(s => s.id === action.payload.id);
			if (index !== -1) {
				state.sides = update(state.sides, { [index]: { profiles: { $push: [action.payload] } } });
			}
		},
		updateSideActivity: (state: UserData, action: PayloadAction<Side>) => {
			const index = state.sides.findIndex(s => s.id === action.payload.id);
			if (index !== -1 && state.sides[index].status !== action.payload.status) {
				const sides = update(state.sides, { [index]: { status: { $set: action.payload.status } } });
				state.sides = sides;
				console.log(current(state));
			}
		}
	},
	extraReducers: builder => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(fetchUserDatas.pending, (state, action) => {
			state.userCollectionsLoading = true;
		});
		builder.addCase(fetchUserDatas.rejected, (state, action) => {
			state.userCollectionsLoading = false;
		});
		builder.addCase(fetchUserDatas.fulfilled, (state, action) => {
			state.userCollectionsData = { ...action.payload };
			state.userCollectionsLoading = false;
		});
		// builder.addCase(getSidesByCollection.pending, (state, action) => {
		//   state.userCollectionsLoadingSides = true;
		// });
		// builder.addCase(getSidesByCollection.rejected, (state, action) => {
		//   state.userCollectionsLoadingSides = false;
		// });
		// builder.addCase(getSidesByCollection.fulfilled, (state, action) => {
		//   state.userCollectionsData[action.payload.contracts].sideCount = action.payload.count;
		//   state.userCollectionsLoadingSides = false;
		// });
	}
});

// Action creators are generated for each case reducer function
export const {
	connect,
	disconnect,
	updateUser,
	addColony,
	removeSide,
	setCurrentProfile,
	updateCurrentProfile,
	addRoomToProfile,
	updateProfiles,
	addProfileToSide,
	updateSideActivity,
	addInvitationToUser
} = userDataSlice.actions;

export default userDataSlice.reducer;
