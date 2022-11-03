import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { reduceWalletAddress } from "../helpers/utilities";
import { Side } from "../models/Side";
import { RootState } from "../redux/store/app.store";
import InputText from "./ui-components/InputText";
import "./SidesList.css";
import { sideAPI } from "../services/side.service";
import _ from "lodash";
import Button from "./ui-components/Button";
import SideEligibilityModal from "./Modals/SideEligibilityModal";

export default function SidesList() {
  const { account, user, userCollectionsData } = useSelector(
    (state: RootState) => state.user
  );
  const [sides, setSides] = useState<Side[]>([]);
  const [filteredSides, setfilteredSides] = useState<Side[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [userCollections, setUserCollections] = useState<any[]>([]);
  const [displayEligibility, setDisplayEligibility] = useState<boolean>(false);
  const [selectedSide, setSelectedSide] = useState<Side | null>(null);

  useEffect(() => {
    async function getAllSides() {
      const sides = await sideAPI.getAllSides();
      setSides(sides);
      setfilteredSides(sides);
    }
    getAllSides();
    if (userCollectionsData)
      setUserCollections(_.orderBy(userCollectionsData, "name"));
  }, [userCollectionsData]);

  useEffect(() => {
    if (selectedCollection && sides) {
      const filteredSides = sides.filter(
        (s) => s.NftTokenAddress === selectedCollection["token_address"]
      );
      setfilteredSides(filteredSides);
    }
  }, [selectedCollection, sides]);

  const handleEligibilityCheck = (side: Side) => {
    setSelectedSide(side);
    setDisplayEligibility(true);
  };

  return (
    <div className="justify-center align-center f-column w-100 mb-auto">
      <div className="text-white size-25 w-700">Welcome to SideSpeech</div>
      <div className="text-secondary">{reduceWalletAddress(account || "")}</div>
      <InputText width={"543px"} height={44} placeholder={"Search"} />
      <div className="flex w-100" style={{ height: "70vh", maxHeight: "70vh" }}>
        <div
          style={{ flex: "1 0 0" }}
          className="text-secondary-dark overflow-auto"
        >
          <div>MY NFT COLLECTIONS</div>
          <div>
            {userCollections.length > 0 &&
              userCollections.map((c: any) => {
                return (
                  <div onClick={() => setSelectedCollection(c)}>{c.name}</div>
                );
              })}
          </div>
        </div>
        <div style={{ flex: "5 0 0" }} className="f-column w-100 overflow-auto">
          <div className=""></div>
          <div className="sides-list-body">
            {filteredSides.map((s: Side) => {
              return (
                <div style={{ width: 256, height: 320, background: "white" }}>
                  <img src={s.sideImage} alt="side" />
                  <div>Name: {s.name}</div>
                  <div>Members: {s.profiles.length}</div>
                  <div className="join-div">
                    <Button
                      children={"join"}
                      onClick={() => handleEligibilityCheck(s)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {displayEligibility && selectedSide && (
        <SideEligibilityModal
          setDisplayEligibility={setDisplayEligibility}
          selectedSide={selectedSide}
        />
      )}
    </div>
  );
}
