import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Colony } from "../../models/Colony";
import { addColony, updateUser } from "../../redux/Slices/UserDataSlice";
import { RootState } from "../../redux/store/app.store";
import moralisService from "../../service/moralis.service";
import { SeparatorHorizontal } from "../Login/DefaultView";
import Button from "../ui-components/Button";
import CustomCheckbox from "../ui-components/CustomCheckbox";
import CustomSelect from "../ui-components/CustomSelect";
import InputText from "../ui-components/InputText";
import Modal from "../ui-components/Modal";

export interface InitialState {
  colonyImage: File | null;
  colonyCover: File | null;
  colonyName: string;
  colonyTokenAddress: string;
  colonyWebsiteLink: string;
}

const initialState = {
  colonyImage: null,
  colonyCover: null,
  colonyName: "",
  colonyTokenAddress: "",
  colonyWebsiteLink: "",
};

export const CollectionContainer = styled.div`
  max-width: 475px;
  width: 100%;
  padding: 12px 10px;
  background: var(--bg-primary);
  border-radius: 10px;
`;

export const UserProfileNFTBadge = styled.div`
  height: 70px;
  max-width: 100px;
  flex: 1 0 20%;
  display: flex;
  background: var(--bg-secondary-dark);
  border-radius: 10px;
  padding: 15px 10px;
  align-items: center;
  justify-content: center;
  position: relative;

  & img {
    width: 60px;
    height: 60px;
    border-radius: 30px;
  }
`;

