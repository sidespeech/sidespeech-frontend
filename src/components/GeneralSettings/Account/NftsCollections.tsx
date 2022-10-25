import React, { useEffect, useState } from "react";
// redux
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/Slices/UserDataSlice";
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

interface IUserNftsCollectionsProps {
  user: User;
  userCollectionsData: UserCollectionsData;
}

export default function NftsCollections({
  user,
  userCollectionsData,
}: IUserNftsCollectionsProps) {
  const [openCollection, setOpenCollection] = useState<boolean[]>([]);
  const [checkedState, setCheckedState] = useState<{
    [key: string]: NFT[];
  } | null>(null);
  const [filteredCollections, setFilteredCollections] = useState<
    Collection[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userCollectionsData && user) {
      const collections = Object.keys(userCollectionsData);
      const array: boolean[] = new Array(collections.length).fill(true);
      setOpenCollection(array);
      const initCheckedState: any = {};
      collections.forEach((key) => {
        const nfts =
          user?.publicNfts?.filter((nft) => nft.token_address === key) || [];
        initCheckedState[key] = [...nfts];
      });
      setCheckedState(initCheckedState);
      setFilteredCollections(Object.values(userCollectionsData));
    }
  }, [userCollectionsData, user]);

  useEffect(() => {
    if (checkedState && Object.values(checkedState).length > 0) {
      setLoading(false);
    }
  }, [checkedState]);

  //#region NFTS handlers
  const handleCollectionShowing = (position: any) => {
    const updatedCollectionShowing = openCollection.map((item, index) =>
      index === position ? !item : item
    );
    setOpenCollection(updatedCollectionShowing);
  };

  const handleNftChange = (selectedNft: NFT) => {
    if (!checkedState) return;
    const index = checkedState[selectedNft.token_address].findIndex(
      (nft) =>
        nft.token_address === selectedNft.token_address &&
        nft.token_id === selectedNft.token_id
    );
    if (index !== -1) {
      const tmp = [...checkedState[selectedNft.token_address]];
      tmp.splice(index, 1);
      setCheckedState({ ...checkedState, [selectedNft.token_address]: tmp });
    } else {
      const tmp = checkedState[selectedNft.token_address];
      setCheckedState({
        ...checkedState,
        [selectedNft.token_address]: [...tmp, selectedNft],
      });
    }
  };
  const handleSelectAll = (nfts: NFT[]) => {
    if (!checkedState) return;
    const values = checkedState[nfts[0].token_address];
    const array = _.union(values, nfts);
    setCheckedState({ ...checkedState, [nfts[0].token_address]: [...array] });
  };

  const handleFilterCollection = (e: any) => {
    const filter: string = e.target.value;

    const filteredData = Object.values(userCollectionsData).filter((value) =>
      value.name?.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredCollections(filteredData);
  };
  //#endregion

  const onSubmitNfts = async () => {
    try {
      if (checkedState) {
        const nftsList = _.flatten(Object.values(checkedState));
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

  return (
    <div className="f-row my-nfts relative">
      <p>
        My public NFTS (
        <span className="selected">
          {" "}
          {checkedState
            ? _.sum(Object.values(checkedState).map((c) => c.length))
            : 0}
        </span>
        /{_.sum(filteredCollections?.map((c) => c.nfts.length))})
      </p>
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
          checkedState &&
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
                  <div className="float-right">
                    <div className="selected">
                      Public :{" "}
                      <span className="selected">
                        {checkedState[collection.address]?.length}
                      </span>
                      /{collection.nfts.length}
                    </div>
                    <a
                      className="selectAll"
                      onClick={() => handleSelectAll(collection.nfts)}
                    >
                      Select All
                    </a>
                  </div>
                </div>

                <div
                  className={`nfts ${
                    openCollection[index] ? "closed" : "open"
                  }`}
                >
                  {collection.nfts.map((nft: NFT, index: number) => {
                    const metadata = nft.metadata;
                    return (
                      <div
                        onClick={() => handleNftChange(nft)}
                        className={`the-nft ${
                          checkedState[collection.address]?.some(
                            (c) =>
                              c.token_id === nft.token_id &&
                              c.token_address === nft.token_address
                          )
                            ? "selected"
                            : ""
                        }`}
                        key={index}
                      >
                        <div className="inner">
                          {checkedState[collection.address]?.some(
                            (c) =>
                              c.token_id === nft.token_id &&
                              c.token_address === nft.token_address
                          ) ? (
                            <div className="status">Public</div>
                          ) : (
                            ""
                          )}
                          <img
                            src={
                              metadata && metadata.image
                                ? fixURL(metadata.image)
                                : nftIcon
                            }
                            onError={(e) => (e.target.src = nftIcon)}
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
      </div>
    </div>
  );
}
