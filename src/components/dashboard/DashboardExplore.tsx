import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from "react-redux";
import { Side } from "../../models/Side";
import { RootState } from "../../redux/store/app.store";
import { sideAPI } from "../../services/side.service";
import _ from "lodash";

import Button from "../ui-components/Button";
import SideEligibilityModal from "../Modals/SideEligibilityModal";

const DashboardExploreStyles = styled.main`
    .sides-list-body {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        max-height: 100%;
        padding: 20px;
    }
    .sides-list-body > div {
        flex: 1 0 15%;
        min-width: 256px;
        max-width: 20%;
        position: relative;
        border-radius: 20px;
        overflow: hidden;
    }
    .sides-list-body img {
        width: 100%;
        height: 260px;
        object-fit: cover;
    }
    
    .join-div {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        background-color: #181A2AE5;
    }
    
    .sides-list-body > div:hover .join-div {
        display: flex;
    }
`

const DashboardExplore = () => {
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
        console.log(userCollectionsData);
      };

  return (
    <DashboardExploreStyles>
        <div>
            <h2>My Collections</h2>
            <div>
                {!!userCollections.length &&
                userCollections.map((c: any) => {
                    return (
                        <div onClick={() => setSelectedCollection(c)}>{c.name}</div>
                        );
                    })}
            </div>
        </div>

        <div className="f-column w-100 overflow-auto">
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

        {displayEligibility && selectedSide && (
            <SideEligibilityModal
            setDisplayEligibility={setDisplayEligibility}
            selectedSide={selectedSide}
            />
        )}
    </DashboardExploreStyles>
  )
}

export default DashboardExplore