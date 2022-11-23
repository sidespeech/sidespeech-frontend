import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import AnnouncementList from "./AnnouncementList/AnnouncementList";
import MiddleContainerHeader from "../ui-components/MiddleContainerHeader";
import CurrentSideLeft from "./ContainerLeft/CurrentSideLeft";
import {
  setCurrentColony,
  setSelectedChannel,
} from "../../redux/Slices/AppDatasSlice";
import { RootState } from "../../redux/store/app.store";
import Button from "../ui-components/Button";
import CreatePollModal from "../Modals/CreatePollModal";
// import InputText from "../ui-components/InputText";
import _ from "lodash";
// import { apiService } from "../../services/api.service";
import ChatComponent from "./ChatComponent/ChatComponent";
import { Announcement } from "../../models/Announcement";
import { ChannelType } from "../../models/Channel";
import { setCurrentProfile, connect } from "../../redux/Slices/UserDataSlice";
// import websocketService from "../../services/websocket.service";
import { sideAPI } from "../../services/side.service";

import { useNavigate, useParams } from "react-router-dom";
import { Poll } from "../../models/Poll";

import { Outlet, useOutletContext } from "react-router-dom";
import CurrentSideMiddle from "./CurrentSideMiddle/CurrentSideMiddle";
import { SideStatus } from "../../models/Side";
import { toast } from "react-toastify";
import { checkUserEligibility } from "../../helpers/utilities";
import SideEligibilityModal from "../Modals/SideEligibilityModal";

const CurrentSideStyled = styled.div`
  .selected-channel {
    border-radius: 10px;
    background-color: var(--bg-primary);
  }
  .middle-container-center-colony {
    height: 90vh;
    display: flex;
    width: 100%;
    align-items: start;
  }
  .channel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: var(--text-secondary);
    padding: 11px 11px 11px 27px;
    border-bottom: 1px solid var(--bg-primary);
  }
  #announcement-list {
    padding: 0px 1rem;
  }

  .profile-round-small > img {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 8px;
  }
  .profile-round-small {
    width: 20px;
    height: 20px;
    background-color: var(--bg-secondary-dark);
    border-radius: 10px;
    position: relative;
  }
  .user-status {
    left: -11px;
    position: relative;
    z-index: 9;
    top: 6px;
    width: 8px;
  }

  .user-status img {
    width: 100%;
  }
  .edit-channel > div {
    padding: 9px 18px;
  }
  .edit-channel {
    width: 100%;
    min-height: 96px;
    border-radius: 10px;
  }
  .member-list {
    background-color: var(--bg-primary);
    width: 100%;
    min-height: 96px;
    border-radius: 10px;
  }
`;

type ContextMiddleSide = {
  selectedRoom: any;
  selectedChannel: any;
  announcementId: any;
  setThread: any;
  thread: any;
  setCreatePollModal: any;
};

export default function CurrentSide() {
  const { announcementId, id } = useParams();
  const { currentSide, selectedChannel } = useSelector(
    (state: RootState) => state.appDatas
  );
  const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);
  const userData = useSelector((state: RootState) => state.user);

  // const [displayEditChannelModal, setDisplayEditChannelModal] = useState<boolean>(false);
  const [createPollModal, setCreatePollModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef<HTMLInputElement>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [extend, setExtend] = useState<string>("");
  const [thread, setThread] = useState<Announcement | Poll | null>(null);
  const [displayEligibility, setDisplayEligibility] = useState<boolean>(false);
  const [sideEligibility, setSideEligibility] = useState<any>(null);

  useEffect(() => {
    if (!announcementId) setThread(null);
  }, [announcementId]);

  useEffect(() => {
    if (selectedChannel && selectedChannel.announcements) {
      setAnnouncements([
        ..._.orderBy(selectedChannel.announcements, "createdAt"),
      ]);
    }
  }, [selectedChannel]);

  useEffect(() => {
    function updateScroll() {
      var element = document.getElementById("announcement-list");
      if (element) element.scrollTop = element.scrollHeight;
    }
    updateScroll();
  }, [announcements]);

  useEffect(() => {
    async function getSide() {
      try {
        const isConnectedLocalStorage = localStorage.getItem("userAccount");

        // If user not connected
        if (!isConnectedLocalStorage) navigate("/");
        // If user connected and there is name Side in the url
        else if (id) {
          // Get Side data
          const res = await sideAPI.getSideByName(id);
          
          const isInTheSide = userData['user']!['profiles'].find(item => item['side']['id'] === res['id']);

          // If side is inactive
          if (res.status === SideStatus.inactive) {
            toast.info("This side is currently inactive", { toastId: 36 });
          }

          // If side is active and the user is already in the Side
          else if (isInTheSide) {
            dispatch(setCurrentColony(res));
            dispatch(
              setSelectedChannel(
                res.channels.find((c) => c.type === 0) || res.channels[0]
              )
            );
          } 

          // If side is active but the user is not in the Side
          else {
            setSideEligibility(res);
            setDisplayEligibility(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    getSide();
  }, [id, userData]);

  useEffect(() => {
    if (userData.user && currentSide) dispatch(setCurrentProfile(currentSide));
  }, [userData.user, currentSide]);

  const handleExtendComments = (id: string) => {
    setExtend(id === extend ? "" : id);
  };

  return (
    <CurrentSideStyled className="flex align-start w-100">
      {currentSide?.status === SideStatus.active ? (
        <>
          <CurrentSideLeft />

          <div className="f-column w-100">
            <MiddleContainerHeader
              channel={selectedChannel}
              room={selectedRoom}
              setThread={setThread}
              thread={thread}
            />
            <Outlet
              context={{
                selectedRoom,
                selectedChannel,
                announcementId,
                setThread,
                thread,
                setCreatePollModal,
              }}
            />
          </div>
          {createPollModal && selectedChannel && currentSide && (
            <CreatePollModal showModal={setCreatePollModal} />
          )}
        </>
      ) : (displayEligibility && sideEligibility) ? (
        <SideEligibilityModal
        setDisplayLeaveSide={() => {}}
        setDisplayEligibility={setDisplayEligibility}
        selectedSide={sideEligibility}
      />
      ) :
      <div>This side is currently inactive</div>
      }
    </CurrentSideStyled>
  );
}

export function useMiddleSide() {
  return useOutletContext<ContextMiddleSide>();
}
