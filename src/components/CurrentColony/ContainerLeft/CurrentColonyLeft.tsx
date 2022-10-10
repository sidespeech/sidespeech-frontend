import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Channel } from "../../../models/Channel";
import { Profile } from "../../../models/Profile";
import { setSelectedChannel } from "../../../redux/Slices/AppDatasSlice";
import { setSelectedRoom } from "../../../redux/Slices/ChatSlice";
import { RootState } from "../../../redux/store/app.store";
import { apiService } from "../../../services/api.service";
import websocketService from "../../../services/websocket.service";
import ColonySettingsModal from "../../Modals/ColonySettingsModal";
import CreateChannelModal from "../../Modals/CreateChannelModal";
import ViewUserProfile from "../../Modals/ViewUserProfile";
import UserBadge from "../../ui-components/UserBadge";
import SideUserList from "./SideUserList/SideUserList";

const CoverImg = styled.img`
  height: 130px;
  width: 100%;
  object-fit: cover;
  margin-top: 22px;
`;
const ContainerLeft = styled.div`
  min-width: 210px;
  background-color: var(--bg-secondary-light);
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 11px;
  color: var(--text-primary-light);
`;

const SeparationLine = styled.hr`
  width: 100%;
  height: 1px;
  background-color: var(--bg-secondary);
  margin: 0px;
`;

export default function CurrentColonyLeft() {
  const { currentSide, selectedChannel } = useSelector(
    (state: RootState) => state.appDatas
  );
  const { user, currentProfile } = useSelector(
    (state: RootState) => state.user
  );
  const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);
  const [displayColonySettings, setDisplayColonySettings] =
    useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [displayNewChannelModal, setDisplayNewChannelModal] =
    useState<boolean>(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMod, setIsMod] = useState<boolean>(false);
  const [displayUserProfile, setDisplayUserProfile] = useState<boolean>(false);

  const dispatch = useDispatch();

  const onChannelSelected = (c: Channel) => {
    dispatch(setSelectedChannel(c));
    dispatch(setSelectedRoom(null));
  };

  useEffect(() => {
    if (currentSide) {
      setChannels(
        _.orderBy(currentSide?.channels, ["isVisible", "name"], ["desc", "asc"])
      );
    }
  }, [currentSide]);

  const handleDisplayNewChannel = () => {
    if (isAdmin) {
      setDisplayNewChannelModal(true);
    }
  };

  const handleDisplayColonySettings = () => {
    if (isAdmin) setDisplayColonySettings(true);
  };

  return (
    <ContainerLeft>
      <div className="w-100 flex align-center justify-between px-2">
        <span className="fw-700 size-13 open-sans flex align-center text-secondary">
          {currentSide?.name.toUpperCase()}
          {/* <img alt="check" className="ml-2" src={check} /> */}
        </span>
        <i
          className="fa-solid fa-ellipsis pointer"
          onClick={handleDisplayColonySettings}
          style={{ marginLeft: "auto" }}
        ></i>
      </div>
      <CoverImg src={currentSide?.coverImage} alt="cover-image" />

      <div className="w-100 flex align-center justify-between px-2 mt-3 text-secondary-dark">
        <span className="fw-400 size-11 flex align-center">
          <i className="fa-solid fa-circle-chevron-right mr-2"></i>
          Channels
        </span>

        <i
          className="fa-solid fa-plus pointer"
          onClick={handleDisplayNewChannel}
        ></i>
      </div>

      <div className="mt-2">
        {channels.map((c, index) => {
          return (
            <div
              onClick={() => onChannelSelected(c)}
              key={index}
              className={`w-100 flex align-center justify-between px-2 mt-1 pointer ${
                selectedChannel &&
                selectedChannel.id === c.id &&
                "selected-channel"
              }`}
            >
              <span className="fw-600 size-12 flex align-center px-1 py-1">
                {c.isVisible ? (
                  <i className="fa-solid fa-hashtag mr-2"></i>
                ) : (
                  <i className="fa-solid fa-lock mr-2"></i>
                )}

                {c.name}
              </span>
            </div>
          );
        })}
      </div>
      <SeparationLine style={{ margin: "18px 0px 11px 0px" }} />
      <div className="w-100 flex align-center justify-between px-2 mt-3 text-secondary-dark">
        <span className="fw-400 size-11 flex align-center">Members</span>
        <i className="fa-solid fa-plus "></i>
      </div>
      <div className="w-100 f-column align-start justify-start px-2 mt-3">
        <span className="fw-700 size-9 flex align-center text-blue">USER</span>
        <div className="f-column align-start ml-2 pt-1 w-100">
          <SideUserList />
        </div>
      </div>

      {currentSide && displayColonySettings && (
        <ColonySettingsModal
          showModal={setDisplayColonySettings}
          currentColony={currentSide}
        />
      )}
      {currentSide && selectedUser && displayUserProfile && (
        <ViewUserProfile
          profile={selectedUser}
          colony={currentSide}
          showModal={setDisplayUserProfile}
        />
      )}
      {displayNewChannelModal && (
        <CreateChannelModal showModal={setDisplayNewChannelModal} />
      )}
    </ContainerLeft>
  );
}
