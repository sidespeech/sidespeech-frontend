import React, { useEffect, useState } from 'react';
import InputText from './InputText';
import styled from 'styled-components';
// import { disconnect } from "../../redux/Slices/UserDataSlice";

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/app.store';
import { Room } from '../../models/Room';
import { fixURL, isColor, reduceWalletAddress, reduceWalletAddressForColor } from '../../helpers/utilities';
import { Channel } from '../../models/Channel';
import Icons from './ChannelIcons';
import { Announcement } from '../../models/Announcement';
import { Link, useNavigate } from 'react-router-dom';
import { Poll } from '../../models/Poll';
import { Profile } from '../../models/Profile';
import UserBadge from './UserBadge';
import defaultPP from '../../assets/default-pp.png';
import { breakpoints, size } from '../../helpers/breakpoints';
import SidesListMobileMenu from '../CurrentColony/SidesListMobileMenu';
import { OpenSeaRequestStatus } from '../../models/interfaces/collection';
import { User } from '../../models/User';
import treasury from '../../assets/account_balance.svg';

const MiddleContainerHeaderStyled = styled.header`
	width: 100%;
	background-color: var(--background);
	height: 10vh;
	color: var(--text);
	padding: 0 2rem;
	&::placeholder {
		color: var(--text);
		font-size: 15px;
		font-weight: 400;
	}
	& .desktop-header {
		display: none;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: 100%;
		${breakpoints(
			size.lg,
			`{
      display: flex;
    }`
		)}
		& .left-side {
			width: 50%;
			&.full-width {
				width: 100%;
			}
			.user-info {
				display: flex;
				align-items: center;
				gap: 1rem;
				& .back-link {
					background-color: transparent;
					border: none;
					outline: none;
					box-shadow: none;
				}
				& .user-name {
					max-width: 100px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
			.settings-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				& .side-image {
					width: 36px;
					height: 36px;
					border-radius: 36px;
					background-color: var(--input);
					${breakpoints(
						size.lg,
						`{
            display: none;
          }`
					)}
					& > img {
						width: 100%;
						object-fit: cover;
					}
				}
				& .page-title {
					display: flex;
					align-items: center;
					gap: 1rem;
					& .settings-icon {
						display: none;
						${breakpoints(
							size.lg,
							`{
              display: block;
            }`
						)}
					}
					& h2 {
						display: flex;
						align-items: center;
						font-weight: 700 !important;
						gap: 1rem;
						& span {
							display: none;
							position: relative;
							padding-left: 1rem;
							line-height: 1;
							font-weight: 400;
							${breakpoints(
								size.lg,
								`{
                display: inline;
              }`
							)}
							&::before {
								position: absolute;
								content: '';
								top: 0;
								left: 0;
								border-left: 3px solid var(--text);
								height: 100%;
							}
						}
					}
				}
			}
			.room-title,
			.channel-title,
			.settings {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 100%;
			}
			.channel-title {
				display: flex;
				align-items: center;
				& h2 {
					margin: 0;
					color: white;
					font-weight: 400;
				}
				& svg {
					transform: scale(1.4);
					& > path {
						fill: white;
					}
				}
			}
		}

		& .right-side {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 1rem;
			width: 50%;
			&.settings-page {
				display: none;
				${breakpoints(
					size.lg,
					`{
          display: flex;
        }`
				)}
			}
			.user-info {
				display: flex;
				align-items: center;
				gap: 1rem;
				flex-shrink: 0;
				height: 100%;
				.back-link {
					background-color: transparent;
					border: none;
					outline: none;
					box-shadow: none;
					padding: 0;
				}
				.profile-round {
					flex-shrink: 0;
					margin: 0;
				}
				.user-name-address {
					display: flex;
					flex-direction: column;
					.user-name {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						max-width: 100px;
					}
					.user-address {
						color: var(--inactive);
					}
				}
			}
			& .settings-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-shrink: 0;
				background-color: var(--disable);
				border-radius: 100px;
				padding: 0.5rem;
			}
		}
	}

	.toolbar-mobile {
		width: 100%;
		${breakpoints(
			size.lg,
			`{
      display: none;
    }`
		)}
		.side-info-header-mobile {
			width: 100%;
			background-color: transparent;
			border: none;
			outline: none;
			box-shadow: none;
			display: flex;
			align-items: center;
			justify-content: space-between;
			& .arrow-icon {
				background-color: transparent;
				border: none;
				box-shadow: none;
				outline: none;
			}
			& > div {
				display: flex;
				align-items: center;
				gap: 1rem;
				.user-name-address {
					display: flex;
					flex-direction: column;
					.user-name {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						max-width: 100px;
					}
					.user-address {
						color: var(--inactive);
					}
				}
			}
			& .title-img-wrapper {
				display: flex;
				align-items: center;
				gap: 1rem;
				flex-grow: 1;
				& .image {
					width: 36px;
					height: 36px;
					border-radius: 36px;
					flex-shrink: 0;
					background-color: var(--panels-gray);
					font-size: 20px;
					text-transform: uppercase;
					font-weight: 700;
					line-height: 37px;
					& img {
						width: 100%;
						object-fit: cover;
					}
				}
				& .mobile-side-name {
					display: inline-block;
					text-align: left;
					max-width: calc(100% - 36px - 2rem);
					word-break: break-word;
				}
			}
		}
		.toolbar-wrapper {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			width: 100%;
			padding: 0.5rem 1rem;
			background-color: var(--disable);
			box-shadow: none;
			border: none;
			outline: none;
			${breakpoints(
				size.lg,
				`{
        display: none;
      }`
			)}
			.menu-icon {
				margin-right: 1rem;
			}
			.icon {
				& path {
					fill: #b4c1d2;
				}
			}
		}
		.toolbar-content {
			background-color: var(--disable);
			transform: scaleY(0);
			position: absolute;
			&.open {
				position: relative;
				transform: scaleY(1);
				min-height: calc(100vh - 77px - 6rem);
			}
		}
	}

	& .menu-btn {
		background-color: transparent;
		border: none;
		outline: none;
		box-shadow: none;
		${breakpoints(
			size.lg,
			`{
      display: none;
    }`
		)}
	}

	& .input-avatar-wrapper {
		display: none;
		align-items: center;
		gap: 1rem;
		min-width: 18% !important;
		${breakpoints(
			size.lg,
			`{
      display: flex;
    }`
		)}
	}
`;

