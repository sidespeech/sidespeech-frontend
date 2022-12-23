import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { EventType } from '../../constants/EventType';
import { subscribeToEvent, unSubscribeToEvent } from '../../helpers/CustomEvent';
import { Announcement } from '../../models/Announcement';
import { RootState } from '../../redux/store/app.store';
import { Side, SideStatus } from '../../models/Side';
import { Dot } from '../ui-components/styled-components/shared-styled-components';
import { Profile, Role } from '../../models/Profile';
import { NotificationType } from '../../models/Notification';
import SideEligibilityModal from '../Modals/SideEligibilityModal';
import LeaveSideConfirmationModal from '../Modals/LeaveSideConfirmationModal';
import notificationService from '../../services/api-services/notification.service';
import { isColor } from '../../helpers/utilities';
import ReactTooltip from 'react-tooltip';

const UserSidesStyled = styled.div`
	max-height: calc(100vh - 4rem - 48px);
	overflow-y: scroll;
	overflow-x: hidden;
	scrollbar-width: none;
	padding-top: 0.5rem;
	::-webkit-scrollbar {
		width: 0;
	}
	.colony-badge {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		background-color: var(--input);
		border: 1px solid black;
		border-radius: 25px;
		margin: 0px 12px;
		overflow: hidden;
		z-index: 50;
		transition: all 0.2s ease;
		font-size: 27px;
		font-weight: 700;
		text-transform: uppercase;

		&.active {
			border: 2px solid var(--primary);
		}
		&:hover {
			outline: 2px solid var(--primary);
		}
		& > img {
			object-fit: cover;
			width: 100%;
			height: 100%;
		}
	}

	.badge-notification {
		position: absolute;
		margin-top: -21px;
	}
`;

export default function UserSides() {
	const navigate = useNavigate();
	const { id } = useParams();

	const { currentSide } = useSelector((state: RootState) => state.appDatas);
	const userData = useSelector((state: RootState) => state.user);
	const [isSideAdmin, SetIsSideAdmin] = useState<any>(null);
	const [displayModal, setDisplayModal] = useState<boolean>(false);
	const [displayLeaveSide, setDisplayLeaveSide] = useState<boolean>(false);
	const [side, setSide] = useState<Side | null>(null);

	const [dots, setDots] = useState<any>({});

	const displaySide = (side: Side) => {
		if (side.status === SideStatus.inactive) {
			setSide(side);
			setDisplayModal(true);
		} else {
			navigate('side/' + side.name.replace(/\s/g, '-').toLowerCase());
		}
	};

	const handleReceiveAnnouncement = ({ detail }: { detail: Announcement }) => {
		const account = localStorage.getItem('userAccount');
		if (currentSide && account) {
			const sideFounded = userData.sides.find((s: Side) => {
				return s.channels.find((c: any) => c.id === detail['channelId']);
			});
			if (sideFounded && sideFounded!['id'] !== currentSide['id']) {
				const number = dots[sideFounded['id']] || 0;
				setDots({ ...dots, [sideFounded!['id']]: number + 1 });
			}
		}
	};

	const handleReceiveMessage = async (m: any) => {
		const { detail } = m;
		const account = localStorage.getItem('userAccount');
		if (currentSide && account) {
			const sideFounded = userData.sides.find((s: Side) => {
				return s.profiles.find((p: Profile) => {
					return p.rooms.find(el => el.id === detail.room['id']);
				});
			});
			if (sideFounded && sideFounded!['id'] !== currentSide['id']) {
				const number = dots[sideFounded['id']] || 0;
				setDots({ ...dots, [sideFounded!['id']]: number + 1 });
			}
		}
	};

	// LISTENING WS =====================================================================
	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
		};
	}, [dots, userData, currentSide]);

	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
		};
	}, [dots, userData, currentSide]);
	// LISTENING WS =====================================================================

	// Function to get notification from db and assign them to the state variable
	async function getAndSetRoomNotifications(account: string) {
		const notifications = await notificationService.getNotification(account!);
		let dots_object: any = {};

		const currentChannelsIds = currentSide!.channels.map((c: any) => c.id);
		for (let notification of notifications) {
			// If the message is for current Side
			if (
				currentChannelsIds.includes(notification['name']) ||
				currentSide?.profiles.find((p: Profile) => p.rooms.some(el => el.id === notification['name']))
			) {
				dots_object[currentSide!['id']] = 0;
			} else {
				// If the message is for another Side
				let sideFounded: any;

				if (notification['type'] == NotificationType.Channel) {
					sideFounded = userData.sides?.find((s: Side) => {
						return s.channels?.find((c: any) => c.id === notification['name']);
					});
				} else {
					sideFounded = userData.sides.find((s: Side) => {
						return s.profiles.find((p: Profile) => {
							return p.rooms.find(el => el.id === notification['name']);
						});
					});
				}
				if(typeof sideFounded !== 'undefined' && sideFounded !== null){
					if (currentSide && sideFounded!['id'] !== currentSide['id']) {
						const number = dots_object[sideFounded!['id']] || 0;
						dots_object[sideFounded!['id']] = number + 1;
					}
				}
			}
		}
		notifications.length ? setDots(dots_object) : setDots({});
	}

	useEffect(() => {
		const account = localStorage.getItem('userAccount');
		if (currentSide && account) getAndSetRoomNotifications(account);
	}, [currentSide]);

	useEffect(() => {
		if (userData.user && side) {
			const sideProfile = userData.user?.profiles.find(profile => profile.side?.id === side?.id);

			const isSideAdminResponse = sideProfile?.role === Role.Admin || sideProfile?.role === Role.subadmin;
			SetIsSideAdmin(isSideAdminResponse);
		}
	}, [currentSide, userData, side]);

	return (
		<>
			<UserSidesStyled className="f-column align-center mt-3" style={{ gap: 15 }}>
				{userData.sides?.map((c, i) => {
					return (
						<>
							<div
								data-tip
								data-for={c.id}
								onClick={() => {
									displaySide(c);
								}}
								className={`colony-badge pointer ${id === c.name ? 'active' : ''}`}
								style={{ backgroundColor: isColor(c.sideImage) ? c.sideImage : '' }}
								key={c.id}
							>
								{!isColor(c.sideImage) ? (
									<img alt="colony-icon" src={c.sideImage} />
								) : (
									<div>{c.name[0]}</div>
								)}
								{c && dots[c.id] > 0 && <Dot className="badge-notification">{dots[c.id]}</Dot>}
							</div>
							<ReactTooltip backgroundColor="var(--panels)" id={c.id} effect="solid">
								{c.name}
							</ReactTooltip>
						</>
					);
				})}
				{/* <Link to={"/new-side"}>
          <i
            className="fa-solid fa-plus mt-3 size-24 pointer text-secondary-dark"
            // onClick={() => changeStateModal(true)}
          ></i>
        </Link> */}
				{displayModal && side && (
					<SideEligibilityModal
						selectedSide={side}
						setDisplayEligibility={setDisplayModal}
						setDisplayLeaveSide={setDisplayLeaveSide}
						isSideAdmin={isSideAdmin}
						setSelectedSide={setSide}
					/>
				)}
				{displayLeaveSide && side && (
					<LeaveSideConfirmationModal
						side={side}
						setIsLeaveConfirmationModalOpen={setDisplayLeaveSide}
						isSideAdmin={isSideAdmin}
					/>
				)}
			</UserSidesStyled>
		</>
	);
}
