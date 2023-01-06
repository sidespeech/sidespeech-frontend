import { Collection } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import check from '../../assets/green-verified.svg';

interface INftCardItemProps {
	url: string;
	collectionName: string;
	nftId: string;
	price: string;
	valuation: string;
}

const ItemContainer = styled.div<any>`
	border: 1px solid var(--white-transparency-10);
	border-radius: 7px;
	height: 107px;
	padding: 14px 19px;
	display: flex;
	gap: 10px;
	align-items: center;
	& .nft-img {
		height: 72px;
		width: 73px;
		border-radius: 7px;
		background-color: black;
		background: no-repeat center url(${props => props.url});
		background-size: cover;
	}

	& .details {
	}
`;

export default function NftCardItem(props: INftCardItemProps) {
	return (
		<ItemContainer url={props.url}>
			<div className="nft-img"></div>
			<div className="details f-column">
				<div className="fw-700 size-12 flex align-center">
					<span>{props.collectionName}</span>
					<img src={check} className={'ml-2'} />
				</div>
				<div className="size-12">#{props.nftId}</div>
				<div className="size-12">Purchase price: {props.price} ETH</div>
				<div className="size-12">Valuation: {props.valuation} ETH</div>
			</div>
		</ItemContainer>
	);
}
