import React, { useEffect, useState } from "react";
import InputText from "./InputText";
import styled from "styled-components";
// import { disconnect } from "../../redux/Slices/UserDataSlice";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/app.store";
import { Room } from "../../models/Room";
import {
  fixURL,
  reduceWalletAddress,
  reduceWalletAddressForColor,
} from "../../helpers/utilities";
import { Channel, ChannelType } from "../../models/Channel";
import Icons from "./ChannelIcons";
import { Announcement } from "../../models/Announcement";
import { Link, useNavigate } from "react-router-dom";
import { Poll } from "../../models/Poll";
import { Profile } from "../../models/Profile";
import UserBadge from "./UserBadge";
import defaultPP from "../../assets/default-pp.webp"

const MiddleContainerHeaderStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: var(--bg-primary);
  height: 10vh;
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
          fill: #b4c1d2;
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
    & .settings-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background-color: var(--bg-secondary-light);
      border-radius: 100px;
      padding: .5rem;
    }
  }
`;

interface MiddleContainerHeaderProps {
  channel?: Channel | null;
  className?: string;
  room?: Room | null;
  setThread?: any;
  thread?: any;
}

export default function MiddleContainerHeader({
  channel,
  className,
  room,
  setThread,
  thread,
}: MiddleContainerHeaderProps) {
  const [displayProfile, setDisplayProfile] = useState<boolean>(false);
  const [roomProfile, setRoomProfile] = useState<Profile | null>(null);
  const [url, setUrl] = useState<string>("");
  const navigate = useNavigate();

  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const { user, currentProfile } = useSelector(
    (state: RootState) => state.user
  );

  const Icon = Icons[channel?.type || 0];

  useEffect(() => {
    if (currentSide && room && currentProfile) {
      const ids = room.profileIds;
      const profile = currentSide.profiles.find(
        (p) => ids.includes(p.id) && p.id !== currentProfile.id
      );
      if (profile) {
        setRoomProfile(profile);
      }
    }
  }, [currentSide, room, currentProfile]);

  useEffect(() => {
    if (roomProfile) {
      const url = roomProfile.profilePicture?.metadata?.image
        ? fixURL(roomProfile.profilePicture?.metadata?.image)
        : defaultPP;
      setUrl(url);
    }
  }, [roomProfile]);

  return (
    <MiddleContainerHeaderStyled className={`middle-container-top ${className}`}>
      <div className="left-side">
        {thread && (
          <div className="user-info">
            <button
              onClick={() => navigate(-1)}
              className="back-link flex align-center gap-20 pointer"
            >
              <svg
                className="arrow-icon ml-3"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M-2.29485e-07 5.25L9.13125 5.25L4.93125 1.05L6 -2.62268e-07L12 6L6 12L4.93125 10.95L9.13125 6.75L-2.95052e-07 6.75L-2.29485e-07 5.25Z"
                  fill="white"
                />
              </svg>
              <span>Back</span>
            </button>
            <img
              className="profile-round pointer"
              style={{
                backgroundColor: reduceWalletAddressForColor(
                  thread?.creator || thread?.creatorAddress
                ),
              }}
              alt=""
              src={thread?.creator || thread?.creatorAddress || ""}
            />
            <div className="user-name-address">
              <p className="user-name size-14">
                {thread?.creator || thread?.creatorAddress}
              </p>
              <p className="user-address size-14">13 hours ago</p>
            </div>
          </div>
        )}
        {!thread && room && !channel && roomProfile && (
          <h2 className="room-title">
            <UserBadge
              width={25}
              avatar={url}
              weight={700}
              fontSize={14}
              username={roomProfile.user.username}
            />
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
          iconSize={0.88}
          maxWidth={300}
          onChange={undefined}
          padding={"0px 40px 0px 20px"}
          parentWidth={"300px"}
          placeholder={"Search"}
        />

        <div className="user-info">
          <img
            onClick={() => setDisplayProfile(true)}
            style={{
              backgroundColor: reduceWalletAddressForColor(
                user?.username || ""
              ),
            }}
            className="profile-round pointer"
            alt=""
            src={fixURL(currentProfile?.profilePicture?.metadata?.image || defaultPP)}
          />
          <div className="user-name-address">
            <p className="user-name size-14">{user?.username}</p>
            <p className="user-address size-14">
              {reduceWalletAddress(user?.accounts || "")}
            </p>
          </div>
        </div>

        <Link className="settings-btn" to={`/${currentSide?.['name']}/settings`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.54134 15.7923V11.209H8.45801V13.0423H15.7913V13.959H8.45801V15.7923H7.54134ZM0.208008 13.959V13.0423H4.79134V13.959H0.208008ZM3.87467 10.2923V8.45898H0.208008V7.54232H3.87467V5.70898H4.79134V10.2923H3.87467ZM7.54134 8.45898V7.54232H15.7913V8.45898H7.54134ZM11.208 4.79232V0.208984H12.1247V2.04232H15.7913V2.95898H12.1247V4.79232H11.208ZM0.208008 2.95898V2.04232H8.45801V2.95898H0.208008Z" fill="#B4C1D2"/>
          </svg>
        </Link>
      </div>
    </MiddleContainerHeaderStyled>
  );
}
