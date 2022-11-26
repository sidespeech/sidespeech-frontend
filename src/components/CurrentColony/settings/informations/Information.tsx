import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import TextArea from "../../../ui-components/TextArea";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { apiService } from "../../../../services/api.service";
import { Side } from "../../../../models/Side";
import Switch from "../../../ui-components/Switch";
import { sideAPI } from "../../../../services/side.service";
import LeavSideAsAdmin from "../../../ui-components/LeavSideAsAdmin";
import { removeSide } from "../../../../redux/Slices/UserDataSlice";
import { useNavigate } from "react-router-dom";
import { breakpoints, size } from "../../../../helpers/breakpoints";

const InformationsStyled = styled.div`
  width: 100%;
  ${breakpoints(size.lg, `{
    width: 60%;
    max-width: 500px;
  }`)}
  .upload-colony-image {
    position: relative;
    .camera-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(0deg, rgba(24, 26, 43, 0.4), rgba(24, 26, 43, 0.4));
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
  .upload-img-btn {
    display: none;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-secondary-light);
    border-radius: 10px;
    width: 181px;
    padding: .88rem 1rem;
    ${breakpoints(size.lg, `{
      display: flex;
    }`)}
  }

  .name-input_wrapper {
    display: flex;
    gap: 1rem;
    align-items: center;
    .name-input {
      width: 60%;
    }
  }

  .success-message {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--green);
  }

  .yellowDiv {
    border: 2px solid #D29B52;
    border-radius: 5px;
    max-width: 600px;
    min-height: 300px;
    background-color: #383232;
    padding: 10px 28px;
  }

  .fa-sign-out {
    color: #D29B52;
    margin-top: 18px;
  }

  .flex {
    display: flex;
  }
  .yellowDiv button{
    background-color: transparent;
    border: none;
    color: #D29B52;
    font-size: 16px;
    font-weight: 600;
  }
  .yellowDiv .flex p {
    margin-left: 7px;
  }

  .sub-text {
    margin-top: 0px;
    font-size: 17px;
    font-weight: 400;
    color: #b9b9b9;
  }

  .btm-div-head {
    margin-bottom: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
  }

  .btm-div-nor {
    margin-top: 0px;
    font-size: 15px;
    color: #848a9b;
    font-weight: 500;
  
  }

  .typ-sm {
    display: flex;
    justify-content: space-between;
  }

  .typ-sm button{
  cursor: pointer;
  color: #ddd9d98c;
  font-size: 16px;
  font-weight: 600;
  }
`;

export interface InitialStateUpdateSide {
  sideImage: string | undefined;
  name: string;
  description: string;
  priv: boolean;
}

const initialStateUpdateSide = {
  sideImage: undefined,
  name: "",
  description: "",
  priv: false,
};

