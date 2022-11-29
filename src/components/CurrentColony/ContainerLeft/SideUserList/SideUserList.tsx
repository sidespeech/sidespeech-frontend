import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import { Profile } from "../../../../models/Profile";
import { RootState } from "../../../../redux/store/app.store";
import { Dot } from "../../../ui-components/styled-components/shared-styled-components";
import UserBadge from "../../../ui-components/UserBadge";
import defaultPP from "../../../../assets/default-pp.webp";
import copyAll from "../../../../assets/copy_all.svg";
import hexagon from "../../../../assets/hexagon.svg";
import check from "../../../../assets/check.svg";
import {
  ProfilePictureData,
  SpanElipsis,
} from "../../../GeneralSettings/Account/Avatar";
import Button from "../../../ui-components/Button";
import {
  fixURL,
  getRandomId,
  reduceTokenId,
  reduceWalletAddress,
} from "../../../../helpers/utilities";
import {
  subscribeToEvent,
  unSubscribeToEvent,
} from "../../../../helpers/CustomEvent";
import { EventType } from "../../../../constants/EventType";
import { useNavigate } from "react-router-dom";
import {
  setSelectedChannel,
  setSelectedProfile,
} from "../../../../redux/Slices/AppDatasSlice";
import { Collection } from "../../../../models/interfaces/collection";
import { NFT } from "../../../../models/interfaces/nft";
import websocketService from "../../../../services/websocket-services/websocket.service";
import { addRoomToProfile } from "../../../../redux/Slices/UserDataSlice";
import { setSelectedRoom } from "../../../../redux/Slices/ChatSlice";
import { toast } from "react-toastify";
import collectionService from "../../../../services/api-services/collection.service";
import roomService from "../../../../services/api-services/room.service";

export default function SideUserList({
  dots,
  handleSelectedUser,
  selectedUser,
  isMembersList,
}: {
  dots: any;
  handleSelectedUser: any;
  selectedUser: any;
  isMembersList?: boolean;
}) {
  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const { currentProfile } = useSelector((state: RootState) => state.user);
  const [usersStatus, setUsersStatus] = useState<any>({});
  const dispatch = useDispatch();

  const handleUsersStatus = async (m: any) => {
    const { detail } = m;
    setUsersStatus(detail);
  };

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_USERS_STATUS, handleUsersStatus);
    return () => {
      unSubscribeToEvent(EventType.RECEIVE_USERS_STATUS, handleUsersStatus);
    };
  }, [usersStatus, handleUsersStatus]);

  useEffect(() => {}, [currentProfile, currentSide]);

  return (
    <div className="f-column align-start w-100">
      {currentSide?.profiles.map((p: Profile, index: number) => {
        let status;
        const id = getRandomId();
        const isMe = p.id === currentProfile?.id;
        const room = currentProfile?.getRoom(p.id);
        if (isMembersList && room && !isMe) return;
        if (!isMembersList && isMe) return;
        const url = p.profilePicture?.metadata?.image
          ? fixURL(p.profilePicture?.metadata?.image)
          : undefined;

        if (usersStatus[index] && usersStatus[index].user) {
          status = usersStatus[index].user.id == p.user.id ? true : false;
        } else {
          status = false;
        }

        return (
          <>
            <ReactTooltip
              id={id}
              globalEventOff="click"
              place="right"
              className="tooltip-radius"
              backgroundColor="#3a445d"
              effect="float"
              clickable
            >
              <ProfileTooltip profile={p} />
            </ReactTooltip>
            <div
              data-tip
              data-event="click"
              data-for={id}
              key={index}
              onClick={
                isMe ? () => {} : () => handleSelectedUser(p, currentProfile)
              }
              className={`w-100 flex justify-between align-center pl-3 pr-2 py-2 ${
                selectedUser && selectedUser.id === p.id && "selected-channel"
              } ${isMe ? "" : "pointer"}`}
            >
              <div className="flex align-center">
                <UserBadge
                  avatar={url}
                  weight={400}
                  fontSize={11}
                  username={p.user.username}
                  connect={status}
                />
                {isMe && <span className="ml-2">(you)</span>}
              </div>
              {room && !isMe && dots[room.id] > 0 && <Dot>{dots[room.id]}</Dot>}
            </div>
          </>
        );
      })}
    </div>
  );
}

