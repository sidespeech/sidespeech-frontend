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
import { updateCurrentProfile } from "../../../redux/Slices/UserDataSlice";
import { toast } from "react-toastify";
import { apiService } from "../../../services/api.service";

export default function GeneralSettingsAccount() {
  const { user, userCollectionsData } = useSelector(
    (state: RootState) => state.user
  );

  const [checkedNfts, setCheckedNfts] = useState<{
    [key: string]: NFT[];
  } | null>(null);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [displayNftsCollection, setDisplayNftsCollection] =
    useState<boolean>(false);

  const { currentProfile } = useSelector((state: RootState) => state.user);

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
      setCollections(Object.values(userCollectionsData));
    }
  }, [userCollectionsData, user]);
  const handleNftChange = (e: any, selectedNft: NFT) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      return;
    }
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

  return (
    <>
      {userCollectionsData && user && (
        <div className="account">
          <UserGeneralInformations user={user} />

          {checkedNfts && collections.length > 0 && (
            <NftsCollections
              selectedNfts={checkedNfts}
              collections={collections}
              user={user}
              handleNftChange={handleNftChange}
              handleSelectAll={handleSelectAll}
              saveNftsProfilePicture={saveNftsProfilePicture}
            />
          )}
        </div>
      )}
    </>
  );
}
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
