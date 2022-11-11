import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FALLBACK_BG_IMG } from '../../../constants/constants';
import { Side } from '../../../models/Side';
import ClampLines from '../../ui-components/ClampLines';
import SideCardJoinActions from './SideCardJoinActions';
import SideCardUserActions from './SideCardUserActions';

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
        height: ${CARD_HEIGHT / 2}px;
        padding: 1rem;
        background-image: url(${(props) => props.coverImage || FALLBACK_BG_IMG});
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
                        max-width: 80%;
                        & > span {
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            max-width: 80%;
                            margin: 0;
                            padding: 0;
                        }
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
        min-height: ${CARD_HEIGHT / 2}px;
        padding: 1rem;
        color: var(--text-secondary);
        .side-description {
            min-height: 50%;
            & > p {
                height: 3.5rem;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden; 
            }
        }
        .side-actions {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 50%;
        }
    }
`;

interface SideCardItemProps {
    alerts?: any;
    messages?: any;
    onJoin?: (side: Side) => void;
    side: Side;
    userProfiles: any[];
    userSides?: boolean
};

const SideCardItem = ({ alerts, messages, onJoin, side, userProfiles, userSides }: SideCardItemProps) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!side.joined) return;
        navigate(`/${side.id}`)
    }

    let alertsCount = 0;
    side.profiles.forEach(profile => {
        const count = profile?.rooms?.filter(room => !alerts?.[room.id])?.reduce((prevCount, room) => {
            return prevCount + alerts?.[room.id] || 0;
        }, 0);
        alertsCount = count;
    });
    
    const messagesCount = side.channels.filter(channel => !messages?.[channel.id])?.reduce((prevCount, channel) => {
        return prevCount + alerts?.[channel.id] || 0;
    }, 0);

    console.log(alertsCount, messagesCount)

  return (
    <SideCardItemStyled coverImage={side.coverImage || side.firstCollection?.imageUrl}>
        <div className={`cover-image ${side.joined ? 'pointer' : ''}`} onClick={handleNavigate}>
            <div className="flex align-center title-wrapper">
                <div className="avatar">
                    <img src={side.firstCollection?.imageUrl || FALLBACK_BG_IMG} alt={`${side?.name} avatar`} />
                </div>
                <div className="f-column">
                    <h3 className="title">{side?.name || "{No Name}"}</h3>
                    {side.collectionsCount > 0 && (
                        <div className="collections">
                            <span className="collection">
                                <span>
                                    {side.firstCollection?.collectionName}
                                </span>
                                {side.firstCollection?.safelistRequestStatus === 'verified' && (
                                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.87273 16L4.40455 13.5619L1.62273 12.9524L1.89318 10.1333L0 8L1.89318 5.86667L1.62273 3.04762L4.40455 2.4381L5.87273 0L8.5 1.10476L11.1273 0L12.5955 2.4381L15.3773 3.04762L15.1068 5.86667L17 8L15.1068 10.1333L15.3773 12.9524L12.5955 13.5619L11.1273 16L8.5 14.8952L5.87273 16ZM7.68864 10.7048L12.0545 6.4L10.9727 5.29524L7.68864 8.53333L6.02727 6.93333L4.94545 8L7.68864 10.7048Z" />
                                    </svg>
                                )}
                            </span>
                            {side.collectionsCount > 1 && <span className="more-collections">+{side.collectionsCount - 1}</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="side-content">
            <div className={`side-description ${side.joined ? 'pointer' : ''}`} onClick={handleNavigate}>
                <ClampLines>
                    {side.description}
                </ClampLines>
            </div>
            <div className="side-actions">
                {userSides && side.joined && side.eligible ? (
                    <SideCardUserActions alertsCount={alertsCount} messagesCount={messagesCount} side={side} userProfiles={userProfiles} />
                    ) : (
                    <SideCardJoinActions eligible={side.eligible} onNavigate={handleNavigate} joined={side.joined} onJoin={() => onJoin?.(side)} />
                )}
            </div>
        </div>
    </SideCardItemStyled>
  )
}

export default SideCardItem