import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { checkUserEligibility, ElligibilityResponse } from '../helpers/utilities';
import { Role } from '../models/Profile';
import { Side } from '../models/Side';
import { RootState } from '../redux/store/app.store';

export default function useSideEligibility(side: Side | undefined): [boolean, ElligibilityResponse] {
	const { userCollectionsData } = useSelector((state: RootState) => state.user);
	const [isEligible, setIsEligible] = useState<boolean>(false);
	const [details, setDetails] = useState<ElligibilityResponse>({});

	useEffect(() => {
		if (Object.keys(userCollectionsData).length && side) {
			const [res, isEligible] = checkUserEligibility(userCollectionsData, side);
			setIsEligible(isEligible);
			setDetails(res);
		}
	}, [userCollectionsData, side]);

	return [isEligible, details];
}
