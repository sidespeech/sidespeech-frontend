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
import { ProfilePictureData } from "../../../GeneralSettings/Account/Avatar";
import Button from "../../../ui-components/Button";
import { fixURL, reduceWalletAddress } from "../../../../helpers/utilities";
import { useNavigate } from "react-router-dom";
import { setSelectedChannel, setSelectedProfile } from "../../../../redux/Slices/AppDatasSlice";

export default function SideUserList({
  dots,
  handleSelectedUser,
  selectedUser,
}: {
  dots: any;
  handleSelectedUser: any;
  selectedUser: any;
}) {
  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const { currentProfile } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {}, [currentProfile, currentSide]);

  return (
    <div className="f-column align-start w-100">
      {currentSide?.profiles.map((p: Profile, index: number) => {
        const isMe = p.id === currentProfile?.id;
        const room = currentProfile?.getRoom(p.id);
        const url = p.profilePicture?.metadata?.image
          ? fixURL(p.profilePicture?.metadata?.image)
          : undefined;
        return (
          <>
            <ReactTooltip
              id={p.id}
              globalEventOff="click"
              place="right"
              className="tooltip-radius"
              backgroundColor="#3a445d"
              effect="float"
              clickable
            >
              <ProfileTooltip   profile={p} />
            </ReactTooltip>
            <div
              data-tip
              data-event="click"
              data-for={p.id}
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
                  address={p.username}
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      profile.profilePicture &&
      profile.profilePicture.metadata &&
      profile.profilePicture.metadata.image
    ) {
      setUrl(fixURL(profile.profilePicture.metadata.image));
    }
  }, [profile.profilePicture]);

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
        <ProfilePictureData className="flex align-center text-main">
          <img src={hexagon} className="mr-3 size-12 fw-700" />
          <span>
            <span className="mr-2">#{4789}</span>
            <span className="">{"Moonbirds"}</span>
            <img src={check} className="ml-2" />
          </span>
        </ProfilePictureData>
        <div className="flex" style={{ gap: 11 }}>
          <Button
            children={"Profile"}
            width={"117px"}
            onClick={() => {
              dispatch(setSelectedProfile(profile));
              navigate(`profile/${profile.user.username}`);
            }}
            height={44}
            background={"rgba(125, 166, 220, 0.1)"}
          />
          <Button
            children={"Messages"}
            width={"117px"}
            onClick={undefined}
            height={44}
          />
        </div>
      </TooltipContent>
    </TooltipContainer>
  );
};
