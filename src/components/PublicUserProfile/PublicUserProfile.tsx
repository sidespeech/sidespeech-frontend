import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../../services/api.service";
import logo from "../../assets/logo.svg";
import { fixURL } from "../../helpers/utilities";
import { User } from "../../models/User";
import { FadeLoader } from "react-spinners";
import defaultPP from "../../assets/default-pp.webp";
import hexagon from "../../assets/hexagon.svg";
import {
  Collection,
  OpenSeaRequestStatus,
} from "../../models/interfaces/collection";
import { ProfilePictureData } from "../GeneralSettings/Account/Avatar";
import Button from "../ui-components/Button";
import { toast } from "react-toastify";
import _ from "lodash";
import { NFT } from "../../models/interfaces/nft";
import greenLogo from "../../assets/green-logo.svg";
import yellowLogo from "../../assets/yellow-logo.svg";
import purpleLogo from "../../assets/purple-logo.svg";
import copy from "../../assets/copy-icon.svg";
import styled from "styled-components";
import { UserAvatar } from "./UserAvatar";
import { NftItem } from "./NftItem";
import useLogin from "../../hooks/useLogin";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/app.store";

interface IDataCard {
  background: string;
  color: string;
}

const DataCard = styled.div<IDataCard>`
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  padding: 18px 23px;
  flex: 1 0 0;
  border-radius: 10px;
`;

const DataAddress = styled.div`
  width: 100%;
  height: 44px;
  border: 1px solid var(--disable);
  border-radius: 7px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  max-width: 500px;
  padding: 0px 17px;
  & > div {
    position: absolute;
    display: flex;
    align-items: center;
    right: 10px;
    bottom: 8px;
    gap: 6px;
  }
`;

