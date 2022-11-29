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
import ChatComponent from "./ChatComponent/ChatComponent";
import { Announcement } from "../../models/Announcement";
import { ChannelType } from "../../models/Channel";
import { setCurrentProfile, connect } from "../../redux/Slices/UserDataSlice";
// import websocketService from "../../services/websocket.service";

import { useNavigate, useParams } from "react-router-dom";
import { Poll } from "../../models/Poll";

import { Outlet, useOutletContext } from "react-router-dom";
// import CurrentSideMiddle from "./CurrentSideMiddle/CurrentSideMiddle";
import { SideStatus } from "../../models/Side";
import { toast } from "react-toastify";
// import { checkUserEligibility } from "../../helpers/utilities";
import SideEligibilityModal from "../Modals/SideEligibilityModal";
import { breakpoints, size } from "../../helpers/breakpoints";
import sideService from "../../services/api-services/side.service";

const CurrentSideStyled = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  ${breakpoints(
    size.lg,
    `{
    flex-direction: row;
    align-items: flex-start;
    width: calc(100vw - 70px);
  }`
  )}
  .current-side-middle-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: calc(100vh - 8rem - 77px);
    ${breakpoints(
      size.lg,
      `{
      height: 100vh;
    }`
    )}
  }
  .middle-container-center-colony {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    align-items: start;
    flex-grow: 1;
    ${breakpoints(
      size.lg,
      `{
      max-height: 100%;
    }`
    )}
  }
  .header-desktop {
    display: none;
    ${breakpoints(
      size.lg,
      `{
      display: flex;
    }`
    )}
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
  const { currentSide, selectedChannel, settingsOpen } = useSelector(
    (state: RootState) => state.appDatas
  );
  const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);
  const { user } = useSelector((state: RootState) => state.user);

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
    return () => {
      dispatch(setCurrentColony(null));
      dispatch(setCurrentProfile(null));
    };
  }, []);

  useEffect(() => {
    async function getSide() {
      try {
        if (id && user) {
          // Get Side data
          const res = await sideService.getSideByName(id);

          const isInTheSide = user["profiles"].find(
            (item) => item["side"]["id"] === res["id"]
          );

          // If side is inactive
          if (res.status === SideStatus.inactive) {
            toast.info("This side is currently inactive", { toastId: 36 });
          }

          // If side is active and the user is already in the Side
          else if (isInTheSide) {
            dispatch(setCurrentColony(res));
            dispatch(setCurrentProfile(res));
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
    const isConnectedLocalStorage = localStorage.getItem("userAccount");

    console.log(currentSide, isConnectedLocalStorage);
    // If user not connected
    if (!isConnectedLocalStorage) navigate("/");
    else getSide();
  }, [id, user]);

  const handleExtendComments = (id: string) => {
    setExtend(id === extend ? "" : id);
  };

  return (
    <CurrentSideStyled>
      {currentSide?.status === SideStatus.active ? (
        <>
          {!settingsOpen && (
            <CurrentSideLeft
              channel={selectedChannel}
              room={selectedRoom}
              setThread={setThread}
              thread={thread}
            />
          )}

          <div className="current-side-middle-container">
            <MiddleContainerHeader
              channel={selectedChannel}
              className="header-desktop"
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
      ) : displayEligibility && sideEligibility ? (
        <SideEligibilityModal
          setDisplayLeaveSide={() => {}}
          setDisplayEligibility={setDisplayEligibility}
          selectedSide={sideEligibility}
        />
      ) : (
        <div>This side is currently inactive</div>
      )}
    </CurrentSideStyled>
  );
}

export function useMiddleSide() {
  return useOutletContext<ContextMiddleSide>();
}
