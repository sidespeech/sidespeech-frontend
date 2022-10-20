import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./channels.css"
import { apiService } from "../../../../services/api.service";

export interface InitialChannelsState {
  currents: Channel[];
  removed: string[];
  added: Channel[];
}


const initialChannelsState = {
  currents: [],
  removed: [],
  added: []
};

export default function Channels({
  currentSide,
  channelsNewSide,
  handleRemoveChannel
}: {
  currentSide: Colony;
  channelsNewSide?: Channel[];
  handleRemoveChannel?: any;
}) {

  const dispatch = useDispatch();
  const [channels, setChannels] = useState<any>(initialChannelsState);

  useEffect(() => {

    console.log('channelsNewSide :', channelsNewSide)

    console.log('data :', { ...initialChannelsState, currents: (currentSide['channels']) ? currentSide['channels'] : [] })
    setChannels({ ...channels, currents: (currentSide['channels']) ? currentSide['channels'] : [] })
  }, []);

  const handleRemove = (index: number, current = true) => {

    if (channelsNewSide) {
      handleRemoveChannel(index, current);
    } else {
      // Remove existing channel
      if (current) {
        let current_removed: Channel[] = [];
        let current_channels: Channel[] = [];
        if (channels['removed'].length) {
          current_removed = [...channels['removed']];
        }
        if (channels['currents'].length) {
          current_channels = [...channels['currents']];
        }
        if (!current_removed.includes(channels['currents'][index]['id'])) {
          current_removed.push(channels['currents'][index]['id']);
        }
        current_channels.splice(index, 1);
        setChannels({ ...channels, removed: current_removed, currents: current_channels });
      }
      // Remove new channel
      else {
        let current_added: Channel[] = []
        if (channels['added'].length) {
          current_added = [...channels['added']]
        }
        current_added.splice(index, 1);
        setChannels({ ...channels, added: current_added })
      }
    }

  };

  const handleAddChannel = () => {
    let current_added: Channel[] = []
    if (channels['added'].length) {
      current_added = [...channels['added']]
    }
    current_added.push({
      name: "",
      isVisible: true,
      type: 2,
      side: currentSide
    });
    setChannels({ ...channels, added: current_added })
  };

  const onChangeName = (event: any, index: number, current = true) => {
    // Change name on existing channel
    if (current) {
      let current_channels = channels['currents'];
      current_channels[index]['name'] = event.target.value;
      setChannels({ ...channels, currents: current_channels })
    }
    // Change name on new channel
    else {
      let added_channels = channels['added'];
      added_channels[index]['name'] = event.target.value;
      setChannels({ ...channels, added: added_channels })
    }
  };

  const onSubmit = async () => {
    console.log(channels)

    try {
      if (channels['added'].length) {
        const addedChannels = await apiService.createManyChannels(channels['added']);
        console.log('addedChannels :', addedChannels)
      }
      if (channels['removed'].length) {
        const removedChannels = await apiService.removeChannels(channels['removed']);
        console.log('removedChannels :', removedChannels)
      }
      if (channels['currents'].length) {
        const updatedChannels = await apiService.updateManyChannels(channels['currents']);
        console.log('updatedChannels :', updatedChannels)
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
      <div className="f-column">
        <div className="text-primary-light mb-3 text fw-600">Channels</div>

        {/* Existing channels */}
        {
          channels['currents'].map((channel: any, index: number) =>
            <div className="flex mt-2 align-center" key={channel['id']}>
              <i className="fa-solid fa-grip-lines fa-lg mr-2 text-secondary-dark"></i>
              <InputText
                placeholderColor="var(--text-primary-light)"
                parentWidth={"43rem"}
                height={40}
                width="50%"
                bgColor="var(--bg-secondary-dark)"
                glass={false}
                placeholder={"# " + channel['name']}
                onChange={(e: any) => onChangeName(e, index)}
                radius="10px"
              />
              <i onClick={(e) => handleRemove(index)} className="fa-solid fa-eye fa-xl remove-icon text-red cursor-pointer"></i>
              <i onClick={(e) => handleRemove(index)} className="fa-solid fa-circle-minus fa-xl remove-icon text-red cursor-pointer"></i>
            </div>
          )
        }

        {/* new channels created now */}
        {
          channels['added'].map((channel: any, index: number) =>
            <div className="flex mt-2 align-center" key={index}>
              <i className="fa-solid fa-grip-lines fa-lg mr-2 text-secondary-dark"></i>
              <InputText
                placeholderColor="var(--text-primary-light)"
                parentWidth={"43rem"}
                height={40}
                width="50%"
                bgColor="var(--bg-secondary-dark)"
                glass={false}
                placeholder={"#"}
                onChange={(e: any) => onChangeName(e, index, false)}
                radius="10px"
              />
              <i onClick={(e) => handleRemove(index)} className="fa-solid fa-eye fa-xl display-icon mr-4 cursor-pointer"></i>
              <i onClick={(e) => handleRemove(index, false)} className="fa-solid fa-circle-minus fa-xl remove-icon text-red cursor-pointer"></i>
            </div>
          )
        }

        <Button classes="ml-4 mt-2" width={298} height={40} onClick={handleAddChannel} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}><i className="fa-solid fa-plus mr-2"></i>Create a channel</Button>

        {/* Submit Button */}
        <Button classes={"mt-5"} width={159} height={46} onClick={onSubmit} radius={10} color={'var(--text-primary-light)'}>Save </Button>
      </div>
    </>
  );
}
