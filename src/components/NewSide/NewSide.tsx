import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import ContainerLeft from '../ui-components/ContainerLeft';
import TabItems from '../ui-components/TabItems';
import { Side } from '../../models/Side';
import Button from '../ui-components/Button';
import Admission from './admission/Admission';
import Channels from '../CurrentColony/settings/channels/ChannelsTab';
import Invitation from '../CurrentColony/settings/invitation/InvitationTab';
import { updateSidesByUserCollections, updateUser } from '../../redux/Slices/UserDataSlice';
import { RootState } from '../../redux/store/app.store';
import { Collection } from '../../models/interfaces/collection';
import _, { cloneDeep, flatten, valuesIn } from 'lodash';
import { Channel, ChannelType } from '../../models/Channel';
import { Profile, Role } from '../../models/Profile';
import { Metadata } from '../../models/Metadata';
import { breakpoints, size } from '../../helpers/breakpoints';
import Informations from '../CurrentColony/settings/informations/Information';
import userService from '../../services/api-services/user.service';
import filesService from '../../services/api-services/files.service';
import sideService from '../../services/api-services/side.service';
import { checkEligibilityByCondition, checkUserEligibility, reduceWalletAddress } from '../../helpers/utilities';
import Spinner from '../ui-components/Spinner';
import useGetCollections from '../../hooks/useGetCollections';

const NewSideStyled = styled.div`
	width: 100%;
	.title-wrapper {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		& .title {
			margin: 0;
			color: var(--inactive);
		}
	}

	.container-next-back {
		width: 100%;
		${breakpoints(
			size.lg,
			`{
    width: 60%;
    max-width: 500px;
  }`
		)}
	}

	.tabs-wrapper_mobile {
		display: flex;
		gap: 3rem;
		align-items: center;
		justify-content: center;
		padding: 0 2rem;
		margin: 2rem 0 1rem 0;
		${breakpoints(
			size.lg,
			`{
        display: none
      }`
		)}
		& .step-icon {
			position: relative;
			background-color: var(--disable);
			display: flex;
			flex-shrink: 0;
			align-items: center;
			justify-content: center;
			width: 2rem;
			height: 2rem;
			border-radius: 2rem;
			font-size: 0.7rem;
			&::after {
				content: '';
				position: absolute;
				top: 50%;
				transform: translate(100%, -50%);
				right: 0;
				width: 3rem;
				height: 1px;
				background-color: var(--disable);
			}
			&:last-of-type::after {
				display: none;
			}
			&.active {
				background-color: var(--primary);
				color: var(--white);
			}
			&.completed {
				background-color: var(--green);
				color: var(--disable);
				&::after {
					background-color: var(--green);
				}
			}
		}
	}

	.container-left {
		display: none;
		padding-left: 1rem;
		${breakpoints(
			size.lg,
			`{
        display: flex;
      }`
		)}
		.tabs-wrapper {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding-left: 1rem;
			margin-top: 1rem;
			.nav-link {
				width: 100%;
				display: flex;
				gap: 0.5rem;
				align-items: center;
				justify-content: space-between;
				& > div {
					display: flex;
					gap: 0.5rem;
					align-items: center;
					& .step-icon {
						background-color: var(--disable);
						display: flex;
						flex-shrink: 0;
						align-items: center;
						justify-content: center;
						width: 2rem;
						height: 2rem;
						border-radius: 2rem;
						font-size: 0.7rem;
					}
				}
				&.active {
					color: var(--primary) !important;
					background-color: transparent !important;
					border-right: 2px solid var(--primary);
					& .step-icon {
						background-color: var(--primary);
						color: var(--white);
					}
				}
				&.completed {
					color: var(--green) !important;
					background-color: transparent !important;
					& .step-icon {
						background-color: var(--green);
						color: var(--disable);
					}
				}
				& .fa-check {
					margin-left: 0.5rem;
				}
			}
		}
	}

	.collection-icon-check {
		color: #0d6efd;
	}
`;

const MAX_NUMBER_OF_COLLECTIONS = 5;

