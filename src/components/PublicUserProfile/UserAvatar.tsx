import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fixURL } from '../../helpers/utilities';
import { Collection, OpenSeaRequestStatus } from '../../models/interfaces/collection';

import check from '../../assets/check_circle.svg';
import defaultPP from '../../assets/default-pp.png';
import hexagon from '../../assets/hexagon.svg';
import { SpanElipsis } from '../GeneralSettings/Account/Avatar';
import { breakpoints, size } from '../../helpers/breakpoints';

const UserAvatarContainer = styled.div`
	border-radius: 10px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 15px;
	${breakpoints(
		size.lg,
		`{
            background: var(--black-transparency-20);
            min-width: 250px;
            max-width: 313px;
        }`
	)}
	& .nft-image {
		width: 100%;
		height: 200px;
		max-width: 200px;
		object-fit: cover;
		border-radius: 10px;
		height: 113px;
		${breakpoints(
			size.lg,
			`{
				height: 273px;
                max-width: none;
                border-radius: 10px;
            }`
		)}
	}
	& .bottom-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 1rem;
		color: var(--white);
		& .user-name {
			font-size: 14px;
			${breakpoints(
				size.lg,
				`{
                display: none;
            }`
			)}
		}
		& .nft-info {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.nft-image-bg {
		height: 100%;
		width: 100%;
		position: relative;
		display: block;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: top center;
		margin-bottom: 10px;
	}
	.nft-image-bg img {
		visibility: hidden;
	}
	.nft-info {
		flex-wrap: wrap;
	}
	.token-id {
		max-width: 80px;
	}
	.collection-name {
		flex-basis: 100%;
		text-align: center;
	}
`;

export const UserAvatar = ({ className = '', nft, name, userName, verified }: any) => {
	const [url, setUrl] = useState<string>(defaultPP);

	useEffect(() => {
		if (nft && nft.metadata && nft.metadata.image) {
			setUrl(fixURL(nft.metadata.image));
		} else {
			setUrl(defaultPP);
		}

	}, [nft]);

	return (
		<UserAvatarContainer className={className}>
			<div 
			className="nft-image-bg" 
			style={{ 
      			backgroundImage: `url(${url})`
    		}}>
				<img className="nft-image" src={url} />
			</div>
			<div className="bottom-container">
				{userName && <p className="user-name">{userName}</p>}
				<div className="nft-info">
					<img src={hexagon} className="mr-3" />
					{name && nft ? (
						<>
							<SpanElipsis title={nft.token_id} className="mr-2 size-12 token-id">
								#{nft.token_id}
							</SpanElipsis>
							{verified.safelistRequestStatus === OpenSeaRequestStatus.verified && (
								<img src={check} />
							)}
							<span className="size-12 collection-name">{name}</span>
						</>
					) : (
						<span>No avatar selected</span>
					)}
				</div>
			</div>
		</UserAvatarContainer>
	);
};
