import React from 'react';
import styled from 'styled-components'
import { FALLBACK_BG_IMG } from '../../../constants/constants';
import { UserCollectionItemProps } from './UserCollectionCard';

const UserCollectionItemSmallStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
    width: 100%;
    height: 68px;
    flex-shrink: 0;
    background-color: var(--bg-secondary);
    color: var(--text-secondary);
    cursor: pointer;
    & .avatar {
        width: 40px;
        height: 40px;
        border-radius: 100px;
        overflow: hidden;
        flex-shrink: 0;
        &>img {
            width: 100%;
            object-fit: cover;
        }
    }
    & .title-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-grow: 1;
        flex-shrink: 0;
        & .title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 80%;
        }
        &>svg {
            & path {
                fill: #705CE9;
            }
        }
    }
    & .number-of-sides {

    }
`;

const UserCollectionItemSmall = ({collection, onClick}: UserCollectionItemProps) => {
    return (
        <UserCollectionItemSmallStyled onClick={() => onClick?.(collection)}>
            <div className="avatar">
                <img src={collection?.opensea?.imageUrl || FALLBACK_BG_IMG} alt={`${collection?.opensea?.collectionName} avatar`} />
            </div>
            <div className="title-wrapper">
                <h3 className="title">{collection?.opensea?.collectionName || "{No Name}"}</h3>
                {collection.opensea?.safelistRequestStatus === 'verified' && (
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.87273 16L4.40455 13.5619L1.62273 12.9524L1.89318 10.1333L0 8L1.89318 5.86667L1.62273 3.04762L4.40455 2.4381L5.87273 0L8.5 1.10476L11.1273 0L12.5955 2.4381L15.3773 3.04762L15.1068 5.86667L17 8L15.1068 10.1333L15.3773 12.9524L12.5955 13.5619L11.1273 16L8.5 14.8952L5.87273 16ZM7.68864 10.7048L12.0545 6.4L10.9727 5.29524L7.68864 8.53333L6.02727 6.93333L4.94545 8L7.68864 10.7048Z" />
                    </svg>
                )}
            </div>
            <div className="number-of-sides">
                {collection.sideCount}
            </div>
        </UserCollectionItemSmallStyled>
    )
}

export default UserCollectionItemSmall;