const initialStateSteps = [
	{
		label: 'Informations',
		icon: 'fa-solid fa-1',
		active: true,
		completed: false
	},
	{
		label: 'Admission',
		icon: 'fa-solid fa-2',
		active: false,
		completed: false
	},
	{
		label: 'Channels',
		icon: 'fa-solid fa-3',
		active: false,
		completed: false
	},
	{
		label: 'Invitation',
		icon: 'fa-solid fa-4',
		active: false,
		completed: false
	}
];

export interface InitialStateSide {
	sideImage: string | undefined;
	name: string;
	description: string;
	NftTokenAddress: string;
	conditions: any;
	creatorAddress: string | undefined;
	required: boolean;
}

export interface InitialChannelsState {
	currents: any[];
	removed: any[];
	added: any[];
}

const initialStateSide = {
	sideImage: undefined,
	name: '',
	description: '',
	NftTokenAddress: '',
	conditions: {},
	priv: false,
	required: false,
	creatorAddress: window.ethereum?.selectedAddress
};

// Data to add collection in condition
const initialDivCollections = [
	{
		collection: '',
		features: [],
		traits_values: [],
		numberNeeded: 1,
		metadata: {}
	}
];

const initialChannelsState = {
	currents: [],
	removed: [],
	added: [
		{
			name: 'Announcement',
			isVisible: true,
			type: ChannelType.Announcement,
			authorizeComments: false
		}
	]
};

const Middle = styled.div`
	overflow: scroll;
	height: calc(100vh - 62px - 77px);
	padding-bottom: calc(2rem + 77px);
	${breakpoints(
		size.lg,
		`{
    height: calc(100vh - 62px);
  }
  .spinner-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}
  `
	)}
`;

