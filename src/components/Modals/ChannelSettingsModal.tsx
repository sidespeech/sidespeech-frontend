import React from "react";
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
import moralisService from "../../service/moralis.service";
import {
  setSelectedChannel,
  updateChannel,
} from "../../redux/Slices/AppDatasSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";

export default function ChannelSettingsModal({
  showModal,
  selectedChannel,
  currentColony,
}: {
  showModal: any;
  selectedChannel: Channel;
  currentColony: Colony;
}) {
  const dispatch = useDispatch();

  const handleActivateChannel = async (value: any) => {
    try {
      const channel = await moralisService.updateChannel(
        selectedChannel.id,
        value
      );
      if (channel) dispatch(updateChannel(channel));
      toast.success("Visibility of the channel has been changed", {
        toastId: 8,
      });
    } catch (error) {
      toast.error("Error when updating visibility of the channel", {
        toastId: 9,
      });
    }
  };
  return (
    <Modal
      header={
        <div
          className="size-20 mt-3 w-100"
          style={{
            textAlign: "left",
            color: "var(--text-secondary-light)",
            borderBottom: "1px solid var(--bg-primary)",
            paddingBottom: 14,
          }}
        >
          <i className="fa-solid fa-hashtag mr-2"></i> {selectedChannel?.name}{" "}
          <i
            className="fa-solid fa-pen ml-3"
            style={{ fontSize: 14, color: "#647A8B" }}
          ></i>
          <div className="fw-400 size-11 mt-2 ml-2">
            Create {format(selectedChannel?.createdAt, "yyyy-mm-dd")} by{" "}
            {reduceWalletAddress(currentColony?.CreatorAddress || "")}
          </div>
        </div>
      }
      backicon={false}
      body={
        <>
          <div className="edit-channel">
            <div className="flex align-center">
              <Switch
                onClick={handleActivateChannel}
                value={selectedChannel.isVisible}
              />
              {selectedChannel.isVisible && (
                <i className="fa-solid fa-lock ml-2"></i>
              )}
              <div>
                {" "}
                <div className="size-14 fw-400 ml-2">
                  {selectedChannel.isVisible
                    ? "Make the channel private"
                    : "Activate channel"}
                </div>
                {!selectedChannel.isVisible && (
                  <div className="size-11 fw-400 ml-2">
                    If the channel is not active, only you can view it
                  </div>
                )}
              </div>
            </div>
            {selectedChannel.type === "announcement" && (
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
                <Button width={124} height={32} onClick={undefined}>
                  <i className="fa-solid fa-user-plus mr-2"></i>
                  <span className="fw-400 size-11">Invite people</span>
                </Button>
              </span>
            )}
          </div>
          {selectedChannel.type === "announcement" && (
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
                  return (
                    <UserLine key={m.id} user={m} colony={currentColony} />
                  );
                })}
              </div>
            </div>
          )}
        </>
      }
      footer={<div className="underline w-100">Remove channel</div>}
      title={undefined}
      showModal={showModal}
    />
  );
}
