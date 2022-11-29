import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';

// Example NFT icon.
import { RootState } from "../../../redux/store/app.store";
import { NFT } from "../../../models/interfaces/nft";
import _ from "lodash";
import { Collection } from "../../../models/interfaces/collection";
import {
  // updateCurrentProfile,
  updateUser,
} from "../../../redux/Slices/UserDataSlice";
import { toast } from "react-toastify";

// import Button from "../../ui-components/Button";
import UserGeneralInformations from "../../ui-components/UserGeneralInformations";
import NftsCollections from "../../ui-components/NftsCollections";
import { Icons, PageTitle } from "../DefaultView";
import { breakpoints, size } from "../../../helpers/breakpoints";
import Button from "../../ui-components/Button";
import { useGeneralSettingsContext } from "../../../App";
import userService from "../../../services/api-services/user.service";

const GeneralSettingsAccountStyled = styled.div`
  width: 100%;
  padding: 2rem 1rem;
  & .content-wrapper {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    & .account{
      width: 100%;
      height: calc(100vh - 77px - 4rem - 22px);
      overflow-y: scroll;
      padding-right: 10px;
      padding-bottom: 77px;
      ${breakpoints(size.lg, `{
        height: calc(100vh - 4rem - 22px);
        overflow-y: hidden;
        padding-right: 0;
        padding-bottom: 0;
      }`)}
    }
    & .nft-collections-wrapper {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9905;
      background-color: var(--bg-primary);
      padding: 1rem;
      &.show {
        display: block;
      }
      ${breakpoints(size.lg, `{
        display: block;
        position: relative;
        height: auto;
        width: 100%;
        padding: 0;
      }`)}
      & .close-modal-btn {
        position: absolute;
        top: 2rem;
        right: 2rem;
        z-index: 12;
        background-color: transparent;
        border: none;
        outline: none;
        box-shadow: none;
        border-radius: 1400px;
        ${breakpoints(size.lg, `{
          display: none;
        }`)}
        &:focus {
          outline: 1px solid var(--primary);
        }
      }
      & .buttons-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        ${breakpoints(size.lg, `{
          display: none;
        }`)}
      }
    }
  }
`;

export interface InitialStateUser {
  username?: string;
  bio?: string;
  avatar: NFT | null;
  showNfts?: boolean;
  publicNfts: NFT[] | null;
}
const initialStateUser = {
  username: "",
  bio: "",
  showNfts: false,
  avatar: null,
  publicNfts: null,
};

export default function GeneralSettingsAccount() {
  const { user, userCollectionsData } = useSelector(
    (state: RootState) => state.user
  );
  const [collections, setCollections] = useState<Collection[]>([]);
  const [formData, setFormData] = useState<InitialStateUser>(initialStateUser);

  const {setIsSettingsMobileMenuOpen} = useGeneralSettingsContext();

  const [displayNftsCollection, setDisplayNftsCollection] =
    useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<NFT | null>(null);

  const { currentProfile } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userCollectionsData && user) {
      const collections = Object.values(userCollectionsData);
      if (user.publicNfts) {
        setFormData({
          ...formData,
          publicNfts: user.publicNfts,
          bio: user.bio,
          avatar: user.userAvatar,
          username: user.username,
        });
      }
      setCollections(Object.values(userCollectionsData));
      setSelectedAvatar(user.userAvatar);
    }
  }, [userCollectionsData, user]);

  const handleNftChange = (selectedNft: NFT) => {
    const checkedNfts = formData.publicNfts;
    if (
      selectedAvatar?.token_address === selectedNft.token_address &&
      selectedAvatar?.token_id === selectedNft.token_id
    )
      return;
    if (!checkedNfts) return;
    const index = checkedNfts.findIndex(
      (nft) =>
        nft.token_address === selectedNft.token_address &&
        nft.token_id === selectedNft.token_id
    );
    if (index !== -1) {
      const tmp = [...checkedNfts];
      tmp.splice(index, 1);
      const nfts = [...tmp];
      setFormData({ ...formData, publicNfts: nfts });
    } else {
      const nfts = [...checkedNfts, selectedNft];
      setFormData({ ...formData, publicNfts: nfts });
    }
  };

  const handleSelectAll = (nfts: NFT[], isAllSelected: boolean) => {
    const publicNfts = formData.publicNfts;
    if (!publicNfts) return;
    const address = nfts[0].token_address;
    if (isAllSelected) {
      const tmp = publicNfts.filter((nft) => nft.token_address !== address);
      setFormData({
        ...formData,
        publicNfts: [...tmp],
      });
    } else {
      const values = publicNfts;
      const array = _.union(values, nfts);
      setFormData({
        ...formData,
        publicNfts: [...array],
      });
    }
  };

  const onSubmit = async () => {
    if (!user) return;
    try {
      const updatedUser = await userService.updateUser(user.id, formData);
      dispatch(updateUser(updatedUser));
      toast.success(updatedUser.username + " has been updated.", {
        toastId: 4,
      });
    } catch (error) {
      toast.error("There has been an issue updating your account.", {
        toastId: 3,
      });
    }
  };

  const handleCloseNftModal = () => {
    setFormData(prevValues => ({ ...prevValues, avatar: null }));
    setDisplayNftsCollection(false);
  }

  return (
    <GeneralSettingsAccountStyled>
      <PageTitle title="Account" Icon={Icons.profile} onBack={() => setIsSettingsMobileMenuOpen?.(true)} />
      {userCollectionsData && user && (
        <div className="content-wrapper">
          <div className="account">
            <UserGeneralInformations
              user={user}
              userCollectionsData={userCollectionsData}
              formData={formData}
              setDisplayNftsCollection={setDisplayNftsCollection}
              setFormData={setFormData}
              onSubmit={onSubmit}
            />
          </div>

          {formData.publicNfts && collections.length > 0 && (
            <div className={`nft-collections-wrapper ${displayNftsCollection ? 'show' : ''}`}>
              <button className="close-modal-btn" onClick={handleCloseNftModal}>
                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.2 13L0 11.7L4.8 6.5L0 1.3L1.2 0L6 5.2L10.8 0L12 1.3L7.2 6.5L12 11.7L10.8 13L6 7.8L1.2 13Z" fill="#B4C1D2"/>
                </svg>
              </button>
              <NftsCollections
                selectedNfts={formData.publicNfts}
                collections={collections}
                handleNftChange={handleNftChange}
                handleSelectAll={handleSelectAll}
                setSelectedAvatar={(avatar: NFT) =>
                  setFormData(prevState => ({ ...prevState, avatar }))
                }
                selectedAvatar={formData.avatar}
              />
              <div className="buttons-wrapper">
                <Button
                  color={"var(--text-primary-light)"}
                  onClick={onSubmit}
                  width={"100%"}
                >
                  Save this selection
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </GeneralSettingsAccountStyled>
  );
}