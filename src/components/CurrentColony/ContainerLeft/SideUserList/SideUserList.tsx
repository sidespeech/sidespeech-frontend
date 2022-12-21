import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { Profile } from '../../../../models/Profile';
import { RootState } from '../../../../redux/store/app.store';
import { Dot } from '../../../ui-components/styled-components/shared-styled-components';
import UserBadge from '../../../ui-components/UserBadge';
import defaultPP from '../../../../assets/default-pp.png';
import copyAll from '../../../../assets/copy_all.svg';
import hexagon from '../../../../assets/hexagon.svg';
import check from '../../../../assets/check_circle.svg';
import { ProfilePictureData, SpanElipsis } from '../../../GeneralSettings/Account/Avatar';
import Button from '../../../ui-components/Button';
import { fixURL, getRandomId, reduceWalletAddress } from '../../../../helpers/utilities';
import { useNavigate } from 'react-router-dom';
import { setSelectedChannel, setSelectedProfile } from '../../../../redux/Slices/AppDatasSlice';
import { Collection } from '../../../../models/interfaces/collection';
import { NFT } from '../../../../models/interfaces/nft';
import websocketService from '../../../../services/websocket-services/websocket.service';
import { addRoomToProfile } from '../../../../redux/Slices/UserDataSlice';
import { setSelectedRoom } from '../../../../redux/Slices/ChatSlice';
import { toast } from 'react-toastify';
import collectionService from '../../../../services/api-services/collection.service';
import roomService from '../../../../services/api-services/room.service';
import useWalletAddress from '../../../../hooks/useWalletAddress';

const SideUserListStyled = styled.div``;

export default function SideUserList({
	dots,
	handleSelectedUser,
	selectedUser,
	isMembersList,
	onlineUsers
}: {
	dots: any;
	handleSelectedUser: any;
	selectedUser: any;
	isMembersList?: boolean;
	onlineUsers?: any;
}) {
	const { currentSide } = useSelector((state: RootState) => state.appDatas);
	const { currentProfile } = useSelector((state: RootState) => state.user);
	const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);

	useEffect(() => {}, [onlineUsers, currentProfile, currentSide]);

	return currentProfile ? (
		<SideUserListStyled className="f-column align-start w-100">
			{currentSide?.profiles.map((p: Profile, index: number) => {
				const id = getRandomId();
				const isMe = p.id === currentProfile?.id;
				const room = currentProfile?.getRoom(p.id);
				if (isMembersList && room && !isMe) return;
				if (!isMembersList && (isMe || !room)) return;
				const url = p.profilePicture?.metadata?.image ? fixURL(p.profilePicture?.metadata?.image) : undefined;

				return (
					<React.Fragment key={index}>
						<ReactTooltip
							id={id}
							globalEventOff="click"
							place="right"
							className="tooltip-radius"
							backgroundColor="#3a445d"
							effect="float"
							clickable
						>
							<ProfileTooltip profile={p} />
						</ReactTooltip>
						<div
							data-tip
							data-event="click"
							data-for={id}
							key={index}
							onClick={isMe ? () => {} : () => handleSelectedUser(p, currentProfile)}
							onMouseEnter={() => ReactTooltip.hide()}
							className={`w-100 flex justify-between align-center pl-3 pr-2 py-2 ${
								selectedRoom && selectedRoom.id === room?.id && !isMe ? 'selected-channel' : ''
							} ${isMe ? '' : 'pointer channel-item'}`}
						>
							<div className="flex align-center">
								{currentProfile['username'] !== p['username'] ? (
									<UserBadge
										avatar={url}
										weight={400}
										fontSize={11}
										username={p.user.username}
										connect={onlineUsers.includes(p['username'])}
									/>
								) : (
									<UserBadge
										avatar={url}
										weight={400}
										fontSize={11}
										username={p.user.username}
										connect={true}
									/>
								)}

								{isMe && <span className="ml-2">(you)</span>}
							</div>
							{room && !isMe && dots[room.id] > 0 && <Dot>{dots[room.id]}</Dot>}
						</div>
					</React.Fragment>
				);
			})}
		</SideUserListStyled>
	) : null;
}

