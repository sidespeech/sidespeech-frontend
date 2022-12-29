import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Collection, OpenSeaRequestStatus } from '../../models/interfaces/collection';
import { UserCollectionsData } from '../../models/interfaces/UserCollectionsData';
import Dropdown from './Dropdown';
import check from '../../assets/check_circle.svg';

function collectionFilterByName(c: Collection, filter: string) {
	const lowerCaseName = c.name?.toLowerCase() || '';
	const lowerCaseFilter = filter.toLowerCase();
	return (
		lowerCaseName.includes(lowerCaseFilter) ||
		lowerCaseName.replaceAll(' ', '').includes(lowerCaseFilter.replaceAll(' ', ''))
	);
}

function collectionFilterByVerified(c: Collection, filter: boolean) {
	if (!filter) return true;
	return c.safelistRequestStatus === OpenSeaRequestStatus.verified;
}

const Thumbnail = styled.img`
	border-radius: 15px;
`;

interface ICollectionsDropdownProps {
	collections: Collection[];
	userCollectionsData: UserCollectionsData;
	onChange: (value: string) => void;
	defaultValue: string;
	style: any;
	selectedCollection: Collection | undefined;
	allValue?: string;
}

export default function CollectionsDropdown(props: ICollectionsDropdownProps) {
	const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
	const [filter, setFilter] = useState<string>('');
	const [onlyVerifiedCollections, setOnlyVerifiedCollections] = useState<boolean>(true);

	useEffect(() => {
		let filtered = props.collections.filter(
			c => collectionFilterByName(c, filter) && collectionFilterByVerified(c, onlyVerifiedCollections)
		);
		setFilteredCollections(filtered);
	}, [filter, onlyVerifiedCollections, props.collections]);

	const filterDropdownList = (e: any) => {
		const value = e.target.value;
		setFilter(value);
	};

	const filterByVerifiedDropdownList = (e: any) => {
		const value = e.target.checked;
		setOnlyVerifiedCollections(value);
	};

	const CollectionRow = ({ c, fi, userData }: { c: Collection; fi: number; userData: any }) => {
		return (
			<span className="flex align-center pl-3" key={fi}>
				{c.imageUrl ? <Thumbnail width={27} height={27} src={c.imageUrl} alt="thumbnail" /> : null}
				<span
					className="ml-2 mr-3"
					style={{
						color: userData[c.address] ? 'var(--green)' : 'var(--red)'
					}}
				>
					{c.getName()}
				</span>
				{c.safelistRequestStatus === OpenSeaRequestStatus.verified && <img alt="check" src={check} />}
			</span>
		);
	};

	const handleOnChange = (address: string) => {
		setFilter('');
		props.onChange(address);
	};

	const optionsList = () => {
		if (props.allValue) {
			return filteredCollections.length
				? [
						[props.allValue],
						...filteredCollections.map((c, fi) => {
							return <CollectionRow userData={props.userCollectionsData} c={c} fi={fi} />;
						})
				  ]
				: [props.defaultValue];
		} else {
			return filteredCollections.length
				? [
						...filteredCollections.map((c, fi) => {
							return <CollectionRow userData={props.userCollectionsData} c={c} fi={fi} />;
						})
				  ]
				: [props.defaultValue];
		}
	};

	const valuesList = () => {
		if (props.allValue) {
			return filteredCollections.length ? ['', ...filteredCollections.map(c => c.address)] : [''];
		} else {
			return filteredCollections.length ? [...filteredCollections.map(c => c.address)] : [''];
		}
	};

	return (
		<Dropdown
			style={props.style}
			filterByCheckbox={filterByVerifiedDropdownList}
			checkboxLabel="Only verified"
			checkboxDefaultValue={onlyVerifiedCollections}
			resultsNumbers={filteredCollections.length}
			values={valuesList()}
			defaultValue={
				props.selectedCollection ? (
					<CollectionRow userData={props.userCollectionsData} c={props.selectedCollection} fi={0} />
				) : (
					props.defaultValue
				)
			}
			options={optionsList()}
			onChange={handleOnChange}
			filterDropdownList={filterDropdownList}
		/>
	);
}
