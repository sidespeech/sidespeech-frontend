import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../../models/User';
import { FadeLoader } from 'react-spinners';
import { Collection } from '../../models/interfaces/collection';
import Button from '../ui-components/Button';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { NFT } from '../../models/interfaces/nft';
import styled from 'styled-components';
import { UserAvatar } from './UserAvatar';
import { NftItem } from './NftItem';
import useLogin from '../../hooks/useLogin';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store/app.store';
import { Profile } from '../../models/Profile';
import websocketService from '../../services/websocket-services/websocket.service';
import { addRoomToProfile } from '../../redux/Slices/UserDataSlice';
import { setSelectedRoom } from '../../redux/Slices/ChatSlice';
import { setSelectedChannel } from '../../redux/Slices/AppDatasSlice';
import userService from '../../services/api-services/user.service';
import collectionService from '../../services/api-services/collection.service';
import roomService from '../../services/api-services/room.service';
import { breakpoints, size } from '../../helpers/breakpoints';
import useWalletAddress from '../../hooks/useWalletAddress';


interface IDataCard {
	background: string;
	color: string;
}

const DataCard = styled.div<IDataCard>`
	background: ${props => props.background};
	color: ${props => props.color};
	padding: 18px 23px;
	flex: 1 0 0;
	border-radius: 10px;
	${breakpoints(
		size.lg,
		`{
     
    }`
	)}
`;

const DataAddress = styled.div`
	width: 100%;
	height: 44px;
	border: 1px solid var(--disable);
	border-radius: 7px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: start;
	padding: 0px 17px;
	max-width: 100%;
	div.wallet {
		padding-right: 50px;
		text-overflow: ellipsis;
		max-width: 100%;
		overflow: hidden;
		color: #b6e5e54d;
	}
	div.pointer {
		position: absolute;
		display: flex;
		align-items: center;
		right: 10px;
		bottom: 11px;
		gap: 6px;
		background: #021427;
	}
	${breakpoints(
		size.lg,
		` {
			max-width: 66%;
		}
			div.wallet {
				max-width: 440px;
			}
    `
	)}
`;

const PublicUserProfileStyled = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: center;
	height: 100vh;
	width: 100%;
	overflow: auto;
	padding: 0 2rem;
	& h1 {
		.app-logo {
			transform: scale(0.4);
			${breakpoints(
				size.lg,
				`{
              transform: scale(0.7);
            }`
			)}
		}
		& span {
			font-size: 2rem;
			color: #fff;
			${breakpoints(
				size.lg,
				`{
              font-size: 33.67px;
            }`
			)}
		}
	}
	& .user-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		${breakpoints(
			size.lg,
			`{
            align-items: flex-start;
            flex-direction: row;
          }`
		)}
		.user-more-info-wrapper {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			justify-content: space-between;
			max-width: 100%;
			flex: 1;
			margin-top: -20px;
			${breakpoints(
				size.lg,
				`{
              max-width: 750px;
			  margin-top: 0;
            }`
			)}

			& .user-name {
				display: none;
				${breakpoints(
					size.lg,
					`{
                      display: block;
                      font-size: 1.5rem;
                      font-weight: 700;
                    }`
				)}
			}
			& .side-cards-wrapper {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 1rem;

				.side-card {
					height: 60px;
					padding: 10px 23px;
				}
				${breakpoints(
					size.lg,
					`{
                  display: flex;
                }
				.side-card {
					height: auto;
					padding: 18px 23px;
				}`
				)}
				.title {
					margin-bottom: 4px;
					${breakpoints(
						size.lg,
						`{
						margin-bottom: 10px;
					}`
					)}
				}
				& .side-card:first-of-type {
					grid-column: 1/3;
				}
				& .side-card .prefix {
					font-weight: 700;
					color: #fff;
					font-size: 12px;
					${breakpoints(
						size.lg,
						`{
                    font-size: 14px;
                }`
					)}
				}
				.side-count-logo {
					width: 18px;
					height: 18px;
					${breakpoints(
						size.lg,
						`{
							width: 37px;
							height: 37px;
					}`
					)}
				}
			}
			& .user-bio {
				h3 {
					margin: 0;
					margin-bottom: 10px;
					font-size: 14px;
				}
				${breakpoints(
					size.lg,
					`h3 {
						font-size: 12px;
					}`
				)}
			}
			& .address-btn {
				width: 100%;
				max-width: 50%;
				${breakpoints(size.lg, `	max-width: 150px;`)}
			}
			& .copy {
				max-width: 50%;
				${breakpoints(size.lg, `max-width: 131px;`)}
			}
			& .user-link {
				display: none;
				max-width: 321px;
				height: 48px;
				${breakpoints(
					size.lg,
					`{
                    display: flex;
                }`
				)}
			}
		}
	}
	.user-bio p {
		word-break: break-all;
	}
	& .nfts-wrapper {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		padding: 1rem 0;
		${breakpoints(
			size.md,
			`{
            display: flex;
            flex-wrap: wrap;
        }`
		)}
	}
	.bottom-container {
		height: 55px;
	}
	.nftsHeader {
		font-weight: 700;
	}
	.main-title {
		gap: 0px;
		grid-gap: 0px;
		${breakpoints(
			size.md,
			`{
				gap: 20px;
				grid-gap: 20px;
        }`
		)}
	}
	.length {
		font-size: 20px;
		margin-left: -10px;
		${breakpoints(
			size.lg,
			`{
            font-size: 40px;
			margin-left:0px;
        }`
		)}
	}
