import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getRandomId } from '../../helpers/utilities';
import { Role } from '../../models/Profile';
import { Side } from '../../models/Side';
import { removeSide } from '../../redux/Slices/UserDataSlice';
import { RootState } from '../../redux/store/app.store';
import profileService from '../../services/api-services/profile.service';
import Button from '../ui-components/Button';
import LeavSideAsAdmin from '../ui-components/LeavSideAsAdmin';
import Modal from '../ui-components/Modal';

interface ILeaveSideConfirmationModalProps {
	isSideAdmin: boolean;
	setIsLeaveConfirmationModalOpen: any;
	side: Side;
}

export default function LeaveSideConfirmationModal(props: ILeaveSideConfirmationModalProps) {
	const location = useLocation();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(props.isSideAdmin);

	const { user } = useSelector((state: RootState) => state.user);

	const dispatch = useDispatch();

	const handleLeaveSide = async (ev: any) => {
		const sideProfile = user?.profiles.find(profile => profile.side.id === props.side.id);
		try {
			setIsLoading(true);
			if (!sideProfile) throw new Error('No Side Profile');
			await profileService.leaveSide(sideProfile);
			dispatch(removeSide(props.side.id));
			toast.success(`We are sorry to see you leave Side ${props.side.name}`, {
				toastId: getRandomId()
			});
			props.setIsLeaveConfirmationModalOpen(false);
			if (location.pathname !== '/') navigate('/');
		} catch (error) {
			console.error(error);
			if (sideProfile?.role === Role.Admin)
				toast.error('Please provide a Sub Admin to replace you as Administrator', { toastId: 4868 });
			else
				toast.error(`There has been an error trying to leave Side ${props.side.name}`, {
					toastId: getRandomId()
				});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			overflow="visible"
			body={
				<div>
					{props.isSideAdmin ? (
						<LeavSideAsAdmin side={props.side} handleLeaveSide={handleLeaveSide} />
					) : (
						<p>Are you sure you want to leave Side {props.side.name}?</p>
					)}
				</div>
			}
			footer={
				props.isSideAdmin ? (
					<div className="mt-4"></div>
				) : (
					<div className="flex mt-5 gap-20">
						<Button
							classes=""
							children={'Cancel'}
							onClick={() => props.setIsLeaveConfirmationModalOpen(false)}
						/>
						<Button
							background="var(--red)"
							classes=""
							disabled={isLoading || isButtonDisabled}
							children={'Leave Side'}
							onClick={handleLeaveSide}
						/>
					</div>
				)
			}
			showModal={() => props.setIsLeaveConfirmationModalOpen(false)}
			title={undefined}
		/>
	);
}
