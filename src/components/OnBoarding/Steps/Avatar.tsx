import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// CSS Import
import "./../../GeneralSettings/DefaultView.css";

// service
import { apiService } from "../../../services/api.service";

import Button from "../../ui-components/Button";

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

type ChildProps = {
  updateCurrentStep: (step: string) => void;
}

export default function Avatar({
  updateCurrentStep
}: ChildProps) {
  const { user, userCollectionsData } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState<InitialStateUser>(initialStateUser);

  const [checkedNfts, setCheckedNfts] = useState<{
    [key: string]: NFT[];
  } | null>(null);

  // Setup an array state.
  const [collections, setCollections] = useState<Collection[]>([])

  // Setup the dispatch and the navigate
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userCollectionsData && user) {

      // Return the object values of the users collections.
      const collections = Object.values(userCollectionsData);
      
      // Check if the user has any public NFTs and set the form data.
      if (user.publicNfts) {
        setFormData({
          ...formData,
          publicNfts: user.publicNfts,
          bio: user.bio,
          avatar: user.userAvatar,
          username: user.username,
        });
      }

      // Set all of the collections
      setCollections(collections);

    }
  }, [userCollectionsData, user]);


  const handleNftChange = (selectedNft: NFT) => {
    if (!checkedNfts) return;
    const index = checkedNfts[selectedNft.token_address].findIndex(
      (nft) =>
        nft.token_address === selectedNft.token_address &&
        nft.token_id === selectedNft.token_id
    );
    if (index !== -1) {
      const tmp = [...checkedNfts[selectedNft.token_address]];
      tmp.splice(index, 1);
      setCheckedNfts({ ...checkedNfts, [selectedNft.token_address]: tmp });
    } else {
      const tmp = checkedNfts[selectedNft.token_address];
      setCheckedNfts({
        ...checkedNfts,
        [selectedNft.token_address]: [...tmp, selectedNft],
      });
    }
  };

  const handleSelectAll = (nfts: NFT[]) => {
    if (!checkedNfts) return;
    const values = checkedNfts[nfts[0].token_address];
    const array = _.union(values, nfts);
    setCheckedNfts({ ...checkedNfts, [nfts[0].token_address]: [...array] });
  };

  const goBack = () => {
    return updateCurrentStep("step 3");
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
                selectedNfts={[]}
                collections={collections}
                handleNftChange={handleNftChange}
                handleSelectAll={handleSelectAll}
                onBoarding={true}
                showAvatarText={true}
                setSelectedAvatar={(data: NFT) =>
                  setFormData({ ...formData, avatar: data })
                }
                selectedAvatar={formData.avatar}
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
