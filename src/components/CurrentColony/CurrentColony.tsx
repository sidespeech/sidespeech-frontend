import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CurrentColony.css";
import ChannelSettingsModal from "../Modals/ChannelSettingsModal";
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
import InputText from "../ui-components/InputText";
import _ from "lodash";
import { apiService } from "../../services/api.service";
import ChatComponent from "./ChatComponent/ChatComponent";
import { Announcement } from "../../models/Announcement";
import { ChannelType } from "../../models/Channel";

export default function CurrentColony() {
  const { currentSide, selectedChannel } = useSelector(
    (state: RootState) => state.appDatas
  );
  const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);

  const [displayEditChannelModal, setDisplayEditChannelModal] =
    useState<boolean>(false);
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
      const res = await apiService.getSideById(
        "a70454a7-458e-4da4-96d9-e4b1b7a8d14b"
      );
      dispatch(setCurrentColony(res));
      console.log(res);
      dispatch(setSelectedChannel(res.channels[0]));
    }
    getSide();
  }, []);

  const handleExtendComments = (id: string) => {
    setExtend(id === extend ? "" : id);
  };

  // This will handle sending an announcement to the api.

  // This will handle sending an announcement to the api.
  const handleComment = (value: string) => {
    // This will need to be made dynamic.
    const creatorAddress = "0xFa446636A9e57ab763C1C70F80ea3c7C3969F397";

    apiService.sendComment(value, creatorAddress);
  };

  return (
    <div className="flex align-start w-100">
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
      {displayEditChannelModal && selectedChannel && currentSide && (
        <ChannelSettingsModal
          showModal={setDisplayEditChannelModal}
          selectedChannel={selectedChannel}
          currentColony={currentSide}
        />
      )}
      {createPollModal && selectedChannel && currentSide && (
        <CreatePollModal showModal={setCreatePollModal} />
      )}
    </div>
  );
}
