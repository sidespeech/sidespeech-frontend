import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import TextArea from "../../../ui-components/TextArea";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./informations.css";

export interface InitialState {
  sideImage: File | null;
  name: string;
  description: string;
}

const initialState = {
  sideImage: null,
  name: "",
  description: "",
};

export default function Informations({
  currentSide,
}: {
  currentSide: Colony;
}) {

  const [formData, setFormData] = useState<InitialState>(initialState);


  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log('currentSide Information:', currentSide)
  });

  const onChangeSideImage = (event: any) => {
    const file = event.target.files[0];
    if (file.size > 500000) {
      toast.error("The image size has to be smaller than 500ko.");
      return;
    }
    setFormData({ ...formData, sideImage: file });
  };

  const onChangeSideName = (event: any) => {
    const name = event.target.value;
    setFormData({ ...formData, name: name });
  };


  return (
    <>
        {/* Profile Picture Section */}
        <div className="f-column ml-5">
          <div className="text-primary-light mb-3 text fw-600">Profile Picture</div>


          <div className="flex">
            <label
              className="upload-colony-image f-column align-center justify-center"
            >
              {formData.sideImage ? (
                <img
                  style={{
                    height: "inherit",
                    width: "inherit",
                    objectFit: "cover",
                  }}
                  src={URL.createObjectURL(formData.sideImage)}
                  alt="file"
                />
              ) : (
                <img
                style={{
                  height: "inherit",
                  width: "inherit",
                  objectFit: "cover",
                }}
                src={currentSide.sideImage}
                alt="file"
              />
              )}
            </label>

            <label className="text-primary-light fw-600 f-column align-center justify-center text-center ml-3">Use square image (1:1 ratio) to have a better rendering.</label>

            <div className="f-column align-center justify-center ml-3">
            <input
              accept=".png,.jpg,.jpeg,.webp"
              style={{ display: "none" }}
              id="input-colony-picture"
              type={"file"}
              onChange={onChangeSideImage}
            />
            <label htmlFor={"input-colony-picture"}>
            <Button width={159} height={46} onClick={undefined} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}> Upload a new image</Button>
            </label>
            </div>
 
          </div>




        </div>

        {/* Name Section */}
        <div className="f-column ml-5 mt-5">
          <div className="text-primary-light mb-3 text fw-600">Side Name</div>
          <div className="flex">
          <InputText
                height={40}
                width="70%"
                bgColor="var(--bg-secondary-dark)"
                glass={false}
                placeholder={currentSide.name}
                onChange={onChangeSideName}
                radius="10px"
              />
          </div>




        </div>

        {/* Description Section */}
        <div className="f-column ml-5 mt-5">
          <div className="text-primary-light mb-3 text fw-600">Description</div>
          <div className="flex">
          <TextArea
                height={120}
                width="70%"
                bgColor="var(--bg-secondary-dark)"
                glass={false}
                placeholder={"Describe your Side"}
                onChange={undefined}
                radius="10px"
              />
          </div>
          <Button classes={"mt-3"} width={159} height={46} onClick={undefined} radius={10} color={'var(--text-primary-light)'}> Save </Button>
        </div>
    </>
  );
}
