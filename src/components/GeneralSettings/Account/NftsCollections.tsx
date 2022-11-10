import React, { useEffect, useState } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import { setCurrentProfile, updateCurrentProfile, updateUser } from "../../../redux/Slices/UserDataSlice";
// service / utilities
import { fixURL } from "../../../helpers/utilities";
import { apiService } from "../../../services/api.service";
// ui component
import Button from "../../ui-components/Button";
import InputText from "../../ui-components/InputText";
// icon
import nftIcon from "./../../../assets/example-nft.svg";
// models
import { NFT } from "../../../models/interfaces/nft";
import { UserCollectionsData } from "../../../models/interfaces/UserCollectionsData";
import { Collection } from "../../../models/interfaces/collection";
import { User } from "../../../models/User";
// libraries
import { toast } from "react-toastify";
import _ from "lodash";
import { FadeLoader } from "react-spinners";
import "./NftsCollections.css";
import { Profile } from "../../../models/Profile";
import Switch from "../../ui-components/Switch";
import { RootState } from "../../../redux/store/app.store";

interface IUserNftsCollectionsProps {
  selectedNfts: {
    [key: string]: NFT[];
  };
  collections: Collection[];
  user: User;
  handleNftChange: any;
  profile?: Profile;
  saveNftsProfilePicture?: any;
  handleSelectAll?: any;
}

export default function NftsCollections({
  selectedNfts,
  collections,
  profile,
  user,
  saveNftsProfilePicture,
  handleNftChange,
  handleSelectAll,
}: IUserNftsCollectionsProps) {
  const [openCollection, setOpenCollection] = useState<boolean[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<
    Collection[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (collections) {
      const array: boolean[] = new Array(collections.length).fill(true);
      setOpenCollection(array);
      setFilteredCollections(collections);
      console.log(collections);
    }
  }, []);

  useEffect(() => {
    if (selectedNfts && Object.values(selectedNfts).length > 0) {
      setLoading(false);
    }
  }, [selectedNfts]);

  //#region NFTS handlers
  const handleCollectionShowing = (position: any) => {
    const updatedCollectionShowing = openCollection.map((item, index) =>
      index === position ? !item : item
    );
    setOpenCollection(updatedCollectionShowing);
  };

  const handleFilterCollection = (e: any) => {
    const filter: string = e.target.value;

    const filteredData = collections.filter((value) =>
      value.name?.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredCollections(filteredData);
  };
  //#endregion

  const onSubmitNfts = async () => {
    try {
      if (selectedNfts) {
        const nftsList = _.flatten(Object.values(selectedNfts));
        await apiService.updateUserPublicNfts(user.id, nftsList);
        dispatch(updateUser({ publicNfts: nftsList }));
        toast.success("Settings have been updated.", {
          toastId: 5,
        });
      }
    } catch (error) {
      toast.error("There has been an issue updating your public nfts.", {
        toastId: 6,
      });
    }
  };

  const handleShowNfts = async (value: boolean) => {
    if (profile) {
      const updatedProfile = await apiService.updateProfile(profile.id, {
        ...profile,
        showNfts: value,
      });
      dispatch(updateCurrentProfile(updatedProfile))
    }
  };

  const Header = () => {
    if (profile) {
      return (
        <div className="flex justify-between align-center">
          <p>Select your profile avatar</p>
          <span className="flex align-center">
            <span className="mr-2">Hide all NFTs</span>
            <Switch value={profile.showNfts} right={"NO"} left={"YES"} onClick={handleShowNfts} />
          </span>
        </div>
      );
    } else {
      return (
        <p>
          My public NFTS (
          <span className="selected">
            {" "}
            {selectedNfts
              ? _.sum(Object.values(selectedNfts).map((c) => c.length))
              : 0}
          </span>
          /{_.sum(filteredCollections?.map((c) => c.nfts.length))})
        </p>
      );
    }
  };

  const renderNumberSelection = (collection: Collection) => {
    return (
      <div className="float-right">
        <div className="selected mr-3">
          {!profile && (
            <>
              Public :{" "}
              <span className="selected">
                {selectedNfts[collection.address]?.length}/
              </span>
            </>
          )}
          {collection.nfts.length}
        </div>
        {!profile && (
          <a
            className="selectAll"
            onClick={() => handleSelectAll(collection.nfts)}
          >
            Select All
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="f-row my-nfts relative text-main">
      <Header />
      <InputText
        height={40}
        width="100%"
        bgColor="var(--bg-primary)"
        glass={false}
        placeholder="Search collection"
        onChange={handleFilterCollection}
        radius="10px"
      />

      <div className="nftCollectionContainer">
        {loading && (
          <div
            className="f-column align-center justify-center"
            style={{ margin: "auto" }}
          >
            <div className="mb-1">Fetching your NFTS...</div>
            <FadeLoader loading={loading} color="var(--text-secondary)" />
          </div>
        )}
        {filteredCollections &&
          selectedNfts &&
          filteredCollections.map((collection, index) => {
            return (
              <div className={`nftCollection`} key={index}>
                <div className="head">
                  <div
                    className="float-left"
                    onClick={() => handleCollectionShowing(index)}
                  >
                    <div
                      className={`minus ${openCollection[index] ? "plus" : ""}`}
                    ></div>
                    <div
                      className="title"
                      title={collection.name || collection.address}
                    >
                      {collection.name || collection.address}
                    </div>
                  </div>
                  {renderNumberSelection(collection)}
                </div>

                <div
                  className={`nfts ${
                    openCollection[index] ? "closed" : "open"
                  }`}
                >
                  {collection.nfts.map((nft: NFT, index: number) => {
                    const metadata = nft.metadata;
                    const isSelected = selectedNfts[collection.address]?.some(
                      (c) =>
                        c.token_id === nft.token_id &&
                        c.token_address === nft.token_address
                    );
                    return (
                      <div
                        onClick={(e:any) => handleNftChange(e,nft)}
                        onContextMenu={(e:any) => handleNftChange(e,nft)}
                        className={`the-nft ${
                          isSelected
                            ? !profile
                              ? "selected"
                              : "selected-2"
                            : ""
                        }`}
                        key={index}
                      >
                        <div className="inner">
                          {isSelected && (
                            <div className="status">
                              {!profile ? "Public" : "Avatar"}
                            </div>
                          )}
                          <img
                            src={
                              metadata && metadata.image
                                ? fixURL(metadata.image)
                                : nftIcon
                            }
                            onError={(e: any) => (e.target.src = nftIcon)}
                            alt="nft"
                          />
                          <div className="detail text-center">
                            <div className="number">
                              <p title={nft.token_id}>
                                #
                                {nft.token_id.length > 5
                                  ? nft.token_id.slice(0, 5) + "..."
                                  : nft.token_id}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
      <div className="submitArea">
        {/* Submit Button */}
        {!profile ? (
          <Button
            classes={"mb-3"}
            width={164}
            height={44}
            radius={10}
            color={"var(--text-primary-light)"}
            onClick={onSubmitNfts}
          >
            Save this selection
          </Button>
        ) : (
          <Button
            classes={"mb-3"}
            width={164}
            height={44}
            radius={10}
            color={"var(--text-primary-light)"}
            onClick={saveNftsProfilePicture}
          >
            Use this NFT
          </Button>
        )}
      </div>
    </div>
  );
}