export default function PublicUserProfile() {
  const { username } = useParams();
  const userData = useSelector((state: RootState) => state.user);

  const [user, setUser] = useState<User | null>(null);
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [createdSideCount, setcreatedSideCount] = useState<number>(0);
  const [sharedSidesCount, setSharedSidesCount] = useState<number>(0);
  const [link, setLink] = useState<string>("");
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("All");

  const { connectWallet } = useLogin();

  useEffect(() => {
    async function getUserData() {
      if (username) {
        const user = await apiService.getUserPublicData(username);
        if (user.publicNfts) {
          const addresses = Object.keys(
            _.groupBy(user.publicNfts, "token_address")
          );
          const collections = await apiService.getManyCollectionsByAddress(
            addresses
          );
          setCollections(collections);
          setFilteredNfts(user.publicNfts);
        }
        setcreatedSideCount(getCreatedSideCount(user));
        setUser(user);
        setLink(`https://side.xyz/user/${username}`);
      }
    }
    getUserData();
  }, [username]);

  useEffect(() => {
    if (userData.user && user) {
      const connectedUserSides = userData.user.profiles.map((p) => p.side);
      const userserSides = user.profiles.map((p) => p.side);
      const foo = _.intersectionBy(connectedUserSides, userserSides, "id");
      setSharedSidesCount(foo.length);
    }
  }, [userData.user, user]);

  useEffect(() => {
    if (user) {
      const filteredNfts =
        selectedCollection === "All"
          ? [...user.publicNfts]
          : [
              ...user.publicNfts.filter(
                (nft: NFT) => nft.token_address === selectedCollection
              ),
            ];
      setFilteredNfts(filteredNfts);
    }
  }, [selectedCollection, user]);

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied!", { toastId: 15 });
  };
  const copyAddress = () => {
    if (user) {
      navigator.clipboard.writeText(user.accounts);
      toast.success("Address copied!", { toastId: 16 });
    }
  };

  return (
    <div
      className="flex align-start justify-center"
      style={{
        height: "100vh",
        maxHeight: "100vh",
        width: "100%",
        overflow: "auto",
      }}
    >
      <div
        className="f-column w-100 align-center justify-start gap-30"
        style={{ maxWidth: 1094 }}
      >
        <h1 className="flex align-center gap-20 size-45 fw-700 text-white">
          <img src={logo} />
          <span>SideSpeech</span>
        </h1>
        {user ? (
          <>
            <div className="flex gap-30  text-main w-100">
              <UserAvatar
                nft={user.userAvatar}
                name={
                  collections?.find(
                    (c) => c.address === user.userAvatar?.token_address
                  )?.name
                }
              />
              <div
                className="f-column gap-20 justify-between"
                style={{ maxWidth: 750 }}
              >
                <div className="size-22 fw-700">{user.username}</div>
                <DataAddress onClick={copyAddress}>
                  {user.accounts}
                  <div className="pointer">
                    Copy <img src={copy} />
                  </div>
                </DataAddress>
                <div className="flex gap-30">
                  <DataCard background="#705CE926" color="#705CE9">
                    <div className="flex align-center  gap-20 mb-3">
                      <img src={purpleLogo} />
                      <span className="size-40">{user.profiles.length}</span>
                    </div>
                    <div className="text-white"> Joined Sides</div>
                  </DataCard>
                  <DataCard background="#5CD8E926" color="#36DABC">
                    <div className="flex align-center  gap-20 mb-3">
                      <img src={greenLogo} />
                      <span className="size-40">{createdSideCount}</span>
                    </div>
                    <div className="text-white"> Created Sides</div>
                  </DataCard>
                  <DataCard background="#FFBD3C26" color="#FFBD3C">
                    <div className="flex align-center gap-20 mb-3">
                      <img src={yellowLogo} />
                      {userData.user ? (
                       <span className="size-40">{sharedSidesCount}</span>
                      ) : (
                        <span style={{ lineHeight: "12px" }}>
                          Connect <br /> your wallet
                        </span>
                      )}
                    </div>
                    <div className="text-white">Sides together</div>
                  </DataCard>
                </div>

                <div style={{ minHeight: 74 }}>
                  <div>Bio</div>
                  <div>{user.bio}</div>
                </div>
                <div className="flex gap-20">
                  {userData.user ? (
                    <Button
                      height={44}
                      children={"Send a message"}
                      onClick={connectWallet}
                    />
                  ) : (
                    <Button
                      height={44}
                      children={"Connect Wallet"}
                      onClick={connectWallet}
                    />
                  )}
                  <DataAddress>
                    {
                      <>
                        <span className="text-inactive">
                          https://side.xyz/user/
                        </span>
                        <span>{username}</span>
                      </>
                    }
                  </DataAddress>
                  <Button
                    height={44}
                    children={"Copy the link"}
                    onClick={copyLink}
                  />
                </div>
              </div>
            </div>
            <div className="f-column gap-20">
              <div>Public NFTs</div>
              <div className="flex f-wrap gap-20">
                <Button
                  width={"61px"}
                  height={36}
                  children={"All"}
                  onClick={() => setSelectedCollection("All")}
                  background={
                    selectedCollection === "All"
                      ? "var(--primary)"
                      : "var(--disable)"
                  }
                />
                {collections &&
                  collections.map((c) => {
                    const isSelected = c.address === selectedCollection;
                    return (
                      <Button
                        key={c.address}
                        radius={7}
                        classes="px-3 py-2"
                        width="fit-content"
                        height={36}
                        children={c.name}
                        background={
                          isSelected ? "var(--primary)" : "var(--disable)"
                        }
                        onClick={() => setSelectedCollection(c.address)}
                      />
                    );
                  })}
              </div>
              <div className="flex f-wrap" style={{ gap: 30 }}>
                {collections &&
                  filteredNfts.map((nft: NFT, index: number) => {
                    const col = collections.find(
                      (c) => c.address === nft.token_address
                    );
                    if (!col) return <></>;
                    return <NftItem key={index} nft={nft} collection={col} />;
                  })}
              </div>
            </div>
          </>
        ) : (
          <FadeLoader color="var(--text)" />
        )}
      </div>
    </div>
  );
}
function getCreatedSideCount(user: User) {
  const sides = user.profiles.map((p) => p.side);
  const createdSides = sides.filter((s) => s.creatorAddress === user.accounts);
  return createdSides.length;
}
