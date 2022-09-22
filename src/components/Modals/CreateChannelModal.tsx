import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentColony } from "../../redux/Slices/AppDatasSlice";
import { RootState } from "../../redux/store/app.store";
import moralisService from "../../service/moralis.service";
import Button from "../ui-components/Button";
import InputText from "../ui-components/InputText";
import Modal from "../ui-components/Modal";

export default function CreateChannelModal({ showModal }: { showModal: any }) {
  const { currentColony } = useSelector((state: RootState) => state.appDatas);
  const [name, setName] = useState<string>("");
  const dispatch = useDispatch();
  
  const handleName = (event: any) => {
    setName(event.target.value);
  };

  const createChannel = async () => {
    if (currentColony) {
      const colony = await moralisService.createTextualChannel(
        name,
        currentColony
      );
      console.log(colony);
      dispatch(setCurrentColony(colony));
    }
  };

  return (
    <Modal
      header={<></>}
      backicon={false}
      body={
        <>
          <div
            className="w-100 flex justify-start align-end"
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
