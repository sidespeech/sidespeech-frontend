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
import defaultPP from "../../../../assets/default-pp.webp";
import hexagon from "../../../../assets/hexagon.svg";

export interface InitialStateProfile {
  profilePicture: NFT | undefined;
  username: string;
  bio: string;
  showNfts: boolean;
}

const initialStateProfile = {
  profilePicture: undefined,
  username: "",
  bio: "",
  showNfts: false
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

const ProfilePictureData = styled.div`
  height: 39px;
  width: 245px;
  border-radius: 7px;
  border: 1px solid var(--disable);
  display: flex;
  align-items: center;
  padding: 8px 12px;
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
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    undefined
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentProfile) {
      setCheckedNfts({
        ...checkedNfts,
        [currentProfile.profilePicture.token_address]: [
          currentProfile.profilePicture,
        ],
      });
      if (currentProfile.profilePicture.metadata) {
        const url = fixURL(currentProfile.profilePicture.metadata.image);
        setProfilePicture(url);
      }
    }
  }, [currentProfile]);

  const saveNftsProfilePicture = async () => {
    if (currentProfile && checkedNfts) {
      try {
        const profile = await apiService.updateProfilePicture(
          currentProfile?.id,
          Object.values(checkedNfts)[0][0]
        );
        dispatch(updateCurrentProfile(profile));
        toast.success("Profile Nft saved");
        setDisplayNftsCollection(false);
      } catch (error) {
        toast.error("error saving your profile picture");
        setDisplayNftsCollection(false);
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
    setFormData({ ...formData, profilePicture: selectedNft });
  };

  return (
    <div className="flex pr-2 text-main" style={{ gap: 30 }}>
      {/* Profile Picture Section */}
      <div className="f-column flex-1" style={{ maxWidth: "45%" }}>
        <div className="text-primary-light mb-3 text fw-600">Profile</div>

        <div className="flex mb-4">
          <ProfileLabel className="f-column align-center justify-center">
            {formData.profilePicture ? (
              <img
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
                src={
                  fixURL(formData.profilePicture.metadata.image) || defaultPP
                }
                alt="file-form"
              />
            ) : (
              <img
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
                src={profilePicture || defaultPP}
                alt="file"
              />
            )}
          </ProfileLabel>
          <div className="f-column ml-3">
            <label className="text-primary-light fw-600 f-column align-center justify-center ">
              Choose an NFT from your wallet as your profile avatar
            </label>
            {(profilePicture ||
              formData?.profilePicture) && (
                <ProfilePictureData className="mt-3">
                  <img src={hexagon} className="mr-3" />
                  {formData && formData.profilePicture ? (
                    <>
                      <span className="mr-2 size-12">
                        #{formData.profilePicture.token_id}
                      </span>
                      <span className="size-12">
                        {
                          userData.userCollectionsData[
                            formData.profilePicture.token_address
                          ]?.name
                        }
                      </span>
                    </>
                  ) : (
                    currentProfile &&
                    currentProfile.profilePicture && (
                      <>
                        <span className="mr-2 size-12">
                          #{currentProfile.profilePicture.token_id}
                        </span>
                        <span className="size-12">
                          {
                            userData.userCollectionsData[
                              currentProfile.profilePicture.token_address
                            ]?.name
                          }
                        </span>
                      </>
                    )
                  )}
                </ProfilePictureData>
              )}
          </div>

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
        </div>
        <Eligibility side={currentSide} />
        {/*TODO: Add function to leave a side */}
        <div onClick={undefined} className="text-red mt-4">
          Leave the side
        </div>
      </div>
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
  );
}
