import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './eligibility.css';
import styled from 'styled-components';
import { RootState } from '../../../../redux/store/app.store';
import { checkUserEligibility, ElligibilityResponse, fixURL } from '../../../../helpers/utilities';
import { Collection, OpenSeaRequestStatus } from '../../../../models/interfaces/collection';
import check from '../../../../assets/check_circle.svg';
import nftIcon from '../../../../assets/images/bad_image_loading@2x.svg';
import { Side } from '../../../../models/Side';

const ConditionsContainer = styled.div`
	width: 100%;
	border-radius: 10px;
	background-color: var(--black-transparency-20);
	padding: 23px 28px 10px 30px;
`;

const ConditionItem = styled.div`
	width: 100%;
	padding: 19px 0px 23px 0px;
	display: flex;
`;

const ErrorNft = styled.div`
	background: var(--disable);
	border: 1px dashed var(--inactive);
	border-radius: 7px;
	height: 62px;
	width: 62px;
	left: 72px;
	overflow: hidden;
`;

const NftImage = styled.img`
	min-height: 62px;
	min-width: 62px;
	height: 62px;
	width: 62px;
	border-radius: 7px;
	object-fit: contain;
	background: var(--disable);
	border: 1px dashed var(--inactive);
`;
const Chip = styled.span`
	width: fit-content;
	border-radius: 5px;
	background-color: var(--disable);
	padding: 1px 8px;
`;

export default function Eligibility({ side, details }: { side: Side; details: ElligibilityResponse }) {
	const renderRequieredPhrase = () =>
		!side['required'] ? '(One collection is enough)' : '(All collections are required)';

	return (
		<ConditionsContainer>
			<div className="fw-700 mb-4">Conditions {renderRequieredPhrase()}</div>
			<div
				className="w-100"
				style={{
					maxHeight: '30vh',
					overflow: 'auto',
					paddingRight: 10,
					paddingTop: 10
				}}
			>
				{Object.values(details).map(d => {
					const collection = side.collectionSides.find(c => c.collectionId === d['numberNeeded'].id)![
						'collection'
					];
					return (
						<>
							<CollectionRow key={collection.address} result={d} collection={collection} />
						</>
					);
				})}
			</div>
		</ConditionsContainer>
	);
}

const CollectionRow = ({
	result,
	collection
}: {
	result: { numberNeeded: any; propertyResults: any[] };
	collection: Collection;
}) => {
	const [successProperty, setSuccessProperty] = useState<any[]>([]);

	useEffect(() => {
		setSuccessProperty(result['propertyResults'].filter(p => p.type.includes('success')));
	}, [result]);

	const isNumberError = result['numberNeeded'].type.includes('error');

	const isAllPropertiesError =
		result['propertyResults'].length && result['propertyResults'].every((item: any) => item.type.includes('error'));

	const color = isNumberError ? 'text-red' : 'text-green';

	const renderNumberErrorIcon = () =>
		isNumberError ? <i className="fa-solid fa-xmark mr-1"></i> : <i className="fa-solid fa-check mr-1"></i>;

	const renderGlobalErrorIcon = () =>
		isNumberError || isAllPropertiesError ? (
			<i className="fa-solid fa-circle-xmark text-red size-18"></i>
		) : (
			<i className="fa-solid fa-circle-check text-green size-18"></i>
		);

	const renderProperties = () =>
		!isAllPropertiesError && successProperty.length ? (
			<PropertyRow propertyResult={successProperty[0]} error={false} successCount={successProperty.length} />
		) : (
			result['propertyResults'].map((v: any, index: number) => {
				const isCurrentPropertyError = v.type.includes('error');
				return <PropertyRow key={index} propertyResult={v} error={isCurrentPropertyError} />;
			})
		);

	return (
		<div className="f-column mb-2">
			<div
				className="flex justify-between align-center"
				style={{
					borderBottom: result['propertyResults'].length && '1px solid var(--disable)',
					paddingBottom: 10
				}}
			>
				<div className="flex align-center">
					<span className="mr-2">-</span>
					{collection?.getName()}{' '}
					<div className={`${color} ml-2`}>
						{renderNumberErrorIcon()}
						{result['numberNeeded']['usefulNfts']?.length || 0} /{result['numberNeeded']['numberNeeded']}
					</div>
				</div>
				{renderGlobalErrorIcon()}
			</div>
			{renderProperties()}
		</div>
	);
};

const PropertyRow = ({ propertyResult, error, successCount }: any) => {
	const nft = propertyResult.usefulNfts ? propertyResult.usefulNfts[0] : null;

	const iconColor = error ? 'text-red' : 'text-green';
	const propertyColor = error ? 'text-light-30' : 'text-green';

	const renderErrorIcon = () =>
		error ? <i className="fa-solid fa-xmark mr-1"></i> : <i className="fa-solid fa-check mr-1"></i>;

	const renderNftImage = () =>
		error ? <ErrorNft /> : <NftImage width={100} height={100} src={fixURL(nft.metadata.image || nftIcon)} />;

	const renderNftId = () =>
		error ? (
			'No eligible NFT'
		) : (
			<>
				#{nft.token_id} {successCount > 1 && <Chip> +{successCount - 1}</Chip>}
			</>
		);

	return (
		<ConditionItem>
			{renderNftImage()}
			<div className="f-column justify-evenly ml-3">
				<div>
					<span>{renderNftId()}</span>
				</div>

				<div>
					<span className={`${iconColor} mr-5`}>
						{renderErrorIcon()}
						<span className={propertyColor}>{propertyResult.property}</span>
					</span>
					<span>{propertyResult.value}</span>
				</div>
			</div>
		</ConditionItem>
	);
};