const TooltipContainer = styled.div`
  poisition: absolute;
  right: -20px;
`;
const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  gap: 10px;
`;
const TooltipProfileAvatar = styled.img`
  border: 4px solid rgba(125, 166, 220, 0.1);
  border-radius: 30px;
  max-width: 55px;
  max-height: 55px;
  min-height: 55px;
  min-width: 55px;
`;

const ProfileTooltip = ({ profile }: { profile: Profile }) => {
  const [url, setUrl] = useState<string>(defaultPP);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [nft, setNft] = useState<NFT | null>(null);

  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const { currentProfile, user } = useSelector(
    (state: RootState) => state.user
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getCollection(address: string) {
      const collection = await collectionService.getCollectionByAddress(address);
      setCollection(collection);
    }
    if (
      profile.profilePicture &&
      profile.profilePicture.metadata &&
      profile.profilePicture.metadata.image
    ) {
      setUrl(fixURL(profile.profilePicture.metadata.image));
    }
    if (profile.profilePicture.token_address) {
      getCollection(profile.profilePicture.token_address);
      setNft(profile.profilePicture);
    }
  }, [profile.profilePicture]);

  const handleSelectedUser = async (
    profile: Profile,
    currentProfile: Profile
  ) => {
    try {
      // getting account
      const connectedAccount = window.ethereum.selectedAddress;
      // getting room for given profile id
      let room = currentProfile?.getRoom(profile.id);
      if (!currentProfile || !connectedAccount || !user) return;
      // if room not exist in profile
      if (!room) {
        // creating the room
        room = await roomService.createRoom(currentProfile.id, profile.id);
        // add this room in the user websocket
        websocketService.addRoomToUsers(room.id, [user.id, profile.user.id]);
        // add the room to profile
        dispatch(addRoomToProfile(room));
      }
      // selecting the room
      dispatch(setSelectedRoom(room));
      dispatch(setSelectedChannel(null));
      navigate(`/side/${currentSide?.name}`);
    } catch (error) {
      console.error(error);
      toast.error("There has been an error opening the room", {
        toastId: 20,
      });
    }
  };

  return (
    <TooltipContainer>
      <TooltipContent>
        <div className="flex align-center gap-20 text-main">
          <TooltipProfileAvatar src={url} />
          <div style={{ lineHeight: "19px" }}>
            <div>{profile.user.username}</div>
            <div className="text-inactive">
              {reduceWalletAddress(profile.user.accounts)}
              <img style={{ verticalAlign: "sub" }} src={copyAll} />
            </div>
          </div>
        </div>
        {collection && (
          <ProfilePictureData className="flex align-center text-main">
            <img src={hexagon} className="mr-3 size-12 fw-700" />
            <span title={nft?.token_id + " " + collection.name}>
              <SpanElipsis className="mr-2">#{nft && nft.token_id}</SpanElipsis>
              <span className="">
                {collection &&
                  (collection.name || collection.opensea?.collectionName)}
              </span>
              <img src={check} className="ml-2" />
            </span>
          </ProfilePictureData>
        )}
        <div className="flex" style={{ gap: 11 }}>
          <Button
            children={"Profile"}
            width={"117px"}
            onClick={() => {
              dispatch(setSelectedProfile(profile));
              navigate(`/user/${profile.user.username}`);
            }}
            height={44}
            background={"rgba(125, 166, 220, 0.1)"}
          />
          <Button
            children={"Messages"}
            width={"117px"}
            onClick={() => {
              currentProfile && handleSelectedUser(profile, currentProfile);
            }}
            height={44}
          />
        </div>
      </TooltipContent>
    </TooltipContainer>
  );
};
