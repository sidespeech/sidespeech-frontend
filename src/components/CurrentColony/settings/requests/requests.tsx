import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../../../ui-components/Button';
import InputText from '../../../ui-components/InputText';
import { useDispatch } from 'react-redux';
import './requests.css';
import CustomCheckbox from '../../../ui-components/CustomCheckbox';
import moment from 'moment';
import { Side } from '../../../../models/Side';
import { State, Type } from '../../../../models/Invitation';
import userService from '../../../../services/api-services/user.service';
import invitationService from '../../../../services/api-services/invitation.service';
import emptyListImg from '../../../../assets/invitations_empty_screen_shape.svg';
import { addProfileToCurrentSide, removeSideInvitation } from '../../../../redux/Slices/AppDatasSlice';
import { toast } from 'react-toastify';

const RequestsStyled = styled.div`
	& .no-results {
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
`;

export default function Requests({
	currentSide,
	userData,
	updateRequestNotifications
}: {
	currentSide: Side;
	userData: any;
	updateRequestNotifications: any;
}) {
	const [requests, setRequests] = useState<any[]>([]);

	const dispatch = useDispatch();

	const getRequestsUsers = async (requestsOrdered: any[]) => {
		let ids = requestsOrdered.map((invitation: any) => invitation['senderId']);
		const users = (await userService.getUsersByIds(ids)).reduce((prev: any, current: any, index: number) => {
			let obj = { accounts: '', created_at: '', image: '', id: '', user_id: '' };
			const current_request = requestsOrdered.find(item => item['senderId'] === current['id']);

			obj['accounts'] = current['accounts'];
			obj['created_at'] = current_request['created_at'];
			obj['id'] = current_request['id'];
			obj['user_id'] = current['id'];
			obj['image'] =
				'https://images.unsplash.com/photo-1662948291101-691f9fa850d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80';

			prev.push(obj);

			return prev;
		}, []);
		setRequests(users);
	};

	useEffect(() => {
		let requestsOrdered = currentSide['invitations'].filter(
			(invitation: any) => invitation['type'] === Type.Request && invitation['state'] === State.Pending
		);
		getRequestsUsers(requestsOrdered);
	}, [currentSide, userData]);

	const onAccept = async (request: any) => {
		try {
			let res = await invitationService.acceptRequest({ id: request['id'] });
			setRequests((prevState: any) => prevState.filter((inv: any) => inv?.id !== request?.id));
			dispatch(addProfileToCurrentSide(res));
			dispatch(removeSideInvitation(request['id']));
		} catch (error) {
			console.error(error);
			toast.error('There has been an error accepting the request', { toastId: 88 });
		}
	};

	const onDecline = async (request: any) => {
		try {
			let res = await invitationService.updateInvitationState(request['id'], State.Declined);
			setRequests((prevState: any) => prevState.filter((inv: any) => inv?.id !== request?.id));
			updateRequestNotifications();
			dispatch(removeSideInvitation(request['id']));
		} catch (error) {
			console.error(error);
			toast.error('There has been an error declining the request', { toastId: 89 });
		}
	};

	const handleAcceptAll = async () => {
		await Promise.all(requests.map(request => onAccept(request)));
	};

	const handleDeclineAll = async () => {
		await Promise.all(requests.map(request => onDecline(request)));
	};

	return (
		<RequestsStyled>
			{/* Search Section */}
			<div className="f-column mt-5">
				<div className="text-primary-light mb-3 text fw-600">They want to join your side</div>
				<div className="flex align-center justify-between mr-5">
					<InputText
						placeholderColor="var(--inactive)"
						color="var(--inactive)"
						parentWidth={'30%'}
						height={45}
						width="85%"
						bgColor="var(--input)"
						glass={true}
						iconRightPos={{ top: 12, right: 80 }}
						placeholder={'Search'}
						onChange={undefined}
						radius="5px"
					/>
					<div className="flex align-center ">
						<CustomCheckbox
							label="Only verified users"
							name="only-verified"
							isChecked={false}
							onClick={undefined}
						/>
						<Button
							width={'159px'}
							height={46}
							onClick={handleDeclineAll}
							radius={10}
							background={'transparent'}
							color={'var(--red)'}
						>
							Decline all
						</Button>
						<Button
							width={'159px'}
							onClick={handleAcceptAll}
							radius={10}
							background={'var(--panels)'}
							color={'white'}
						>
							Accept all
						</Button>
					</div>
				</div>
			</div>

			{requests.length ? (
				requests.map((request, index) => {
					return (
						<div className="f-column mt-3 requests-list" key={index}>
							<div className="flex align-center justify-between">
								<div>
									<small className="date-label">
										{moment.utc(request['created_at']).local().startOf('seconds').fromNow()}
									</small>
									<div className="flex mt-2">
										<label className="profile-image-user f-column align-center justify-center">
											<img
												style={{ height: 'inherit', width: 'inherit', objectFit: 'cover' }}
												src={request['image']}
												alt="file"
											/>
										</label>
										<label className="align-center justify-center mt-2 ml-3">
											{request['accounts'].replace(request['accounts'].substring(4, 30), '...')}
										</label>
									</div>
								</div>
								<div className="flex align-center">
									<Button
										width={'159px'}
										height={46}
										onClick={() => onDecline(request)}
										radius={10}
										background={'var(--red-opacity)'}
										color={'var(--red)'}
										classes={'mr-4'}
									>
										Decline
									</Button>
									<Button
										width={'159px'}
										height={46}
										onClick={() => onAccept(request)}
										radius={10}
										color={'var(--text)'}
									>
										Accept
									</Button>
								</div>
							</div>
						</div>
					);
				})
			) : (
				<div className="no-results">
					<p>No requests</p>
				</div>
			)}
		</RequestsStyled>
	);
}
