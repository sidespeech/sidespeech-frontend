import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import TextArea from "../../../ui-components/TextArea";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./informations.css";
import { apiService } from "../../../../services/api.service";
import { addColony } from "../../../../redux/Slices/UserDataSlice";
import { useSearchParams } from "react-router-dom";
import { Side } from "../../../../models/Side";
import Switch from "../../../ui-components/Switch";

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
  formError,
}: {
  currentSide: Side;
  userData?:any;
  onChangeNewSideName?: any;
  onChangeNewSideImage?: any;
  formError?: any;
}) {
  const [formData, setFormData] = useState<InitialStateUpdateSide>(
    initialStateUpdateSide
  );
  const [isNewSide, setIsNewSide] = useState<boolean>(true);
  const [subAdmin, setSubAdmin] = useState<string>('');

  useEffect(() => {
    if (window.location.href.includes("settings")) {
      setIsNewSide(false);
      setFormData({ sideImage: currentSide['sideImage'], name: currentSide['name'], description: currentSide['description'], private: currentSide['private'] })
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
      const updatedSide = await apiService.updateSide(
        formData,
        currentSide["id"]
      );
      toast.success(formData.name + " has been updated.", {
        toastId: 4,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error when update side.", { toastId: 3 });
    }
  };

  const onChangeSubAdmin = (event:any) => {
    if (event.target.value.length) {
      setSubAdmin(event.target.value)
    }
  };

  const onSubmitSubAdmin = async () => {
    let result = await apiService.updateSubAdmin(subAdmin, currentSide['id']);
    (result['error']) ? toast.error(result['message'], { toastId: 3 }) : toast.success(result['message'], { toastId: 4 });
  };

  const onSubmitLeaveSide = async () => {
    let result = await apiService.leaveSide(userData['currentProfile']);
    if (result['error'])
      toast.error(result['message'], { toastId: 3 })
    else {
      toast.success(result['message'], { toastId: 4 });
      window.location.reload();
    }
  };

  return (
    <>
      {/* Profile Picture Section */}
      <div className="f-column">
        <div className="text-primary-light mb-2 text fw-600 size-13">
          Profile Picture
        </div>

        <div className="flex">
          <label className="upload-colony-image f-column align-center justify-center">
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
                src={currentSide.sideImage}
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

          <label className="text-primary-light fw-600 f-column align-center justify-center text-center ml-3 size-11">
            Use square image (1:1 ratio) to have a better rendering.
          </label>

          <div className="f-column align-center justify-center ml-3">
            <input
              accept=".png,.jpg,.jpeg,.webp"
              style={{ display: "none" }}
              id="input-colony-picture"
              type={"file"}
              onChange={onChangeSideImage}
            />
            <label htmlFor={"input-colony-picture"}>
              <Button
                width={129}
                height={36}
                onClick={undefined}
                radius={10}
                background={"var(--bg-secondary-light)"}
                color={"var(--text-primary-light)"}
                fontSize={"11px"}
              >
                {" "}
                Upload a new image
              </Button>
            </label>
          </div>
        </div>
      </div>

      {/* Name Section */}
      <div className="f-column mt-3">
        <div className="text-primary-light mb-2 text fw-600 size-13">Side Name</div>
        <div className="flex">
          <InputText
            parentWidth="30%"
            height={35}
            width="70%"
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            defaultValue={currentSide.name}
            onChange={onChangeSideName}
            radius="10px"
          />
        </div>
        {formError?.name.exist && (
          <div className="text-red">Side name already exist.</div>
        )}
        {formError?.name.length && (
          <div className="text-red">
            Side name has to be between 3 and 50 character.
          </div>
        )}
      </div>

      {/* Description Section */}
      <div className="f-column mt-3">
        <div className="text-primary-light mb-2 text fw-600 size-13">Description</div>
        <div className="flex">
          <TextArea
            height={100}
            width="68%"
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            placeholder={"Describe your Side"}
            onChange={undefined}
            radius="10px"
            maxLength={500}
          />
        </div>
        <div className="size-8">Max number of characters: 500</div>
      </div>

      {/* Private Side Section */}

      {
        !isNewSide ? (
          <div className="f-column mt-3">
            <div className="flex">
              <div className="text-primary-light mb-1 text fw-600 mr-3">Private Side</div>
              <Switch
                onClick={onChangePrivate}
                value={currentSide.priv}
              />
            </div>
            <div className="size-8">Only invited users will be able to join this Side. All invitations will be received as requests.</div>
          </div>
        ) : null
      }


      {/* Submit Button */}
      {
        !isNewSide ? (
          <>
            <Button
              classes={"mt-1"}
              width={159}
              height={46}
              onClick={updateSide}
              radius={10}
              color={"var(--text-primary-light)"}
            >
              Save{" "}
            </Button>

            <div className='yellowDiv mt-3'>
              <button className='flex' onClick={onSubmitLeaveSide}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <p>Leave the side</p>
              </button>

              <p className='sub-text mt-2'>To leave a side, you must define a sub-admin-user who will become the new administrator</p>

              <div className='btm-div'>
                <p className='btm-div-head mt-3'>Define a sub-admin User</p>
                <p className='btm-div-nor'>Search for a username or wallet address registered on<br /> SideSpeech</p>
                <div className='typ-sm mt-3'>
                  {/* <input className='sideInput' placeholder='Type something' /> */}
                  <InputText
                    parentWidth="100%"
                    height={35}
                    width="100%"
                    bgColor="rgba(19, 19, 16, 0.55)"
                    glass={false}
                    placeholder={"Type something"}
                    onChange={onChangeSubAdmin}
                    radius="10px"
                  />
                  <Button
                    width={149}
                    height={36}
                    onClick={onSubmitSubAdmin}
                    radius={10}
                    background={"rgba(19, 19, 16, 0.55)"}
                    color={"var(--text-primary-light)"}
                    fontSize={"11px"}
                    classes={"ml-3"}
                  >
                    {" "}
                    Update Sub-admin
                  </Button>
                </div>

              </div>
            </div>
          </>
        ) : null
      }

    </>
  );
}
