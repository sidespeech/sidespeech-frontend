import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { checkUserEligibility, isColor } from '../../helpers/utilities';
import { Profile, Role } from '../../models/Profile';
import { Side, SideStatus } from '../../models/Side';
import { RootState } from '../../redux/store/app.store';
import Button from '../ui-components/Button';
import Modal from '../ui-components/Modal';
import { RoundedImageContainer } from '../ui-components/styled-components/shared-styled-components';
import Eligibility from '../CurrentColony/settings/eligibility/eligibility';
import { toast } from 'react-toastify';
import { addUserParsedSide, updateProfiles } from '../../redux/Slices/UserDataSlice';
import { State, Type } from '../../models/Invitation';
import { useNavigate } from 'react-router-dom';
import Spinner from '../ui-components/Spinner';
import invitationService from '../../services/api-services/invitation.service';
import sideService from '../../services/api-services/side.service';
import profileService from '../../services/api-services/profile.service';
import { breakpoints, size } from '../../helpers/breakpoints';
import { setLeaveSideOpen } from '../../redux/Slices/AppDatasSlice';
import useSideEligibility from '../../hooks/useSideEligibility';
import websocketService from '../../services/websocket-services/websocket.service';
import { subscribeToEvent, unSubscribeToEvent } from '../../helpers/CustomEvent';
import { EventType } from '../../constants/EventType';

const eligibilityTexts = {
	success: {
		title: 'You are eligible.',
		message: 'Your wallet meets the requirements to join this Side. You can now join it.'
	},
	error: {
		title: 'You are not eligible.',
		message: 'Your wallet does not meets the requirements to join this Side.'
	},
	inactive: {
		title: 'You are not eligible.',
		message:
			'You are no longer eligible for this Side, get the NFTs you need to regain access or choose a Sub-admin user to leave the Side.'
	}
};

interface IEligibilityResultProps {
	isEligible: boolean;
	info: boolean;
}

const EligibilityResult = styled.div<IEligibilityResultProps>`
	width: 100%;
	background-color: ${props =>
		props.info ? 'var(--primary-opacity)' : props.isEligible ? 'var(--green-opacity)' : 'var(--red-opacity)'};
	border: 1px solid ${props => (props.info ? 'var(--primary)' : props.isEligible ? 'var(--green)' : 'var(--red)')};
	& div:first-child {
		color: ${props => (props.info ? 'var(--primary)' : props.isEligible ? 'var(--green)' : 'var(--red)')};
	}
	padding: 30px;
	border-radius: 10px;
	margin-top: 20px;
	margin-bottom: 30px;
	text-align: left;
`;

const SideEligibilityModalStyled = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	& .conditions-wrapper {
		width: 100%;
		overflow-y: scroll;
	}
`;

const FooterStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	width: 100%;
	margin-top: 1rem;
	${breakpoints(
		size.md,
		`{
    justify-content: space-between;

  }`
	)}
	& .footer-btn {
		${breakpoints(
			size.md,
			`{
      max-width: 175px;
    }`
		)}
		&.secondary-btn {
			border: 1px solid var(--disable);
		}
	}
`;

interface ISideEligibilityModalProps {
	selectedSide: Side;
	setDisplayEligibility: (value: boolean) => void;
	isSideAdmin?: boolean;
	setSelectedSide?: React.Dispatch<React.SetStateAction<Side | null>>;
}

