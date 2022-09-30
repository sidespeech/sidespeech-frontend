import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import check from "../../../assets/check.svg";
import polygon from "../../../assets/Polygon3.svg";
import { Channel } from "../../../models/Colony";
import { setSelectedChannel } from "../../../redux/Slices/AppDatasSlice";
import { RootState } from "../../../redux/store/app.store";
import ChannelSettingsModal from "../../Modals/ChannelSettingsModal";
import ColonySettingsModal from "../../Modals/ColonySettingsModal";
import CreateChannelModal from "../../Modals/CreateChannelModal";
import ViewUserProfile from "../../Modals/ViewUserProfile";
import UserBadge from "../../ui-components/UserBadge";

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

const Dot = styled.div`
  width: 15px;
  height: 15px;
  color: white;
  background-color: var(--text-red);
  weight: 700;
  font-size: 7px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const initialMembers = {
  Administrator: [],
  User: [],
  Moderator1: [],
  Moderator2: [],
  Moderator3: [],
};

export default function CurrentColonyLeft() {
  const { currentColony, selectedChannel } = useSelector(
    (state: RootState) => state.appDatas
  );
  const { user } = useSelector((state: RootState) => state.user);
  const [displayColonySettings, setDisplayColonySettings] =
    useState<boolean>(false);

  const [members, setMembers] = useState<any>(initialMembers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [displayNewChannelModal, setDisplayNewChannelModal] =
    useState<boolean>(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMod, setIsMod] = useState<boolean>(false);
  const [displayUserProfile, setDisplayUserProfile] = useState<boolean>(false);

  const dispatch = useDispatch();

  const onChannelSelected = (c: Channel) => {
    if (isMod) dispatch(setSelectedChannel(c));
  };

  useEffect(() => {
    if (currentColony && currentColony.members) {
      const groupedMembers = _.groupBy(currentColony.members, (m) =>
        m.get("role").get("name")
      );
      console.log(groupedMembers);
      setMembers({ ...groupedMembers });
      setChannels(
        _.orderBy(
          currentColony?.channels,
          ["isVisible", "name"],
          ["desc", "asc"]
        )
      );
      const address = user.get("ethAddress");
      const admins = groupedMembers.Administrator;
      const mods = _.concat(
        groupedMembers["Moderator1"],
        groupedMembers["Moderator2"],
        groupedMembers["Moderator3"]
      );
      const isAdmin = admins.some(
        (a: any) => a.get("user").get("ethAddress") === address
      );
      const isMod = mods.some(
        (a: any) => a && a.get("user").get("ethAddress") === address
      );
      setIsAdmin(isAdmin);
      setIsMod(isAdmin || isMod);
    }
  }, [currentColony]);

  const handleDisplayNewChannel = () => {
    if (isAdmin) {
      setDisplayNewChannelModal(true);
    }
  };

  const handleDisplayColonySettings = () => {
    if (isAdmin) setDisplayColonySettings(true);
  };

  const handleSelectedUser = (a: any) => {
    setSelectedUser(a);
    setDisplayUserProfile(true);
  };

  return (
    <ContainerLeft>
      <div className="w-100 flex align-center justify-between px-2">
        <span className="fw-700 size-13 open-sans flex align-center text-secondary">
          {currentColony?.name.toUpperCase()}
          {/* <img alt="check" className="ml-2" src={check} /> */}
        </span>
        <i
          className="fa-solid fa-ellipsis pointer"
          onClick={handleDisplayColonySettings}
          style={{ marginLeft: "auto" }}
        ></i>
      </div>
      <CoverImg src={currentColony?.cover} alt="cover-image" />
      <div className="f-column px-2 mt-3">
        <div className="w-100 flex align-center justify-between text-secondary-dark">
          <span className="fw-400 size-11 flex align-center ">
            <i className="fa-solid fa-circle-chevron-right mr-2"></i>
            Direct messages
          </span>
          <i className="fa-solid fa-plus "></i>
        </div>
        <div className="ml-2 mt-1">
          <div className="w-100 flex justify-between align-center">
            <UserBadge
              connect
              weight={400}
              fontSize={11}
              address="0x7965Dffef589465"
            />
            <Dot>1</Dot>
          </div>
        </div>
      </div>
      <div
        className="w-100 flex align-center justify-between px-2 ml-2"
        style={{ margin: "11px 0px 14px 17px" }}
      >
        <span className="fw-400 size-11 flex align-center">
          <i className="fa-solid fa-comment-dots mr-2"></i>
          All my threads
        </span>
      </div>
      <SeparationLine />
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
        <span className="fw-700 size-9 flex align-center text-red">ADMIN</span>
        <div className="f-column align-start ml-2 pt-1">
          {members["Administrator"].map((a: any) => {
            return (
              <div
                onClick={() => handleSelectedUser(a)}
                className="w-100 flex justify-between align-center"
              >
                <UserBadge
                  weight={400}
                  fontSize={11}
                  username={a.get("username")}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-100 f-column align-start justify-start px-2 mt-3">
        <span className="fw-700 size-9 flex align-center text-green">
          MODERATOR
        </span>
        <div className="f-column align-start ml-2 pt-1">
          {_.concat(
            members["Moderator1"],
            members["Moderator2"],
            members["Moderator3"]
          ).map((a: any) => {
            if (!a) return;
            return (
              <div
                onClick={() => handleSelectedUser(a)}
                className="w-100 flex justify-between align-center"
              >
                <UserBadge
                  weight={400}
                  fontSize={11}
                  username={a.get("username")}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-100 f-column align-start justify-start px-2 mt-3">
        <span className="fw-700 size-9 flex align-center text-blue">USER</span>
        <div className="f-column align-start ml-2 pt-1">
          {members["User"].map((a: any) => {
            return (
              <div
                onClick={() => handleSelectedUser(a)}
                className="w-100 flex justify-between align-center"
              >
                <UserBadge
                  weight={400}
                  fontSize={11}
                  username={a.get("username")}
                />
              </div>
            );
          })}
        </div>
      </div>
      {currentColony && displayColonySettings && (
        <ColonySettingsModal
          showModal={setDisplayColonySettings}
          currentColony={currentColony}
        />
      )}
      {currentColony && selectedUser && displayUserProfile && (
        <ViewUserProfile
          profile={selectedUser}
          colony={currentColony}
          showModal={setDisplayUserProfile}
        />
      )}
      {displayNewChannelModal && (
        <CreateChannelModal showModal={setDisplayNewChannelModal} />
      )}
    </ContainerLeft>
  );
}
