import { RootState } from '../store/app.store';
import { AppDatas } from './AppDatasSlice';
import { DaoState } from './DaoSlice';
import { UserData } from './UserDataSlice';

export const daoState: (state: RootState) => DaoState = state => state.daoState;
export const appDataState: (state: RootState) => AppDatas = state => state.appDatas;
export const userState: (state: RootState) => UserData = state => state.user;
