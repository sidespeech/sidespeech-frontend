import React, { useEffect, useState } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { disconnect, updateUser } from "../../redux/Slices/UserDataSlice";
// models
import { User } from "../../models/User";
// ui component
import Button from "../ui-components/Button";
import InputText from "../ui-components/InputText";
import TextArea from "../ui-components/TextArea";
// icons
import copyIcon from "./../../assets/copy-icon.svg";
import closeWalletIcon from "./../../assets/close-wallet.svg";
// other
import { toast } from "react-toastify";
import {
  fixURL,
  reduceWalletAddress,
  validateBio,
  validateUsername,
} from "../../helpers/utilities";
import Eligibility from "../CurrentColony/settings/eligibility/eligibility";
import styled from "styled-components";
import { Side } from "../../models/Side";
import { InitialStateUser } from "../GeneralSettings/Account/GeneralSettingsAccount";
import Avatar from "../GeneralSettings/Account/Avatar";
import { breakpoints, size } from "../../helpers/breakpoints";

const UserGeneralInformationsStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
  & .user-info-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    ${breakpoints(size.md, `{
      flex-direction: row;
    }`)}
  }
`;

interface InitialErrorState {
  username: boolean;
  bio: boolean;
}

const initialStateError = {
  username: true,
  bio: true,
};

interface IUserGeneralInformationsProps {
  user?: User;
  currentSide?: Side;
  userCollectionsData?: any;
  formData: InitialStateUser;
  setFormData: any;
  onSubmit: any;
  displayNftsCollection?: boolean;
  setDisplayNftsCollection?: any;
  leaveSide?:any;
}

export default function UserGeneralInformations({
  user,
  currentSide,
  userCollectionsData,
  formData,
  setFormData,
  onSubmit,
  displayNftsCollection,
  setDisplayNftsCollection,
  leaveSide
}: IUserGeneralInformationsProps) {
  const [errorData, setErrorData] =
    useState<InitialErrorState>(initialStateError);

  const [collectionName, setCollectionName] = useState<string | undefined>(
    undefined
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const walletAddress = window.ethereum.selectedAddress;

  useEffect(() => {
    if (formData.avatar) {
      setCollectionName(
        userCollectionsData[formData.avatar.token_address]?.name
      );
    }
  }, [formData]);

  //#region Form handlers

  const onChangeUsername = (event: any) => {
    const username = event.target.value;
    const isValid = validateUsername(username);
    setErrorData({ ...errorData, username: isValid });

    setFormData({ ...formData, username: username });
  };

  const onChangeBio = (event: any) => {
    const bio = event.target.value;
    const validLength = validateBio(bio);
    setErrorData({ ...errorData, bio: validLength });
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

  const renderAvatar = () => {
    return (
      <div className="user-info-header">
        <Avatar nft={formData.avatar} collectionName={collectionName} />
        {!displayNftsCollection && !user && (
          <Button
            width={"159px"}
            height={46}
            onClick={() => setDisplayNftsCollection(true)}
            radius={10}
            background={"var(--bg-secondary-light)"}
            color={"var(--text-primary-light)"}
          >
            Select an NFT
          </Button>
        )}
      </div>
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
      <div className="f-column">
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
      <>
        {currentSide && (
          <div onClick={leaveSide} className="text-red cursor-pointer">
            Leave the side
          </div>
        )}
      </>
    );
  };

  return (
    <UserGeneralInformationsStyled>
      {renderAvatar()}
      {!currentSide && (
        <>
          {/* Username Section */}
          {renderUsername()}
          {/* Description Section */}
          {renderBio()}
        </>
      )}

      {/* Eligibility Section */}
      {currentSide && <Eligibility side={currentSide} />}

      {
        <div className="submitArea">
          <Button
            width={"164px"}
            height={44}
            radius={10}
            color={"var(--text-primary-light)"}
            onClick={onSubmit}
          >
            Save
          </Button>
        </div>
      }

      {/* Wallet Section */}
      {!currentSide && renderConnectedWallet()}
      {currentSide && renderLeave()}

    </UserGeneralInformationsStyled>
  );
}
