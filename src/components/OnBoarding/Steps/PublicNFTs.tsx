import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "../../ui-components/Button";

// service
import { apiService } from "../../../services/api.service";

// Example NFT icon.
import { RootState } from "../../../redux/store/app.store";
import NftsCollections from "./../../ui-components/NftsCollections";
import { NFT } from "../../../models/interfaces/nft";
import _ from "lodash";
import { Collection } from "../../../models/interfaces/collection";

import {
  updateUser
} from "../../../redux/Slices/UserDataSlice";

// other
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

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
  updateCurrentStep: (step: number) => void;
}

export default function PublicNFTs({
  updateCurrentStep
}: ChildProps) {
  const { user, userCollectionsData } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState<InitialStateUser>(initialStateUser);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    if (userCollectionsData && user) {
      const collections = Object.values(userCollectionsData);

      // if (user.username) {
        setFormData({
          ...formData,
          publicNfts: user.publicNfts,
          bio: user.bio,
          avatar: user.userAvatar,
          username: user.username,
        });
      // }

      setCollections(Object.values(collections));
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
    return updateCurrentStep(3);
  };

  const onSubmit = async () => {
    if (!user) return;

    try {

      const updatedUser = await apiService.updateUser(user.id, formData);
      dispatch(updateUser(updatedUser));

      toast.success("Congratulations you are now onboarded", {
        toastId: 3,
      });

      navigate('/');

    } catch (error) {
      toast.error("There has been an issue updating your account.", {
        toastId: 3,
      });
      console.log(error);
    }
  };

  return (
    <>
      {userCollectionsData && user && (
        <div className="nft-step">
          {formData.publicNfts && collections.length > 0 && (
              <NftsCollections
                selectedNfts={formData.publicNfts}
                collections={collections}
                onBoarding={true}
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
              Finish
          </Button>
      </div>
    </>
  );
}
