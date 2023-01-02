import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EventType } from '../constants/EventType';
import { subscribeToEvent, unSubscribeToEvent } from '../helpers/CustomEvent';
import { Role } from '../models/Profile';
import { Side, SideStatus } from '../models/Side';
import { updateSideActivity } from '../redux/Slices/UserDataSlice';
import { RootState } from '../redux/store/app.store';
import useIsSideAdmin from './useIsSideAdmin';

export default function useNftTransfert() {
	const { currentSide } = useSelector((state: RootState) => state.appDatas);
	const isSideAdmin = useIsSideAdmin(currentSide);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleNftTransfert = ({ detail }: { detail: Side }) => {
		const side = new Side(detail);
		if (currentSide && side.id === currentSide.id && side.status === SideStatus.inactive) {
			if (isSideAdmin) {
				toast.info('You transfert an nft and are not eligible to this side anymore.');
			} else {
				toast.info('This side is inactive from now.');
			}
			dispatch(updateSideActivity(side));
			navigate('/');
		} else {
			dispatch(updateSideActivity(side));
		}
	};

	useEffect(() => {
		subscribeToEvent(EventType.NFT_TRANSFERT, handleNftTransfert);

		return () => {
			unSubscribeToEvent(EventType.NFT_TRANSFERT, handleNftTransfert);
		};
	}, [currentSide, isSideAdmin]);
}
