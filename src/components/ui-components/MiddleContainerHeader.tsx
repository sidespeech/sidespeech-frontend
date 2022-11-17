import React, { useState } from "react";
import InputText from "./InputText";
import styled from 'styled-components';
// import { disconnect } from "../../redux/Slices/UserDataSlice";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/app.store";
import { Room } from "../../models/Room";
import { fixURL, reduceWalletAddress, reduceWalletAddressForColor } from "../../helpers/utilities";
import { Channel, ChannelType } from "../../models/Channel";
import Icons from "./ChannelIcons";
import { Announcement } from "../../models/Announcement";
import { useNavigate } from "react-router-dom";

const MiddleContainerHeaderStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: var(--bg-primary);
  height: 10vh;
  width: calc(100vw - 71px - 210px);
  color: var(--text-secondary);
  padding: 0 2rem;
  &::placeholder {
    color: var(--text-secondary);
    font-size: 15px;
    font-weight: 400;
  }

  & .left-side { 
    width: 50%;
    .room-title,
    .channel-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .channel-title {
      display: flex;
      align-items: center;
      & h2 {
        margin: 0;
      }
      & svg {
        transform: scale(1.4);
        & > path {
          fill: #B4C1D2;
        }
      }
    }
  }

  & .right-side {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    width: 50%;
  }
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
    height: 100%;
    .back-link {
      background-color: transparent;
      border: none;
      outline: none;
      box-shadow: none;
      padding: 0;
      .arrow-icon {
        transform: rotate(180deg);
      }
    }
    .profile-round {
      flex-shrink: 0;
      margin: 0;
    }
    .user-name-address {
      display: flex;
      flex-direction: column;
      .user-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100px;
      }
      .user-address {
        color: var(--text-secondary-dark);
      }
    }
  }
`;

interface MiddleContainerHeaderProps { 
  channel?: Channel | null; 
  room?: Room | null; 
  setThread?: any;
  thread?: Announcement | null;
}

export default function MiddleContainerHeader({ channel, room, setThread, thread }: MiddleContainerHeaderProps) {
  const [displayProfile, setDisplayProfile] = useState<boolean>(false);
  const navigate = useNavigate();

  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const { user, currentProfile } = useSelector(
    (state: RootState) => state.user
  );

  const Icon = Icons[channel?.type || 0];

  const currentUser = user?.profiles?.find((a) => a.side?.id === currentSide?.id);

  return (
    <MiddleContainerHeaderStyled className="middle-container-top">
      <div className="left-side">
        {thread && (
          <div className="user-info">
            <button onClick={() => navigate(-1)} className="back-link flex align-center gap-20 pointer">
              <svg className="arrow-icon ml-3" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-2.29485e-07 5.25L9.13125 5.25L4.93125 1.05L6 -2.62268e-07L12 6L6 12L4.93125 10.95L9.13125 6.75L-2.95052e-07 6.75L-2.29485e-07 5.25Z" fill="white"/>
              </svg>
              <span>Back</span>
            </button>
            <img
              className="profile-round pointer"
              style={{ backgroundColor: reduceWalletAddressForColor(thread?.creatorAddress)}}
              alt=""
              src={thread?.creatorAddress || ""}
            />
            <div className="user-name-address">
              <p className="user-name size-14">{thread?.creatorAddress}</p>
              <p className="user-address size-14">13 hours ago</p>
            </div>  
          </div>
        )} 
        {!thread && room && !channel && (
          <h2 className="room-title">
            {room.getRoomNameForUser(currentProfile?.username)}
          </h2>
        )}
        {!thread && channel && (
          <div className="channel-title">
            <Icon className="mr-3" />
            <h2>{channel.name}</h2>
          </div>
        )}
      </div>

      <div className="right-side">
        <InputText
          bgColor="rgba(0, 0, 0, 0.2)"
          color="var(--white)"
          glass
          height={35}
          iconColor="var(--white)"
          iconRightPos={{ top: 6, right: 24 }}
          iconSize={.88}
          maxWidth={300}
          onChange={undefined}
          padding={"0px 40px 0px 20px"}
          parentWidth={"300px"}
          placeholder={"Search"}
        />
        
        <div className="user-info">
          <img
            onClick={() => setDisplayProfile(true)}
            style={{ backgroundColor: reduceWalletAddressForColor(currentUser?.username || '')}}
            className="profile-round pointer"
            alt=""
            src={fixURL(currentUser?.profilePicture?.token_uri || "")}
          />
          <div className="user-name-address">
            <p className="user-name size-14">{currentUser?.username}</p>
            <p className="user-address size-14">{reduceWalletAddress(currentUser?.username || '')}</p>
          </div>  
        </div>
      </div>
    </MiddleContainerHeaderStyled>
  );
}
