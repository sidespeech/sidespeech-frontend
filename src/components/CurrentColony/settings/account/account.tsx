import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import TextArea from "../../../ui-components/TextArea";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./account.css";
import { apiService } from "../../../../services/api.service";
import { addColony } from "../../../../redux/Slices/UserDataSlice";
import { RootState } from "../../../../redux/store/app.store";


export interface InitialStateProfile {
  profilePicture: string | undefined;
  username: string;
  bio: string;
}

const initialStateProfile = {
  profilePicture: undefined,
  username: "",
  bio: "",
};

export default function Account({
  currentSide, userData
}: {
  currentSide: Colony;
  userData: any;
}) {


  const [formData, setFormData] = useState<InitialStateProfile>(initialStateProfile);

  const dispatch = useDispatch();

  useEffect(() => {
  });

  const onChangeUsername = (event: any) => {
    const username = event.target.value;
    setFormData({ ...formData, username: username });
  };

  const onSubmit = async () => {
    try {
      if (!formData.profilePicture) {
        delete formData['profilePicture']
      }
      const updatedProfile = await apiService.updateProfile(userData['currentProfile']['id'], formData);
      toast.success(formData.username + " has been updated.", {
        toastId: 4,
      });

    } catch (error) {
      console.log(error);
      toast.error("Error when update profile.", { toastId: 3 });
    }
  };

  return (
    <>
      {/* Profile Picture Section */}
      <div className="f-column">
        <div className="text-primary-light mb-3 text fw-600">Account</div>


        <div className="flex">
          <label
            className="upload-colony-image f-column align-center justify-center"
          >
            {formData.profilePicture ? (
              <img
                style={{
                  height: "inherit",
                  width: "inherit",
                  objectFit: "cover",
                }}
                src={formData.profilePicture}
                alt="file"
              />
            ) : (
              <img
                style={{
                  height: "inherit",
                  width: "inherit",
                  objectFit: "cover",
                }}
                src={userData.currentProfile.profilePicture}
                alt="file"
              />
            )}
          </label>
          <label className="text-primary-light fw-600 f-column align-center justify-center text-center ml-3">Choose an NFT from your wallet as your account avatar</label>

          <div className="f-column align-center justify-center ml-3">
            <input
              accept=".png,.jpg,.jpeg,.webp"
              style={{ display: "none" }}
              id="input-colony-picture"
              type={"file"}
              onChange={undefined}
            />
            <label htmlFor={"input-colony-picture"}>
              <Button width={159} height={46} onClick={undefined} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}> Select an NFT</Button>
            </label>
          </div>
        </div>




      </div>


      {/* Username Section */}
      <div className="f-column mt-5">
        <div className="text-primary-light mb-3 text fw-600">Username</div>
        <div className="flex">
          <InputText
            height={40}
            width="50%"
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            placeholderColor="var(--text-primary-light)"
            placeholder={userData.currentProfile.username}
            onChange={onChangeUsername}
            radius="10px"
          />
        </div>
      </div>

      {/* Description Section */}
      <div className="f-column mt-5">
        <div className="text-primary-light mb-3 text fw-600">Bio</div>
        <div className="flex">
          <TextArea
            height={120}
            width="70%"
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            placeholder={"Describe yourself"}
            placeholderColor="var(--text-primary-light)"
            onChange={undefined}
            radius="10px"
          />
        </div>
      </div>

      {/* Wallet Section */}
      <div className="f-column mt-5">
        <div className="text-primary-light mb-3 text fw-600">Connected wallet</div>
        <div className="flex">
          <InputText
            height={40}
            width="70%"
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            placeholder={userData.account}
            onChange={undefined}
            disabled={true}
            radius="10px"
          />
        </div>
      </div>


      {/* Submit Button */}
      <Button classes={"mt-3"} width={159} height={46} onClick={onSubmit} radius={10} color={'var(--text-primary-light)'}>Save </Button>
    </>
  );
}
