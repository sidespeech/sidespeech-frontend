import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Profile, Role } from '../../models/Profile';
import { Side } from '../../models/Side';
import { User } from '../../models/User';
import { RootState } from '../../redux/store/app.store';
import userService from '../../services/api-services/user.service';
import websocketService from '../../services/websocket-services/websocket.service';
import Button from './Button';
import InputText from './InputText';

interface LeaveSideAsAdminStyledProps {}

const LeaveSideAsAdminStyled = styled.div<LeaveSideAsAdminStyledProps>`
	background-color: rgba(240, 158, 34, 0.1);
	border: 1px solid var(--warning);
	border-radius: 10px;
	padding: 1.5rem;
	text-align: left;
	.leave-title {
		color: var(--warning);
		margin: 0;
	}

	.leave-subtitle {
		margin-bottom: 0.5rem;
	}

	.leave-description_secondary {
		max-width: 340px;
		opacity: 0.4;
	}

	.leave-button {
		width: 35%;
		transition: background-color 0.3s ease;
		&:disabled {
			background-color: transparent;
			border: none;
			outline: none;
			box-shadow: none;
		}
	}
`;

interface LeaveSideAsAdminProps {
	className?: string;
	id?: string;
	style?: any;
	handleLeaveSide: any;
	side?: Side;
}

const LeavSideAsAdmin = ({ className, id, style, handleLeaveSide, side }: LeaveSideAsAdminProps) => {
	const [newSubAdmin, setNewSubAdmin] = useState<any>(null);
	const [inputValue, setInputValue] = useState<string>('');
	const [users, setUsers] = useState<User[]>([]);

	const userAccount = useSelector((state: RootState) => state.user?.account);

	useEffect(() => {
		async function getSideUsers() {
			if (side) {
				const users = await userService.getUserFromSides([side.id]);
				setUsers(users.filter((user: any) => user.accounts?.toLowerCase() !== userAccount?.toLowerCase()));
				const subadmin = side.profiles.filter(p => p.role === Role.subadmin)[0];
				if (subadmin) setNewSubAdmin(subadmin.user.username);
				else {
					const normalUser = side.profiles.filter(p => p.role === Role.User)[0];
					if (normalUser) setNewSubAdmin(normalUser.user.username);
				}
			}
		}
		if (side) {
			getSideUsers();
		}
	}, [side]);

	const handleInputChange = (event: any) => {
		const value = event.target.value;
		if (users.findIndex(p => p.username === value) !== -1) setNewSubAdmin(value);
		else if (newSubAdmin) setNewSubAdmin(null);
		setInputValue(value);
	};

	const leaveSide = async () => {
		if (side) {
			try {
				const response = await userService.updateSubAdmin(newSubAdmin, side.id);
				if (!response?.error) websocketService.updateSideStatus(side);
			} catch (error) {
				console.error('Sub admin could not be updated: ', error);
			}
			handleLeaveSide();
		}
	};

	return (
		<LeaveSideAsAdminStyled className={className} id={id} style={style}>
			<div className="flex align-center mb-4">
				<svg
					className="mr-2"
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M1.75 13.75C1.3375 13.75 0.98425 13.6033 0.69025 13.3097C0.39675 13.0157 0.25 12.6625 0.25 12.25V1.75C0.25 1.3375 0.39675 0.98425 0.69025 0.69025C0.98425 0.39675 1.3375 0.25 1.75 0.25H7V1.75H1.75V12.25H7V13.75H1.75ZM10 10.75L8.96875 9.6625L10.8812 7.75H4.75V6.25H10.8812L8.96875 4.3375L10 3.25L13.75 7L10 10.75Z"
						fill="#F09E22"
					/>
				</svg>
				<h3 className="leave-title">Leave the Side</h3>
			</div>

			<p>To leave a Side, you must define a sub-admin-user who will become the new administrator.</p>

			<h4 className="leave-subtitle">Define a sub-admin user</h4>

			<p className="leave-description_secondary">Search for a username registered on SideSpeech</p>

			<div className="flex align-center justify-between gap-20 mt-4">
				<InputText
					bgColor="rgba(0, 0, 0, 0.2)"
					className="leave-input"
					color="var(--white)"
					height={43}
					onChange={handleInputChange}
					placeholder="Type something"
					placeholderColor="var(--white)"
					radius="10px"
					value={inputValue || newSubAdmin}
					autocomplete
					data={users?.map(p => p.username)}
					onSelected={(value: any) => setNewSubAdmin(value)}
				/>

				<Button background="var(--red)" classes="leave-button" onClick={leaveSide}>
					Leave the Side
				</Button>
			</div>
		</LeaveSideAsAdminStyled>
	);
};

export default LeavSideAsAdmin;
