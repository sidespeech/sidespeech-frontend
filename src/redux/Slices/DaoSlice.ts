import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Proposal } from '../../models/Proposal';

export interface DaoState {
	selectedProposal: Proposal | null;
}

const initialState: DaoState = {
	selectedProposal: null
};

export const daoSlice = createSlice({
	name: 'daoSlice',
	initialState,
	reducers: {
		setSelectedProposal: (state: DaoState, action: PayloadAction<Proposal>) => {
			const { payload } = action;
			state.selectedProposal = payload;
		}
	}
});

// Action creators are generated for each case reducer function
export const { setSelectedProposal } = daoSlice.actions;

export default daoSlice.reducer;
