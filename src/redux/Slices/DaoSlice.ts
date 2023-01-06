import { createSlice } from '@reduxjs/toolkit';

export interface DaoState {}

const initialState: DaoState = {
	rooms: [],
	selectedRoom: null
};

export const daoSlice = createSlice({
	name: 'daoSlice',
	initialState,
	reducers: {}
});

// Action creators are generated for each case reducer function
export const {} = daoSlice.actions;

export default daoSlice.reducer;
