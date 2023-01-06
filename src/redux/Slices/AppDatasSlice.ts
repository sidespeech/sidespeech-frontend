import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Side, SideStatus } from '../../models/Side';
import { Channel } from '../../models/Channel';
import { Profile } from '../../models/Profile';
import update from 'immutability-helper';
import { Invitation } from '../../models/Invitation';

export interface AppDatas {
	currentSide: Side | null;
	bannedUser: string | null;
	selectedChannel: Channel | null;
	selectedProfile: Profile | null;
	settingsOpen: boolean;
	openEligibilityModal: { open: boolean; side: Side | null };
	openLeaveSideModal: { open: boolean; side: Side | null };
}

const initialState: AppDatas = {
	currentSide: null,
	bannedUser: null,
	selectedChannel: null,
	selectedProfile: null,
	settingsOpen: false,
	openEligibilityModal: { open: false, side: null },
	openLeaveSideModal: { open: false, side: null }
};

export const appDatasSlice = createSlice({
	name: 'appDatas',
	initialState,
	reducers: {
		setCurrentSide: (state: AppDatas, action: PayloadAction<Side | null>) => {
			if (action.payload) state.currentSide = action.payload;
			else state.currentSide = null;
		},
		updateCurrentSideStatue: (state: AppDatas, action: PayloadAction<SideStatus>) => {
			if (action.payload !== null && state.currentSide) state.currentSide.status = action.payload;
		},
		addProfileToCurrentSide: (state: AppDatas, action: PayloadAction<Profile>) => {
			state.currentSide = update(state.currentSide, { profiles: { $push: [action.payload] } });
		},
		updateProfileInSide: (state: AppDatas, action: PayloadAction<{ key: string; value: any; id: string }>) => {
			if (state.currentSide) {
				const index = state.currentSide.profiles.findIndex(p => p.id === action.payload.id);
				if (index !== -1) {
					const profiles = update(state.currentSide.profiles, {
						[index]: { [action.payload.key]: { $set: action.payload.value } }
					});
					state.currentSide = update(state.currentSide, { profiles: { $set: profiles } });
					state.bannedUser = update(state.bannedUser, { $set: profiles[index]['id'] });
					console.log('redux stuff: ', profiles[index]['id']);
				}
			}
		},
		setSelectedChannel: (state: AppDatas, action: PayloadAction<Channel | null>) => {
			state.selectedChannel = action.payload;
			state.selectedProfile = null;
		},
		setSelectedProfile: (state: AppDatas, action: PayloadAction<Profile | null>) => {
			state.selectedProfile = action.payload;
			state.selectedChannel = null;
		},
		updateChannel: (state: AppDatas, action: PayloadAction<Channel>) => {
			if (state.currentSide) {
				const c = state.currentSide?.channels.findIndex((c: any) => c.id === action.payload.id);
				if (c !== -1) state.currentSide?.channels.splice(c, 1, action.payload);
			}
		},
		addChannel: (state: AppDatas, action: PayloadAction<Channel>) => {
			if (state.currentSide) {
				state.currentSide.channels = [...state.currentSide.channels, action.payload];
			}
		},
		setSettingsOpen: (state: AppDatas, action: PayloadAction<boolean>) => {
			state.settingsOpen = action.payload;
		},
		setLeaveSideOpen: (state: AppDatas, action: PayloadAction<{ open: boolean; side: Side | null }>) => {
			state.openLeaveSideModal = action.payload;
		},
		setEligibilityOpen: (state: AppDatas, action: PayloadAction<{ open: boolean; side: Side | null }>) => {
			state.openEligibilityModal = action.payload;
		},
		addSideInvitation: (state: AppDatas, action: PayloadAction<Invitation>) => {
			if (state.currentSide) state.currentSide.invitations = [...state.currentSide.invitations, action.payload];
		},
		removeSideInvitation: (state: AppDatas, action: PayloadAction<string>) => {
			if (state.currentSide)
				state.currentSide.invitations = state.currentSide.invitations.filter(inv => inv.id !== action.payload);
		}
	}
});

// Action creators are generated for each case reducer function
export const {
	setCurrentSide,
	setSelectedChannel,
	updateChannel,
	addChannel,
	setSelectedProfile,
	setSettingsOpen,
	setEligibilityOpen,
	setLeaveSideOpen,
	addProfileToCurrentSide,
	updateCurrentSideStatue,
	updateProfileInSide,
	addSideInvitation,
	removeSideInvitation
} = appDatasSlice.actions;

export default appDatasSlice.reducer;
