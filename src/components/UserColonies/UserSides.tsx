import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../redux/store/app.store';
import { Side, SideStatus } from '../../models/Side';
import { Dot } from '../ui-components/styled-components/shared-styled-components';
import { Profile, Role } from '../../models/Profile';
import { NotificationType } from '../../models/Notification';
import { isColor } from '../../helpers/utilities';
import ReactTooltip from 'react-tooltip';
import { useNotificationsContext } from '../../providers/NotificationsProvider';
import useWalletAddress from '../../hooks/useWalletAddress';
import { setEligibilityOpen } from '../../redux/Slices/AppDatasSlice';

const UserSidesStyled = styled.div`
	max-height: calc(100vh - 4rem - 48px);
	overflow-y: scroll;
	overflow-x: hidden;
	scrollbar-width: none;
	padding: 0.5rem 0;
	::-webkit-scrollbar {
		width: 0;
	}
	.colony-badge {
		position: relative;
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
			object-fit: contain;
			width: 100%;
			height: 100%;
		}
	}

	.badge-notification {
		position: absolute;
		top: 0;
		right: -5px;
	}
`;

export default function UserSides() {
	const navigate = useNavigate();
	const { id } = useParams();
	const dispatch = useDispatch();

	const { currentSide } = useSelector((state: RootState) => state.appDatas);
	const userData = useSelector((state: RootState) => state.user);
	const [isSideAdmin, SetIsSideAdmin] = useState<any>(null);
	const [displayLeaveSide, setDisplayLeaveSide] = useState<boolean>(false);
	const [side, setSide] = useState<Side | null>(null);

	const { lastAnnouncement, lastMessage, staticNotifications } = useNotificationsContext();
	const { walletAddress } = useWalletAddress();

	const [dots, setDots] = useState<any>({});

	const displaySide = (side: Side) => {
		if (side.status === SideStatus.inactive) {
			dispatch(setEligibilityOpen({ open: true, side: side }));
		} else {
			navigate('side/' + side.name.replace(/\s/g, '-').toLowerCase());
		}
	};

	// LISTENING WS =====================================================================
	useEffect(() => {
		if (walletAddress) {
			const sideFounded = userData.sides.find((s: Side) => {
				return s.channels.find((c: any) => c.id === lastAnnouncement?.channelId);
			});
			if (sideFounded && sideFounded!['id'] !== currentSide?.['id']) {
				setDots((prevState: any) => {
					const number = prevState[sideFounded['id']] || 0;
					return { ...prevState, [sideFounded!['id']]: number + 1 };
				});
			}
		}
	}, [userData, currentSide, lastAnnouncement]);

	useEffect(() => {
		if (walletAddress) {
			const sideFounded = userData.sides.find((s: Side) => {
				return s.profiles.find((p: Profile) => {
					return p.rooms.find(el => el.id === lastMessage?.room['id']);
				});
			});
			if (sideFounded && sideFounded!['id'] !== currentSide?.['id']) {
				setDots((prevState: any) => {
					const number = prevState[sideFounded['id']] || 0;
					return { ...prevState, [sideFounded!['id']]: number + 1 };
				});
			}
		}
	}, [userData, currentSide, lastMessage]);
	// LISTENING WS =====================================================================

	// Function to get notification from db and assign them to the state variable
	async function setRoomNotifications(notifications: any[]) {
		let dots_object: any = {};

		const currentChannelsIds = currentSide?.channels?.map((c: any) => c.id);
		for (let notification of notifications) {
			// If the message is for current Side
			if (
				currentChannelsIds?.includes(notification['name']) ||
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
				if (currentSide && sideFounded && sideFounded!['id'] !== currentSide['id']) {
					const number = dots_object[sideFounded!['id']] || 0;
					dots_object[sideFounded!['id']] = number + 1;
				}
			}
		}
		notifications.length ? setDots(dots_object) : setDots({});
	}

	useEffect(() => {
		if (staticNotifications.length) setRoomNotifications(staticNotifications);
	}, [staticNotifications]);

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

			</UserSidesStyled>
		</>
	);
}
