import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Role } from '../models/Profile';
import { Side } from '../models/Side';
import { RootState } from '../redux/store/app.store';

export default function useIsSideAdmin(side: Side | null): boolean {
	const { user } = useSelector((state: RootState) => state.user);
	const [isSideAdmin, setIsSideAdmin] = useState<boolean>(false);

	useEffect(() => {
		if (user && user.profiles.length && side) {
			const sideProfile = user.profiles.find(profile => profile.side?.id === side.id);
			if (sideProfile) {
				const isSideAdminResponse = sideProfile.role === Role.Admin || sideProfile.role === Role.subadmin;
				setIsSideAdmin(isSideAdminResponse);
			}
		}
	}, [user, side]);

	return isSideAdmin;
}
