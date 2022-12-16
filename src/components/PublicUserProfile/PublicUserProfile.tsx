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
		color: #B6E5E54D;
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
				}
				& .side-card:first-of-type {
					grid-column: 1/3;
				}
				& .side-card .prefix{
					font-weight: 700;
					color:#fff;
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
				${breakpoints(
					size.lg,
					`	max-width: 150px;`
				)}
			}
			& .copy {
				max-width: 50%;
				${breakpoints(
					size.lg,
					`max-width: 131px;`
				)}
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
		margin-left:-10px;
		${breakpoints(
			size.md,
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
						<span className='wording'>Side.xyz</span>
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
									profile ? collections?.find(c => c.address === profile.profilePicture.token_address)
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
												className="side-count-logo"
												width="28"
												height="28"
												viewBox="0 0 28 28"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M15.9588 11.243L12.7487 11.2363C11.2681 11.2363 10.0627 10.0005 10.0627 8.48261V8.28112C10.0627 6.76325 11.2681 5.52747 12.7487 5.52747H28C26.7029 3.29096 24.9733 1.39698 22.8376 0H12.7422C8.28732 0 4.67103 3.71408 4.67103 8.27441V8.47589C4.67103 9.44303 4.83481 10.3699 5.13617 11.2363C6.24988 14.4466 9.23725 16.757 12.7487 16.757L15.9588 16.7637C17.4394 16.7637 18.6448 17.9995 18.6448 19.5174V19.7189C18.6448 21.2367 17.4394 22.4725 15.9588 22.4725H0C1.29715 24.709 3.04633 26.603 5.18203 28H15.9523C20.4071 28 24.0234 24.2859 24.0234 19.7256V19.5241C24.0234 18.557 23.8596 17.6301 23.5583 16.7637C22.4576 13.5534 19.4637 11.243 15.9588 11.243Z"
													fill="var(--primary)"
												/>
											</svg>
											<span className="size-40 length">{user.profiles.length}</span>
										</div>
										<div className="text-white prefix"> Joined Sides</div>
									</DataCard>
									<DataCard className="side-card" background="#5CD8E926" color="var(--blue)">
										<div className="flex align-center  gap-20 mb-3 title">
											<svg
												className="side-count-logo"
												width="28"
												height="28"
												viewBox="0 0 28 28"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M15.9588 11.243L12.7487 11.2363C11.2681 11.2363 10.0627 10.0005 10.0627 8.48261V8.28112C10.0627 6.76325 11.2681 5.52747 12.7487 5.52747H28C26.7029 3.29096 24.9733 1.39698 22.8376 0H12.7422C8.28732 0 4.67103 3.71408 4.67103 8.27441V8.47589C4.67103 9.44303 4.83481 10.3699 5.13617 11.2363C6.24988 14.4466 9.23725 16.757 12.7487 16.757L15.9588 16.7637C17.4394 16.7637 18.6448 17.9995 18.6448 19.5174V19.7189C18.6448 21.2367 17.4394 22.4725 15.9588 22.4725H0C1.29715 24.709 3.04633 26.603 5.18203 28H15.9523C20.4071 28 24.0234 24.2859 24.0234 19.7256V19.5241C24.0234 18.557 23.8596 17.6301 23.5583 16.7637C22.4576 13.5534 19.4637 11.243 15.9588 11.243Z"
													fill="var(--blue)"
												/>
											</svg>
											<span className="size-40 length">{createdSideCount}</span>
										</div>
										<div className="text-white prefix"> Created Sides</div>
									</DataCard>
									<DataCard className="side-card" background="#FFBD3C26" color="var(--warning)">
										<div className="flex align-center gap-20 mb-3 title">
											<svg
												className="side-count-logo"
												width="28"
												height="28"
												viewBox="0 0 28 28"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M15.9588 11.243L12.7487 11.2363C11.2681 11.2363 10.0627 10.0005 10.0627 8.48261V8.28112C10.0627 6.76325 11.2681 5.52747 12.7487 5.52747H28C26.7029 3.29096 24.9733 1.39698 22.8376 0H12.7422C8.28732 0 4.67103 3.71408 4.67103 8.27441V8.47589C4.67103 9.44303 4.83481 10.3699 5.13617 11.2363C6.24988 14.4466 9.23725 16.757 12.7487 16.757L15.9588 16.7637C17.4394 16.7637 18.6448 17.9995 18.6448 19.5174V19.7189C18.6448 21.2367 17.4394 22.4725 15.9588 22.4725H0C1.29715 24.709 3.04633 26.603 5.18203 28H15.9523C20.4071 28 24.0234 24.2859 24.0234 19.7256V19.5241C24.0234 18.557 23.8596 17.6301 23.5583 16.7637C22.4576 13.5534 19.4637 11.243 15.9588 11.243Z"
													fill="var(--warning)"
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
													children={c.name}
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
