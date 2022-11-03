import React from 'react';
import styled from 'styled-components';
import { Side } from '../../../models/Side';

const CARD_HEIGHT = 363;

interface SideCardItemStyledProps {
    coverImage?: string;
};

const SideCardItemStyled = styled.main<SideCardItemStyledProps>`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    height: ${CARD_HEIGHT}px;
    flex-shrink: 0;
    background-color: var(--bg-secondary);
    border-radius: 10px;
    overflow: hidden;
    .cover-image {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 50%;
        padding: 1rem;
        background-image: url(${(props) => props.coverImage || 'https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149611030.jpg'});
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        &::after {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            background: linear-gradient(180deg, rgba(24, 26, 43, 0) 0%, #181A2B 100%);
            pointer-events: none;
            z-index: 1;
        }
        &>div {
            position: relative;
            z-index: 2;
            height: 40%;
        }
        .title-wrapper {
            gap: 1rem;
            & .avatar {
                width: 50px;
                height: 50px;
                border-radius: 100px;
                overflow: hidden;
                flex-shrink: 0;
                &>img {
                    width: 100%;
                    object-fit: cover;
                }
            }
            & .title {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 60%;
                margin: 0;
            }
            & .collections {
                display: flex;
                gap: 5px;
                width: 100%;
                & span {
                    background-color: var(--bg-secondary-light);
                    color: var(--text-secondary-light);
                    padding: .3rem .5rem;
                    border-radius: 5px;
                    &.collection {
                        display: flex;
                        align-items: center;
                        width: auto;
                        &>svg {
                            margin-left: 1rem;
                            & path {
                                fill: #705CE9;
                            }
                        }
                    }
                    &.more-collections {
        
                    }
                }
            }
        }
    }
    .side-content {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 50%;
        padding: 1rem;
        color: var(--text-secondary);
        .side-description {
            height: 50%;
        }
        .side-actions {
            height: 50%;
        }
    }
`;

interface SideCardItemProps {
    side: Side;
};

const SideCardItem = ({ side }: SideCardItemProps) => {
    console.log(side)
  return (
    <SideCardItemStyled coverImage={side.coverImage}>
        <div className="cover-image">
            <div className="flex align-center title-wrapper">
                <div className="avatar">
                    <img src={side.coverImage || 'https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149611030.jpg'} alt={`${side?.name} avatar`} />
                </div>
                <div className="f-column">
                    <h3 className="title">{side?.name || "{No Name}"}</h3>
                    <div className="collections">
                        <span className="collection">
                            {side.name}
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.87273 16L4.40455 13.5619L1.62273 12.9524L1.89318 10.1333L0 8L1.89318 5.86667L1.62273 3.04762L4.40455 2.4381L5.87273 0L8.5 1.10476L11.1273 0L12.5955 2.4381L15.3773 3.04762L15.1068 5.86667L17 8L15.1068 10.1333L15.3773 12.9524L12.5955 13.5619L11.1273 16L8.5 14.8952L5.87273 16ZM7.68864 10.7048L12.0545 6.4L10.9727 5.29524L7.68864 8.53333L6.02727 6.93333L4.94545 8L7.68864 10.7048Z" />
                            </svg>
                        </span>
                        <span className="more-collections">+1</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="side-content">
            <div className="side-description">
                <p>{side.description} Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda quasi in</p>
            </div>
            <div className="side-actions"></div>
        </div>
    </SideCardItemStyled>
  )
}

export default SideCardItem