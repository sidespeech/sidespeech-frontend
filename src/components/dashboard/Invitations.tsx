import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Invitation, State } from '../../models/Invitation';
import { User } from '../../models/User';
import { RootState } from '../../redux/store/app.store';
import Button from '../ui-components/Button';
import CustomCheckbox from '../ui-components/CustomCheckbox';
import InputText from '../ui-components/InputText';
import moment from 'moment';
import { checkUserEligibility, getRandomId, isColor } from '../../helpers/utilities';
import Spinner from '../ui-components/Spinner';
import { Side } from '../../models/Side';
import SideEligibilityModal from '../Modals/SideEligibilityModal';
import { Link } from 'react-router-dom';
import emptyListImg from '../../assets/invitations_empty_screen_shape.svg';
import { breakpoints, size } from '../../helpers/breakpoints';
import invitationService from '../../services/api-services/invitation.service';
import { toast } from 'react-toastify';

interface InvitationsStyledProps {}

const InvitationsStyled = styled.main<InvitationsStyledProps>`
	.title {
		margin-top: 0;
	}
	.invitations-toolbar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		${breakpoints(
			size.lg,
			`{
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }`
		)}
		& .search-input {
			width: 100%;
			${breakpoints(
				size.lg,
				`{
        width: 40%;
      }`
			)}
		}
	}

	& .list-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 2rem;
	}

	.requests-list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		width: 100%;
		position: relative;
		padding: 20px;
		border-radius: 10px;
		flex: 1.2;
		background-color: var(--white-transparency-10);
		width: 96%;
		height: 6rem;
		${breakpoints(
			size.md,
			`{
			grid-template-columns: repeat(3, 1fr);
		}`
		)}
		& .image-collection {
			width: 70px;
			height: 70px;
			cursor: pointer;
			background: var(--input);
			border-radius: 5px;
			text-align: center;
			color: var(--inactive);
			overflow: hidden;
			font-size: 40px;
			text-transform: uppercase;
			font-weight: 700;
		}
		& .invited-by {
			font-size: 10px;
			& .date-label {
				color: var(--inactive);
			}
		}
		& .buttons-wrapper {
			display: flex;
			gap: 1rem;
			align-items: center;
		}
	}

	.spinner-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.2rem;
		width: 100%;
		color: var(--text);
		text-align: center;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--inactive);
	}

	.override-width {
		width: fit-content !important;
	}

	.no-results {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.2rem;
		width: 100%;
		min-height: 400px;
		color: var(--text);
		flex-direction: column;
		background-image: url(${emptyListImg});
		background-position: center center;
		background-size: contain;
		background-repeat: no-repeat;
		margin: 80px 0;
	}

	.no-results p {
		text-align: center;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--inactive);
	}

	.no-results .buttons-wrapper {
		display: flex;
		gap: 1rem;
		margin-top: 2.5rem;
	}

	.no-results .buttons-wrapper a {
		color: inherit;
	}
`;

interface InvitationsProps {}