interface MiddleContainerHeaderProps {
	channel?: Channel | null;
	className?: string;
	isMobileSettingsMenuOpen: boolean;
	room?: Room | null;
	setIsMobileSettingsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setThread?: React.Dispatch<React.SetStateAction<Announcement | Poll | null>>;
	thread?: any;
}

export default function MiddleContainerHeader({
	channel,
	className,
	isMobileSettingsMenuOpen,
	room,
	setIsMobileSettingsMenuOpen,
	thread
}: MiddleContainerHeaderProps) {
	const [roomProfile, setRoomProfile] = useState<Profile | null>(null);
	const [isSidesListOpen, setIsSidesListOpen] = useState<boolean>(false);
	const [url, setUrl] = useState<string>('');
	const navigate = useNavigate();

	const { currentSide, settingsOpen, displayDao } = useSelector((state: RootState) => state.appDatas);
	const { user, currentProfile } = useSelector((state: RootState) => state.user);

	const Icon = Icons[channel?.type || 0];

	useEffect(() => {
		if (currentSide && room && currentProfile) {
			const ids = room.profileIds;
			const isSelfRoom = ids.length === 1 && ids[0] === currentProfile?.id;
			const profile = isSelfRoom
				? null
				: currentSide.profiles.find(p => ids.includes(p.id) && p.id !== currentProfile.id);
			if (profile) {
				setRoomProfile(profile);
			} else setRoomProfile(null);
		}
	}, [currentSide, room, currentProfile]);

	useEffect(() => {
		if (roomProfile) {
			const url = roomProfile.user?.userAvatar?.metadata?.image
				? roomProfile.user?.userAvatar?.metadata?.image
				: defaultPP;
			setUrl(url);
		}
	}, [roomProfile]);

	const getUserBySenderId = (senderId: string): User | undefined => {
		const profile = currentSide?.profiles.find(p => p.user.accounts?.toLowerCase() === senderId?.toLowerCase());
		return profile?.user;
	};

	const avatarUrl = () => {
		if (user?.userAvatar?.metadata?.image) {
			if (user?.userAvatar?.metadata?.image.indexOf('ipfs://') > -1) {
				return 'https://ipfs.io/ipfs/' + user?.userAvatar?.metadata?.image.replaceAll('ipfs://', '');
			} else {
				return user?.userAvatar?.metadata?.image;
			}
		} else {
			return defaultPP;
		}
	};

	const thredCreatorAvatarUrl = () => {
		if (threadCreator?.userAvatar?.metadata?.image) {
			if (threadCreator?.userAvatar?.metadata?.image.indexOf('ipfs://') > -1) {
				return 'https://ipfs.io/ipfs/' + threadCreator?.userAvatar?.metadata?.image.replaceAll('ipfs://', '');
			} else {
				return threadCreator?.userAvatar?.metadata?.image;
			}
		} else {
			return '';
		}
	};

	const threadCreator = thread ? getUserBySenderId(thread.creator || thread.creatorAddress) : null;

	return (
		<MiddleContainerHeaderStyled className={`middle-container-top ${className}`}>
			<div className="desktop-header fade-in-top">
				<div className={`left-side ${settingsOpen && currentSide ? 'full-width' : ''}`}>
					{thread && (
						<div className="user-info">
							<button onClick={() => navigate(-1)} className="back-link flex align-center gap-20 pointer">
								<svg
									className="arrow-icon ml-3"
									style={{ transform: 'rotate(180deg)' }}
									width="12"
									height="12"
									viewBox="0 0 12 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M-2.29485e-07 5.25L9.13125 5.25L4.93125 1.05L6 -2.62268e-07L12 6L6 12L4.93125 10.95L9.13125 6.75L-2.95052e-07 6.75L-2.29485e-07 5.25Z"
										fill="white"
									/>
								</svg>
								<span>Back</span>
							</button>
							<img
								className="profile-round pointer"
								style={{
									backgroundColor: reduceWalletAddressForColor(
										thread?.creator || thread?.creatorAddress
									)
								}}
								alt=""
								src={thredCreatorAvatarUrl()}
							/>
							<div className="user-name-address">
								<p className="user-name size-14">{threadCreator?.username}</p>
								<p className="user-address size-14">13 hours ago</p>
							</div>
						</div>
					)}
					{!thread && room && !channel && !settingsOpen && (
						<h2 className="room-title">
							{roomProfile ? (
								<UserBadge
									width={25}
									avatar={url}
									weight={700}
									fontSize={14}
									username={roomProfile.user.username}
								/>
							) : (
								<span>You</span>
							)}
						</h2>
					)}
					{!thread && channel && !settingsOpen && (
						<div className="channel-title">
							<Icon className="mr-3" />
							<h2>{channel.name}</h2>
						</div>
					)}
					{currentSide && displayDao && (
						<div className="flex align-end  size-22 fw-400">
							<img src={treasury} width={28} height={28} />
							<span className='ml-3'>DAO</span>
						</div>
					)}
					{settingsOpen && currentSide && (
						<div className="settings-header">
							<div className="page-title">
								<svg
									className="settings-icon"
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M7.54134 15.7923V11.209H8.45801V13.0423H15.7913V13.959H8.45801V15.7923H7.54134ZM0.208008 13.959V13.0423H4.79134V13.959H0.208008ZM3.87467 10.2923V8.45898H0.208008V7.54232H3.87467V5.70898H4.79134V10.2923H3.87467ZM7.54134 8.45898V7.54232H15.7913V8.45898H7.54134ZM11.208 4.79232V0.208984H12.1247V2.04232H15.7913V2.95898H12.1247V4.79232H11.208ZM0.208008 2.95898V2.04232H8.45801V2.95898H0.208008Z"
										fill="#B4C1D2"
									/>
								</svg>
								<div className="side-image">
									<img src={currentSide.sideImage} alt="" />
								</div>
								<h2 className="navTitle">
									{' '}
									{currentSide.name}
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M6.95 11.4499L12.2375 6.16244L11.1875 5.11244L6.95 9.34994L4.8125 7.21244L3.7625 8.26244L6.95 11.4499ZM8 15.4999C6.9625 15.4999 5.9875 15.3029 5.075 14.9089C4.1625 14.5154 3.36875 13.9812 2.69375 13.3062C2.01875 12.6312 1.4845 11.8374 1.091 10.9249C0.697 10.0124 0.5 9.03744 0.5 7.99994C0.5 6.96244 0.697 5.98744 1.091 5.07494C1.4845 4.16244 2.01875 3.36869 2.69375 2.69369C3.36875 2.01869 4.1625 1.48419 5.075 1.09019C5.9875 0.696689 6.9625 0.499939 8 0.499939C9.0375 0.499939 10.0125 0.696689 10.925 1.09019C11.8375 1.48419 12.6313 2.01869 13.3063 2.69369C13.9813 3.36869 14.5155 4.16244 14.909 5.07494C15.303 5.98744 15.5 6.96244 15.5 7.99994C15.5 9.03744 15.303 10.0124 14.909 10.9249C14.5155 11.8374 13.9813 12.6312 13.3063 13.3062C12.6313 13.9812 11.8375 14.5154 10.925 14.9089C10.0125 15.3029 9.0375 15.4999 8 15.4999Z"
											fill="#36DA81"
										/>
									</svg>
									<span>Preferences</span>
								</h2>
							</div>
						</div>
					)}
				</div>

				<div className={`right-side ${settingsOpen ? 'settings-page' : ''}`}>
					<InputText
						bgColor="rgba(0, 0, 0, 0.2)"
						color="var(--white)"
						glass
						height={35}
						iconColor="var(--white)"
						iconRightPos={{ top: 6, right: 24 }}
						iconSize={0.88}
						maxWidth={300}
						onChange={undefined}
						padding={'0px 40px 0px 20px'}
						parentWidth={'300px'}
						placeholder={'Search'}
					/>

					<div className="user-info">
						<img
							style={{
								backgroundColor: reduceWalletAddressForColor(user?.username || '')
							}}
							className="profile-round pointer"
							alt=""
							src={avatarUrl()}
						/>
						<div className="user-name-address">
							<p className="user-name size-14">{user?.username}</p>
							<p className="user-address size-14">{reduceWalletAddress(user?.accounts || '')}</p>
						</div>
					</div>

					{!settingsOpen && (
						<Link className="settings-btn" to={`settings`}>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M7.54134 15.7923V11.209H8.45801V13.0423H15.7913V13.959H8.45801V15.7923H7.54134ZM0.208008 13.959V13.0423H4.79134V13.959H0.208008ZM3.87467 10.2923V8.45898H0.208008V7.54232H3.87467V5.70898H4.79134V10.2923H3.87467ZM7.54134 8.45898V7.54232H15.7913V8.45898H7.54134ZM11.208 4.79232V0.208984H12.1247V2.04232H15.7913V2.95898H12.1247V4.79232H11.208ZM0.208008 2.95898V2.04232H8.45801V2.95898H0.208008Z"
									fill="#B4C1D2"
								/>
							</svg>
						</Link>
					)}
				</div>
			</div>

			<div className="toolbar-mobile">
				{thread && !settingsOpen ? (
					<div className="side-info-header-mobile">
						<div>
							<button onClick={() => navigate(-1)} className="arrow-icon">
								<svg
									className="ml-3"
									style={{ transform: 'rotate(180deg)' }}
									width="12"
									height="12"
									viewBox="0 0 12 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M-2.29485e-07 5.25L9.13125 5.25L4.93125 1.05L6 -2.62268e-07L12 6L6 12L4.93125 10.95L9.13125 6.75L-2.95052e-07 6.75L-2.29485e-07 5.25Z"
										fill="white"
									/>
								</svg>
							</button>

							<img
								className="profile-round pointer"
								style={{
									backgroundColor: reduceWalletAddressForColor(
										thread?.creator || thread?.creatorAddress
									)
								}}
								alt=""
								src={thread?.creator || thread?.creatorAddress || ''}
							/>
							<div className="user-name-address">
								<p className="user-name size-14">{thread?.creator || thread?.creatorAddress}</p>
								<p className="user-address size-14">13 hours ago</p>
							</div>
						</div>
					</div>
				) : (
					<button
						onClick={settingsOpen ? undefined : () => setIsSidesListOpen(prevState => !prevState)}
						className="side-info-header-mobile"
					>
						<div className="title-img-wrapper">
							{!isMobileSettingsMenuOpen && (
								<button
									onClick={() => setIsMobileSettingsMenuOpen(true)}
									className="menu-btn arrow-icon"
								>
									<svg
										style={{ transform: 'rotate(180deg)' }}
										width="12"
										height="12"
										viewBox="0 0 12 12"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M-2.29485e-07 5.25L9.13125 5.25L4.93125 1.05L6 -2.62268e-07L12 6L6 12L4.93125 10.95L9.13125 6.75L-2.95052e-07 6.75L-2.29485e-07 5.25Z"
											fill="white"
										/>
									</svg>
								</button>
							)}
							<div
								className="image"
								style={{
									backgroundColor: isColor(currentSide?.sideImage || '') ? currentSide?.sideImage : ''
								}}
							>
								{currentSide && !isColor(currentSide.sideImage) ? (
									<img alt="side" src={currentSide.sideImage} />
								) : (
									<div>{currentSide?.name[0]}</div>
								)}
							</div>
							<span className="mobile-side-name">{currentSide?.name}</span>
							{currentSide?.firstCollection?.safelistRequestStatus === OpenSeaRequestStatus.verified && (
								<svg
									width="13"
									height="14"
									viewBox="0 0 13 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M6.5 0.625C6.97396 0.625 7.39714 0.74349 7.76953 0.980469C8.14193 1.21745 8.43815 1.5306 8.6582 1.91992C9.08138 1.78451 9.50456 1.76758 9.92773 1.86914C10.3509 1.9707 10.7402 2.19076 11.0957 2.5293C11.4173 2.86784 11.6289 3.2487 11.7305 3.67188C11.832 4.11198 11.8236 4.54362 11.7051 4.9668C12.0944 5.18685 12.4076 5.48307 12.6445 5.85547C12.8815 6.22786 13 6.65104 13 7.125C13 7.59896 12.8815 8.02214 12.6445 8.39453C12.4076 8.76693 12.0944 9.06315 11.7051 9.2832C11.959 10.1634 11.7559 10.9759 11.0957 11.7207C10.7402 12.0423 10.3509 12.2539 9.92773 12.3555C9.50456 12.457 9.08138 12.4486 8.6582 12.3301C8.43815 12.7194 8.14193 13.0326 7.76953 13.2695C7.39714 13.5065 6.97396 13.625 6.5 13.625C6.02604 13.625 5.60286 13.5065 5.23047 13.2695C4.85807 13.0326 4.56185 12.7194 4.3418 12.3301C3.91862 12.4486 3.48698 12.457 3.04688 12.3555C2.6237 12.2708 2.24284 12.0592 1.9043 11.7207C1.24414 10.9759 1.04102 10.1634 1.29492 9.2832C0.905599 9.06315 0.592448 8.76693 0.355469 8.39453C0.11849 8.02214 0 7.59896 0 7.125C0 6.65104 0.11849 6.22786 0.355469 5.85547C0.592448 5.48307 0.905599 5.18685 1.29492 4.9668C1.15951 4.54362 1.14258 4.11198 1.24414 3.67188C1.3457 3.2487 1.56576 2.86784 1.9043 2.5293C2.24284 2.19076 2.6237 1.9707 3.04688 1.86914C3.48698 1.78451 3.91862 1.80143 4.3418 1.91992C4.56185 1.5306 4.85807 1.21745 5.23047 0.980469C5.60286 0.74349 6.02604 0.625 6.5 0.625ZM8.9375 6.3125C9.19141 6.04167 9.19141 5.76237 8.9375 5.47461C8.66667 5.23763 8.38737 5.23763 8.09961 5.47461L5.6875 7.88672L4.67188 6.89648C4.40104 6.65951 4.12174 6.65951 3.83398 6.89648C3.59701 7.18424 3.59701 7.46354 3.83398 7.73438L5.25586 9.15625C5.54362 9.41016 5.82292 9.41016 6.09375 9.15625L8.9375 6.3125Z"
										fill="#705CE9"
									/>
								</svg>
							)}
						</div>

						{isMobileSettingsMenuOpen && settingsOpen && (
							<button onClick={() => navigate(-1)} className="menu-btn close-icon">
								<svg
									width="14"
									height="14"
									viewBox="0 0 14 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M1.8668 13.096L0.904297 12.1335L6.03763 7.00013L0.904297 1.8668L1.8668 0.904297L7.00013 6.03763L12.1335 0.904297L13.096 1.8668L7.96263 7.00013L13.096 12.1335L12.1335 13.096L7.00013 7.96263L1.8668 13.096Z"
										fill="#B4C1D2"
									/>
								</svg>
							</button>
						)}
						{!settingsOpen && (
							<Link onClick={ev => ev.stopPropagation()} to={`/side/${currentSide?.['name']}/settings`}>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M7.54134 15.7923V11.209H8.45801V13.0423H15.7913V13.959H8.45801V15.7923H7.54134ZM0.208008 13.959V13.0423H4.79134V13.959H0.208008ZM3.87467 10.2923V8.45898H0.208008V7.54232H3.87467V5.70898H4.79134V10.2923H3.87467ZM7.54134 8.45898V7.54232H15.7913V8.45898H7.54134ZM11.208 4.79232V0.208984H12.1247V2.04232H15.7913V2.95898H12.1247V4.79232H11.208ZM0.208008 2.95898V2.04232H8.45801V2.95898H0.208008Z"
										fill="#B4C1D2"
									/>
								</svg>
							</Link>
						)}
					</button>
				)}
			</div>

			<SidesListMobileMenu
				currentSide={currentSide}
				onClose={() => setIsSidesListOpen(false)}
				open={isSidesListOpen}
			/>
		</MiddleContainerHeaderStyled>
	);
}
