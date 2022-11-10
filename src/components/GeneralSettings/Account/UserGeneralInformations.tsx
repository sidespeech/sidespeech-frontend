import React, { useEffect, useState } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { disconnect, updateUser } from "../../../redux/Slices/UserDataSlice";
// service
import { apiService } from "../../../services/api.service";
// models
import { User } from "../../../models/User";
// ui component
import Button from "../../ui-components/Button";
import InputText from "../../ui-components/InputText";
import TextArea from "../../ui-components/TextArea";
// icons
import copyIcon from "./../../../assets/copy-icon.svg";
import closeWalletIcon from "./../../../assets/close-wallet.svg";
// other
import { toast } from "react-toastify";
import { fixURL, reduceWalletAddress } from "../../../helpers/utilities";
import Eligibility from "../../CurrentColony/settings/eligibility/eligibility";
import styled from "styled-components";
import { NFT } from "../../../models/interfaces/nft";
import { RootState } from "../../../redux/store/app.store";
import { Side } from "../../../models/Side";
import { Profile } from "../../../models/Profile";
import Avatar from "./Avatar";

export interface InitialStateUser {
  username: string;
  bio: string;
  profilePicture: NFT | undefined;
  showNfts: boolean;
}
interface InitialErrorState {
  username: boolean;
  bio: boolean;
}

const initialStateError = {
  username: true,
  bio: true,
};
const initialStateUser = {
  username: "",
  bio: "",
  showNfts: false,
  profilePicture: undefined,
};

interface IUserGeneralInformationsProps {
  user?: User;
  currentSide?: Side;
  currentProfile?: Profile;
  userCollectionsData?: any;
}