const Invitations = ({}: InvitationsProps) => {
	const userData = useSelector((state: RootState) => state.user);
	const [invitations, setInvitations] = useState<any[]>([]);
	const [filteredInvitations, setFilteredInvitations] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isCheckedVerified, setIsCheckedVerified] = useState<boolean>(false);
	const [isCheckedEligible, setIsCheckedEligible] = useState<boolean>(false);

	// Variable for modal eligibility
	const [displayEligibility, setDisplayEligibility] = useState<boolean>(false);
	const [selectedSide, setSelectedSide] = useState<Side | null>(null);

	const getInvitations = async (user: User) => {
		try {
			let invitations = (await invitationService.getPendingInvitationsByRecipient(user['id'])).map(
				(item: any) => {
					item['eligibility'] = checkUserEligibility(userData?.['userCollectionsData'], item['side']);
					return item;
				}
			);
			setInvitations(invitations);
			setFilteredInvitations(invitations);
		} catch (error) {
			console.error(error);
			toast.error('Ooops! Something went wrong fetching invitations', { toastId: getRandomId() });
		}
	};

	useEffect(() => {
		if (userData && userData['user']) getInvitations(userData['user']);
	}, [userData]);

	const onDecline = async (invitation: Invitation, index: number) => {
		setIsLoading(true);
		await invitationService.updateInvitationState(invitation['id']!, State.Declined);
		if (userData && userData['user']) await getInvitations(userData['user']);
		setIsLoading(false);
	};

	const onAccept = async (invitation: Invitation, index: number) => {
		setIsLoading(true);
		await invitationService.acceptInvitation(invitation);
		if (userData && userData['user']) await getInvitations(userData['user']);
		setIsLoading(false);
	};

	const onFilterByVerifiedcollection = async () => {
		setIsCheckedVerified(!isCheckedVerified);
		if (!isCheckedVerified) {
			setIsLoading(true);
			let filtered = [...filteredInvitations].filter((invitation: Invitation) => {
				if (invitation['side']['collectionSides'].length) {
					let isVerified = invitation['side']['collectionSides'].find((collection: any) => {
						let opensea = JSON.parse(collection['collection']['opensea']);
						if (opensea['safelistRequestStatus'] === 'verified') return collection;
					});

					if (isVerified) return invitation;
				}
			});
			setFilteredInvitations(filtered);
			setIsLoading(false);
		} else setFilteredInvitations([...invitations]);
	};

	const onFilterByEligibleSide = async () => {
		setIsCheckedEligible(!isCheckedEligible);
		if (!isCheckedEligible) {
			setIsLoading(true);
			let filtered = [...filteredInvitations].filter((invitation: any) => {
				if (invitation['eligibility'][1]) return invitation;
			});
			setFilteredInvitations(filtered);
			setIsLoading(false);
		} else setFilteredInvitations([...invitations]);
	};

	const onFilterBySearchInput = async (e: any) => {
		const text = e.target.value;
		if (text.length) {
			setIsLoading(true);
			let filtered = [...invitations].filter((invitation: Invitation) => {
				const invitationStringify = JSON.stringify(invitation).toLowerCase();
				if (invitationStringify.includes(text)) return invitation;
			});
			setFilteredInvitations(filtered);
			setIsLoading(false);
		} else setFilteredInvitations([...invitations]);
	};

	const handleEligibilityCheck = (side: Side) => {
		setSelectedSide(side);
		setDisplayEligibility(true);
	};

	return (
		<InvitationsStyled>
			<h2 className="fade-in title">
				Invitations {filteredInvitations.length ? '(' + filteredInvitations.length + ')' : null}
			</h2>

			{/* Search Section */}
			<div className="invitations-toolbar">
				<div className="search-input">
					<InputText
						placeholderColor="var(--inactive)"
						color="var(--text)"
						height={40}
						bgColor="var(--input)"
						glass={true}
						iconRightPos={{ top: 12, right: 40 }}
						placeholder={'Search'}
						onChange={onFilterBySearchInput}
						radius="5px"
					/>
				</div>

				<div className="flex align-center ">
					<CustomCheckbox
						label="Only verified collections"
						name="only-verified"
						isChecked={isCheckedVerified}
						onClick={onFilterByVerifiedcollection}
					/>
					<CustomCheckbox
						label="Only eligible sides"
						name="only-eligible"
						isChecked={isCheckedEligible}
						onClick={onFilterByEligibleSide}
					/>
				</div>
			</div>

			{/* Invitations List **start */}
			{!isLoading ? (
				<div className="list-wrapper">
					{filteredInvitations.length ? (
						filteredInvitations.map((invitation, index) => {
							const userImg =
								typeof invitation['recipient']['userAvatar'] === 'string'
									? JSON.parse(invitation['recipient']['userAvatar'])?.metadata?.thumbnail
									: 'https://images.unsplash.com/photo-1662948291101-691f9fa850d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80';
							return (
								<div className="requests-list bounce-from-right" key={index}>
									{/* Side data */}
									<div>
										<div className="flex align-center gap-20">
											<label
												style={{
													backgroundColor: isColor(invitation.side?.sideImage)
														? invitation.side?.sideImage
														: ''
												}}
												className="image-collection f-column align-center justify-center"
											>
												{!isColor(invitation.side?.sideImage) ? (
													<img
														style={{
															height: 'inherit',
															width: 'inherit',
															objectFit: 'cover'
														}}
														alt="file"
														src={invitation.side?.sideImage}
													/>
												) : (
													<div>{invitation.side?.name[0]}</div>
												)}
											</label>
											{/* <label className="align-center justify-center mt-2 ml-3">{request['accounts'].replace(request['accounts'].substring(4, 30), "...")}</label> */}
											<div className="f-column align-start justify-center gap-10">
												<label className="align-center justify-center">
													{invitation['side']['name']}
												</label>
												<label className="align-center justify-center flex">
													<Button
														width={'100px'}
														height={25}
														onClick={undefined}
														radius={3}
														background={'transparent'}
														fontSize={'12px'}
														classes={'override-width'}
													>
														{invitation['side']['collectionSides'].length
															? invitation['side']['collectionSides'][0][
																	'collection'
															  ].getName()
															: 'Collection Name'}{' '}
														<i className="fa-solid fa-circle-check ml-2 text-blue"></i>
													</Button>
													{invitation['side']['collectionSides'].length > 1 ? (
														<Button
															width={'50px'}
															height={25}
															onClick={undefined}
															radius={3}
															background={'var(--disable)'}
															fontSize={'12px'}
														>
															+ {invitation['side']['collectionSides'].length - 1}
														</Button>
													) : null}
												</label>
												{invitation['eligibility'][1] ? (
													<label className="align-center justify-center">
														<i className="fa-solid fa-circle-check mr-2 text-green"></i>
														Eligible
													</label>
												) : (
													<label className="align-center justify-center">
														<i className="fa-solid fa-circle-xmark mr-2 text-red"></i>
														Non-Eligible
													</label>
												)}
											</div>
										</div>
									</div>

									{/* Sender data */}
									<div className="flex f-column justify-center gap-10">
										<label className="invited-by">
											<span className="date-label mr-3">
												{moment
													.utc(invitation['created_at'])
													.local()
													.startOf('seconds')
													.fromNow()}
											</span>
											Invited By
										</label>
										<div className="flex align-center gap-10">
											<label className="profile-image-user f-column align-center justify-center">
												<img
													style={{
														height: 'inherit',
														width: 'inherit',
														objectFit: 'cover'
													}}
													src={userImg}
													alt="file"
												/>
											</label>
											<label>{invitation['recipient']['username']}</label>
										</div>
									</div>

									{/* Buttons section */}
									<div className="buttons-wrapper">
										<Button
											width="100%"
											onClick={() => onDecline(invitation, index)}
											background={'var(--red-opacity)'}
											color={'var(--red)'}
										>
											Decline
										</Button>

										{invitation['eligibility'][1] ? (
											<Button
												width="100%"
												onClick={() => onAccept(invitation, index)}
												color={'var(--text)'}
											>
												Accept
											</Button>
										) : (
											<Button
												width="100%"
												onClick={() => handleEligibilityCheck(invitation['side'])}
												background={'var(--disable)'}
											>
												Condition
											</Button>
										)}
									</div>
								</div>
							);
						})
					) : (
						<div className="no-results">
							<p>
								Ooops!
								<br />
								Nothing here
							</p>
							<div className="buttons-wrapper">
								<Link to="/new-side">
									<Button width={'145px'} background="var(--disable)" color="white">
										<i className="fa-solid fa-circle-plus mr-2"></i>
										Create a Side
									</Button>
								</Link>
								<Link to="/">
									<Button width={'145px'}>Explore</Button>
								</Link>
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="spinner-wrapper">
					<Spinner />
				</div>
			)}
			{/* Invitations List **end */}

			{displayEligibility && selectedSide && (
				<SideEligibilityModal
					setDisplayLeaveSide={() => {}}
					setDisplayEligibility={setDisplayEligibility}
					selectedSide={selectedSide}
				/>
			)}
		</InvitationsStyled>
	);
};

export default Invitations;
