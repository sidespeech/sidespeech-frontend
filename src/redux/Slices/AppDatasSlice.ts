import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Side } from '../../models/Side';
import { Channel } from '../../models/Channel';
import { Profile } from '../../models/Profile';

export interface AppDatas {
	currentSide: Side | null;
	selectedChannel: Channel | null;
	selectedProfile: Profile | null;
	settingsOpen: boolean;
	openEligibilityModal: { open: boolean; side: Side | null };
	openLeaveSideModal: { open: boolean; side: Side | null };
}

const initialState: AppDatas = {
	currentSide: null,
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
			if (action.payload) state.currentSide = { ...action.payload };
			else state.currentSide = null;
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
	setLeaveSideOpen
} = appDatasSlice.actions;

export default appDatasSlice.reducer;
