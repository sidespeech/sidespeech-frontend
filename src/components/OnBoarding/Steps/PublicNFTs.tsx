import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// CSS Import
import "./../../GeneralSettings/DefaultView.css";
import "./../../GeneralSettings/Account/Account.css";

import Button from "../../ui-components/Button";

// Example NFT icon.
import { RootState } from "../../../redux/store/app.store";
import NftsCollections from "./../../GeneralSettings/Account/NftsCollections";
import { NFT } from "../../../models/interfaces/nft";
import _ from "lodash";
import { Collection } from "../../../models/interfaces/collection";

type ChildProps = {
  updateCurrentStep: (step: string) => void;
}

export default function PublicNFTs({
  updateCurrentStep
}: ChildProps) {
  const { user, userCollectionsData } = useSelector(
    (state: RootState) => state.user
  );

  const [checkedNfts, setCheckedNfts] = useState<{
    [key: string]: NFT[];
  } | null>(null);

  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    if (userCollectionsData && user) {
      const collections = Object.keys(userCollectionsData);
      const initCheckedState: any = {};
      collections.forEach((key) => {
        const nfts =
          user.publicNfts?.filter((nft) => nft.token_address === key) || [];
        initCheckedState[key] = [...nfts];
      });
      setCheckedNfts(initCheckedState);
      setCollections(Object.values(userCollectionsData))
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
    return updateCurrentStep("step 2");
  };

  return (
    <>
      {userCollectionsData && user && (
        <div className="nft-step">
          {checkedNfts && collections.length >0 && (
            <NftsCollections
              selectedNfts={checkedNfts}
              collections={collections}
              user={user}
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
            width={121}
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
            width={121}
            height={44}
            // onClick={}
            radius={10}
            color={"var(--text-primary-light)"}
          >
              Finish
          </Button>
      </div>
    </>
  );
}
