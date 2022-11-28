import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiService } from "../../../../services/api.service";
import {
  updateCurrentProfile,
  UserData,
} from "../../../../redux/Slices/UserDataSlice";
import { RootState } from "../../../../redux/store/app.store";
import styled from "styled-components";
import { NFT } from "../../../../models/interfaces/nft";
import { fixURL } from "../../../../helpers/utilities";
import { Side } from "../../../../models/Side";
import { toast } from "react-toastify";
import NftsCollections from "../../../ui-components/NftsCollections";
import UserGeneralInformations from "../../../ui-components/UserGeneralInformations";
import { InitialStateUser } from "../../../GeneralSettings/Account/GeneralSettingsAccount";
import { Collection } from "../../../../models/interfaces/collection";
import _ from "lodash";
import { breakpoints, size } from "../../../../helpers/breakpoints";

const SideProfileAccountStyled = styled.div`
  // position: relative;
  display: flex;
  gap: 2rem;
  width: 100%;
  & .user-info-wrapper {
    width: 100%;
    ${breakpoints(size.lg, `{
      width: 50%;
    }`)}
  }
  & .nft-collections-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-primary);
    padding: 1rem;
    ${breakpoints(size.lg, `{
      position: relative;
      height: auto;
      padding: 0;
    }`)}
  }
`;

const initialStateUser = {
  username: "",
  bio: "",
  showNfts: false,
  avatar: null,
  publicNfts: null,
};

export default function SideProfileAccount({
  currentSide,
  userData,
}: {
  currentSide: Side;
  userData: UserData;
}) {
  const { currentProfile } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<InitialStateUser>(initialStateUser);

  const [filteredUserCollections, setFilteredUserCollections] = useState<
    Collection[]
  >([]);

  const [displayNftsCollection, setDisplayNftsCollection] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userData.userCollectionsData && userData.user) {
      const collections = Object.values(userData.userCollectionsData);
      const colls: Collection[] = filterCollection(
        collections,
        userData.user.publicNfts
      );
      setFilteredUserCollections(colls);
    }
  }, [userData.userCollectionsData, userData.user]);

  useEffect(() => {
    if (currentProfile?.profilePicture) {
      setFormData({
        ...formData,
        avatar: currentProfile.profilePicture,
        showNfts: currentProfile.showNfts,
      });
    }
  }, [currentProfile?.profilePicture]);

  const onSubmit = async () => {
    if (currentProfile && formData.avatar) {
      try {
        const profile = await apiService.updateProfile(currentProfile.id, {
          showNfts: formData.showNfts,
          profilePicture: formData.avatar,
        });
        dispatch(updateCurrentProfile(profile));
        toast.success("Profile updated");
        setDisplayNftsCollection(false);
      } catch (error) {
        toast.error("error saving your profile avatar");
        setDisplayNftsCollection(false);
      }
    }
  };

  const leaveSide = async () => {
    try {
      if (userData["currentProfile"]) {
        const res = await apiService.leaveSide(userData["currentProfile"]);
        if (res["error"]) toast.error(res["message"]);
        else {
          window.location.reload();
          toast.success(res["message"]);
        }
      }
    } catch (error) {
      toast.error("Error when leaving the side");
    }
  };

  const handleShowNfts = async (value: boolean) => {
    setFormData({ ...formData, showNfts: !value });
  };

  return (
    <SideProfileAccountStyled>
      <div className="user-info-wrapper">
        <UserGeneralInformations
          formData={formData}
          setFormData={undefined}
          onSubmit={onSubmit}
          currentSide={currentSide}
          displayNftsCollection={displayNftsCollection}
          setDisplayNftsCollection={setDisplayNftsCollection}
          userCollectionsData={userData.userCollectionsData}
          leaveSide={leaveSide}
        />
      </div>
      {displayNftsCollection &&
        userData &&
        userData.user &&
        userData.userCollectionsData &&
        userData.user.publicNfts && (
          <div className="nft-collections-wrapper">
            <NftsCollections
              selectedNfts={userData.user.publicNfts}
              collections={filteredUserCollections}
              profile={currentProfile}
              selectedAvatar={formData.avatar}
              setSelectedAvatar={(avatar: NFT) => {
                setFormData({ ...formData, avatar: avatar });
              }}
              handleShowNfts={handleShowNfts}
              formData={formData}
            />
          </div>
        )}
    </SideProfileAccountStyled>
  );
}

function filterCollection(
  collections: Collection[],
  publicNfts: NFT[]
): Collection[] {
  const colls: Collection[] = [];
  collections.forEach((currentValue: Collection) => {
    const collection = _.clone(currentValue);
    const nfts = collection.nfts;
    const filteredNfts = nfts.filter((nft: NFT) => {
      //@ts-ignore
      return publicNfts?.find((a) => a.token_id === nft.token_id);
    });
    collection.nfts = filteredNfts;
    if (collection.nfts.length !== 0) colls.push(collection);
  });
  return colls;
}
