import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FALLBACK_BG_IMG } from '../../../constants/constants';
import useWalletAddress from '../../../hooks/useWalletAddress';
import { OpenSeaRequestStatus } from '../../../models/interfaces/collection';
import { Profile, Role } from '../../../models/Profile';
import { Side } from '../../../models/Side';
import ClampLines from '../../ui-components/ClampLines';
import SideCardJoinActions from './SideCardJoinActions';
import SideCardUserActions from './SideCardUserActions';

const CARD_HEIGHT = 363;

interface SideCardItemStyledProps {
	coverImage?: string;
}

const OopsContainer = styled.div<any>`
	background-color: ${props => props.backgroundColor};
	color: ${props => props.color};
	position: absolute;
	height: 50px;
	top: 0px;
	left: 0px;
	z-index: 50;
	width: 100%;
	padding: 10px 13px;
	font-weight: 700;
	font-size: 14px;
`;

const SideCardItemStyled = styled.main<SideCardItemStyledProps>`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	width: 100%;
	flex-shrink: 0;
	background-color: var(--black-transparency-20);
	border-radius: 10px;
	overflow: hidden;
	position: relative;
	.cover-image {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		height: ${CARD_HEIGHT / 2}px;
		padding: 1rem;
		background-image: url(${props => props.coverImage || FALLBACK_BG_IMG});
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
		&::after {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			right: 0;
			left: 0;
			background: linear-gradient(180deg, rgba(24, 26, 43, 0) 0%, #181a2b 100%);
			pointer-events: none;
			z-index: 1;
		}
		& > div {
			position: relative;
			z-index: 2;
			height: 40%;
		}
		.title-wrapper {
			gap: 1rem;
			& .avatar {
				width: 50px;
				height: 50px;
				border-radius: 100px;
				overflow: hidden;
				flex-shrink: 0;
				& > img {
					width: 100%;
					object-fit: cover;
				}
			}
			& .title {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 90%;
				margin: 0;
			}
			& .collections {
				display: flex;
				gap: 5px;
				width: 100%;
				& span {
					background-color: var(--disable);
					color: var(--white);
					padding: 0.3rem 0.5rem;
					border-radius: 5px;
					width: 100px;
					&.collection {
						display: flex;
						align-items: center;
						width: auto;
						max-width: 75%;
						& > span {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							max-width: 100%;
							margin: 0;
							padding: 0;
						}
						& > svg {
							margin-left: 1rem;
							& path {
								fill: #705ce9;
							}
						}
					}
					&.more-collections {
					}
				}
			}
		}
	}
	.side-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: flex-end;
		min-height: ${CARD_HEIGHT / 2}px;
		padding: 1rem;
		color: var(--text);
		.side-description {
			height: 50px;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.side-actions {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
	}
`;

interface SideCardItemProps {
	alerts?: any[];
	messages?: any[];
	onJoin?: (side: Side) => void;
	side: Side;
	userProfiles: any[];
	userSides?: boolean;
}

const SideCardItem = ({ alerts, messages, onJoin, side, userProfiles, userSides }: SideCardItemProps) => {
	const navigate = useNavigate();
	const { walletAddress } = useWalletAddress();

	const handleNavigate = () => {
		const sideProfile: Profile = userProfiles.find(profile => profile.side.id === side.id);
		if (!side.joined || !side.eligible || sideProfile.isBlacklisted) return;
		navigate(`/side/${side.name.replace(/\s/g, '-').toLowerCase()}`);
	};

	let alertsCount = 0;
	alerts?.forEach(alert => {
		if (alert.sideId === side.id) alertsCount += 1;
		else
			side.channels?.forEach(channel => {
				if (alert.channelId === channel?.id) alertsCount += 1;
			});
	});

	let messagesCount = 0;
	messages?.forEach(message => {
		if (message.sideId === side.id) messagesCount += 1;
		else
			side?.profiles
				?.filter(profile => profile.user?.accounts?.toLowerCase() !== walletAddress?.toLowerCase())
				?.forEach(profile => {
					if (profile.rooms?.some(room => room.id === message.name || room.id === message.room?.id))
						messagesCount += 1;
				});
	});

	const sideProfile: Profile = userProfiles.find(profile => profile.side.id === side.id);

	return (
		<SideCardItemStyled
			coverImage={side.firstCollection?.bannerUrl || side.firstCollection?.imageUrl || FALLBACK_BG_IMG}
		>
			{sideProfile && sideProfile.isBlacklisted && (
				<OopsContainer backgroundColor={'var(--red)'} color={'var(--white)'}>
					Oops! You have been banned from this Side
				</OopsContainer>
			)}
			{userSides && side.joined && !side.eligible && (
				<OopsContainer backgroundColor={'#FFDA56'} color={'black'}>
					Oops! You are no longer eligible for this Side.
				</OopsContainer>
			)}
			<div className={`cover-image ${side.joined ? 'pointer' : ''}`} onClick={handleNavigate}>
				<div className="flex align-center title-wrapper">
					<div className="avatar">
						<img src={side.firstCollection?.imageUrl || FALLBACK_BG_IMG} alt={`${side?.name} avatar`} />
					</div>
					<div className="f-column w-100">
						<h3 className="title">{side?.name || '{No Name}'}</h3>
						{side.collectionsCount > 0 && (
							<div className="collections">
								<span className="collection">
									<span>{side.firstCollection?.collectionName}</span>
									{side.firstCollection?.safelistRequestStatus === OpenSeaRequestStatus.verified && (
										<svg
											width="17"
											height="16"
											viewBox="0 0 17 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M5.87273 16L4.40455 13.5619L1.62273 12.9524L1.89318 10.1333L0 8L1.89318 5.86667L1.62273 3.04762L4.40455 2.4381L5.87273 0L8.5 1.10476L11.1273 0L12.5955 2.4381L15.3773 3.04762L15.1068 5.86667L17 8L15.1068 10.1333L15.3773 12.9524L12.5955 13.5619L11.1273 16L8.5 14.8952L5.87273 16ZM7.68864 10.7048L12.0545 6.4L10.9727 5.29524L7.68864 8.53333L6.02727 6.93333L4.94545 8L7.68864 10.7048Z" />
										</svg>
									)}
								</span>
								{side.collectionsCount > 1 && (
									<span className="more-collections">+{side.collectionsCount - 1}</span>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="side-content">
				<div className={`side-description ${side.joined ? 'pointer' : ''}`} onClick={handleNavigate}>
					{side.description}
				</div>
				<div className="side-actions">
					{userSides && side.joined && side.eligible ? (
						<SideCardUserActions
							alertsCount={alertsCount}
							messagesCount={messagesCount}
							onNavigate={handleNavigate}
							side={side}
							userProfiles={userProfiles}
						/>
					) : (
						<SideCardJoinActions
							eligible={side.eligible}
							onNavigate={handleNavigate}
							joined={side.joined}
							onJoin={() => onJoin?.(side)}
						/>
					)}
				</div>
			</div>
		</SideCardItemStyled>
	);
};

export default SideCardItem;
