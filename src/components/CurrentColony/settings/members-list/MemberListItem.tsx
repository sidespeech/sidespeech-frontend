import React, { useEffect, useState } from 'react';
import defaultPP from '../../../../assets/default-pp.webp';
import { fixURL, getRoleColor, reduceWalletAddress } from '../../../../helpers/utilities';
import { Profile } from '../../../../models/Profile';
import { Side } from '../../../../models/Side';
import profileService from '../../../../services/api-services/profile.service';
import Button from '../../../ui-components/Button';
import CustomSelect from '../../../ui-components/CustomSelect';

export default function MemberListItem({ side, user }: { side: Side; user: Profile }) {
	const [isCreator, setIsCreator] = useState<boolean>(false);
	const [connectedUserIsCreator, setConnectedUserIsCreator] = useState<boolean>(false);
	const [newRole, setNewRole] = useState('');

	const handleRoleChange = (event: any) => {
		setNewRole(event.target.value);
	};

	const getRole = (role: number) => {
		if (role === 0) return 'Administrator';
		else if (role === 2) return 'Sub-Admin';
		else return 'User';
	};

	useEffect(() => {}, []);

	const onClickEject = async (user: any) => {
		await profileService.removeProfile(user['id']);
		window.location.reload();
	};

	const handleSaveRole = async () => {};

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
				{connectedUserIsCreator ? (
					!isCreator && (
						<>
							<CustomSelect
								options={['User', 'Moderator1', 'Moderator2', 'Moderator3']}
								values={['User', 'Moderator1', 'Moderator2', 'Moderator3']}
								// valueToSet={user.get("role").get("name")}
								valueToSet={getRole(user['role'])}
								onChange={handleRoleChange}
							/>
							<i
								className="fa-solid fa-check ml-4 pointer"
								onClick={handleSaveRole}
								title="Save new role"
							></i>
							<i className="fa-solid fa-trash ml-4" title="Delete user"></i>
						</>
					)
				) : (
					<span className={getRoleColor(getRole(user['role']))}>{getRole(user['role'])}</span>
				)}
			</div>
			<div className="flex-1 align-center text-center">
				{getRole(user['role']) !== 'Administrator' ? (
					<Button classes="eject-btn" width="100%" onClick={() => onClickEject(user)}>
						<i className="fa-solid fa-right-from-bracket mr-1"></i> Eject
					</Button>
				) : null}
			</div>
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
