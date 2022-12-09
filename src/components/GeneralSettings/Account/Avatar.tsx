import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fixURL } from '../../../helpers/utilities';
import { NFT } from '../../../models/interfaces/nft';

import defaultPP from '../../../assets/default-pp.webp';
import hexagon from '../../../assets/hexagon.svg';
import { breakpoints, size } from '../../../helpers/breakpoints';

const AvatarStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	${breakpoints(
		size.md,
		`{
    align-items: flex-start;
    flex-direction: row;
  }`
	)}
	& label {
		text-align: center;
		${breakpoints(
			size.md,
			`{
      text-align: left;
    }`
		)}
	}
`;

const ProfileImage = styled.div`
	min-width: 70px;
	min-height: 70px;
	max-width: 70px;
	max-height: 70px;
	cursor: pointer;
	background: var(--input);
	border-radius: 100px;
	text-align: center;
	color: var(--inactive);
	overflow: hidden;
`;

export const SpanElipsis = styled.span`
	display: inline-block;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 150px;
	overflow: hidden;
`;

export const ProfilePictureData = styled.div`
	min-height: 39px;
	width: 245px;
	border-radius: 7px;
	border: 1px solid rgba(125, 166, 220, 0.1);
	display: flex;
	align-items: center;
	padding: 8px 12px;
`;

export default function Avatar({ nft, collectionName }: { nft: NFT | null; collectionName: string | undefined }) {
	const [url, setUrl] = useState<string>(defaultPP);

	useEffect(() => {
		if (nft && nft.metadata && nft.metadata.image) {
			setUrl(fixURL(nft.metadata.image));
		} else setUrl(defaultPP);
	}, [nft]);

	return (
		<AvatarStyled>
			<ProfileImage className="flex align-center justify-center">
				<img
					style={{
						height: '100%',
						width: '100%',
						objectFit: 'cover'
					}}
					src={url}
					alt="file-form"
				/>
			</ProfileImage>
			<div className="f-column gap-10" style={{ maxWidth: '235px' }}>
				<label className="fw-600">Choose an NFT from your wallet as your profile avatar</label>
				{collectionName && nft && (
					<ProfilePictureData className="">
						<img src={hexagon} className="mr-3" />
						<>
							<SpanElipsis className="mr-2 size-12">#{nft.token_id}</SpanElipsis>
							<span className="size-12">{collectionName}</span>
						</>
					</ProfilePictureData>
				)}
			</div>
		</AvatarStyled>
	);
}
