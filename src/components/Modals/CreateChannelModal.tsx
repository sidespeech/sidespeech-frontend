import React, { BaseSyntheticEvent, SyntheticEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChannelType } from "../../models/Channel";
import {
  addChannel,
  setCurrentColony,
  setSelectedChannel,
} from "../../redux/Slices/AppDatasSlice";
import { RootState } from "../../redux/store/app.store";
import { apiService } from "../../services/api.service";

import Button from "../ui-components/Button";
import CustomSelect from "../ui-components/CustomSelect";
import InputText from "../ui-components/InputText";
import Modal from "../ui-components/Modal";

export default function CreateChannelModal({ showModal }: { showModal: any }) {
  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<ChannelType>(0);
  const dispatch = useDispatch();

  const handleName = (event: any) => {
    setName(event.target.value);
  };

  const createChannel = async () => {
    if (currentSide) {
      const channel = await apiService.createChannel(
        currentSide.id,
        name,
        +type
      );
      dispatch(addChannel(channel));
      dispatch(setSelectedChannel(channel));
    }
  };

  const handleOnChangeType = (event: BaseSyntheticEvent) => {
    setType(event.target.value);
  };

  return (
    <Modal
      header={<></>}
      backicon={false}
      body={
        <>
          <div
            className="w-100 flex align-center f-column"
            style={{ maxWidth: 400, gap: 10 }}
          >
            <div className="w-100 f-column">
              <div className="mb-1">Channel name</div>
              <InputText
                height={40}
                bgColor="var(--bg-secondary-dark)"
                glass={false}
                placeholder={""}
                onChange={handleName}
              />
            </div>
            <div>Channel type</div>
            <CustomSelect
              options={["Announcement", "Textual", "Poll"]}
              onChange={handleOnChangeType}
            />
          </div>
        </>
      }
      footer={
        <Button classes="mt-3" width={149} height={43} onClick={createChannel}>
          Create
        </Button>
      }
      title={<span>Create new channel</span>}
      showModal={showModal}
    />
  );
}