export default function NewSide() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const currentSide = new Side({});
	const [formData, setFormData] = useState<InitialStateSide>(cloneDeep(initialStateSide));
	const [formError, setFormError] = useState({
		name: { exist: false, length: false }
	});
	const { userCollectionsData, user } = useSelector((state: RootState) => state.user);

	const [steps, setSteps] = useState<any[]>(cloneDeep(initialStateSteps));
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Variables for Admission component
	const [divCollections, setDivCollection] = useState<any[]>(cloneDeep(initialDivCollections));
	const [onlyOneRequired, setOnlyOneRequired] = useState<boolean>(true);

	// Variables for Channels component
	const [channels, setChannels] = useState<InitialChannelsState>(initialChannelsState);

	// Variables for Invitation component
	const [invitationUsers, setInvitationUsers] = useState<any>([]);
	const [userInvited, setUserInvited] = useState<any>([]);

	const collections = useGetCollections();

	useEffect(() => {
		if (user && user.profiles) {
			const getInvitationUsers = async (user: any) => {
				let userSides = user.profiles.map((p: Profile) => p.side);
				let users = await userService.getUserFromSides(userSides.map((s: Side) => s.id));
				let invitationsUsersObject = [];
				delete user['profiles'];
				for (let userInvite of users) {
					if (user['id'] !== userInvite['id'])
						invitationsUsersObject.push({
							name: userInvite['username']
								? `${userInvite['username']} (${reduceWalletAddress(userInvite['accounts'])})`
								: reduceWalletAddress(userInvite['accounts']),
							invited: false,
							recipient: userInvite,
							sender: user
						});
				}
				setInvitationUsers(invitationsUsersObject);
			};
			getInvitationUsers({ ...user });
		}
	}, [user]);

	const handleTabs = async (tabIndex: number) => {
		let current_data = { ...formData };
		let current_steps = cloneDeep(steps);
		let isValidate: boolean;

		if (currentStep < tabIndex) {
			isValidate = await validatorSteps(currentStep, current_data);
			const tabCompletedValidator = current_steps.find(
				(item, index) => !item['completed'] && index < tabIndex && !item['active']
			);
			if (!isValidate || tabCompletedValidator) return;
		}

		const currentStepsState = current_steps.map((item: any, map_i: number) => {
			// Turn active or not for selected item
			item['active'] = map_i === tabIndex ? true : false;
			// Turn completed or not for previous or next items
			item['completed'] = map_i < tabIndex || item['completed'] ? true : false;
			return item;
		});

		setCurrentStep(tabIndex);
		setSteps(currentStepsState);
	};

	const newSideNextPreviousStep = async (index: number, previous: boolean = false) => {
		let current_data = { ...formData };
		let current_steps = cloneDeep(steps);

		if (!previous) {
			const isValidate = await validatorSteps(index, current_data);
			if (!isValidate) return;
		}

		const currentStepsState = current_steps.map((item: any, map_i: number) => {
			if (!previous) {
				// Turn active or not for selected item
				item['active'] = map_i === index + 1 ? true : false;
				// Turn completed or not for previous or next items
				item['completed'] = map_i < index + 1 ? true : false;
			} else {
				// Turn active or not for selected item
				item['active'] = map_i === index - 1 ? true : false;
				// Turn completed or not for previous or next items
				item['completed'] = map_i < index - 1 ? true : false;
			}

			return item;
		});

		setCurrentStep(index);
		setSteps(currentStepsState);
	};

	// Functions to check mandatory data in steps
	const validatorSteps = async (index: number, current_data: any) => {
		// Checking if sideImage and name stored to continu to the other steps
		if ((index === 0 && !current_data['sideImage']) || !current_data['name'].trim().length) {
			toast.error('Missing data', { toastId: 3 });
			return false;
		}

		//TODO
		// Set conditions and checking if there is minimum one condition to continu to the other steps
		if (index === 1) {
			let current_divs = [...divCollections];

			let conditions: any = {};
			for (let div of current_divs) {
				if (
					div['collection'].trim().length !== 0 &&
					!div['features'].find((item: any) => item['trait_selected'].trim().length == 0) &&
					!div['features'].find((item: any) => item['value_selected'].trim().length == 0)
				) {
					conditions[div['collection']] = { features: [] };
					conditions[div['collection']]['numberNeeded'] = div['numberNeeded'];

					for (let feature of div['features']) {
						conditions[div['collection']]['features'].push({
							property: feature['trait_selected'],
							value: feature['value_selected']
						});
					}
				} else {
					toast.error('There is one or more conditions not completed', {
						toastId: 3
					});
					return false;
				}
			}
			if (Object.keys(conditions).length === 0) {
				toast.error('You need to enter miminum one condition', { toastId: 3 });
				return false;
			}
			conditions['required'] = onlyOneRequired;
			const userNfts = flatten(Object.values(userCollectionsData).map(c => c.nfts));

			const isEligible = checkEligibilityByCondition(conditions, userNfts);
			if (isEligible) {
				setFormData({ ...formData, conditions: conditions });
			} else {
				toast.error('Your nfts do not meet those conditions', { toastId: 3 });
				return false;
			}
		}

		// Checking if every channels have name to continu to the other steps
		if (index === 2) {
			let isWrongChannels = channels['added'].filter((c: Channel) => c['name'].trim().length === 0);
			if (isWrongChannels.length) {
				toast.error('You need to name every channels', { toastId: 3 });
				return false;
			}
		}
		return true;
	};

	// Functions for information component
	const onChangeSideName = async (name: string) => {
		const valid = await validateName(name);
		if (valid) {
			setFormData({ ...formData, name: name });
		}
	};

	const onChangeSideDescription = async (text: string) => {
		setFormData({ ...formData, description: text });
	};

	const validateForm = async () => {};

	// validate the name, return true if name is valid;
	const validateName = async (name: string) => {
		const exist = await sideService.isSideNameExist(name);
		const inValidLength = !(name.length < 50 && name.length > 3);
		setFormError({ ...formError, name: { exist, length: inValidLength } });
		return !(exist || inValidLength);
	};

	const onChangeSideImage = (event: any) => {
		if (event.target.files.length) {
			const file = event.target.files[0];
			if (file.size > 500000) {
				toast.error('The image size has to be smaller than 5mb.');
				return;
			}
			setFormData({ ...formData, sideImage: file });
		}
	};

	// ----- Functions for Admission component **start
	const setSideTokenAddress = async (address: string, index: number, filteredCollections: any) => {
		setFormData({ ...formData, NftTokenAddress: address });
		if (address.trim().length) {
			let current_divs = [...divCollections];
			current_divs[index]['collection'] = address;

			current_divs[index]['traits_values'] = createPropertiesObject(address);
			current_divs[index]['features'] = [];

			const data = filteredCollections.find((item: Collection) => item['address'] === address);
			current_divs[index]['metadata'] = data;
			setDivCollection(current_divs);
		}
	};

	// Creation properties object to display in conditions
	function createPropertiesObject(address: string) {
		const selectedCollection = collections.find(c => c.address === address);
		if (!selectedCollection) return;
		const properties = selectedCollection.getCollectionProperties();
		return properties;
	}

	const setSidePropertyCondition = (value: any, index: number, findex: number) => {
		const trait = value;
		if (trait.trim().length) {
			let current_divs = [...divCollections];

			const last_selected = current_divs[index]['features'][findex]['trait_selected'];
			current_divs[index]['features'][findex]['trait_selected'] = trait;
			current_divs[index]['features'][findex]['value_selected'] = '';

			// Clear last selected property values used
			current_divs[index]['traits_values'] = current_divs[index]['traits_values'].map((item: any) => {
				if (last_selected === item['property']['value']) item['values_used'] = [];
				return item;
			});

			setDivCollection(current_divs);
		}
	};

	const setSideValueCondition = (value: any, index: number, findex: number) => {
		if (value.trim().length) {
			let current_divs = [...divCollections];

			// Define value selected
			current_divs[index]['features'][findex]['value_selected'] = value;

			// Adding the value as already used in the 'features' cell of it property
			current_divs[index]['traits_values'] = current_divs[index]['traits_values'].map((item: any) => {
				const valueUsed = item['values'].find((innerElem: any) => innerElem['value'] == value);
				if (valueUsed) {
					item['values_used'].push(valueUsed);
				}
				return item;
			});

			setDivCollection(current_divs);
		}
	};

	const onRemoveFeature = (index: number, findex: number) => {
		let current_divs = [...divCollections];
		current_divs[index]['features'].splice(findex, 1);
		setDivCollection(current_divs);
	};

	// Add collection div in condition
	const addDivCollection = () => {
		if (divCollections.length < MAX_NUMBER_OF_COLLECTIONS) {
			let current_divs = [...divCollections];
			current_divs.push({
				collection: '',
				traits_values: [],
				features: [],
				numberNeeded: 1,
				metadata: {}
			});
			setDivCollection(current_divs);
		} else {
			toast.error('You can not create side with more than 5 linked collections.', { toastId: 8 });
		}
	};

	const addConditionToDivCollection = (index: number) => {
		let current_divs = [...divCollections];
		if (current_divs[index]['features'].length === current_divs[index]['traits_values'].length) {
			toast.error('No more features available for this collection', { toastId: 8 });
			return;
		}
		if (current_divs[index]['features'].length < MAX_NUMBER_OF_COLLECTIONS) {
			current_divs[index]['features'].push({
				trait_selected: '',
				value_selected: '',
				traits_values: []
			});
			setDivCollection(current_divs);
		} else {
			toast.error('You can not create side with more than 5 features per collections.', { toastId: 8 });
		}
	};
	const setNumberOfNftNeededToDivCollection = (number: number, index: number) => {
		let current_divs = [...divCollections];
		if (current_divs[index]['collection'].length) {
			current_divs[index] = {
				...current_divs[index],
				numberNeeded: number
			};
			setDivCollection(current_divs);
		}
	};

	// Remove collection div in condition
	const removeDivCollection = (index: number) => {
		let current_divs = [...divCollections];
		current_divs.splice(index, 1);
		setDivCollection(current_divs);
	};

	// ----- Functions for Admission component **end

	// ----- Functions for Channels component **start
	const handleRemoveChannel = (index: number, current = true) => {
		// Remove existing channel
		if (current) {
			let current_removed: Channel[] = [];
			let current_channels: Channel[] = [];
			if (channels['removed'].length) {
				current_removed = [...channels['removed']];
			}
			if (channels['currents'].length) {
				current_channels = [...channels['currents']];
			}
			if (!current_removed.includes(channels['currents'][index]['id'])) {
				current_removed.push(channels['currents'][index]['id']);
			}
			current_channels.splice(index, 1);
			setChannels({
				...channels,
				removed: current_removed,
				currents: current_channels
			});
		}
		// Remove new channel
		else {
			let current_added: Channel[] = [];
			if (channels['added'].length) {
				current_added = [...channels['added']];
			}
			current_added.splice(index, 1);
			setChannels({ ...channels, added: current_added });
		}
	};

	const handleAddNewChannel = () => {
		let current_added: Partial<Channel>[] = [];
		if (channels['added'].length) {
			current_added = [...channels['added']];
		}
		current_added.push({
			name: '',
			isVisible: true,
			type: ChannelType.Announcement,
			side: formData,
			authorizeComments: false
		});
		setChannels({ ...channels, added: current_added });
	};

	const onChangeNameChannel = (event: any, index: number, current = true) => {
		// Change name on existing channel
		if (current) {
			let current_channels = channels['currents'];
			current_channels[index]['name'] = event.target.value;
			setChannels({ ...channels, currents: current_channels });
		}
		// Change name on new channel
		else {
			let added_channels = channels['added'];
			added_channels[index]['name'] = event.target.value;
			setChannels({ ...channels, added: added_channels });
		}
	};
	const onChangeTypeChannel = (value: number, index: number, current = true) => {
		// Change name on existing channel
		if (current) {
			let current_channels = channels['currents'];
			current_channels[index]['type'] = value;
			setChannels({ ...channels, currents: current_channels });
		}
		// Change name on new channel
		else {
			let added_channels = channels['added'];
			added_channels[index]['type'] = value;
			setChannels({ ...channels, added: added_channels });
		}
	};
	const onChangeAuthorizeCommentsChannel = (event: any, index: number, current = true) => {
		// Change name on existing channel
		if (current) {
			let current_channels = channels['currents'];
			current_channels[index]['authorizeComments'] = event.target.checked;
			setChannels({ ...channels, currents: current_channels });
		}
		// Change name on new channel
		else {
			let added_channels = channels['added'];
			added_channels[index]['authorizeComments'] = event.target.checked;
			setChannels({ ...channels, added: added_channels });
		}
	};
	const onChangeIsVisibleChannel = (value: any, index: number, current = true) => {
		// Change name on existing channel
		if (current) {
			let current_channels = channels['currents'];
			current_channels[index]['isVisible'] = value;
			setChannels({ ...channels, currents: current_channels });
		}
		// Change name on new channel
		else {
			let added_channels = channels['added'];
			added_channels[index]['isVisible'] = value;
			setChannels({ ...channels, added: added_channels });
		}
	};

	// ----- Functions for Channels component **end

	const onSubmit = async () => {
		try {
			if (formData.sideImage && user) {
				setIsLoading(true);
				const data = _.cloneDeep(formData);

				// Save side entity ** start
				const userNfts = flatten(Object.values(userCollectionsData).map(c => c.nfts));
				const eligibility = checkEligibilityByCondition(data['conditions'], userNfts);
				if (eligibility) {
					data['conditions'] = JSON.stringify(data['conditions']);
					data['NftTokenAddress'] = data['conditions'];
					const fd = new FormData();
					fd.append('file', formData['sideImage']);
					data['sideImage'] = await filesService.uploadImage(fd);
					data['creatorAddress'] = user.accounts;
					data['required'] = !onlyOneRequired;
					const newSide = await sideService.createFullSide(data, channels, userInvited);
					// Save side entity ** end

					dispatch(updateSidesByUserCollections(null));
					toast.success(data.name + ' has been created.', {
						toastId: 4
					});

					const refreshedUser = await userService.getUserByAddress(user.accounts);
					dispatch(updateUser(refreshedUser));

					setIsLoading(false);
					navigate('/side/' + newSide.name);
				} else {
					toast.error('You do not meet the conditions to create this side.');
				}
			}
		} catch (error) {
			console.log(error);
			toast.error('Error creating side.', { toastId: 3 });
		}
	};

	return (
		<NewSideStyled>
			<div className="title-wrapper">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
						fill="#B4C1D2"
					/>
				</svg>
				<h2 className="title">Create Side</h2>
			</div>

			<div className="tabs-wrapper_mobile">
				{steps.map((step: any) => (
					<i
						className={`${step['icon']} ${step['active'] ? 'active' : ''} ${
							step['completed'] ? 'completed' : ''
						} step-icon`}
						key={step['icon']}
					></i>
				))}
			</div>

			<div className="flex align-start w-100 text-left">
				<ContainerLeft className="container-left">
					<label className="sidebar-title">Steps</label>
					<nav className="tabs-wrapper">
						{steps.map((step: any, index: number) => {
							return (
								<TabItems
									onClick={() => handleTabs(index)}
									key={index}
									className={`nav-link ${step['active'] ? 'active' : ''} ${
										step['completed'] ? 'completed' : ''
									} sidebar-item text-secondary-dark`}
								>
									<div>
										<i className={`${step['icon']} step-icon`}></i>
										{step['label']}{' '}
									</div>
									{step['completed'] ? <i className="fa-solid fa-check mr-2"></i> : null}
								</TabItems>
							);
						})}
					</nav>
				</ContainerLeft>

				<Middle className="f-column w-100 pt-3 pb-5 px-5">
					{isLoading ? (
						<div className="spinner-wrapper">
							<Spinner />
						</div>
					) : (
						steps.map((step: any, index: number) => {
							return (
								<div key={index}>
									{step['label'] === 'Informations' && step['active'] ? (
										<>
											<Informations
												currentSide={formData}
												onChangeNewSideName={onChangeSideName}
												onChangeNewSideImage={onChangeSideImage}
												onChangeNewSideDescription={onChangeSideDescription}
												formError={formError}
											/>
										</>
									) : step['label'] === 'Admission' && step['active'] ? (
										<>
											<Admission
												divCollections={divCollections}
												collections={collections}
												setSideTokenAddress={setSideTokenAddress}
												setSidePropertyCondition={setSidePropertyCondition}
												setSideValueCondition={setSideValueCondition}
												onRemoveFeature={onRemoveFeature}
												addDivCollection={addDivCollection}
												removeDivCollection={removeDivCollection}
												addConditionToDivCollection={addConditionToDivCollection}
												onlyOneRequired={onlyOneRequired}
												setOnlyOneRequired={setOnlyOneRequired}
												setNumberOfNftNeededToDivCollection={
													setNumberOfNftNeededToDivCollection
												}
												userCollectionsData={userCollectionsData}
											/>
										</>
									) : step['label'] === 'Channels' && step['active'] ? (
										<div>
											<Channels
												currentSide={currentSide}
												channelsNewSide={channels}
												handleRemoveChannel={handleRemoveChannel}
												handleAddNewChannel={handleAddNewChannel}
												onChangeNameChannel={onChangeNameChannel}
												onChangeTypeChannel={onChangeTypeChannel}
												onChangeAuthorizeCommentsChannel={onChangeAuthorizeCommentsChannel}
												onChangeIsVisibleChannel={onChangeIsVisibleChannel}
											/>
										</div>
									) : step['label'] === 'Invitation' && step['active'] ? (
										<>
											<Invitation
												currentSide={formData}
												invitationUsers={invitationUsers}
												setUserInvited={setUserInvited}
												userInvited={userInvited}
											/>
										</>
									) : null}
								</div>
							);
						})
					)}
					<FooterButtons
						steps={steps}
						onSubmit={onSubmit}
						index={steps.findIndex(s => s.active)}
						newSideNextPreviousStep={newSideNextPreviousStep}
					/>
				</Middle>
			</div>
		</NewSideStyled>
	);
}

const FooterButtons = ({ index, newSideNextPreviousStep, onSubmit, steps }: any) => {
	const handleContinue = () => {
		if (steps.length === index + 1) {
			onSubmit();
		} else {
			newSideNextPreviousStep(index);
		}
	};

	return (
		<div className="flex justify-between container-next-back">
			{index > 0 ? (
				<Button
					classes={'mt-4'}
					width={'159px'}
					height={46}
					onClick={() => newSideNextPreviousStep(index, true)}
					radius={10}
					color={'var(--text)'}
					background={'transparent'}
					border={'1px solid var(--disable);'}
				>
					Back
				</Button>
			) : (
				<div />
			)}

			<Button
				classes={'mt-4'}
				width={'159px'}
				height={46}
				onClick={handleContinue}
				radius={10}
				color={'var(--text)'}
			>
				{steps.length === index + 1 ? 'Finish' : 'Continue'}
			</Button>
		</div>
	);
};
