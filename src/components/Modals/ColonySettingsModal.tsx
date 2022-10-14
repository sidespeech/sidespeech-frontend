import React, { useEffect, useState } from "react";
import { reduceWalletAddress } from "../../helpers/utilities";
import { Channel, Colony } from "../../models/Colony";
import Button from "../ui-components/Button";
import CustomSelect from "../ui-components/CustomSelect";
import Modal from "../ui-components/Modal";
import Switch from "../ui-components/Switch";
import check from "../../assets/check.svg";
import InputText from "../ui-components/InputText";
import { format } from "date-fns";
import UserLine from "../ui-components/UserLine";
import styled from "styled-components";
import MembersList from "../CurrentColony/settings-admin/members-list/members-list"
import Channels from "../CurrentColony/settings-admin/channels/channels"
import Invitation from "../CurrentColony/settings-admin/invitation/invitation"
import Informations from "../CurrentColony/settings-admin/informations/informations"

import {
  setSelectedChannel,
  updateChannel,
} from "../../redux/Slices/AppDatasSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";


const ContainerLeft = styled.div`
  min-width: 140px;
  background-color: var(--bg-secondary-light);
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 11px;
  color: var(--text-primary-light);
`;

const TabItems = styled.div`
  cursor: pointer;
`;

const initialStateTabs = {
  Informations: true,
  Members: false,
  Channels: false,
  Invitation: false
};

export default function ColonySettingsModal({
  showModal,
  currentColony,
}: {
  showModal: any;
  currentColony: Colony;
}) {
  const dispatch = useDispatch();

  const [tabs, setTabs] = useState<any>(initialStateTabs);

  const handleTabs = (tabName: any) => {    
    let currentTabState = {...tabs}
    for (const key of Object.keys(currentTabState)) { currentTabState[key] = (key === tabName) ? true : false }
    console.log('tabName :', tabName);
    console.log("currentTabState :", currentTabState)
    setTabs(currentTabState);
  };


  return (
    <Modal
      header={
        <div className="f-column w-100 align-start">
          <div
            className="size-20 mt-3 w-100"
            style={{
              textAlign: "left",
              color: "var(--text-secondary-light)",
              borderBottom: "1px solid var(--bg-primary)",
              paddingBottom: 14,
            }}
          >
            <i className="fa-solid fa-hashtag mr-2"></i> {currentColony?.name}{" "}
            <i
              className="fa-solid fa-pen ml-3"
              style={{ fontSize: 14, color: "#647A8B" }}
            ></i>
          </div>
          {/* <div className="fw-400 size-11 mt-2 ml-2">
            Create {format(currentColony.createdAt, "yyyy-mm-dd")} by{" "}
            {reduceWalletAddress(currentColony?.CreatorAddress || "")}
          </div> */}
        </div>
      }
      backicon={false}
      body={
        <>
          <div className="flex align-start w-100">
            <ContainerLeft>
              <TabItems onClick={(e) => handleTabs("Informations")}>Informations</TabItems>
              <TabItems onClick={(e) => handleTabs("Members")}>Members</TabItems>
              <TabItems onClick={(e) => handleTabs("Channels")}>Channels</TabItems>
              <TabItems onClick={(e) => handleTabs("Invitation")}>Invitation</TabItems>


            </ContainerLeft>
            {Object.keys(tabs).map((keyName, i) =>
              (keyName == 'Informations' && tabs[keyName]) ? <Informations currentColony={currentColony} /> :
                (keyName == 'Members' && tabs[keyName]) ? <MembersList currentColony={currentColony} /> :
                  (keyName == 'Channels' && tabs[keyName]) ? <Channels currentColony={currentColony} /> :
                    (keyName == 'Invitation' && tabs[keyName]) ? <Invitation currentColony={currentColony} /> : null
            )}

            {/* <div className="row">
              <div className="w-100">
                <span className="fw-500 size-12 flex w-100 mt-2 justify-between px-1">
                  <InputText
                    width={"335px"}
                    padding={"0px 40px 0px 20px"}
                    height={36}
                    radius={"90px"}
                    weight={500}
                    size={12}
                    onChange={console.log}
                    iconRightPos={{ top: 11, right: 18 }}
                    iconSize={14}
                    color="var(--text-secondary)"
                    placeholderWeight={500}
                    placeholderSize={12}
                    placeholder={"Search"}
                    glass
                  />
                  <Button width={124} height={32} onClick={handleInvitePeople}>
                    <i className="fa-solid fa-user-plus mr-2"></i>
                    <span className="fw-400 size-11">Invite people</span>
                  </Button>
                </span>
              </div>
              <div className="member-list mt-3" style={{ minHeight: 360 }}>
                <div
                  className="fw-500 size-12 flex w-100 pl-4 pb-2 pt-3 text-secondary-dark"
                  style={{ borderBottom: "1px solid var(--text-secondary-dark)" }}
                >
                  <span className="flex-1">MEMBERS</span>
                  <span className="flex-1">STATUS</span>
                </div>
                <div className="w-100 pl-4 pb-2 pt-3">
                  {_.orderBy(currentColony.members, (m) =>
                    m.get("role").get("name")
                  ).map((m) => {
                    return <UserLine key={m.id} user={m} colony={currentColony} />;
                  })}
                </div>
              </div>
              <div className="my-3 mr-auto">
                <div className="fw-400 size-14">Conditions</div>
                <div className="fw-400 size-12">Required token to enter: 1</div>
              </div>
            </div> */}
          </div>
        </>
      }
      footer={<div className="underline w-100">Delete Colony</div>}
      title={undefined}
      showModal={showModal}
    />
  );
}
