import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import ChannelsList from "./ChannelsList/ChannelsList";
import SideUserList from "./SideUserList/SideUserList";
import ContainerLeft from "../../ui-components/ContainerLeft";
import { subscribeToEvent, unSubscribeToEvent } from "../../../helpers/CustomEvent";
import { EventType } from "../../../constants/EventType";
import { Announcement } from "../../../models/Announcement";
import { addRoomToProfile } from "../../../redux/Slices/UserDataSlice";

const CoverImg = styled.img`
  height: 130px;
  width: 100%;
  object-fit: cover;
  margin-top: 22px;
`;

const SeparationLine = styled.hr`
  width: 100%;
  height: 1px;
  background-color: var(--bg-secondary);
  margin: 0px;
`;

export default function CurrentColonyLeft() {
  const { account } = useSelector((state: RootState) => state.user);
  const [displayColonySettings, setDisplayColonySettings] =
    useState<boolean>(false);
  const [displayNewChannelModal, setDisplayNewChannelModal] =
    useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMod, setIsMod] = useState<boolean>(false);
  const [displayUserProfile, setDisplayUserProfile] = useState<boolean>(false);
  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const dispatch = useDispatch();


  // Variables for notifications Channels
  const [dotsChannel, setDotsChannel] = useState<any>({});
  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

  // Variables for notifications Private Message
  const [dotsPrivateMessage, setDotsPrivateMessage] = useState<any>({});
  const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);


  const navigate = useNavigate();

  const handleDisplayNewChannel = () => {
    if (isAdmin) {
      setDisplayNewChannelModal(true);
    }
  };

  const onChannelSelected = (c: Channel) => {
    dispatch(setSelectedChannel(c));
    dispatch(setSelectedRoom(null));
    setSelectedUser(null)
  };

  const handleSelectedUser = async (profile: Profile, currentProfile:Profile) => {
    // set selected user
    setSelectedUser(profile);
    // getting account
    const connectedAccount = localStorage.getItem("userAccount");
    // getting room for given profile id
    let room = currentProfile?.getRoom(profile.id);
    if (!currentProfile || !connectedAccount) return;
    // if room not exist in profile
    if (!room) {
      // creating the room
      room = await apiService.createRoom(currentProfile.id, profile.id);
      // add this room in the user websocket
      websocketService.addRoomToUsers(room.id, [currentProfile.id, profile.id]);
      // add the room to profile
      dispatch(addRoomToProfile(room));
    }
    // selecting the room
    dispatch(setSelectedRoom(room));
    dispatch(setSelectedChannel(null));
  };

  const handleDisplayColonySettings = () => {
    if (isAdmin) setDisplayColonySettings(true);
  };

  const handleReceiveAnnouncement = ({ detail }: { detail: Announcement }) => {
    const account = localStorage.getItem('userAccount')
    if (account) getAndSetRoomNotifications(account, true)
  };

  const handleReceiveMessage = async (m: any) => {
    const { detail } = m;
    const account = localStorage.getItem('userAccount')
    if (account) getAndSetRoomNotifications(account, true)
  };

  // Function to get notification from db and assign them to the state variable
  async function getAndSetRoomNotifications(account:string, from_ws=false) {
    const notifications = await apiService.getNotification(account!);
    let dotsPrivateMessageCopy:any = {...dotsPrivateMessage}
    let dotsChannelCopy:any = {...dotsChannel}
    for (let notification of notifications) {
      if (notification['type'] === 1) {
        if (!selectedChannel && notification['name'] in dotsChannelCopy) dotsChannelCopy[notification.name] += 1
        else if (selectedChannel && notification['name'] === selectedChannel!.id) {
          dotsChannelCopy[notification['name']] = 0
          if (!from_ws) await apiService.deleteNotification(selectedChannel!.id, account!);
        }
        else dotsChannelCopy[notification['name']] = 1
      } else {
        if (!selectedRoom && notification['name'] in dotsPrivateMessageCopy) dotsPrivateMessageCopy[notification.name] += 1
        else if (selectedRoom && notification['name'] === selectedRoom!.id) {
          dotsPrivateMessageCopy[notification['name']] = 0
          if (!from_ws) await apiService.deleteNotification(selectedRoom!.id, account!);
        }
        else dotsPrivateMessageCopy[notification['name']] = 1
      }
    }
    if (JSON.stringify(dotsPrivateMessageCopy) !== JSON.stringify(dotsPrivateMessage)) setDotsPrivateMessage(dotsPrivateMessageCopy);
    if (JSON.stringify(dotsChannelCopy) !== JSON.stringify(dotsChannel)) setDotsChannel(dotsChannelCopy);

  }

  // LISTENING WS =====================================================================
  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    return () => {
      unSubscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  });

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
    return () => {
      unSubscribeToEvent(
        EventType.RECEIVE_ANNOUNCEMENT,
        handleReceiveAnnouncement
      );
    };
  });
  // LISTENING WS =====================================================================

  useEffect(() => {
    setIsAdmin(currentSide?.creatorAddress === account);
  }, [currentSide, account]);

  useEffect(() => {
    const account = localStorage.getItem('userAccount')
    if (account) getAndSetRoomNotifications(account)
  }, [selectedRoom, selectedChannel]);

  if (!currentSide) return <>No side selected</>;

  return (
    <ContainerLeft backgroundColor="var(--bg-secondary-light)" minWidth={210} height={100}>
      <div className="w-100 flex align-center justify-between px-2">
        <span className="fw-700 size-13 open-sans flex align-center text-secondary">
          {currentSide.name.toUpperCase()}
          {/* <img alt="check" className="ml-2" src={check} /> */}
        </span>
        <i
          className="fa-solid fa-ellipsis pointer"
          // onClick={handleDisplayColonySettings}
          onClick={() => navigate(`/${currentSide['id']}/admin-settings`)}
          style={{ marginLeft: "auto" }}
        ></i>
      </div>

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

      <ChannelsList channels={currentSide.channels} dots={dotsChannel} onChannelSelected={onChannelSelected} />
      <SeparationLine style={{ margin: "18px 0px 11px 0px" }} />
      <div className="w-100 flex align-center justify-between px-2 mt-3 text-secondary-dark">
        <span className="fw-400 size-11 flex align-center">Members</span>
        <i className="fa-solid fa-plus "></i>
      </div>
      <div className="w-100 f-column align-start justify-start px-2 mt-3">
        <span className="fw-700 size-9 flex align-center text-blue">USER</span>
        <div className="f-column align-start ml-2 pt-1 w-100">
          <SideUserList dots={dotsPrivateMessage} handleSelectedUser={handleSelectedUser} selectedUser={selectedUser} />
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
