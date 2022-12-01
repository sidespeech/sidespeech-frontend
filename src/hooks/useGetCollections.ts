import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Collection } from '../models/interfaces/collection';
import { RootState } from '../redux/store/app.store';
import collectionService from '../services/api-services/collection.service';

export default function useGetCollections(): Collection[] {
	const [collections, setCollections] = useState<Collection[]>([]);
	const { user } = useSelector((state: RootState) => state.user);

	useEffect(() => {
		const getCollections = async () => {
			if (user?.token) {
				const response = await collectionService.getAllCollections();
				setCollections(response);
			}
		};
		getCollections();
	}, [user?.token]);

	return collections;
}
