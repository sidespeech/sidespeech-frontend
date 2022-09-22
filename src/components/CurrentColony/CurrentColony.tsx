import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { connect, fetchUserDatas } from "../../redux/Slices/UserDataSlice";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import { redirect } from "../../redux/Slices/RedirectSlice";
import "./CurrentColony.css";
import moralisService from "../../service/moralis.service";
import ChannelSettingsModal from "../Modals/ChannelSettingsModal";
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

export default function CurrentColony() {
  const { id } = useParams();
  const { currentColony, selectedChannel } = useSelector(
    (state: RootState) => state.appDatas
  );
  const {user} = useSelector(
    (state: RootState) => state.user
  );

  const [displayEditChannelModal, setDisplayEditChannelModal] =
    useState<boolean>(false);
  const [createPollModal, setCreatePollModal] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const { Moralis, isAuthenticated } = useMoralis();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentColony && currentColony.members) {
      const groupedMembers = _.groupBy(currentColony.members, (m) =>
        m.get("role").get("name")
      );
      const address = user.get("ethAddress");
      const admins = groupedMembers.Administrator;
      const isAdmin = admins.some((a:any) => a.get('user').get('ethAddress') === address);
      setIsAdmin(isAdmin);
    }
  }, [currentColony, user])
  

  useEffect(() => {
    const currentUser = Moralis.User.current();
    if (currentUser) {
      dispatch(
        connect({
          user: currentUser,
          account: currentUser.attributes.ethAddress,
        })
      );
      dispatch(fetchUserDatas(currentUser.attributes.ethAddress));
    } else {
      dispatch(redirect(id));
      toast.info("Connect to join the colony", { toastId: 2 });
      navigate("/");
    }
  }, [Moralis.User, isAuthenticated]);

  useEffect(() => {
    async function getColonyData() {
      if (!id) return;
      var colony = await moralisService.getColonyDatas(id);
      dispatch(setCurrentColony(colony));
      dispatch(
        setSelectedChannel(
          colony.channels.find((c) => c.type === "announcement")
        )
      );
    }
    if (id) {
      getColonyData();
    }
  }, [id]);
  const setNewChannel = (data: CustomEvent) => {
    console.log("new channel", data);
    dispatch(updateChannel(data.detail));
  };
  useEffect(() => {
    on("channelUpdate", setNewChannel);
    console.log("on");

    return () => {
      console.log("off");
      off("channelUpdate", setNewChannel);
    };
  }, [dispatch]);

  const sendAnnouncement = async () => {
    if (selectedChannel)
      await moralisService.sendAnnonce(selectedChannel?.id, announcementText);
    setAnnouncementText("");
    if (ref.current) ref.current.value = "";
  };

  const handleDisplayEditChannelModal = () => {
    if(isAdmin)
      setDisplayEditChannelModal(true);
  }

  return (
    <div className="flex align-start w-100">
      <CurrentColonyLeft />
      <div className="f-column w-100">
        <MiddleContainerHeader />
        {selectedChannel && (
          <div className="middle-container-center-colony f-column justify-start">
            <div className="channel-header size-14 fw-700 mb-2">
              <span>
                <i className="fa-solid fa-hashtag mr-2"></i>{" "}
                {selectedChannel?.name}
              </span>
              <i
                className="fa-solid fa-ellipsis pointer"
                onClick={handleDisplayEditChannelModal}
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
                  {(currentColony?.isCreator(
                    Moralis.User.current()?.attributes.ethAddress
                  ) ||
                    selectedChannel.type === "textual") && (
                    <InputText
                      ref={ref}
                      size={14}
                      weight={600}
                      glass={false}
                      message
                      iconRightPos={{ top: 19, right: 18 }}
                      height={55}
                      radius="10px"
                      placeholder={""}
                      onChange={(e: any) => {
                        setAnnouncementText(e.target.value);
                      }}
                      onKeyUp={(event: any) => {
                        if (event.key === "Enter") sendAnnouncement();
                      }}
                      onClick={(e: any) => {
                        sendAnnouncement();
                      }}
                    />
                  )}
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
          </div>
        )}
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
