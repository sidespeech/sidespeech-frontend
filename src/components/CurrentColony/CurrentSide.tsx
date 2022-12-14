import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import MiddleContainerHeader from '../ui-components/MiddleContainerHeader';
import CurrentSideLeft from './ContainerLeft/CurrentSideLeft';
import { setCurrentSide, setEligibilityOpen, setSelectedChannel } from '../../redux/Slices/AppDatasSlice';
import { RootState } from '../../redux/store/app.store';
import CreatePollModal from '../Modals/CreatePollModal';
import _ from 'lodash';
import { Announcement } from '../../models/Announcement';
import { setCurrentProfile, connect } from '../../redux/Slices/UserDataSlice';

import { useNavigate, useParams } from 'react-router-dom';
import { Poll } from '../../models/Poll';

import { Outlet, useOutletContext } from 'react-router-dom';
import { SideStatus } from '../../models/Side';
import { toast } from 'react-toastify';
import { breakpoints, size } from '../../helpers/breakpoints';
import sideService from '../../services/api-services/side.service';
import Skeleton from '../ui-components/Skeleton';
import { setSelectedRoom } from '../../redux/Slices/ChatSlice';

const CurrentSideStyled = styled.div`
	width: 100vw;
	display: flex;
	flex-direction: column;
	${breakpoints(
		size.lg,
		`{
    flex-direction: row;
    align-items: flex-start;
    width: calc(100vw - 70px);
  }`
	)}
	.left-side-desktop {
		display: none;
		${breakpoints(
			size.lg,
			`{
      display: block;
      width: 100%;
      max-width: 250px;
      flex-shrink: 0;
    }`
		)}
	}
	.left-side-mobile {
		width: 100%;
		${breakpoints(
			size.lg,
			`{
				display: none;
				}`
		)}
	}
	.current-side-middle-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		height: calc(100vh - 8rem - 77px);
		${breakpoints(
			size.lg,
			`{
      height: 100vh;
    }`
		)}
	}
	.middle-container-center-colony {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		align-items: start;
		flex-grow: 1;
		${breakpoints(
			size.lg,
			`{
      max-height: 100%;
    }`
		)}
	}
	.header-desktop {
		display: flex;
		padding: 1rem;
		${breakpoints(
			size.lg,
			`{
      display: flex;
    }`
		)}
	}

	.profile-round-small > img {
		position: absolute;
		bottom: -2px;
		right: -2px;
		width: 8px;
	}
	.profile-round-small {
		width: 20px;
		height: 20px;
		background-color: var(--input);
		border-radius: 10px;
		position: relative;
	}
	.user-status {
		left: -11px;
		position: relative;
		z-index: 9;
		top: 6px;
		width: 8px;
	}

	.user-status img {
		width: 100%;
	}
	.edit-channel > div {
		padding: 9px 18px;
	}
	.edit-channel {
		width: 100%;
		min-height: 96px;
		border-radius: 10px;
	}
	.member-list {
		background-color: var(--background);
		width: 100%;
		min-height: 96px;
		border-radius: 10px;
	}
`;

type ContextMiddleSide = {
	announcementId: any;
	isMobileMenuOpen: boolean;
	selectedChannel: any;
	selectedRoom: any;
	setCreatePollModal: React.Dispatch<React.SetStateAction<boolean>>;
	setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setThread: React.Dispatch<React.SetStateAction<Announcement | Poll | null>>;
	thread: any;
};

export default function CurrentSide() {
	const { announcementId, id } = useParams();
	const { currentSide, selectedChannel, settingsOpen } = useSelector((state: RootState) => state.appDatas);
	const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);
	const { user } = useSelector((state: RootState) => state.user);
	const [createPollModal, setCreatePollModal] = useState<boolean>(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [extend, setExtend] = useState<string>('');
	const [thread, setThread] = useState<Announcement | Poll | null>(null);
	const [isMobileSettingsMenuOpen, setIsMobileSettingsMenuOpen] = useState<boolean>(true);

	useEffect(() => {
		if (!announcementId) setThread(null);
	}, [announcementId]);

	useEffect(() => {
		return () => {
			dispatch(setCurrentSide(null));
			dispatch(setCurrentProfile(null));
		};
	}, []);

	useEffect(() => {
		async function getSide() {
			try {
				dispatch(setCurrentSide(null));
				dispatch(setCurrentProfile(null));
				dispatch(setSelectedChannel(null));
				dispatch(setSelectedRoom(null));
				if (id && user) {
					// Get Side data
					const res = await sideService.getSideBySlug(id);

					const isInTheSide = user['profiles'].find(item => item['side']['id'] === res['id']);

					// If side is inactive
					if (res.status === SideStatus.inactive) {
						toast.info('This side is currently inactive', { toastId: 36 });
						dispatch(setEligibilityOpen({ open: true, side: res }));
						dispatch(setCurrentSide(res));
					}

					// If side is active and the user is already in the Side
					else if (isInTheSide) {
						if (isInTheSide.isBlacklisted) {
							toast.error('You have been banned from this side', { toastId: 115 });
							navigate('/');
						} else {
							dispatch(setCurrentSide(res));
							dispatch(setCurrentProfile(res));
							dispatch(setSelectedChannel(res.channels.find(c => c.index === 0) || res.channels[0]));
						}
					}

					// If side is active but the user is not in the Side
					else {
						dispatch(setEligibilityOpen({ open: true, side: res }));
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
		const isConnectedLocalStorage = localStorage.getItem('userAccount');
		// If user not connected
		if (!isConnectedLocalStorage) navigate('/');
		else if (currentSide?.id === id) return;
		else getSide();
	}, [id, user]);

	const handleExtendComments = (id: string) => {
		setExtend(id === extend ? '' : id);
	};

	return (
		<CurrentSideStyled>
			{!settingsOpen && (
				<div className="left-side-desktop">
					<CurrentSideLeft />
				</div>
			)}

			<div className="current-side-middle-container">
				<MiddleContainerHeader
					channel={selectedChannel}
					className="header-desktop"
					isMobileSettingsMenuOpen={isMobileSettingsMenuOpen}
					room={selectedRoom}
					setIsMobileSettingsMenuOpen={setIsMobileSettingsMenuOpen}
					setThread={setThread}
					thread={thread}
				/>
				{/* {!settingsOpen && (
					<div className="left-side-mobile">
						<CurrentSideLeft />
					</div>
				)} */}
				{currentSide?.status === SideStatus.active ? (
					<Outlet
						context={{
							announcementId,
							isMobileMenuOpen: isMobileSettingsMenuOpen,
							selectedChannel,
							selectedRoom,
							setCreatePollModal,
							setIsMobileMenuOpen: setIsMobileSettingsMenuOpen,
							setThread,
							thread
						}}
					/>
				) : !currentSide ? (
					<div className="spinner-wrapper f-column align-center justify-center gap-20 w-100 vh-100">
						<Skeleton />
						{/* <div className="size-18 mt-3 text-primary">Loading Side "{id}" information...</div> */}
					</div>
				) : (
					<div className="f-column align-center justify-center w-100 vh-100 text-green">
						<i className="fa-solid fa-lock size-60"></i>
						<div className="size-18 mt-3 text-center">
							This side is currently locked. <br />
							Waiting for a new admin to be set.
							<br />
							Please try again later.
						</div>
					</div>
				)}
			</div>
			{createPollModal && selectedChannel && <CreatePollModal showModal={setCreatePollModal} />}
		</CurrentSideStyled>
	);
}

export function useMiddleSide() {
	return useOutletContext<ContextMiddleSide>();
}
