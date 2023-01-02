import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeSide, updateCurrentProfile, UserData } from '../../../../redux/Slices/UserDataSlice';
import { RootState } from '../../../../redux/store/app.store';
import styled from 'styled-components';
import { NFT } from '../../../../models/interfaces/nft';
import { Side } from '../../../../models/Side';
import { toast } from 'react-toastify';
import NftsCollections from '../../../ui-components/NftsCollections';
import UserGeneralInformations from '../../../ui-components/UserGeneralInformations';
import { InitialStateUser } from '../../../GeneralSettings/Account/GeneralSettingsAccount';
import { Collection } from '../../../../models/interfaces/collection';
import _ from 'lodash';
import { breakpoints, size } from '../../../../helpers/breakpoints';
import Button from '../../../ui-components/Button';
import profileService from '../../../../services/api-services/profile.service';
import { useNavigate } from 'react-router-dom';

const SideProfileAccountStyled = styled.div`
	// position: relative;
	display: flex;
	gap: 2rem;
	width: 100%;
	padding-bottom: 3rem;
	${breakpoints(
		size.lg,
		`{
    padding-bottom: 0;
  }`
	)}
	& .user-info-wrapper {
		width: 100%;
		${breakpoints(
			size.lg,
			`{
      width: 50%;
    }`
		)}
	}
	& .nft-collections-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9905;
		background-color: var(--background);
		padding: 1rem;
		${breakpoints(
			size.lg,
			`{
      position: relative;
      height: auto;
      width: 50%;
      padding: 0;
    }`
		)}
		& .close-modal-btn {
			position: absolute;
			top: 2rem;
			right: 2rem;
			z-index: 12;
			background-color: transparent;
			border: none;
			outline: none;
			box-shadow: none;
			border-radius: 1400px;
			${breakpoints(
				size.lg,
				`{
        display: none;
      }`
			)}
			&:focus {
				outline: 1px solid var(--primary);
			}
		}
		& .buttons-wrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			${breakpoints(
				size.lg,
				`{
        display: none;
      }`
			)}
			& .cancel-btn {
				background-color: var(--disable);
			}
		}
	}
`;

const initialStateUser = {
	username: '',
	bio: '',
	showNfts: false,
	avatar: null,
	publicNfts: null
};

export default function SideProfileAccount({
	className,
	currentSide,
	userData
}: {
	className?: string;
	currentSide: Side;
	userData: UserData;
}) {
	const { currentProfile } = useSelector((state: RootState) => state.user);
	const navigate = useNavigate();

	const [formData, setFormData] = useState<InitialStateUser>(initialStateUser);

	const [initialData, setInitialData] = useState<InitialStateUser>(initialStateUser);

	const [filteredUserCollections, setFilteredUserCollections] = useState<Collection[]>([]);

	const [displayNftsCollection, setDisplayNftsCollection] = useState<boolean>(false);

	const dispatch = useDispatch();

	const areThereChanges = JSON.stringify(initialData) !== JSON.stringify(formData);

	useEffect(() => {
		if (userData.userCollectionsData && userData.user) {
			const collections = Object.values(userData.userCollectionsData);
			const colls: Collection[] = filterCollection(collections, userData.user.publicNfts);
			setFilteredUserCollections(colls);
		}
	}, [userData.userCollectionsData, userData.user]);

	useEffect(() => {
		if (currentProfile?.profilePicture) {
			setFormData({
				...formData,
				avatar: currentProfile.profilePicture,
				showNfts: currentProfile.showNfts
			});
			setInitialData({
				...formData,
				avatar: currentProfile.profilePicture,
				showNfts: currentProfile.showNfts
			});
		}
	}, [currentProfile?.profilePicture]);

	const onSubmit = async () => {
		if (currentProfile && formData.avatar) {
			try {
				const profile = await profileService.updateProfile(currentProfile.id, {
					showNfts: formData.showNfts,
					profilePicture: formData.avatar
				});
				dispatch(updateCurrentProfile(profile));
				toast.success('Profile updated', { toastId: 1024 });
				setDisplayNftsCollection(false);
			} catch (error) {
				toast.error('error saving your profile avatar', { toastId: 1025 });
				setDisplayNftsCollection(false);
			}
		}
	};

	const leaveSide = async () => {
		try {
			if (userData['currentProfile']) {
				const res = await profileService.leaveSide(userData['currentProfile']);
				if (res['error']) toast.error(res['message'], { toastId: 1026 });
				else {
					navigate('/');
					dispatch(removeSide(userData['currentProfile'].side.id));
					toast.success(res['message'], { toastId: 1027 });
				}
			}
		} catch (error) {
			toast.error('Error when leaving the side', { toastId: 1028 });
		}
	};

	const handleShowNfts = async (value: boolean) => {
		setFormData({ ...formData, showNfts: !value });
	};

	const handleCloseNftModal = () => {
		setFormData(prevValues => ({ ...prevValues, avatar: null }));
		setDisplayNftsCollection(false);
	};

	return (
		<SideProfileAccountStyled className={className}>
			<div className="user-info-wrapper">
				<UserGeneralInformations
					formData={formData}
					setFormData={undefined}
					onSubmit={onSubmit}
					currentSide={currentSide}
					displayNftsCollection={displayNftsCollection}
					setDisplayNftsCollection={setDisplayNftsCollection}
					sideSettingsPage
					userCollectionsData={userData.userCollectionsData}
					leaveSide={leaveSide}
					areThereChanges={areThereChanges}
				/>
			</div>
			{displayNftsCollection &&
				userData &&
				userData.user &&
				userData.userCollectionsData &&
				userData.user.publicNfts && (
					<div className="nft-collections-wrapper">
						<button className="close-modal-btn" onClick={handleCloseNftModal}>
							<svg
								width="12"
								height="13"
								viewBox="0 0 12 13"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M1.2 13L0 11.7L4.8 6.5L0 1.3L1.2 0L6 5.2L10.8 0L12 1.3L7.2 6.5L12 11.7L10.8 13L6 7.8L1.2 13Z"
									fill="#B4C1D2"
								/>
							</svg>
						</button>
						<NftsCollections
							selectedNfts={userData.user.publicNfts}
							collections={filteredUserCollections}
							profile={currentProfile}
							selectedAvatar={formData.avatar}
							setSelectedAvatar={(avatar: NFT) => {
								setFormData(prevValues => ({ ...prevValues, avatar }));
							}}
							handleShowNfts={handleShowNfts}
							formData={formData}
						/>

						<div className="buttons-wrapper">
							<Button classes="cancel-btn" onClick={handleCloseNftModal} width={'100%'}>
								Cancel
							</Button>

							<Button
								color={'var(--text)'}
								disabled={!Object.keys(formData.avatar || {}).length}
								onClick={onSubmit}
								width={'100%'}
							>
								Use this NFT
							</Button>
						</div>
					</div>
				)}
		</SideProfileAccountStyled>
	);
}

function filterCollection(collections: Collection[], publicNfts: NFT[]): Collection[] {
	const colls: Collection[] = [];
	collections.forEach((currentValue: Collection) => {
		const collection = _.clone(currentValue);
		const nfts = collection.nfts;
		const filteredNfts = nfts.filter((nft: NFT) => {
			//@ts-ignore
			return publicNfts?.find(a => a.token_id === nft.token_id);
		});
		collection.nfts = filteredNfts;
		if (collection.nfts.length !== 0) colls.push(collection);
	});
	return colls;
}
