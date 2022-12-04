import { useEffect } from 'react';
import styled from 'styled-components';
import { FALLBACK_BG_IMG } from '../../../constants/constants';
import { breakpoints, size } from '../../../helpers/breakpoints';
import { Collection, OpenSeaRequestStatus } from '../../../models/interfaces/collection';
import Button from '../../ui-components/Button';

const CARD_HEIGHT = 302;

interface CollectionCardStyledProps {
	coverImage?: string;
}

const UserCollectionCardStyled = styled.div<CollectionCardStyledProps>`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	width: 100%;
	height: ${CARD_HEIGHT * 0.8}px;
	flex-shrink: 0;
	background-color: var(--panels);
	border-radius: 10px;
	overflow: hidden;
	${breakpoints(
		size.lg,
		`{
        height: ${CARD_HEIGHT}px;
    }`
	)}
	.cover-image {
		height: 50%;
		background: url(${props => props.coverImage || FALLBACK_BG_IMG});
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.content {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		height: 50%;
		padding: 1rem;
		color: var(--text);
		& > div {
			height: 100%;
			${breakpoints(
				size.md,
				`
                height: 50%;
            `
			)}
		}
		.content-bottom {
			display: flex;
			flex-direction: column;
			gap: 2rem;
			justify-content: center;
			align-items: center;
			${breakpoints(
				size.md,
				`
                gap: 1rem;
                flex-direction: row;
            `
			)}
			&>div {
				gap: 1rem;
				width: 100%;
				justify-content: center;
				${breakpoints(
					size.md,
					`
                    justify-content: flex-start;
                `
				)}
				.number-of-sides {
					font-size: 2rem;
				}
			}
			& .discover-btn {
				width: 100%;
				${breakpoints(
					size.md,
					`
                {
                     width: 100%;
                 }
                `
				)}
			}
		}
	}
	.title-wrapper {
		display: flex;
		align-items: center;
		gap: 1rem;
		& .avatar {
			width: 50px;
			height: 50px;
			border-radius: 100px;
			overflow: hidden;
			flex-shrink: 0;
			& > img {
				width: 100%;
				object-fit: cover;
			}
		}
		& .title {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 60%;
		}
		& > svg {
			& path {
				fill: #705ce9;
			}
		}
		&.title-wrapper-mobile {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			background: linear-gradient(0deg, rgba(15, 15, 21, 0.8), rgba(15, 15, 21, 0.8));
			${breakpoints(
				size.md,
				`
                {display: none;}
            `
			)}
		}
		&.title-wrapper-desktop {
			display: none;
			${breakpoints(
				size.md,
				`
                {display: flex;}
            `
			)}
		}
	}
`;

export interface UserCollectionItemProps {
	collection: Collection;
	onClick?: (collection?: Collection) => void;
}

const UserCollectionCard = ({ collection, onClick }: UserCollectionItemProps) => {
	useEffect(() => {}, [collection]);

	return collection ? (
		<UserCollectionCardStyled coverImage={collection?.bannerUrl || FALLBACK_BG_IMG}>
			<div className="cover-image">
				<div className="title-wrapper title-wrapper-mobile">
					<div className="avatar">
						<img src={collection.imageUrl || FALLBACK_BG_IMG} alt={`${collection.name} avatar`} />
					</div>
					<h3 className="title">{collection?.getName()}</h3>
					{collection.safelistRequestStatus === OpenSeaRequestStatus.verified && (
						<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M5.87273 16L4.40455 13.5619L1.62273 12.9524L1.89318 10.1333L0 8L1.89318 5.86667L1.62273 3.04762L4.40455 2.4381L5.87273 0L8.5 1.10476L11.1273 0L12.5955 2.4381L15.3773 3.04762L15.1068 5.86667L17 8L15.1068 10.1333L15.3773 12.9524L12.5955 13.5619L11.1273 16L8.5 14.8952L5.87273 16ZM7.68864 10.7048L12.0545 6.4L10.9727 5.29524L7.68864 8.53333L6.02727 6.93333L4.94545 8L7.68864 10.7048Z" />
						</svg>
					)}
				</div>
			</div>
			<div className="content">
				<div className="title-wrapper title-wrapper-desktop">
					<div className="avatar">
						<img src={collection.imageUrl || FALLBACK_BG_IMG} alt={`${collection?.name} avatar`} />
					</div>
					<h3 className="title">{collection.getName()}</h3>
					{collection.safelistRequestStatus === OpenSeaRequestStatus.verified && (
						<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M5.87273 16L4.40455 13.5619L1.62273 12.9524L1.89318 10.1333L0 8L1.89318 5.86667L1.62273 3.04762L4.40455 2.4381L5.87273 0L8.5 1.10476L11.1273 0L12.5955 2.4381L15.3773 3.04762L15.1068 5.86667L17 8L15.1068 10.1333L15.3773 12.9524L12.5955 13.5619L11.1273 16L8.5 14.8952L5.87273 16ZM7.68864 10.7048L12.0545 6.4L10.9727 5.29524L7.68864 8.53333L6.02727 6.93333L4.94545 8L7.68864 10.7048Z" />
						</svg>
					)}
				</div>
				<div className="content-bottom">
					<div className="flex align-center">
						<span className="number-of-sides">{collection?.sideCount}</span>
						<p>Active Sides</p>
					</div>
					<Button classes="discover-btn" onClick={() => onClick?.(collection)}>
						Discover
					</Button>
				</div>
			</div>
		</UserCollectionCardStyled>
	) : null;
};

export default UserCollectionCard;