export default function Informations({
  currentSide,
  userData,
  onChangeNewSideName,
  onChangeNewSideImage,
  onChangeNewSideDescription,
  formError,
}: {
  userData?: any;
  currentSide: any;
  onChangeNewSideName?: any;
  onChangeNewSideImage?: any;
  onChangeNewSideDescription?:any;
  formError?: any;
}) {
  const [formData, setFormData] = useState<InitialStateUpdateSide>(
    initialStateUpdateSide
  );
  const [isNewSide, setIsNewSide] = useState<boolean>(true);
  const [subAdmin, setSubAdmin] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.href.includes("settings")) {
      setIsNewSide(false);
      setFormData({
        sideImage: currentSide["sideImage"],
        name: currentSide["name"],
        description: currentSide["description"],
        priv: currentSide["priv"],
      });
    }
  }, [currentSide]);

  const dispatch = useDispatch();

  const onChangeSideImage = (event: any) => {
    const file = event.target.files[0];
    if (file.size > 500000) {
      toast.error("The image size has to be smaller than 500ko.");
      return;
    }
    setFormData({ ...formData, sideImage: URL.createObjectURL(file) });
    if (isNewSide) onChangeNewSideImage(event);
  };

  const onChangeSideName = (event: any) => {
    const name = event.target.value;
    setFormData({ ...formData, name: name });
    if (isNewSide) onChangeNewSideName(event.target.value);
  };


  const onChangeSideDescription = (event: any) => {
    const description = event.target.value;
    setFormData({ ...formData, description: description });
    if (isNewSide) onChangeNewSideDescription(event.target.value);
  };

  const onChangePrivate = (event: any) => {
    setFormData({ ...formData, priv: event });
    // if (isNewSide) onChangeNewSideName(event.target.value);
  };

  // If we are in settings on existing Side
  const updateSide = async () => {
    try {
      if (!formData.sideImage) {
        delete formData["sideImage"];
      }
      if (!currentSide["id"]) return;
      const updatedSide = await sideAPI.updateSide(formData, currentSide["id"]);
      toast.success(formData.name + " has been updated.", {
        toastId: 4,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error when update side.", { toastId: 3 });
    }
  };

  const onSubmitLeaveSide = async () => {
    let result = await apiService.leaveSide(userData["currentProfile"]);
    if (result["error"]) toast.error(result["message"], { toastId: 3 });
    else {
      toast.success(result["message"], { toastId: 4 });
      dispatch(removeSide(userData["currentProfile"].side.id));
      navigate("/");
    }
  };

  return (
    <InformationsStyled>
      {/* Profile Picture Section */}
      <div className="f-column">
        <div className="text-primary-light mb-2 text fw-600 size-13">
          Side Icon
        </div>

        <label htmlFor="input-colony-picture" className="flex pointer">
          <div className="upload-colony-image f-column align-center justify-center">
            {formData.sideImage ? (
              <img
                style={{
                  height: "inherit",
                  width: "inherit",
                  objectFit: "cover",
                }}
                src={formData.sideImage}
                alt="file"
              />
            ) : currentSide.sideImage ? (
              <img
                style={{
                  height: "inherit",
                  width: "inherit",
                  objectFit: "cover",
                }}
                src={(!window.location.href.includes("settings")) ? URL.createObjectURL(currentSide.sideImage) : currentSide.sideImage}
                alt="file"
              />
            ) : (
              <></>
            )}
            <span className="camera-icon">
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6V4H16V2H18V0H20V2H22V4H20V6H18ZM2 20C1.45 20 0.979333 19.8043 0.588 19.413C0.196 19.021 0 18.55 0 18V6C0 5.45 0.196 4.97933 0.588 4.588C0.979333 4.196 1.45 4 2 4H5.15L7 2H13V4H7.875L6.05 6H2V18H18V9H20V18C20 18.55 19.8043 19.021 19.413 19.413C19.021 19.8043 18.55 20 18 20H2ZM10 16.5C11.25 16.5 12.3127 16.0627 13.188 15.188C14.0627 14.3127 14.5 13.25 14.5 12C14.5 10.75 14.0627 9.68733 13.188 8.812C12.3127 7.93733 11.25 7.5 10 7.5C8.75 7.5 7.68733 7.93733 6.812 8.812C5.93733 9.68733 5.5 10.75 5.5 12C5.5 13.25 5.93733 14.3127 6.812 15.188C7.68733 16.0627 8.75 16.5 10 16.5ZM10 14.5C9.3 14.5 8.70833 14.2583 8.225 13.775C7.74167 13.2917 7.5 12.7 7.5 12C7.5 11.3 7.74167 10.7083 8.225 10.225C8.70833 9.74167 9.3 9.5 10 9.5C10.7 9.5 11.2917 9.74167 11.775 10.225C12.2583 10.7083 12.5 11.3 12.5 12C12.5 12.7 12.2583 13.2917 11.775 13.775C11.2917 14.2583 10.7 14.5 10 14.5Z" fill="white"/>
              </svg>

            </span>
          </div>

          <div className="text-primary-light fw-600 f-column align-center justify-center ml-3 size-11">
            Use square image (1:1 ratio) to have a better rendering.
          </div>

          <div className="f-column align-center justify-center ml-3">
            <div>
              <input
                accept=".png,.jpg,.jpeg,.webp"
                style={{
                  opacity: 0,
                  position: "absolute",
                  pointerEvents: "none",
                }}
                id="input-colony-picture"
                type={"file"}
                onChange={onChangeSideImage}
              />
              <div className="upload-img-btn">
                Upload a new image
              </div>
            </div>
          </div>
        </label>
      </div>

      {/* Name Section */}
      <div className="f-column mt-3">
        <div className="text-primary-light mb-2 text fw-600 size-13">
          Side Name
        </div>
        <div className="name-input_wrapper">
          <div className="name-input">
            <InputText
              bgColor="var(--bg-secondary-dark)"
              defaultValue={currentSide.name}
              glass={false}
              height={35}
              onChange={onChangeSideName}
              radius="10px"
            />
          </div>
          {!formError?.name.exist && formData?.name.length > 3 && (
            <div className="success-message">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.95 11.45L12.2375 6.1625L11.1875 5.1125L6.95 9.35L4.8125 7.2125L3.7625 8.2625L6.95 11.45ZM8 15.5C6.9625 15.5 5.9875 15.303 5.075 14.909C4.1625 14.5155 3.36875 13.9813 2.69375 13.3063C2.01875 12.6313 1.4845 11.8375 1.091 10.925C0.697 10.0125 0.5 9.0375 0.5 8C0.5 6.9625 0.697 5.9875 1.091 5.075C1.4845 4.1625 2.01875 3.36875 2.69375 2.69375C3.36875 2.01875 4.1625 1.48425 5.075 1.09025C5.9875 0.69675 6.9625 0.5 8 0.5C9.0375 0.5 10.0125 0.69675 10.925 1.09025C11.8375 1.48425 12.6313 2.01875 13.3063 2.69375C13.9813 3.36875 14.5155 4.1625 14.909 5.075C15.303 5.9875 15.5 6.9625 15.5 8C15.5 9.0375 15.303 10.0125 14.909 10.925C14.5155 11.8375 13.9813 12.6313 13.3063 13.3063C12.6313 13.9813 11.8375 14.5155 10.925 14.909C10.0125 15.303 9.0375 15.5 8 15.5Z" fill="#36DA81"/>
              </svg>
              Available
            </div>
          )}
        </div>
        {formError?.name.exist && (
          <div className="mt-3 text-red">Side name already exist.</div>
        )}
        {formError?.name.length && (
          <div className="mt-3 text-red">
            Side name has to be between 3 and 50 character.
          </div>
        )}
      </div>

      {/* Description Section */}
      <div className="f-column mt-3">
        <div className="text-primary-light mb-2 text fw-600 size-13">
          Description
        </div>
        <div className="flex pointer">
          <TextArea
            height={100}
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            placeholder={"Describe your Side"}
            defaultValue={currentSide.description}
            onChange={onChangeSideDescription}
            radius="10px"
            maxLength={500}
          />
        </div>
        <div className="size-8">Max number of characters: 500</div>
      </div>

      {/* Private Side Section */}

      {!isNewSide ? (
        <div className="f-column mt-3">
          <div className="flex pointer">
            <div className="text-primary-light mb-1 text fw-600 mr-3">
              Private Side
            </div>
            <Switch onClick={onChangePrivate} value={currentSide.priv} />
          </div>
          <div className="size-8">
            Only invited users will be able to join this Side. All invitations
            will be received as requests.
          </div>
        </div>
      ) : null}

      {/* Submit Button */}
      {!isNewSide ? (
        <>
          <Button
            classes={"my-3"}
            width={"121px"}
            height={44}
            onClick={updateSide}
            radius={10}
            color={"var(--text-primary-light)"}
          >
            Save{" "}
          </Button>
          <LeavSideAsAdmin
            side={currentSide}
            handleLeaveSide={onSubmitLeaveSide}
          />
        </>
      ) : null}
    </InformationsStyled>
  );
}