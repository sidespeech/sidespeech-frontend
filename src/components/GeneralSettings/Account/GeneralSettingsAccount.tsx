import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// CSS Import
import "./../DefaultView.css";
import "./GeneralSettingsAccount.css";

// Example NFT icon.
import { RootState } from "../../../redux/store/app.store";
import { NFT } from "../../../models/interfaces/nft";
import _ from "lodash";
import { Collection } from "../../../models/interfaces/collection";
import {
  updateCurrentProfile,
  updateUser,
} from "../../../redux/Slices/UserDataSlice";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";
import Button from "../../ui-components/Button";
import UserGeneralInformations from "../../ui-components/UserGeneralInformations";
import NftsCollections from "../../ui-components/NftsCollections";

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
      const updatedUser = await apiService.updateUser(user.id, formData);
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

  return (
    <>
      {userCollectionsData && user && (
        <>
          <div className="account">
            <UserGeneralInformations
              user={user}
              userCollectionsData={userCollectionsData}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
            />

            {formData.publicNfts && collections.length > 0 && (
              <NftsCollections
                selectedNfts={formData.publicNfts}
                collections={collections}
                handleNftChange={handleNftChange}
                handleSelectAll={handleSelectAll}
                setSelectedAvatar={(data: NFT) =>
                  setFormData({ ...formData, avatar: data })
                }
                selectedAvatar={formData.avatar}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
