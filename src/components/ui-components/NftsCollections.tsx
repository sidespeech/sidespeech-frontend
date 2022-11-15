import React, { useEffect, useState } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentProfile,
  updateCurrentProfile,
  updateUser,
} from "../../redux/Slices/UserDataSlice";
// service / utilities
import { fixURL } from "../../helpers/utilities";
import { apiService } from "../../services/api.service";
// ui component
import Button from "../ui-components/Button";
import InputText from "../ui-components/InputText";
// icon
import nftIcon from "./../../assets/example-nft.svg";
// models
import { NFT } from "../../models/interfaces/nft";
import { UserCollectionsData } from "../../models/interfaces/UserCollectionsData";
import { Collection } from "../../models/interfaces/collection";
import { User } from "../../models/User";
// libraries
import { toast } from "react-toastify";
import _ from "lodash";
import { FadeLoader } from "react-spinners";
import "./NftsCollections.css";
import { Profile } from "../../models/Profile";
import Switch from "../ui-components/Switch";
import { RootState } from "../../redux/store/app.store";

interface IUserNftsCollectionsProps {
  selectedNfts: NFT[];
  collections: Collection[];
  handleNftChange?: any;
  profile?: Profile;
  onBoarding?: any;
  handleSelectAll?: any;
  setSelectedAvatar?: any;
  selectedAvatar?: NFT | null;
}

export default function NftsCollections({
  selectedNfts,
  collections,
  profile,
  onBoarding,
  handleNftChange,
  handleSelectAll,
  setSelectedAvatar,
  selectedAvatar,
}: IUserNftsCollectionsProps) {
  const [openCollection, setOpenCollection] = useState<boolean[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<
    Collection[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [groupedNfts, setGroupedNfts] = useState<{ [key: string]: NFT[] }>({});

  const dispatch = useDispatch();

  let submitButton;

  useEffect(() => {
    if (collections) {
      const array: boolean[] = new Array(collections.length).fill(true);
      setOpenCollection(array);
      setFilteredCollections(collections);
      setLoading(false);
    }
  }, [collections]);

  useEffect(() => {
    if (selectedNfts && selectedNfts.length > 0) {
      setGroupedNfts(_.groupBy(selectedNfts, "token_address"));
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

  const handleShowNfts = async (value: boolean) => {
    if (profile) {
      const updatedProfile = await apiService.updateProfile(profile.id, {
        ...profile,
        showNfts: value,
      });
      dispatch(updateCurrentProfile(updatedProfile));
      toast.success("Profile updated!", { toastId: 10 });
    }
  };

  const Header = () => {
    if (profile) {
      return (
        <div className="flex justify-between align-center">
          <p>Select your profile avatar</p>
          <span className="flex align-center">
            <span className="mr-2">Hide all NFTs</span>
            <Switch
              value={profile.showNfts}
              right={"NO"}
              left={"YES"}
              onClick={handleShowNfts}
            />
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
              ? _.sum(Object.values(groupedNfts).map((c) => c.length))
              : 0}
          </span>
          /{_.sum(filteredCollections?.map((c) => c.nfts.length))})
        </p>
      );
    }
  };

  const renderNumberSelection = (collection: Collection) => {
    const isAllSelected =
      groupedNfts[collection.address]?.length === collection.nfts.length;

    return (
      <div className="float-right">
        <div className="selected mr-3">
          {!profile && (
            <>
              Public :{" "}
              <span className="selected">
                {groupedNfts[collection.address]?.length | 0}/
              </span>
            </>
          )}
          {collection.nfts.length}
        </div>
        {!profile && (
          <a
            className="selectAll"
            onClick={() => handleSelectAll(collection.nfts, isAllSelected)}
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </a>
        )}
      </div>
    );
  };


  if (!profile) {
    submitButton =  <Button
                      classes={"mb-3"}
                      width={"164px"}
                      height={44}
                      radius={10}
                      color={"var(--text-primary-light)"}
                      // onClick={onSubmitNfts}
                    >
                      Save this selection
                    </Button>
  } else {
    submitButton =  <Button
                      classes={"mb-3"}
                      width={"164px"}
                      height={44}
                      radius={10}
                      color={"var(--text-primary-light)"}
                      // onClick={saveNftsProfilePicture}
                    >
                      Use this NFT
                    </Button>
  }

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
                    const isSelected =
                      !profile &&
                      groupedNfts[collection.address]?.some((c) =>
                        nftEqual(c, nft)
                      );
                    const isAvatar =
                      selectedAvatar && nftEqual(nft, selectedAvatar);

                    return (
                      <div
                        onClick={(e: any) => {
                          profile
                            ? setSelectedAvatar(nft)
                            : handleNftChange(nft);
                        }}
                        onContextMenu={(e: any) => {
                          e.preventDefault();
                          setSelectedAvatar(nft);
                        }}
                        className={`the-nft ${isSelected && "selected"} ${
                          isAvatar && " selected-2"
                        }`}
                        key={index}
                      >
                        <div className="inner">
                          {(isSelected || isAvatar) && (
                            <div className="status">
                              {!isAvatar ? "Public" : "Avatar"}
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
      {!onBoarding  && (
        <div className="submitArea">{submitButton}</div>
      )}
    </div>
  );
}

function nftEqual(nft: NFT, nft2: NFT) {
  return (
    nft.token_address === nft2.token_address && nft.token_id === nft2.token_id
  );
}
