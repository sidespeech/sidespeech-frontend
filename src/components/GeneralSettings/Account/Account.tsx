import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// CSS Import
import "./../DefaultView.css";
import "./Account.css";

// Example NFT icon.
import { RootState } from "../../../redux/store/app.store";
import NftsCollections from "./NftsCollections";
import UserGeneralInformations from "./UserGeneralInformations";
import { NFT } from "../../../models/interfaces/nft";
import _ from "lodash";
import { Collection } from "../../../models/interfaces/collection";

export default function GeneralSettingsAccount() {
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

  return (
    <>
      {userCollectionsData && user && (
        <div className="account">
          <UserGeneralInformations user={user} />

          {checkedNfts && collections.length >0 && (
            <NftsCollections
              selectedNfts={checkedNfts}
              collections={collections}
              user={user}
              handleNftChange={handleNftChange}
              handleSelectAll={handleSelectAll}
            />
          )}
        </div>
      )}
    </>
  );
}
