import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useGetCollections from '../../../hooks/useGetCollections';
import { Collection } from '../../../models/interfaces/collection';
import { userState } from '../../../redux/Slices/InterfaceSelectors';
import CollectionsDropdown from '../../ui-components/CollectionsDropdown';
import NftsList from './NFTS/NftsList';

export default function Nfts() {
	const { userCollectionsData } = useSelector(userState);

	const collections = useGetCollections();

	const [selectedCollection, setSelectedCollection] = useState<Collection>();

	const handleOnChange = (address: string) => {
		const col = collections.find(c => c.address === address);
		if (col) setSelectedCollection(col);
	};
	return (
		<div className='f-column w-100'>
			<CollectionsDropdown
				collections={collections}
				userCollectionsData={userCollectionsData}
				onChange={handleOnChange}
				defaultValue={
					<span>
						Collection <span className="ml-3">All</span>
					</span>
				}
				selectedCollection={selectedCollection}
				allValue={
					<span>
						Collection <span className="ml-3">All</span>
					</span>
				}
				style={{ zIndex: 10, maxWidth: 412 }}
			/>
			<NftsList />
		</div>
	);
}
