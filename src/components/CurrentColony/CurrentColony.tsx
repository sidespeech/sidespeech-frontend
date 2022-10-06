import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { connect, fetchUserDatas } from "../../redux/Slices/UserDataSlice";

import { toast } from "react-toastify";
import { redirect } from "../../redux/Slices/RedirectSlice";
import "./CurrentColony.css";

import { Announcement } from "../../../models/Colony";
import ChannelSettingsModal from "../Modals/ChannelSettingsModal";
import "./AnnouncementList/AnnouncementItem.css";
import AnnouncementList from "./AnnouncementList/AnnouncementList";
import MiddleContainerHeader from "../ui-components/MiddleContainerHeader";
import CurrentColonyLeft from "./ContainerLeft/CurrentColonyLeft";
import {
  setCurrentColony,
  setSelectedChannel,
  updateChannel,
} from "../../redux/Slices/AppDatasSlice";
import { RootState } from "../../redux/store/app.store";
import Polls from "./Polls/Polls";
import Button from "../ui-components/Button";
import CreatePollModal from "../Modals/CreatePollModal";
import InputText from "../ui-components/InputText";
import { off, on } from "../../helpers/CustomEvent";
import { Channel } from "../../models/Colony";
import _ from "lodash";
import AnnouncementItem from "./AnnouncementList/AnnouncementItem";
import ChatComponent from "./ChatComponent/ChatComponent";

export default function CurrentColony() {
  const { id } = useParams();
  const { currentColony, selectedChannel } = useSelector(
    (state: RootState) => state.appDatas
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);

  const [displayEditChannelModal, setDisplayEditChannelModal] =
    useState<boolean>(false);
  const [createPollModal, setCreatePollModal] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [extend, setExtend] = useState<string>("");
  const [sendMessage, setsendMessage] = useState("");

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

  const handleExtendComments = (id: string) => {
    setExtend(id === extend ? "" : id);
  };

  return (
    <div className="flex align-start w-100">
      <CurrentColonyLeft />

      <div className="f-column w-100">
        <MiddleContainerHeader room={selectedRoom} />
        <div className="middle-container-center-colony f-column justify-start">
          <div className="channel-header size-14 fw-700 mb-2">
            <span>
              {" "}
              <i className="fa-solid fa-hashtag mr-2"></i>Announcement
            </span>
          </div>
          <AnnouncementList />
          <div className="w-100" style={{ padding: "11px", marginTop: "auto" }}>
            <InputText
              ref={ref}
              size={14}
              weight={600}
              glass={false}
              message
              id="sendmessage"
              iconRightPos={{ top: 19, right: 18 }}
              height={55}
              radius="10px"
              placeholder={"Type your message here"}
              onChange={(e) => {
                console.log(sendMessage);
                setsendMessage(e.target.value);
              }}
            />
          </div>

          {selectedRoom ? (
            <ChatComponent room={selectedRoom} />
          ) : (
            <>
              {selectedChannel && (
                <>
                  <div className="channel-header size-14 fw-700 mb-2">
                    <span>
                      <i className="fa-solid fa-hashtag mr-2"></i>
                      {"Announcement"}
                      {selectedChannel?.name}
                    </span>
                    <i
                      className="fa-solid fa-ellipsis pointer"
                      onClick={undefined}
                    ></i>
                  </div>
                  {selectedChannel.type === "announcement" ||
                  selectedChannel.type === "textual" ? (
                    <>
                      <AnnouncementList />
                      <div
                        className="w-100"
                        style={{ padding: "11px", marginTop: "auto" }}
                      >
                        <InputText
                          ref={ref}
                          size={14}
                          weight={600}
                          glass={false}
                          iconRightPos={{ top: 19, right: 18 }}
                          height={55}
                          radius="10px"
                          placeholder={""}
                          onClick={console.log(15)}
                        />
                      </div>
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
      {displayEditChannelModal && selectedChannel && currentColony && (
        <ChannelSettingsModal
          showModal={setDisplayEditChannelModal}
          selectedChannel={selectedChannel}
          currentColony={currentColony}
        />
      )}
      {createPollModal && selectedChannel && currentColony && (
        <CreatePollModal showModal={setCreatePollModal} />
      )}
    </div>
  );
}
