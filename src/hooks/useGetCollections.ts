import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Collection } from '../models/interfaces/collection';
import { RootState } from '../redux/store/app.store';
import collectionService from '../services/api-services/collection.service';

export default function useGetCollections(): Collection[] {
	const [collections, setCollections] = useState<Collection[]>([]);
	const { user, account, userCollectionsData } = useSelector((state: RootState) => state.user);

	useEffect(() => {
		const getCollections = async () => {
			if (user?.token && account && Object.keys(userCollectionsData).length) {
				try {
					const response = await collectionService.getAllCollections(userCollectionsData);
					setCollections(response);
				} catch (error) {
					console.error(error);
				}
			}
		};
		getCollections();
	}, [user?.token, account, userCollectionsData]);

	return collections;
}
