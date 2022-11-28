import React, { useEffect, useState } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/Slices/UserDataSlice";
// service / utilities
import { fixURL } from "../../helpers/utilities";
import { apiService } from "../../services/api.service";
// ui component
import InputText from "../ui-components/InputText";
import Switch from "../ui-components/Switch";
// icon
import nftIcon from "./../../assets/images/bad_image_loading@2x.svg";
// models
import { NFT } from "../../models/interfaces/nft";
import { Collection } from "../../models/interfaces/collection";
import { Profile } from "../../models/Profile";
import { RootState } from "../../redux/store/app.store";
// libraries
import { toast } from "react-toastify";
import _ from "lodash";
import { FadeLoader } from "react-spinners";
import styled from 'styled-components';
import { breakpoints, size } from "../../helpers/breakpoints";

const NftsCollectionsStyled = styled.div`
  position: relative;
  padding: 1rem .5rem;
  border-radius: 20px;
  flex: 1;
  height: 100%;
  max-height: 80vh;
  overflow: hidden;
  ${breakpoints(size.lg, `{
    padding: 1rem;
    background-color: var(--bg-secondary-dark);
  }`)}
  & .user-profile-header {
    display: flex; 
    flex-direction: column;
    gap: .5rem;
    justify-content: space-between; 
    margin: 0 0 1rem 0; 
    font-size: 14px;
    ${breakpoints(size.lg, `{
      flex-direction: row;
      margin: 1rem 0 1.5rem 0; 
      align-items: center; 
    }`)}
  }
  & .input-container {
    margin-bottom: 20px;
  }

  & span.selected {
    color: var(--green);
  }
  & span.selected-2 {
    color: var(--primary);
  }

  & .nftCollectionContainer {
    overflow-y: scroll;
    padding-right: 10px;
    height: 80%;
    &.padding-bottom {
      padding-bottom: 3rem;
    }
    & .nftCollection {
      border-bottom: 2px solid var(--bg-primary);
      & .head {
        width: 100%;
        background-color: transparent;
        border: none;
        outline: none;
        box-shadow: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        padding: 1rem 0;
        & div,
        & a {
          display: inline-block;
          vertical-align: top;
        }
        
        & .title-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 50%;
          cursor: pointer;
          & .minus-plus-icon {
            display: flex;
            align-items: center;
            height: 100%;
          }
          & .title {
            flex-grow: 1;
            max-width: 200px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            text-align: left;
            font-size: 14px;
            color: var(--text-secondary-dark);
          }
        }
        & .right-side {
          &>div {
            font-size: 14px;
            color: var(--text-secondary-dark);
          }
          & .selectAll {
            background-color: transparent;
            border: none;
            outline: none;
            box-shadow: none;
            color: var(--green)!important;
            float: right;
            cursor: pointer;
          }
        }
      }
      & .nfts {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: .5rem;
        ${breakpoints(size.lg, `{
          grid-template-columns: repeat(4, 1fr);
        }`)}
        &.closed {
          display: none;
        }
        & .the-nft{
          display: inline-block;
          width: 100%;
          margin-bottom: 10px;
          & .inner {
            position: relative;
            border: 2px solid var(--bg-primary);
            border-radius: 10px;
            overflow: hidden;
            & .status {
              position: absolute;
              width: 70px;
              border-radius: 0 0 10px 10px;
              display: block;
              margin: 0 auto;
              left: 50%;
              margin-left: -35px;
              text-align: center;
              padding: 1px;
            }
          }
          &.selected .inner {
            border: 2px solid var(--green);
            & .status {
              background: var(--green);
              color: var(--bg-primary);
            }
          }
          &.selected-2 .inner {
            border: 2px solid var(--primary);            
            & .status {
              background: var(--primary);
              color: var(--white);
            }
          }
          & img{
            width: 100%;
          }
          & .public p,
          & .public .checkarea {
            display: inline-block;
            overflow: hidden;
          }
          & .public p {
            margin: 4px 0px;
          }
          & .public .checkarea {
            margin-left: 10px;
          }
          & input[type=checkbox]{
            height: 0;
            width: 0;
            visibility: hidden;
            &:checked + label {
              background: var(--green);
              &::after {
                left: calc(100% - 2px);
                transform: translateX(-100%);
              }
            }
          }
          & label {
            cursor: pointer;
            text-indent: -9999px;
            width: 55px;
            height: 25px;
            background: var(--checkbox-dark);
            display: block;
            border-radius: 100px;
            position: relative;
            &::after {
              content: '';
              position: absolute;
              top: 2px;
              left: 2px;
              width: 20px;
              height: 20px;
              background: #fff;
              border-radius: 90px;
              transition: 0.3s;
            }
            &:active:after {
              width: 50px;
            }
          }
        }
      }
      & .detail{
        display: block;
        background: var(--bg-primary);
        margin: 0;
        padding: 7px;
        border-radius: 0px 0px 10px 10px;
        margin-top: -10px;
      }
    }
  }
`;

