import { useEffect, useState } from 'react';
import { User } from '../models/User';
import userService from '../services/api-services/user.service';

export function useGetUserPartialInfo(address: string) {
	const [user, setUser] = useState<Partial<User> | null>(null);

	async function getUserInfo(address: string) {
		const user = await userService.getPartialUserByAddress(address);
		setUser(user);
	}

	useEffect(() => {
		getUserInfo(address);
	}, [address]);

	return user;
}
