import React, { useEffect, useState } from "react";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./channels.css";
import { apiService } from "../../../../services/api.service";
import ChannelRow from "./channel-row/channel-row";
import { Channel } from "../../../../models/Channel";
import { Side } from "../../../../models/Side";
import _ from "lodash";

export interface InitialChannelsState {
  currents: Channel[];
  removed: string[];
  added: Channel[];
}

const initialChannelsState = {
  currents: [],
  removed: [],
  added: [],
};

export default function Channels({
  currentSide,
  channelsNewSide,
  handleRemoveChannel,
  handleAddNewChannel,
  onChangeNameChannel,
  onChangeTypeChannel,
  onChangeAuthorizeCommentsChannel,
  onChangeIsVisibleChannel,
}: {
  currentSide: Side;
  channelsNewSide?: any;
  handleRemoveChannel?: any;
  handleAddNewChannel?: any;
  onChangeNameChannel?: any;
  onChangeTypeChannel?: any;
  onChangeAuthorizeCommentsChannel?: any;
  onChangeIsVisibleChannel?: any;
}) {
  const dispatch = useDispatch();
  const [channels, setChannels] = useState<any>(initialChannelsState);

  useEffect(() => {
    setChannels({
      ...channels,
      currents: currentSide["channels"] ? currentSide["channels"] : [],
    });
  }, []);

  const handleRemove = (index: number, current = true) => {
    if (channelsNewSide) {
      handleRemoveChannel(index, current);
    } else {
      // Remove existing channel
      if (current) {
        let current_removed: Channel[] = [];
        let current_channels: Channel[] = [];
        if (channels["removed"].length) {
          current_removed = [...channels["removed"]];
        }
        if (channels["currents"].length) {
          current_channels = [...channels["currents"]];
        }
        if (!current_removed.includes(channels["currents"][index]["id"])) {
          current_removed.push(channels["currents"][index]["id"]);
        }
        current_channels.splice(index, 1);
        setChannels({
          ...channels,
          removed: current_removed,
          currents: current_channels,
        });
      }
      // Remove new channel
      else {
        let current_added: Channel[] = [];
        if (channels["added"].length) {
          current_added = [...channels["added"]];
        } 
        current_added.splice(index, 1);
        setChannels({ ...channels, added: current_added });
      }
    }
  };

  const handleAddChannel = () => {
    if (channelsNewSide) {
      handleAddNewChannel();
    } else {
      let current_added: Partial<Channel>[] = [];
      if (channels["added"].length) {
        current_added = [...channels["added"]];
      }
      current_added.push({
        name: "",
        isVisible: true,
        type: 2,
        side: currentSide,
      });
      setChannels({ ...channels, added: current_added });
    }
  };

  const onChangeName = (event: any, index: number, current = true) => {
    if (channelsNewSide) {
      onChangeNameChannel(event, index, current);
    } else {
      // Change name on existing channel
      if (current) {
        let current_channels = channels["currents"];
        current_channels[index]["name"] = event.target.value;
        setChannels({ ...channels, currents: current_channels });
      }
      // Change name on new channel
      else {
        let added_channels = channels["added"];
        added_channels[index]["name"] = event.target.value;
        setChannels({ ...channels, added: added_channels });
      }
    }
  };
  const onChangeType = (event: any, index: number, current = true) => {
    const value = Number.parseInt(event.target.value);
    if (channelsNewSide) {
      onChangeTypeChannel(value, index, current);
    } else {
      // Change name on existing channel
      if (current) {
        let current_channels = channels["currents"];
        current_channels[index]["type"] = value;
        setChannels({ ...channels, currents: current_channels });
      }
      // Change name on new channel
      else {
        let added_channels = channels["added"];
        added_channels[index]["type"] = value;
        setChannels({ ...channels, added: added_channels });
      }
    }
  };
  const onChangeAuthorizeComments = (
    event: any,
    index: number,
    current = true
  ) => {
    if (channelsNewSide) {
      onChangeAuthorizeCommentsChannel(event, index, current);
    } else {
      // Change name on existing channel
      if (current) {
        let current_channels = _.cloneDeep(channels["currents"]);
        current_channels[index]["authorizeComments"] = event.target.checked;
        setChannels({ ...channels, currents: current_channels });
      }
      // Change name on new channel
      else {
        let added_channels = channels["added"];
        added_channels[index]["authorizeComments"] = event.target.checked;
        setChannels({ ...channels, added: added_channels });
      }
    }
  };
  const onChangeIsVisible = (value: any, index: number, current = true) => {
    if (channelsNewSide) {
      onChangeIsVisibleChannel(value, index, current);
    } else {
      // Change name on existing channel
      if (current) {
        let current_channels = channels["currents"];
        current_channels[index]["isVisible"] = value;
        setChannels({ ...channels, currents: current_channels });
      }
      // Change name on new channel
      else {
        let added_channels = channels["added"];
        added_channels[index]["isVisible"] = value;
        setChannels({ ...channels, added: added_channels });
      }
    }
  };

  const onSubmit = async () => {
    try {
      if (channels["added"].length) {
        const addedChannels = await apiService.createManyChannels(
          channels["added"]
        );
        console.log("addedChannels :", addedChannels);
      }
      if (channels["removed"].length) {
        const removedChannels = await apiService.removeChannels(
          channels["removed"]
        );
        console.log("removedChannels :", removedChannels);
      }
      if (channels["currents"].length) {
        const updatedChannels = await apiService.updateManyChannels(
          channels["currents"]
        );
        console.log("updatedChannels :", updatedChannels);
      }
      toast.success(`Saved`, {
        toastId: 4,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error when added.", { toastId: 3 });
    }
  };

  return (
    <>
      <div className="text-primary-light mb-3 text fw-600">Channels</div>
      <div className="f-column channels-container">
        {/* Existing channels */}
        {channelsNewSide
          ? channelsNewSide["currents"].map((channel: any, index: number) => (
              <ChannelRow
                channel={channel}
                index={index}
                onChangeName={onChangeName}
                handleRemove={handleRemove}
                placeholder={channel["name"]}
                onChangeType={onChangeType}
                onChangeAuthorizeComments={onChangeAuthorizeComments}
                onChangeIsVisible={onChangeIsVisible}
              />
            ))
          : channels["currents"].map((channel: any, index: number) => (
              <ChannelRow
                channel={channel}
                index={index}
                onChangeName={onChangeName}
                handleRemove={handleRemove}
                placeholder={channel["name"]}
                onChangeType={onChangeType}
                onChangeAuthorizeComments={onChangeAuthorizeComments}
                onChangeIsVisible={onChangeIsVisible}
              />
            ))}

        {/* new channels created now */}
        {channelsNewSide
          ? channelsNewSide["added"].map((channel: any, index: number) => (
              <ChannelRow
                channel={channel}
                index={index}
                onChangeName={onChangeName}
                handleRemove={handleRemove}
                onChangeAuthorizeComments={onChangeAuthorizeComments}
                onChangeType={onChangeType}
                onChangeIsVisible={onChangeIsVisible}
              />
            ))
          : channels["added"].map((channel: any, index: number) => (
              <ChannelRow
                channel={channel}
                index={index}
                onChangeName={onChangeName}
                handleRemove={handleRemove}
                onChangeType={onChangeType}
                onChangeAuthorizeComments={onChangeAuthorizeComments}
                onChangeIsVisible={onChangeIsVisible}
              />
            ))}
      </div>

      {/* Add new channel Section*/}
      <div style={{ paddingLeft: 25 }}>
        <Button
          classes="mt-4 fw-700"
          width={"408px"}
          height={40}
          onClick={handleAddChannel}
          radius={10}
          background={"var(--disable)"}
          color={"var(--white)"}
        >
          <i className="fa-solid fa-plus mr-2"></i>Create a channel
        </Button>

        {/* Submit Button */}
        {!channelsNewSide ? (
          <Button
            width={"159px"}
            height={46}
            onClick={onSubmit}
            radius={10}
            color={"var(--text-primary-light)"}
            classes={"mt-4"}
          >
            Save{" "}
          </Button>
        ) : null}
      </div>
    </>
  );
}
