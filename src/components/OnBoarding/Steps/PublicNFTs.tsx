import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// CSS Import
import "./../../GeneralSettings/DefaultView.css";
// import "./../../GeneralSettings/Account/Account.css";

import Button from "../../ui-components/Button";

// Example NFT icon.
import { RootState } from "../../../redux/store/app.store";
import NftsCollections from "./../../ui-components/NftsCollections";
import { NFT } from "../../../models/interfaces/nft";
import _ from "lodash";
import { Collection } from "../../../models/interfaces/collection";


export interface InitialStateUser {
  username?: string;
  bio?: string;
  showNfts?: boolean;
  avatar: NFT | null;
  publicNfts: NFT[] | null;
}

const initialStateUser = {
  username: "",
  bio: "",
  showNfts: false,
  avatar: null,
  publicNfts: null,
};

type ChildProps = {
  updateCurrentStep: (step: string) => void;
}

export default function PublicNFTs({
  updateCurrentStep
}: ChildProps) {
  const { user, userCollectionsData } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState<InitialStateUser>(initialStateUser);


  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    if (userCollectionsData && user) {
      const collections = Object.values(userCollectionsData);
      if (user.publicNfts) {
        console.log(user.publicNfts);
        setFormData({
          ...formData,
          publicNfts: user.publicNfts,
          bio: user.bio,
          avatar: user.userAvatar,
          username: user.username,
        });
      }
      setCollections(Object.values(userCollectionsData));
      //setSelectedAvatar(user.userAvatar);
    }
  }, [userCollectionsData, user]);

  const handleNftChange = (selectedNft: NFT) => {
    const checkedNfts = formData.publicNfts;
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

  const goBack = () => {
    return updateCurrentStep("step 2");
  };


  const onSubmit = async () => {
    try {
      
      // Update the step to go to that we are on.
      updateCurrentStep("step 4");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    test
      {userCollectionsData && user && (
        <div className="nft-step">
          {formData.publicNfts && collections.length > 0 && (
              <NftsCollections
                selectedNfts={formData.publicNfts}
                collections={collections}
                handleNftChange={handleNftChange}
                handleSelectAll={handleSelectAll}
              />
            )}
        </div>
      )}
      <div className="actions">
          <Button
            classes={"mt-3 back"}
            width={"121px"}
            height={44}
            onClick={goBack}
            radius={10}
            color={"var(--text-primary-light)"}
          >
            Back
          </Button>

          {/* Submit Button */}
          <Button
            classes={"mt-3 submit"}
            width={"121px"}
            height={44}
            onClick={onSubmit}
            radius={10}
            color={"var(--text-primary-light)"}
          >
              Continue
          </Button>
      </div>
    </>
  );
}