const TooltipContainer = styled.div``;
const TooltipContent = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 10px;
	gap: 10px;
`;
const TooltipProfileAvatar = styled.img`
	border: 4px solid rgba(125, 166, 220, 0.1);
	border-radius: 30px;
	max-width: 55px;
	max-height: 55px;
	min-height: 55px;
	min-width: 55px;
`;

const ProfileTooltip = ({ profile }: { profile: Profile }) => {
	const [url, setUrl] = useState<string>(defaultPP);
	const [collection, setCollection] = useState<Collection | null>(null);
	const [nft, setNft] = useState<NFT | null>(null);

	const { walletAddress } = useWalletAddress();
	const { currentSide } = useSelector((state: RootState) => state.appDatas);
	const { currentProfile, user, userCollectionsData } = useSelector((state: RootState) => state.user);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		async function getCollection(address: string) {
			const collection = userCollectionsData[address];
			setCollection(collection);
		}
		if (profile.profilePicture && profile.profilePicture.metadata && profile.profilePicture.metadata.image) {
			setUrl(fixURL(profile.profilePicture.metadata.image));
		}
		if (profile.profilePicture.token_address && Object.keys(userCollectionsData).length && !collection) {
			getCollection(profile.profilePicture.token_address);
			setNft(profile.profilePicture);
		}
	}, [profile.profilePicture, userCollectionsData]);

	const handleSelectedUser = async (profile: Profile, currentProfile: Profile) => {
		try {
			// getting room for given profile id
			let room = currentProfile?.getRoom(profile.id);
			if (!currentProfile || !walletAddress || !user) return;
			// if room not exist in profile
			if (!room) {
				// creating the room
				room = await roomService.createRoom(currentProfile.id, profile.id);
				// add this room in the user websocket
				websocketService.addRoomToUsers(room.id, [user.id, profile.user.id]);
				// add the room to profile
				dispatch(addRoomToProfile(room));
			}
			// selecting the room
			dispatch(setSelectedRoom(room));
			dispatch(setSelectedChannel(null));
			navigate(`/side/${currentSide?.name}`);
		} catch (error) {
			console.error(error);
			toast.error('There has been an error opening the room', {
				toastId: 20
			});
		}
	};

	const handleCopyWalletAddress = (address: string) => {
		navigator.clipboard.writeText(address);
		toast.success('Address copied successfuly.', { toastId: 1 });
	};

	return (
		<TooltipContainer>
			<TooltipContent>
				<div className="flex align-center gap-20 text-main">
					<TooltipProfileAvatar src={url} />
					<div style={{ lineHeight: '19px' }}>
						<div>{profile.user.username}</div>
						<div className="text-inactive">
							{reduceWalletAddress(profile.user.accounts)}
							<img
								style={{ verticalAlign: 'sub' }}
								src={copyAll}
								onClick={() => handleCopyWalletAddress(profile.user.accounts)}
							/>
						</div>
					</div>
				</div>
				{collection && (
					<ProfilePictureData className="flex align-center text-main">
						<img src={hexagon} className="mr-3 size-12 fw-700" />
						<span title={nft?.token_id + ' ' + collection.name}>
							<SpanElipsis className="mr-2">#{nft && nft.token_id}</SpanElipsis>
							<span className="">{collection && collection.getName()}</span>
							<img src={check} className="ml-2" />
						</span>
					</ProfilePictureData>
				)}
				<div className="flex" style={{ gap: 11 }}>
					<Button
						children={'Profile'}
						width={'117px'}
						onClick={() => {
							dispatch(setSelectedProfile(profile));
							navigate(`/user/${profile.user.username}`);
						}}
						height={44}
						background={'rgba(125, 166, 220, 0.1)'}
					/>
					{profile.user.accounts.toLowerCase() !== walletAddress && (
						<Button
							children={'Messages'}
							width={'117px'}
							onClick={() => {
								currentProfile && handleSelectedUser(profile, currentProfile);
							}}
							height={44}
						/>
					)}
				</div>
			</TooltipContent>
		</TooltipContainer>
	);
};
