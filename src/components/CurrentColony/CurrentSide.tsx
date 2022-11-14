import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';
import "./AnnouncementList/AnnouncementItem.css";
import AnnouncementList from "./AnnouncementList/AnnouncementList";
import MiddleContainerHeader from "../ui-components/MiddleContainerHeader";
import CurrentColonyLeft from "./ContainerLeft/CurrentColonyLeft";
import {
  setCurrentColony,
  setSelectedChannel,
} from "../../redux/Slices/AppDatasSlice";
import { RootState } from "../../redux/store/app.store";
import Polls from "./Polls/Polls";
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
import { useParams } from "react-router-dom";

const CurrentSideStyled = styled.div`
  .selected-channel {
    border-radius: 10px;
    background-color: var(--bg-primary);
  }
  .middle-container-center-colony {
    height: calc(100vh - 51px);
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
  .annoucement-item {
    width: 100%;
    /* min-height: 104px; */
    border-bottom: 1px solid var(--bg-secondary-light);
    padding: 13px 16px 17px 16px;
    gap: 8px;
    color: var(--text-secondary);
  }
  #announcement-list {
    padding: 0px 32px 0px 27px;
  }

  .profile-round-small > img {
    position: absolute;
    bottom: -2px;
    right: -2px;
  }
  .profile-round-small {
    width: 20px;
    height: 20px;
    background-color: var(--bg-secondary-dark);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
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

export default function CurrentSide() {
  const { id } = useParams();
  const { currentSide, selectedChannel } = useSelector(
    (state: RootState) => state.appDatas
  );
  const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);
  const userData = useSelector((state: RootState) => state.user);

  // const [displayEditChannelModal, setDisplayEditChannelModal] = useState<boolean>(false);
  const [createPollModal, setCreatePollModal] = useState<boolean>(false);

  const dispatch = useDispatch();
  const ref = useRef<HTMLInputElement>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [extend, setExtend] = useState<string>("");

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
      if (id) {
        const res = await sideAPI.getSideById(id);
        dispatch(setCurrentColony(res));
        dispatch(
          setSelectedChannel(
            res.channels.find((c) => c.type === 0) || res.channels[0]
          )
        );
      }
    }
    getSide();
  }, [id]);

  useEffect(() => {
    if (userData.user && currentSide) dispatch(setCurrentProfile(currentSide));
  }, [userData.user, currentSide]);

  const handleExtendComments = (id: string) => {
    setExtend(id === extend ? "" : id);
  };

  return (
    <CurrentSideStyled className="flex align-start w-100">
      <CurrentColonyLeft />

      <div className="f-column w-100">
        <MiddleContainerHeader room={selectedRoom} />

        <div className="middle-container-center-colony f-column justify-start">
          {selectedRoom ? (
            <ChatComponent room={selectedRoom} />
          ) : (
            <>
              {selectedChannel && (
                <>
                  <div className="channel-header size-14 fw-700 mb-2">
                    <span>
                      <i className="fa-solid fa-hashtag mr-2"></i>
                      {selectedChannel?.name}
                    </span>
                    <i
                      className="fa-solid fa-ellipsis pointer"
                      onClick={undefined}
                    ></i>
                  </div>
                  {selectedChannel.type === ChannelType.Announcement ||
                  selectedChannel.type === ChannelType.Textual ? (
                    <>
                      <AnnouncementList />
                    </>
                  ) : (
                    <>
                      <Polls />
                      <div
                        className="w-100"
                        style={{ padding: "11px", marginTop: "auto" }}
                      >
                        <Button
                          classes="mt-auto mx-auto mb-2"
                          onClick={() => setCreatePollModal(true)}
                        >
                          Create Poll
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {createPollModal && selectedChannel && currentSide && (
        <CreatePollModal showModal={setCreatePollModal} />
      )}
    </CurrentSideStyled>
  );
}