export default function UserGeneralInformations({
  user,
  currentSide,
  currentProfile,
  userCollectionsData,
}: IUserGeneralInformationsProps) {
  const [formData, setFormData] = useState<InitialStateUser>(initialStateUser);
  const [errorData, setErrorData] =
    useState<InitialErrorState>(initialStateError);
  const [displayNftsCollection, setDisplayNftsCollection] =
    useState<boolean>(false);
  const [checkedNfts, setCheckedNfts] = useState<{
    [key: string]: NFT[];
  } | null>(null);
  const [profilePicture, setProfilePicture] = useState<NFT | undefined>(
    undefined
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const walletAddress = window.ethereum.selectedAddress;

  useEffect(() => {
    if (user)
      setFormData({ ...formData, bio: user.bio, username: user.username });
  }, [user]);

  useEffect(() => {
    if (currentProfile) {
      setCheckedNfts({
        ...checkedNfts,
        [currentProfile.profilePicture.token_address]: [
          currentProfile.profilePicture,
        ],
      });
      if (currentProfile.profilePicture.metadata) {
        setProfilePicture(currentProfile.profilePicture);
      }
    }
  }, [currentProfile]);

  //#region Form handlers

  const onChangeUsername = (event: any) => {
    const username = event.target.value;
    validateUsername(username);
    setFormData({ ...formData, username: username });
  };
  const onChangeBio = (event: any) => {
    const bio = event.target.value;
    validateBio(bio);
    setFormData({ ...formData, bio: bio });
  };
  const handleCopyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Address copied successfuly.", { toastId: 1 });
  };
  const logout = () => {
    dispatch(disconnect());
    localStorage.clear();
    navigate("/");
  };
  //#endregion

  //#region Submit functions

  const onSubmit = async () => {
    if (!user) return;
    if (!validateForm()) {
      return toast.error("Form data are invalid", { toastId: 7 });
    }
    try {
      await apiService.updateUser(user.id, formData);
      dispatch(updateUser({ ...formData }));
      toast.success(formData.username + " has been updated.", {
        toastId: 4,
      });
    } catch (error) {
      toast.error("There has been an issue updating your account.", {
        toastId: 3,
      });
      console.log(error);
    }
  };
  //#endregion

  //#region Form validation

  const validateForm = () => {
    return validateUsername(formData.username) && validateBio(formData.bio);
  };

  const validateUsername = (username: string) => {
    const re = new RegExp("^[a-zA-Z0-9]*$");
    const isValid = re.test(username);
    setErrorData({ ...errorData, username: isValid });
    return isValid;
  };

  const validateBio = (bio: string) => {
    const length = bio.length;
    const validLength = length <= 500;
    setErrorData({ ...errorData, bio: validLength });
    return validLength;
  };
  //#endregion

  const renderAvatar = () => {
    return (
      <>
        {profilePicture && (
          <Avatar
            nft={profilePicture}
            collectionName={
              userCollectionsData[profilePicture.token_address].name
            }
          />
        )}
        {!displayNftsCollection && (
          <div className="f-column align-center justify-center ml-3">
            <label htmlFor={"input-profile-picture"}>
              <Button
                width={159}
                height={46}
                onClick={() => setDisplayNftsCollection(true)}
                radius={10}
                background={"var(--bg-secondary-light)"}
                color={"var(--text-primary-light)"}
              >
                {" "}
                Select an NFT
              </Button>
            </label>
          </div>
        )}
      </>
    );
  };

  const renderUsername = () => {
    return (
      <div className="f-column mt-5">
        <div className="text-primary-light mb-3 text fw-600">Username</div>
        <InputText
          height={40}
          width="100%"
          bgColor="var(--bg-secondary-dark)"
          glass={false}
          placeholderColor="var(--text-primary-light)"
          placeholder={"Your username"}
          defaultValue={user?.username || ""}
          onChange={onChangeUsername}
          radius="10px"
        />
        {!errorData.username && (
          <div className="text-red"> Only letters and numbers</div>
        )}
      </div>
    );
  };

  const renderBio = () => {
    return (
      <div className="f-column mt-5">
        <div className="text-primary-light mb-3 text fw-600">Bio</div>
        <TextArea
          height={120}
          width="100%"
          bgColor="var(--bg-secondary-dark)"
          glass={false}
          placeholder={"Describe yourself"}
          defaultValue={user?.bio || ""}
          placeholderColor="var(--text-primary-light)"
          onChange={onChangeBio}
          radius="10px"
          maxLength={500}
        />
        {!errorData.bio && (
          <div className="text-red">Max number of charactere is 500.</div>
        )}
      </div>
    );
  };

  const renderConnectedWallet = () => {
    return (
      <div className="f-column mt-5">
        <div className="text-primary-light mb-3 text fw-600">
          Connected wallet
        </div>
        <div className="flex">
          <div className="w-100 relative">
            <InputText
              height={40}
              width="100%"
              bgColor="var(--bg-secondary-dark)"
              glass={false}
              placeholder={reduceWalletAddress(user?.accounts || "")}
              onChange={undefined}
              disabled={true}
              defaultValue={reduceWalletAddress(walletAddress)}
              radius="10px"
            />
            <div className="copy" onClick={handleCopyWalletAddress}>
              <p>Copy</p> <img src={copyIcon} />
            </div>
          </div>

          <div className="closeWallet cursor-pointer" onClick={logout}>
            <img src={closeWalletIcon} />
          </div>
        </div>
      </div>
    );
  };

  const renderLeave = () => {
    return (
      <div onClick={undefined} className="text-red mt-4">
        Leave the side
      </div>
    );
  };

  const SubmitButton = () => {
    return (
      <Button
        classes={"mt-3"}
        width={121}
        height={44}
        onClick={onSubmit}
        radius={10}
        color={"var(--text-primary-light)"}
      >
        Save{" "}
      </Button>
    );
  };

  return (
    <div className="f-row form-area">
      {renderAvatar()}
      {/* Username Section */}
      {renderUsername()}

      {/* Description Section */}
      {renderBio()}
      {/* Eligibility Section */}
      {currentSide && <Eligibility side={currentSide} />}

      {/* Wallet Section */}
      {renderConnectedWallet()}
      {renderLeave()}

      {/* Submit Button */}
      <SubmitButton />
    </div>
  );
}
