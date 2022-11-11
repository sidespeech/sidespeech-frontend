import React, { useEffect, useState } from "react";
import Button from "../../../ui-components/Button";
import { useDispatch, useSelector } from "react-redux";
import "./account.css";
import { apiService } from "../../../../services/api.service";
import {
  updateCurrentProfile,
  UserData,
} from "../../../../redux/Slices/UserDataSlice";
import { RootState } from "../../../../redux/store/app.store";
import Eligibility from "../eligibility/eligibility";
import NftsCollections from "../../../GeneralSettings/Account/NftsCollections";
import styled from "styled-components";
import { NFT } from "../../../../models/interfaces/nft";
import { fixURL } from "../../../../helpers/utilities";
import { Side } from "../../../../models/Side";
import { toast } from "react-toastify";

export interface InitialStateProfile {
  profilePicture: NFT | undefined;
  username: string;
  bio: string;
}

const initialStateProfile = {
  profilePicture: undefined,
  username: "",
  bio: "",
};

const ProfileLabel = styled.label`
  min-width: 70px;
  min-height: 70px;
  max-width: 70px;
  max-height: 70px;
  cursor: pointer;
  background: var(--bg-secondary-dark);
  border: 2px dashed var(--bg-primary-light);
  border-radius: 100px;
  text-align: center;
  color: var(--bg-primary-light);
  overflow: hidden;
`;

export default function Account({
  currentSide,
  userData,
}: {
  currentSide: Side;
  userData: UserData;
}) {
  const { currentProfile } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] =
    useState<InitialStateProfile>(initialStateProfile);
  const [displayNftsCollection, setDisplayNftsCollection] =
    useState<boolean>(false);
  const [checkedNfts, setCheckedNfts] = useState<{
    [key: string]: NFT[];
  } | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentProfile)
      setCheckedNfts({
        ...checkedNfts,
        [currentProfile.profilePicture.token_address]: [
          currentProfile.profilePicture,
        ],
      });
  }, [currentProfile]);

  const saveNftsProfilePicture = async () => {
    if (currentProfile && checkedNfts) {
      try {
        const profile = await apiService.updateProfilePicture(
          currentProfile?.id,
          Object.values(checkedNfts)[0][0]
        );
        dispatch(updateCurrentProfile(profile));
        toast.success("Profile Nft saved")
      } catch (error) {
        toast.error("error saving your profile picture")
      }
    }
  };

  const handleNftChange = (selectedNft: NFT) => {
    if (!checkedNfts) return;
    const nfts = checkedNfts[selectedNft.token_address];
    const index = nfts?.findIndex(
      (nft) =>
        nft.token_address === selectedNft.token_address &&
        nft.token_id === selectedNft.token_id
    );
    if (index && index !== -1) {
      const tmp = [...checkedNfts[selectedNft.token_address]];
      tmp.splice(index, 1);
      setCheckedNfts({ ...checkedNfts, [selectedNft.token_address]: tmp });
    } else {
      setCheckedNfts({
        [selectedNft.token_address]: [selectedNft],
      });
    }
    setFormData({...formData, profilePicture: selectedNft });
  };

  return (
    <div className="flex pr-2" style={{gap: 30}}>
      {/* Profile Picture Section */}
      <div className="f-column flex-1">
        <div className="text-primary-light mb-3 text fw-600">Account</div>

        <div className="flex">
          <ProfileLabel className="f-column align-center justify-center">
            {formData.profilePicture ? (
              <img
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
                src={fixURL(formData.profilePicture.metadata.image || "")}
                alt="file-form"
              />
            ) : (
              <img
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
                src={fixURL(currentProfile?.profilePicture.metadata?.image || "")}
                alt="file"
              />
            )}
          </ProfileLabel>
          <label className="text-primary-light fw-600 f-column align-center justify-center text-center ml-3">
            Choose an NFT from your wallet as your profile avatar
          </label>

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
        </div>
        <div className="mt-5">
        <Eligibility side={currentSide} />
        </div>
      </div>
      <div className="flex-1">
        {displayNftsCollection &&
          checkedNfts &&
          userData.userCollectionsData &&
          userData.user && (
            <NftsCollections
              selectedNfts={checkedNfts}
              handleNftChange={handleNftChange}
              collections={Object.values(userData.userCollectionsData)}
              user={userData.user}
              profile={currentProfile}
              saveNftsProfilePicture={saveNftsProfilePicture}
            />
          )}
      </div>
    </div>
  );
}