interface IUserNftsCollectionsProps {
  selectedNfts: NFT[];
  collections: Collection[];
  handleNftChange?: any;
  profile?: Profile;
  onBoarding?: any;
  handleSelectAll?: any;
  saveNftsProfilePicture?: any;
  showAvatarText?: any;
  setSelectedAvatar?: any;
  selectedAvatar?: NFT | null;
  handleShowNfts?: any;
  formData?: any;
}

export default function NftsCollections({
  selectedNfts,
  collections,
  profile,
  onBoarding,
  saveNftsProfilePicture,
  handleNftChange,
  handleSelectAll,
  showAvatarText,
  setSelectedAvatar,
  selectedAvatar,
  handleShowNfts,
  formData,
}: IUserNftsCollectionsProps) {
  const { user, userCollectionsData } = useSelector(
    (state: RootState) => state.user
  );

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

  const Header = () => {
    if (profile || showAvatarText) {
      return (
        <div className="user-profile-header">
          <p>Select your profile avatar</p>
        {profile &&  <span className="flex align-center">
            <span className="mr-2">Hide all NFTs</span>
            <Switch
              value={formData ? !formData.showNfts : true}
              right={"NO"}
              left={"YES"}
              onClick={handleShowNfts}
            />
          </span>}
        </div>
      );
    } else {
      return (
        <p className="mt-2 mb-3 text-left">
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
      <div className="right-side">
        <div className="selected">
          {!profile && !showAvatarText && (
            <>
              Public :{" "}
              <span className="selected">
                {groupedNfts[collection.address]?.length | 0}/
              </span>
            </>
          )}
          {collection.nfts.length}
        </div>
        {!profile && !showAvatarText && (
          <button
            className="selectAll"
            onClick={(ev) => {
              ev.stopPropagation();
              handleSelectAll(collection.nfts, isAllSelected)
            }}
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </button>
        )}
      </div>
    );
  };

  const onSubmitNfts = async () => {
    if (!user) return;
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

  // if (!profile) {
  //   submitButton = (
  //     <Button
  //       classes={"mb-3"}
  //       width={"164px"}
  //       height={44}
  //       radius={10}
  //       color={"var(--text-primary-light)"}
  //       onClick={onSubmitNfts}
  //     >
  //       Save this selection
  //     </Button>
  //   );
  // } else {
  //   submitButton = (
  //     <Button
  //       classes={"mb-3"}
  //       width={"164px"}
  //       height={44}
  //       radius={10}
  //       color={"var(--text-primary-light)"}
  //       onClick={saveNftsProfilePicture}
  //     >
  //       Use this NFT
  //     </Button>
  //   );
  // }

  return (
    <NftsCollectionsStyled>
      <Header />
      <InputText
        className="mb-3"
        glass
        height={40}
        iconRightPos={{right: 16, top: 12}}
        width="100%"
        bgColor="var(--bg-secondary-light)"
        placeholder="Search collection"
        onChange={handleFilterCollection}
        radius="10px"
      />

      <div className={`nftCollectionContainer ${profile ? '' : 'padding-bottom'}`}>
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
                <button className="head" onClick={() => handleCollectionShowing(index)}>
                  <div className="title-wrapper">
                    <div
                      className="minus-plus-icon"
                    >
                      {openCollection[index] ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.96372 13.1627V7.72832H0.529297V5.91685H5.96372V0.482422H7.7752V5.91685H13.2096V7.72832H7.7752V13.1627H5.96372Z" fill="#B4C1D2" fillOpacity="0.4"/>
                        </svg>                        
                      ) : (
                        <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.824219 1.70746V0.177734H11.5323V1.70746H0.824219Z" fill="#B4C1D2" fillOpacity="0.4"/>
                        </svg>
                      )}
                    </div>
                    <div
                      className="title"
                      title={collection.name || collection.address}
                    >
                      {collection.name || collection.address}
                    </div>
                  </div>
                  {renderNumberSelection(collection)}
                </button>

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
                          profile || showAvatarText
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
      {/* {!onBoarding && <div className="submitArea">{submitButton}</div>} */}
    </NftsCollectionsStyled>
  );
}

function nftEqual(nft: NFT, nft2: NFT) {
  return (
    nft.token_address === nft2.token_address && nft.token_id === nft2.token_id
  );
}
