import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import defaultPP from '../../../../assets/default-pp.png';
import { getRoleColor, reduceWalletAddress } from '../../../../helpers/utilities';
import { Profile, Role } from '../../../../models/Profile';
import { Side } from '../../../../models/Side';
import { updateProfileInSide } from '../../../../redux/Slices/AppDatasSlice';
import profileService from '../../../../services/api-services/profile.service';
import websocketService from '../../../../services/websocket-services/websocket.service';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import Button from '../../../ui-components/Button';
import CustomSelect from '../../../ui-components/CustomSelect';

const getRole = (role: number) => {
	if (role === Role.Admin) return 'Administrator';
	else if (role === Role.subadmin) return 'Sub-Admin';
	else return 'User';
};

export default function MemberListItem({ side, user, isAdmin }: { side: Side; user: Profile; isAdmin: boolean }) {
	const [userToEject, setUserToEject] = useState<Profile | undefined>(undefined);
	const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);

	const rolesObject = {
		// [Role.Admin]: getRole(Role.Admin),
		[Role.subadmin]: getRole(Role.subadmin),
		[Role.User]: getRole(Role.User)
	};

	const dispatch = useDispatch();

	const handleRoleChange = async (event: any) => {
		try {
			const newRole = event.target.value;
			const response = await profileService.updateProfile(user.id, { role: newRole });
			console.log(response);
			toast.success('The user role has been updated', { toastId: 46 });
		} catch (error) {
			console.error(error);
			toast.error('There has been some problem updating the role of the user', { toastId: 46 });
		}
	};

	const onClickEject = async (user: any) => {
		setUserToEject(user);
		setConfirmationModalOpen(true);
	};

	const handleConfirm = async (value: boolean) => {
		if (value && userToEject) {
			try {
				await profileService.blacklistProfile(side.id, userToEject.id, true);
				// Socket IO call to ban user
				websocketService.banUser(userToEject.id);
				dispatch(updateProfileInSide({ key: 'isBlacklisted', value, id: userToEject.id }));
			} catch (error) {
				console.log(error);
				toast.error('Error when banning this user.', { toastId: 111 });
			} finally {
				setConfirmationModalOpen(false);
			}
		} else {
			setUserToEject(undefined);
			setConfirmationModalOpen(false);
		}
	};

	const removeFromBlacklist = async (user: any) => {
		try {
			await profileService.blacklistProfile(side.id, user.id, false);
			dispatch(updateProfileInSide({ key: 'isBlacklisted', value: false, id: user.id }));
		} catch (error) {
			console.log(error);
			toast.error('Error when un-banning this user.', { toastId: 112 });
		} finally {
			setConfirmationModalOpen(false);
		}
	};

	const userImg =
		typeof user?.user?.userAvatar === 'string' ? JSON.parse(user.user.userAvatar)?.metadata?.thumbnail : null;

	return (
		<div className="member-item">
			<div className="flex align-center gap-20 user-avatar-name">
				<span className="profile-round-small">
					<img
						style={{
							width: '25px',
							height: '25px',
							objectFit: 'cover',
							borderRadius: 25
						}}
						src={userImg || defaultPP}
						alt="profile"
					/>
				</span>
				<span className="fw-400 size-12">
					{user?.user?.username?.length > 25
						? reduceWalletAddress(user?.user?.username)
						: user?.user?.username}
				</span>
			</div>
			<div>
				{!isAdmin ? (
					<>
						<CustomSelect
							options={Object.values(rolesObject)}
							values={Object.keys(rolesObject)}
							valueToSet={user['role']}
							onChange={handleRoleChange}
						/>
						{/* <i
							className="fa-solid fa-check ml-4 pointer"
							onClick={handleSaveRole}
							title="Save new role"
						></i>
						<i className="fa-solid fa-trash ml-4" title="Delete user"></i> */}
					</>
				) : (
					<span className={getRoleColor(getRole(user['role']))}>{getRole(user['role'])}</span>
				)}
			</div>
			<div className="flex-1 align-center text-center">
				{!isAdmin ? (
					!user['isBlacklisted'] ? (
						<Button classes="eject-btn" width="100%" onClick={() => onClickEject(user)}>
							<i className="fa-solid fa-right-from-bracket mr-1"></i> Block
						</Button>
					) : (
						<Button classes="remove-btn" width="100%" onClick={() => removeFromBlacklist(user)}>
							<i className="fa-solid fa-right-from-bracket mr-1"></i> Unblock
						</Button>
					)
				) : null}
			</div>
			{confirmationModalOpen && (
				<ConfirmationModal
					message={
						<span className="size-20">
							Are you sure you want to blacklist {userToEject?.user.username}?
						</span>
					}
					handleConfirm={handleConfirm}
					setIsConfirmationModalOpen={setConfirmationModalOpen}
				/>
			)}
		</div>
		// <div className="flex align-center my-2">
		//   <div className="flex flex-1 align-end">
		//     <span className="profile-round-small mr-1">
		//       <img
		//         style={{ width: "inherit", height: "inherit", objectFit: "cover" }}
		//         // src={user.get("user")?.get("profilePicture")?.url}
		//         src={user["profilePicture"]}
		//         alt="profile"
		//       />
		//       {/* <img alt="verified" src={check} /> */}
		//     </span>
		//     {/* <span className="fw-400 size-12 ml-2">{user.get("username")}</span> */}
		//     <span className="fw-400 size-12 ml-2 text-primary-light">{(user["username"].length > 25) ? user["username"].slice(0, 20) + '...' : user["username"]}</span>
		//   </div>
		//   <div className="flex flex-1 align-center size-12">
		// {connectedUserIsCreator ? (
		//   !isCreator && (
		//     <>
		//       <CustomSelect
		//         options={["User", "Moderator1", "Moderator2", "Moderator3"]}
		//         values={["User", "Moderator1", "Moderator2", "Moderator3"]}
		//         // valueToSet={user.get("role").get("name")}
		//         valueToSet={user["role"]}
		//         onChange={handleRoleChange}
		//       />
		//       <i
		//         className="fa-solid fa-check ml-4 pointer"
		//         onClick={handleSaveRole}
		//         title="Save new role"
		//       ></i>
		//       <i className="fa-solid fa-trash ml-4" title="Delete user"></i>
		//     </>
		//   )
		// ) : (
		//   // <span className={getRoleColor(user.attributes.role.get("name"))}>
		//   <span className={getRoleColor(user["role"]) + ' flex-1 align-center text-center'}>
		//     {/* {user.get("role").get("name")} */}
		//     {user["role"]}
		//   </span>
		// )}
		//   </div>
		//   <div className="flex-1 ml-5 align-center text-center">
		// <Button width={70} height={35} onClick={undefined} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}>Eject</Button>
		//   </div>
		// </div>
	);
}