export default function UserProfileModal({
  colony,
  showModal,
  join = false,
}: {
  colony: Colony;
  showModal: any;
  join?: boolean;
}) {
  const [formData, setFormData] = useState<InitialState>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const { userTokens, user } = useSelector((state: RootState) => state.user);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [urls, setUrls] = useState<any[]>([]);
  const [savedNfts, setSavedNfts] = useState<any[]>([]);
  const [profilePicture, setProfilePicture] = useState<any>(null);
  const [username, setUsername] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { Moralis } = useMoralis();

  useEffect(() => {
    if (userTokens) {
      const values = Object.values(userTokens?.ERC721);
      console.log(userTokens.ERC721);
    }
  }, [userTokens]);

  useEffect(() => {
    if (user && user.attributes.savedNfts) {
      setSavedNfts(user.attributes.savedNfts);
      console.log(savedNfts);
    }
    if (user && user.attributes.profilePicture) {
      setProfilePicture(user.attributes.profilePicture);
    }
    async function getProfile(colony: Colony) {
      const profile = await moralisService.getProfile(colony);
      if (profile) setProfile(profile);
    }
    if (colony) getProfile(colony);
  }, [user, colony]);

  useEffect(() => {
    async function getUrls() {
      if (userTokens && selectedCollection) {
        setLoading(true);
        const tmp: any[] = [];
        await Promise.all(
          userTokens.ERC721[selectedCollection].map(async (nft) => {
            try {
              const asset = await Moralis.Plugins.opensea.getAsset({
                network: "mainnet",
                tokenAddress: nft.token_address,
                tokenId: nft.token_id,
              });
              console.log(asset);
              tmp.push({
                address: nft.token_address,
                id: nft.token_id,
                url: asset.imageUrl || asset.assetContract.imageUrl,
                collection: asset.assetContract.name,
              });
            } catch (error) {
              console.log(JSON.stringify(error));
              tmp.push(
                "https://decizia.com/blog/wp-content/uploads/2017/06/default-placeholder.png"
              );
            }
          })
        );
        setUrls([...tmp]);
        setLoading(false);
      }
    }
    getUrls();
  }, [selectedCollection, userTokens]);

  function fixURL2(url: string) {
    if (url.startsWith("ipfs")) {
      return (
        "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://").slice(-1)[0]
      );
    } else if (url.startsWith("https://")) {
      return url;
    }
  }

  const handleSaveNfts = async () => {
    try {
      const user = await moralisService.updateMoralisUser({
        profilePicture: profilePicture,
        nfts: savedNfts,
      });
      dispatch(updateUser(user));
      toast.success("Changes saved");
    } catch (error) {
      toast.error("error saving publics nfts, retry later.",{toastId: 11})
    }
  };

  const handleSetProfilePicture = (event: any, url: any) => {
    event.stopPropagation();
    setProfilePicture(url);
  };

  const handleSaveUsername = async () => {
    await moralisService.saveUsername(username, colony, profile);
  };
  const handleJoinColony = async () => {
    await moralisService.JoinColony(colony, username);
    dispatch(addColony(colony));
    toast.success("Successfuly join the Colony " + colony.name, { toastId: 6 });
    showModal(false);
    navigate(colony.id);
  };

  const handleOnClickNfts = (nft: any) => {
    if (savedNfts.some((foo) => nft.url === foo.url)) {
      const nfts = _.remove(savedNfts, (foo) => foo.url !== nft.url);
      setSavedNfts(nfts);
    } else {
      setSavedNfts([...savedNfts, nft]);
    }
  };

  return (
    <Modal
      showModal={showModal}
      body={
        <>
          <div
            className="w-100 flex justify-start align-end"
            style={{ maxWidth: 475, gap: 10 }}
          >
            <div className="w-100 f-column">
              <div className="mb-1">Pseudo</div>
              <InputText
                bgColor="var(--bg-secondary-dark)"
                glass={false}
                placeholder={""}
                defaultValue={profile?.get("username") || ""}
                onChange={(event: any) => setUsername(event.target.value)}
              />
            </div>

            {join ? (
              <Button
                width={150}
                height={35}
                classes="mx-auto mt-3"
                onClick={handleJoinColony}
              >
                Join
              </Button>
            ) : (
              <Button
                width={150}
                height={35}
                classes="mx-auto mt-3"
                onClick={handleSaveUsername}
              >
                Save
              </Button>
            )}
          </div>
          {!join && (
            <div className="flex align-center justify-between">
              <div className="f-column justify-center align-center mt-2 flex-1">
                <div className="size-14 fw-400 mb-3">Upload colony image</div>
                <input
                  accept=".png,.jpg,.jpeg,.webp"
                  style={{ display: "none" }}
                  id="input-colony-picture"
                  type={"file"}
                  onChange={undefined}
                />
                <label
                  htmlFor={"input-colony-picture"}
                  className="upload-colony-image f-column align-center justify-center"
                >
                  {profilePicture?.url ? (
                    <img
                      style={{
                        height: "inherit",
                        width: "inherit",
                        objectFit: "cover",
                      }}
                      src={profilePicture.url}
                      alt="file"
                    />
                  ) : (
                    <>
                      <i className="fa-solid fa-camera size-30 mb-1 mt-2"></i>
                      <span>
                        <i className="fa-solid fa-plus size-20"></i>
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}
          {userTokens && (
            <div className="w-100" style={{ maxWidth: 475, gap: 10 }}>
              <div className="fw-700 size-14 text-secondary-dark">
                Your NFTS Collections
              </div>
              <div className="fw-600 size-12 mb-1">
                Select a collection and add your NFTs in your public selection
              </div>
              <CollectionContainer>
                <CustomSelect
                  width={"400px"}
                  height={"44px"}
                  fontSize={12}
                  fontWeight={700}
                  arrowPosition={{ top: 12, right: 15 }}
                  values={["", ...Object.keys(userTokens?.ERC721).sort()]}
                  options={["", ...Object.keys(userTokens?.ERC721).sort()]}
                  onChange={(e: any) => {
                    setSelectedCollection(e.target.value);
                  }}
                />
                <div className="relative" style={{ alignSelf: "center" }}>
                  <div
                    className="flex"
                    style={{ overflow: "auto", gap: 15, marginTop: 18 }}
                  >
                    {selectedCollection && userTokens && !loading && (
                      <>
                        {urls.map((url, index) => {
                          return (
                            <UserProfileNFTBadge id={"nft" + index.toString()}>
                              <CustomCheckbox
                                isChecked={savedNfts.some(
                                  (nft) => nft.url === url.url
                                )}
                                onClick={() => handleOnClickNfts(url)}
                              />
                              <img
                                width={50}
                                height={50}
                                src={url.url}
                                alt="nft"
                                className="ml-2"
                              />
                              <i
                                title="Use as profile picture"
                                onClick={(event) =>
                                  handleSetProfilePicture(event, url)
                                }
                                className="fa-solid fa-camera absolute"
                                style={{ bottom: 5, right: 10 }}
                              ></i>
                            </UserProfileNFTBadge>
                          );
                        })}
                      </>
                    )}
                    {loading && (
                      <div className="mx-auto">
                        <FadeLoader color="var(--bg-primary-light)" />
                      </div>
                    )}
                  </div>
                </div>
              </CollectionContainer>
            </div>
          )}
          {/* <SeparatorHorizontal
            margin="9px 0px 18px 0px"
            borderColor="var(--bg-primary)"
          /> */}
          {!join && (
            <div
              className="w-100 f-column align-start"
              style={{ maxWidth: 475 }}
            >
              <div className="fw-700 size-14 text-secondary-dark mt-2">
                Your public NFTs
              </div>
              <CollectionContainer
                className="flex mt-2 w-100"
                style={{ overflow: "auto", gap: 10 }}
              >
                {savedNfts.map((url, index) => {
                  return (
                    <UserProfileNFTBadge id={"nft" + index.toString()}>
                      <img width={50} height={50} src={url.url} alt="nft" />
                    </UserProfileNFTBadge>
                  );
                })}
              </CollectionContainer>
            </div>
          )}
        </>
      }
      footer={
        <div className="mt-3">
          <Button width={149} height={43} onClick={handleSaveNfts}>
            Save changes
          </Button>
        </div>
      }
      title={<span>{join ? "Select a username" : "Profile"}</span>}
    />
  );
}