export default function SideEligibilityModal(props: ISideEligibilityModalProps) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { userCollectionsData, user } = useSelector((state: RootState) => state.user);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [isEligible, details] = useSideEligibility(props.selectedSide);

	const handleJoinSide = async () => {
		if (!user) return;
		try {
			setIsLoading(true);
			if (props.selectedSide['private'] === true) {
				let sender: any = { ...user };
				delete sender['profiles'];
				const object = {
					state: State.Pending,
					type: Type.Request,
					sender: sender,
					recipient: props.selectedSide['creatorAddress'],
					side: props.selectedSide
				};
				await invitationService.sendRequestPrivateSide(object);
				props.setDisplayEligibility?.(false);
				setIsLoading(false);
			} else {
				websocketService.joinSide(user.id, props.selectedSide.id, Role.User);
			}
		} catch (error: any) {
			if (error.statusCode === '403') {
				toast.error('you do not meet the requirements to join this side.', {
					toastId: 15
				});
			} else {
				toast.error('Ooops! Something went wrong joining this Sides', {
					toastId: 25
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleNewProfile = ({ detail }: { detail: Profile }) => {
		if (detail.user.id === user?.id) {
			props.setDisplayEligibility?.(false);
			const profile = new Profile(detail);
			dispatch(updateProfiles(profile));
			const side = props.selectedSide;
			side.profiles.push(profile);
			dispatch(addUserParsedSide(side));
			toast.success('Great! You join the side', { toastId: 26 });
			navigate('/side/' + props.selectedSide.name.replace(/\s/g, '-').toLowerCase());
			setIsLoading(false);
		}
	};

	useEffect(() => {
		subscribeToEvent(EventType.NEW_PROFILE, handleNewProfile);
		return () => {
			unSubscribeToEvent(EventType.NEW_PROFILE, handleNewProfile);
		};
	}, [user]);

	useEffect(() => {
		async function updateSide() {
			const side = await sideService.updateSideStatus(SideStatus.active, props.selectedSide.id);
			props.setDisplayEligibility(false);
			navigate('side/' + side.name.replace(/\s/g, '-').toLowerCase());
		}
		if (isEligible && props.selectedSide.status === SideStatus.inactive && props.isSideAdmin) {
			updateSide();
		}
	}, [isEligible, props.selectedSide, props.isSideAdmin]);

	if (!userCollectionsData) return null;

	return (
		<Modal
			body={
				!isLoading ? (
					<SideEligibilityModalStyled>
						<RoundedImageContainer
							style={{
								backgroundColor: isColor(props.selectedSide?.sideImage)
									? props.selectedSide?.sideImage
									: ''
							}}
							height="104px"
							width="104px"
							radius={60}
						>
							{!isColor(props.selectedSide?.sideImage) ? (
								<img alt="colony-icon" src={props.selectedSide?.sideImage} />
							) : (
								<div>{props.selectedSide?.name[0]}</div>
							)}
						</RoundedImageContainer>
						<h2>{props.selectedSide.name}</h2>
						<div className="text-center">{props.selectedSide.description}</div>
						<EligibilityResult
							isEligible={isEligible && props.selectedSide.status === SideStatus.active}
							info={!props.isSideAdmin && props.selectedSide.status === SideStatus.inactive}
						>
							{props.selectedSide.status === SideStatus.active ? (
								<>
									<div>
										{isEligible ? (
											<i className="fa-solid fa-circle-check mr-2"></i>
										) : (
											<i className="fa-solid fa-circle-xmark mr-2"></i>
										)}
										{isEligible ? eligibilityTexts.success.title : eligibilityTexts.error.title}
									</div>
									<div>
										{isEligible ? eligibilityTexts.success.message : eligibilityTexts.error.message}
									</div>
								</>
							) : (
								<>
									<div>
										{!props.isSideAdmin ? (
											<i className="fa-solid fa-circle-info mr-2"></i>
										) : (
											<i className="fa-solid fa-circle-xmark mr-2"></i>
										)}
										{!props.isSideAdmin ? 'Inactive side' : eligibilityTexts.inactive.title}
									</div>
									<div>
										{!props.isSideAdmin
											? ' This side is currently inactive. Waiting for a new Administrator. Please try again later.'
											: eligibilityTexts.inactive.message}
									</div>
								</>
							)}
						</EligibilityResult>
						<div className="conditions-wrapper">
							<Eligibility side={props.selectedSide} details={details} />
						</div>
					</SideEligibilityModalStyled>
				) : (
					<div className="spinner-wrapper">
						<Spinner />
					</div>
				)
			}
			footer={
				<FooterStyled>
					<Button
						classes="footer-btn secondary-btn"
						width="100%"
						background={'transparent'}
						onClick={() => props.setDisplayEligibility(false)}
					>
						Back
					</Button>
					{props.selectedSide.status === SideStatus.active ? (
						<Button
							classes="footer-btn"
							width="100%"
							disabled={!isEligible || isLoading}
							children={props.selectedSide['private'] === true ? 'Send Request' : 'Join now'}
							onClick={handleJoinSide}
						/>
					) : (
						<>
							{' '}
							{props.isSideAdmin && (
								<Button
									classes="footer-btn"
									width="100%"
									background={'var(--disable)'}
									children={'Choose a sub-admin'}
									onClick={() => {
										dispatch(setLeaveSideOpen({ open: true, side: props.selectedSide }));
										props.setDisplayEligibility(false);
									}}
								/>
							)}
						</>
					)}
				</FooterStyled>
			}
			title={undefined}
			showModal={props.setDisplayEligibility}
		/>
	);
}
