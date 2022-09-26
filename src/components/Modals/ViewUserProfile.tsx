import { format } from "date-fns";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import styled from "styled-components";
import { getRoleColor } from "../../helpers/utilities";
import { Colony } from "../../models/Colony";
import { RootState } from "../../redux/store/app.store";

import Button from "../ui-components/Button";
import CustomSelect from "../ui-components/CustomSelect";
import InputText from "../ui-components/InputText";
import Modal from "../ui-components/Modal";
import { UserProfileNFTBadge } from "./UserProfileModal";

const ProfilePicture = styled.div`
  min-width: 90px;
  min-height: 90px;
  max-width: 90px;
  max-height: 90px;
  background-color: var(--bg-secondary-dark);
  border-radius: 45px;
  position: relative;
  overflow: hidden;
  & > img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const SavedNftsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
`;

const Container = styled.div`
  max-width: 475px;
  width: 100%;
  padding: 12px 10px;
  background: var(--bg-primary);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export default function ViewUserProfile({
  colony,
  showModal,
  profile,
}: {
  colony: Colony;
  showModal: any;
  profile: any;
}) {
  const [savedNfts, setSavedNfts] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      setSavedNfts(
        _.groupBy(profile.get("user").get("savedNfts"), "collection")
      );
    }
    if (profile) {
      console.log(
        profile.get("user"),
        profile.get("user").get("profilePicture")
      );
      setProfilePicture(profile.get("user").get("profilePicture"));
    }
  }, [profile, colony]);

  return (
    <Modal
      showModal={showModal}
      body={
        <>
          <ProfilePicture>
            {profilePicture && <img alt="profile" src={profilePicture.url} />}
          </ProfilePicture>
          <div className="fw-400 size-16 my-2">{profile.get("username")}</div>
          <div className="fw-400 size-11">
            Join the colony the {format(profile.get("createdAt"), "yyyy-mm-dd")}
          </div>
          <div className="fw-400 size-14 my-3">
            <span>Status:</span>{" "}
            <span
              className={
                getRoleColor(profile.get("role").get("name")) + " fw-700"
              }
            >
              {profile.get("role").get("name")}
            </span>
          </div>
          {savedNfts && (
            <Container>
              {Object.keys(savedNfts).map((name: any) => {
                return (
                  <div>
                    <div className="mb-1">{name}</div>
                    <SavedNftsContainer>
                      {savedNfts[name].map((nft: any, index: number) => {
                        return (
                          <UserProfileNFTBadge id={"nft" + index.toString()}>
                            <img
                              width={50}
                              height={50}
                              src={nft.url}
                              alt="nft"
                            />
                          </UserProfileNFTBadge>
                        );
                      })}
                    </SavedNftsContainer>
                  </div>
                );
              })}
            </Container>
          )}
        </>
      }
      footer={undefined}
      title={<span></span>}
    />
  );
}
