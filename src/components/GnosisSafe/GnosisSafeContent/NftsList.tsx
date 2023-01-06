import React from 'react';
import styled from 'styled-components';
import { breakpoints, size } from '../../../helpers/breakpoints';
import NftCardItem from '../NftCardItem';

const nfts = [
	{
		url: 'https://api.phantom.app/image-proxy/?image=https%3A%2F%2Farweave.net%2FMRosxcfIWBX5EI088UMXvaQw7OhOYqZULHAWIpvYVdE%2F3326.png',
		collectionName: 'Moonbirds Oddities',
		nftId: '9950',
		price: '0.90',
		valuation: '1.91'
	},
	{
		url: 'https://api.phantom.app/image-proxy/?image=https%3A%2F%2Farweave.net%2FMRosxcfIWBX5EI088UMXvaQw7OhOYqZULHAWIpvYVdE%2F3326.png',
		collectionName: 'Moonbirds Oddities',
		nftId: '9950',
		price: '0.90',
		valuation: '1.91'
	},
	{
		url: 'https://api.phantom.app/image-proxy/?image=https%3A%2F%2Farweave.net%2FMRosxcfIWBX5EI088UMXvaQw7OhOYqZULHAWIpvYVdE%2F3326.png',
		collectionName: 'Moonbirds Oddities',
		nftId: '9950',
		price: '0.90',
		valuation: '1.91'
	},
	{
		url: 'https://api.phantom.app/image-proxy/?image=https%3A%2F%2Farweave.net%2FMRosxcfIWBX5EI088UMXvaQw7OhOYqZULHAWIpvYVdE%2F3326.png',
		collectionName: 'Moonbirds Oddities',
		nftId: '9950',
		price: '0.90',
		valuation: '1.91'
	}
];

const Container = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	margin-top: 20px;
	${breakpoints(
		size.md,
		`
        {
                grid-template-columns: repeat(3, 1fr);
            }
        `
	)}
	${breakpoints(
		size.xl,
		`
            {
                grid-template-columns: repeat(auto, minmax(275px, 352px));
            }
            `
	)}
        grid-gap: 1rem;
	width: 100%;
`;

export default function NftsList() {
	return (
		<Container>
			{nfts.map(nft => (
				<NftCardItem
					url={nft.url}
					collectionName={nft.collectionName}
					nftId={nft.nftId}
					price={nft.price}
					valuation={nft.valuation}
				/>
			))}
		</Container>
	);
}
