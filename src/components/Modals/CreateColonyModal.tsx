import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addColony } from "../../redux/Slices/UserDataSlice";

import Button from "../ui-components/Button";
import InputText from "../ui-components/InputText";
import Modal from "../ui-components/Modal";

export interface InitialState {
  colonyImage: File | null;
  colonyCover: File | null;
  colonyName: string;
  colonyTokenAddress: string;
  colonyWebsiteLink: string;
}

const initialState = {
  colonyImage: null,
  colonyCover: null,
  colonyName: "",
  colonyTokenAddress: "",
  colonyWebsiteLink: "",
};

export default function CreateColonyModal({ showModal }: { showModal: any }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<InitialState>(initialState);

  const setColonyName = (event: any) => {
    const name = event.target.value;
    setFormData({ ...formData, colonyName: name });
  };
  const setColonyTokenAddress = (event: any) => {
    // if (!Web3.utils.isAddress(event.target.value, CONFIG.NETWORK.ID)) {
    //   toast.error("This address is not an Ethereum Address",{toastId: 1});
    //   return;
    // }
    const address = event.target.value;
    setFormData({ ...formData, colonyTokenAddress: address });
  };
  const setColonyWebsite = (event: any) => {
    const url = event.target.value;
    setFormData({ ...formData, colonyWebsiteLink: url });
  };

  const setColonyCover = (event: any) => {
    const file = event.target.files[0];
    if (file.size > 1000000) {
      toast.error("The image size has to be smaller than 1Mo.");
      return;
    }
    setFormData({ ...formData, colonyCover: file });
  };
  const setColonyImage = (event: any) => {
    const file = event.target.files[0];
    if (file.size > 500000) {
      toast.error("The image size has to be smaller than 500ko.");
      return;
    }
    setFormData({ ...formData, colonyImage: file });
  };

  const saveColony = async () => {
    // Save file input to IPFS

    try {
      if (formData.colonyImage)
        if (formData.colonyCover)
          //dispatch(addColony(colony));
          toast.success(formData.colonyName + " has been created.", {
            toastId: 4,
          });
    } catch (error) {
      console.log(error);
      toast.error("Error creating colony.", { toastId: 3 });
    }
  };

  return (
    <Modal
      showModal={showModal}
      body={
        <>
          <div className="f-column">
            <label htmlFor="name" className="size-14 fw-400 mb-1 text-left">
              Colony name
            </label>
            <InputText
              glass={false}
              width={"400px"}
              padding={"0px 40px 0px 20px"}
              height={40}
              onChange={setColonyName}
              iconRightPos={{ top: 6, right: 16 }}
              placeholder={""}
            />
          </div>
          <div
            className="flex justify-between mt-4 w-100"
            style={{ maxWidth: 400 }}
          >
            <div className="f-column justify-center align-center">
              <div className="size-14 fw-400 mb-3">Upload colony image</div>
              <input
                accept=".png,.jpg,.jpeg,.webp"
                style={{ display: "none" }}
                id="input-colony-picture"
                type={"file"}
                onChange={setColonyImage}
              />
              <label
                htmlFor={"input-colony-picture"}
                className="upload-colony-image f-column align-center justify-center"
              >
                {formData.colonyImage ? (
                  <img
                    style={{
                      height: "inherit",
                      width: "inherit",
                      objectFit: "cover",
                    }}
                    src={URL.createObjectURL(formData.colonyImage)}
                    alt="file"
                  />
                ) : (
                  <>
                    <i className="fa-solid fa-camera size-30 mb-1 mt-2"></i>
                    <span>
                      <i className="fa-solid fa-plus size-20"></i>
                    </span>
                  </>
                )}
              </label>
            </div>
            <div className="f-column justify-center align-center">
              <div className="size-14 fw-400 mb-3">
                Upload colony cover image
              </div>
              <input
                accept=".png,.jpg,.jpeg,.webp"
                style={{ display: "none" }}
                id="input-colony-cover"
                type={"file"}
                onChange={setColonyCover}
              />
              <label
                htmlFor={"input-colony-cover"}
                className="upload-colony-cover f-column align-center justify-center"
              >
                {formData.colonyCover ? (
                  <img
                    style={{
                      height: "inherit",
                      width: "inherit",
                      objectFit: "cover",
                    }}
                    src={URL.createObjectURL(formData.colonyCover)}
                    alt="file"
                  />
                ) : (
                  <>
                    <i className="fa-solid fa-camera size-30 mb-1 mt-2"></i>
                    <span>
                      <i className="fa-solid fa-plus size-20"></i>
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>
          <div className="f-column mt-4 mb-3">
            <label htmlFor="name" className="size-14 fw-400 mb-1 text-left">
              NFT or Token address
            </label>
            <InputText
              glass={false}
              width={"400px"}
              padding={"0px 40px 0px 20px"}
              height={40}
              onChange={setColonyTokenAddress}
              iconRightPos={{ top: 6, right: 16 }}
              placeholder={"Paste the address of your NFT or Token"}
              placeholderSize={14}
              placeholderWeight={400}
              placeholderColor="var(--placeholder)"
            />
          </div>
          <div className="f-column">
            <label htmlFor="name" className="size-14 fw-400 mb-1 text-left">
              Website link
            </label>
            <InputText
              glass={false}
              width={"400px"}
              padding={"0px 40px 0px 20px"}
              height={40}
              onChange={setColonyWebsite}
              iconRightPos={{ top: 6, right: 16 }}
              placeholder={""}
            />
          </div>
        </>
      }
      footer={
        <Button width={159} height={46} onClick={saveColony}>
          Create
        </Button>
      }
      title={<span>Create a new colony</span>}
    />
  );
}