`;

export default function PublicUserProfile({ profile }: { profile?: Profile }) {
	const { username } = useParams();

	const userData = useSelector((state: RootState) => state.user);
	const { currentSide } = useSelector((state: RootState) => state.appDatas);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [user, setUser] = useState<User | null>(null);
	const [collections, setCollections] = useState<Collection[] | null>(null);
	const [createdSideCount, setcreatedSideCount] = useState<number>(0);
	const [sharedSidesCount, setSharedSidesCount] = useState<number>(0);
	const [link, setLink] = useState<string>('');
	const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
	const [selectedCollection, setSelectedCollection] = useState<string>('All');

	const { connectWallet } = useLogin();
	const { getWalletAddress, walletAddress } = useWalletAddress();

	useEffect(() => {
		async function getUserData() {
			if (username) {
				const user = await userService.getUserPublicData(username);
				if (user.publicNfts) {
					const addresses = Object.keys(_.groupBy(user.publicNfts, 'token_address'));
					if (addresses.length > 0) {
						const collections = await collectionService.getManyCollectionsByAddress(addresses);
						setCollections(collections);
					}
					setFilteredNfts(user.publicNfts);
				}
				setcreatedSideCount(getCreatedSideCount(user));
				setUser(user);
				setLink(`https://side.xyz/user/${username}`);
				getWalletAddress();
			}
		}
		getUserData();
	}, [username]);

	useEffect(() => {
		if (userData.user && user) {
			const connectedUserSides = userData.user.profiles.map(p => p.side);
			const userserSides = user.profiles.map(p => p.side);
			const foo = _.intersectionBy(connectedUserSides, userserSides, 'id');
			setSharedSidesCount(foo.length);
		}
	}, [userData.user, user]);

	useEffect(() => {
		if (user) {
			const filteredNfts =
				selectedCollection === 'All'
					? [...user.publicNfts]
					: [...user.publicNfts.filter((nft: NFT) => nft.token_address === selectedCollection)];
			setFilteredNfts(filteredNfts);
		}
	}, [selectedCollection, user]);

	const copyLink = () => {
		navigator.clipboard.writeText(link);
		toast.success('Link copied!', { toastId: 15 });
	};
	const copyAddress = () => {
		if (user) {
			navigator.clipboard.writeText(user.accounts);
			toast.success('Address copied!', { toastId: 16 });
		}
	};

	const handleSelectedUser = useCallback(
		async (profile: Profile, currentProfile: Profile) => {
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
				navigate(`/${currentSide?.name}`);
			} catch (error) {
				console.error(error);
				toast.error('There has been an error opening the room', {
					toastId: 20
				});
			}
		},
		[walletAddress]
	);

	return (
		<PublicUserProfileStyled>
			<div className="f-column w-100 align-center justify-start gap-30" style={{ maxWidth: 1094 }}>
				{!profile && (
					<h1 className="fade-in flex align-center gap-20 fw-700 text-white main-title">
						<svg
							className="app-logo"
							width="79"
							height="77"
							viewBox="0 0 79 77"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M45.0267 30.9182L35.9696 30.8997C31.7922 30.8997 28.3912 27.5013 28.3912 23.3272V22.7731C28.3912 18.5989 31.7922 15.2005 35.9696 15.2005H79C75.3402 9.05013 70.4604 3.84169 64.4347 0H35.9511C23.3821 0 13.179 10.2137 13.179 22.7546V23.3087C13.179 25.9683 13.6411 28.5172 14.4913 30.8997C17.6336 39.7282 26.0622 46.0818 35.9696 46.0818L45.0267 46.1003C49.204 46.1003 52.6051 49.4987 52.6051 53.6728V54.2269C52.6051 58.4011 49.204 61.7995 45.0267 61.7995H0C3.6598 67.9499 8.59499 73.1583 14.6207 77H45.0082C57.5772 77 67.7803 66.7863 67.7803 54.2454V53.6913C67.7803 51.0317 67.3182 48.4829 66.4679 46.1003C63.3627 37.2718 54.9155 30.9182 45.0267 30.9182Z"
								fill="var(--primary)"
							/>
						</svg>
						<span className="wording">Side.xyz</span>
					</h1>
				)}
				{user ? (
					<>
						<div className="user-container">
							<UserAvatar
								className="fade-in-delay user-avatar"
								nft={profile ? profile.profilePicture : user.userAvatar}
								name={
									profile
										? collections?.find(c => c.address === profile.profilePicture.token_address)
												?.name
										: collections?.find(c => c.address === user.userAvatar?.token_address)?.name
								}
								userName={user.username}
								verified={
									profile
										? collections?.find(c => c.address === profile.profilePicture.token_address)
										: collections?.find(c => c.address === user.userAvatar?.token_address)
								}
							/>
							<div className="fade-in-delay-2 user-more-info-wrapper">
								<div className="user-name">{user.username}</div>
								<DataAddress onClick={copyAddress}>
									<div className="wallet">{user.accounts}</div>
									<div className="pointer">
										Copy
										<svg
											width="17"
											height="21"
											viewBox="0 0 17 21"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M2 20.8184C1.45 20.8184 0.979 20.6227 0.587 20.2314C0.195667 19.8394 0 19.3684 0 18.8184V4.81836H2V18.8184H13V20.8184H2ZM6 16.8184C5.45 16.8184 4.97933 16.6227 4.588 16.2314C4.196 15.8394 4 15.3684 4 14.8184V2.81836C4 2.26836 4.196 1.79736 4.588 1.40536C4.97933 1.01403 5.45 0.818359 6 0.818359H15C15.55 0.818359 16.021 1.01403 16.413 1.40536C16.8043 1.79736 17 2.26836 17 2.81836V14.8184C17 15.3684 16.8043 15.8394 16.413 16.2314C16.021 16.6227 15.55 16.8184 15 16.8184H6Z"
												fill="var(--primary)"
											/>
										</svg>
									</div>
								</DataAddress>
								<div className="side-cards-wrapper">
									<DataCard className="side-card" background="#705CE926" color="var(--primary)">
										<div className="flex align-center  gap-20 mb-3 title">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="30"
												height="34"
												viewBox="0 0 30 34"
												fill="none"
											>
												<path
													d="M14.9992 26.6722C12.9214 26.6722 10.9047 27.0541 8.94919 27.818C6.99363 28.5819 5.1603 29.7583 3.44919 31.3472V31.4389C3.57141 31.5305 3.67835 31.5916 3.77002 31.6222C3.86169 31.6528 3.96863 31.668 4.09085 31.668H25.8617C25.9839 31.668 26.0835 31.6528 26.1605 31.6222C26.2363 31.5916 26.32 31.5305 26.4117 31.4389V31.3472C24.7922 29.7583 23.0127 28.5819 21.073 27.818C19.1321 27.0541 17.1075 26.6722 14.9992 26.6722ZM2.16585 30.0639C3.81585 28.4444 5.73352 27.169 7.91885 26.2377C10.103 25.3051 12.4631 24.8389 14.9992 24.8389C17.5353 24.8389 19.896 25.3051 22.0814 26.2377C24.2655 27.169 26.1825 28.4444 27.8325 30.0639V7.1472C27.8325 6.84164 27.7176 6.57459 27.4879 6.34603C27.2593 6.11626 26.9922 6.00137 26.6867 6.00137H3.31169C3.00613 6.00137 2.73908 6.11626 2.51052 6.34603C2.28074 6.57459 2.16585 6.84164 2.16585 7.1472V30.0639ZM14.9992 19.7514C13.4714 19.7514 12.1728 19.2166 11.1034 18.1472C10.0339 17.0778 9.49919 15.7791 9.49919 14.2514C9.49919 12.7236 10.0339 11.425 11.1034 10.3555C12.1728 9.28609 13.4714 8.75137 14.9992 8.75137C16.527 8.75137 17.8256 9.28609 18.895 10.3555C19.9645 11.425 20.4992 12.7236 20.4992 14.2514C20.4992 15.7791 19.9645 17.0778 18.895 18.1472C17.8256 19.2166 16.527 19.7514 14.9992 19.7514ZM14.9992 17.918C16.0075 17.918 16.871 17.5587 17.5897 16.84C18.3071 16.1226 18.6659 15.2597 18.6659 14.2514C18.6659 13.243 18.3071 12.3795 17.5897 11.6609C16.871 10.9434 16.0075 10.5847 14.9992 10.5847C13.9909 10.5847 13.128 10.9434 12.4105 11.6609C11.6919 12.3795 11.3325 13.243 11.3325 14.2514C11.3325 15.2597 11.6919 16.1226 12.4105 16.84C13.128 17.5587 13.9909 17.918 14.9992 17.918ZM3.31169 33.5014C2.45613 33.5014 1.74602 33.219 1.18135 32.6544C0.615464 32.0885 0.33252 31.3778 0.33252 30.5222V7.1472C0.33252 6.29164 0.615464 5.58153 1.18135 5.01687C1.74602 4.45098 2.45613 4.16803 3.31169 4.16803H6.52002V0.0888672H8.49085V4.16803H21.645V0.0888672H23.4784V4.16803H26.6867C27.5422 4.16803 28.253 4.45098 28.8189 5.01687C29.3835 5.58153 29.6659 6.29164 29.6659 7.1472V30.5222C29.6659 31.3778 29.3835 32.0885 28.8189 32.6544C28.253 33.219 27.5422 33.5014 26.6867 33.5014H3.31169Z"
													fill="#0CCF99"
												/>
											</svg>
											<span className="size-40 length">{user.profiles.length}</span>
										</div>
										<div className="text-white prefix"> Joined Sides</div>
									</DataCard>
									<DataCard className="side-card" background="#5CD8E926" color="var(--blue)">
										<div className="flex align-center  gap-20 mb-3 title">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="33"
												height="25"
												viewBox="0 0 33 25"
												fill="none"
											>
												<path
													d="M18.5041 22V20.1667H22.5833C22.9499 20.1667 23.286 20.0829 23.5916 19.9155C23.8971 19.7468 24.1416 19.525 24.3249 19.25L30.2374 11L24.3249 2.75C24.1416 2.475 23.8971 2.25317 23.5916 2.0845C23.286 1.91706 22.9499 1.83333 22.5833 1.83333H6.49575C6.22075 1.83333 5.96836 1.94822 5.73858 2.178C5.51003 2.40656 5.39575 2.67361 5.39575 2.97917V6.82917H3.56242V2.97917C3.56242 2.15417 3.8527 1.45139 4.43325 0.870833C5.01381 0.290278 5.70131 0 6.49575 0H22.5833C23.2555 0 23.8819 0.152778 24.4624 0.458333C25.043 0.763889 25.5166 1.17639 25.8832 1.69583L32.4374 11L25.8832 20.2125C25.486 20.7625 25.0051 21.1982 24.4404 21.5197C23.8745 21.8399 23.2555 22 22.5833 22H18.5041ZM6.08325 24.75V19.25H0.583252V17.4167H6.08325V11.9167H7.91658V17.4167H13.4166V19.25H7.91658V24.75H6.08325Z"
													fill="#3DB4E7"
												/>
											</svg>
											<span className="size-40 length">{createdSideCount}</span>
										</div>
										<div className="text-white prefix"> Created Sides</div>
									</DataCard>
									{userData.user && user.accounts.toLowerCase() !== walletAddress && (
										<DataCard className="side-card" background="#FFBD3C26" color="var(--warning)">
											<div className="flex align-center gap-20 mb-3 title">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="36"
													height="26"
													viewBox="0 0 36 26"
													fill="none"
												>
													<path
														d="M0.766724 25.1462V22.1212C0.766724 21.2656 0.988557 20.5323 1.43222 19.9212C1.87467 19.31 2.46256 18.8212 3.19589 18.4545C4.78478 17.6906 6.36634 17.0874 7.94056 16.645C9.51356 16.2013 11.4001 15.9795 13.6001 15.9795C15.8001 15.9795 17.6872 16.2013 19.2614 16.645C20.8344 17.0874 22.4153 17.6906 24.0042 18.4545C24.7376 18.8212 25.3261 19.31 25.7697 19.9212C26.2122 20.5323 26.4334 21.2656 26.4334 22.1212V25.1462H0.766724ZM30.1001 25.1462V22.0295C30.1001 20.96 29.8862 19.9517 29.4584 19.0045C29.0306 18.0573 28.4195 17.2475 27.6251 16.5753C28.5112 16.7587 29.3747 17.0184 30.2156 17.3545C31.0552 17.6906 31.8876 18.0573 32.7126 18.4545C33.507 18.8517 34.1261 19.3632 34.5697 19.989C35.0122 20.616 35.2334 21.2962 35.2334 22.0295V25.1462H30.1001ZM13.6001 11.8545C12.0723 11.8545 10.7737 11.3198 9.70422 10.2503C8.63478 9.18088 8.10006 7.88227 8.10006 6.35449C8.10006 4.85727 8.63478 3.56599 9.70422 2.48066C10.7737 1.39655 12.0723 0.854492 13.6001 0.854492C15.0973 0.854492 16.3886 1.39655 17.4739 2.48066C18.558 3.56599 19.1001 4.85727 19.1001 6.35449C19.1001 7.88227 18.558 9.18088 17.4739 10.2503C16.3886 11.3198 15.0973 11.8545 13.6001 11.8545ZM26.9376 6.35449C26.9376 7.88227 26.3955 9.18088 25.3114 10.2503C24.2261 11.3198 22.9348 11.8545 21.4376 11.8545C21.3459 11.8545 21.2389 11.8472 21.1167 11.8325C20.9945 11.8166 20.9028 11.8087 20.8417 11.8087C21.4528 11.0448 21.9264 10.1965 22.2626 9.26399C22.5987 8.33266 22.7667 7.36283 22.7667 6.35449C22.7667 5.37671 22.5907 4.42949 22.2387 3.51283C21.8879 2.59616 21.4223 1.7406 20.8417 0.946159C20.9334 0.915604 21.0251 0.892381 21.1167 0.876492C21.2084 0.861826 21.3153 0.854492 21.4376 0.854492C22.9348 0.854492 24.2261 1.39655 25.3114 2.48066C26.3955 3.56599 26.9376 4.85727 26.9376 6.35449ZM2.60006 23.3128H24.6001V22.1212C24.6001 21.6934 24.4931 21.3194 24.2792 20.9992C24.0653 20.6777 23.6834 20.3642 23.1334 20.0587C21.7584 19.3253 20.3149 18.768 18.8031 18.3867C17.2899 18.0041 15.5556 17.8128 13.6001 17.8128C11.6445 17.8128 9.91078 18.0041 8.39889 18.3867C6.88578 18.768 5.44172 19.3253 4.06672 20.0587C3.51672 20.3642 3.13478 20.6777 2.92089 20.9992C2.707 21.3194 2.60006 21.6934 2.60006 22.1212V23.3128ZM13.6001 10.0212C14.6084 10.0212 15.4719 9.66182 16.1906 8.94316C16.908 8.22571 17.2667 7.36283 17.2667 6.35449C17.2667 5.34616 16.908 4.48327 16.1906 3.76583C15.4719 3.04716 14.6084 2.68783 13.6001 2.68783C12.5917 2.68783 11.7288 3.04716 11.0114 3.76583C10.2927 4.48327 9.93339 5.34616 9.93339 6.35449C9.93339 7.36283 10.2927 8.22571 11.0114 8.94316C11.7288 9.66182 12.5917 10.0212 13.6001 10.0212Z"
														fill="#FFDA56"
													/>
												</svg>
												{userData.user ? (
													<span className="size-40 length">{sharedSidesCount}</span>
												) : (
													<span style={{ lineHeight: '12px' }}>
														Connect <br /> your wallet
													</span>
												)}
											</div>
											<div className="text-white prefix">Sides together</div>
										</DataCard>
									)}
								</div>

								<div className="user-bio">
									<h3>Bio</h3>
									<p>{user.bio}</p>
								</div>
								<div className="flex gap-20">
									{userData.user && user.accounts.toLowerCase() !== walletAddress && (
										<Button
											classes="address-btn"
											children={'Send a message'}
											onClick={() => {
												if (profile && userData.currentProfile)
													handleSelectedUser(profile, userData.currentProfile);
											}}
										/>
									)}
									{!userData.user && (
										<Button
											classes="address-btn"
											children={'Connect Wallet'}
											onClick={connectWallet}
										/>
									)}
									<DataAddress className="user-link">
										<span className="text-inactive">
											{profile
												? `https://side.xyz/${currentSide?.name}/profile/`
												: 'https://side.xyz/user/'}
											<span className="text-main">{username}</span>
										</span>
									</DataAddress>
									<Button
										background="var(--white-transparency-10)"
										classes="address-btn copy"
										children={'Copy the link'}
										onClick={copyLink}
									/>
								</div>
							</div>
						</div>
						{((profile && profile.showNfts) || !profile) && (
							<div className="fade-in-delay-3 f-column gap-20 w-100">
								<div className="nftsHeader">Public NFTs</div>
								<div className="flex f-wrap gap-20">
									<Button
										width={'61px'}
										height={36}
										children={'All'}
										color={selectedCollection === 'All' ? 'var(--dark-gray)' : 'var(--text)'}
										onClick={() => setSelectedCollection('All')}
										background={
											selectedCollection === 'All'
												? 'var(--primary)'
												: 'var(--white-transparency-10)'
										}
									/>
									{collections &&
										collections.map(c => {
											const isSelected = c.address === selectedCollection;
											return (
												<Button
													key={c.address}
													radius={7}
													classes="px-3 py-2"
													width="fit-content"
													height={36}
													children={c.getName()}
													color={isSelected ? 'var(--dark-gray)' : 'var(--text)'}
													background={
														isSelected ? 'var(--primary)' : 'var(--white-transparency-10)'
													}
													onClick={() => setSelectedCollection(c.address)}
												/>
											);
										})}
								</div>
								<div className="nfts-wrapper">
									{collections &&
										filteredNfts.map((nft: NFT, index: number) => {
											const col = collections.find(c => c.address === nft.token_address);
											if (!col) return <></>;
											return <NftItem key={index} nft={nft} collection={col} />;
										})}
								</div>
							</div>
						)}
					</>
				) : (
					<FadeLoader color="var(--text)" />
				)}
			</div>
		</PublicUserProfileStyled>
	);
}
function getCreatedSideCount(user: User) {
	const sides = user.profiles.map(p => p.side);
	const createdSides = sides.filter(s => s.creatorAddress === user.accounts);
	return createdSides.length;
}
