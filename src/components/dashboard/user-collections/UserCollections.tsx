import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from "react-redux";
import { Side } from "../../../models/Side";
import { RootState } from "../../../redux/store/app.store";
import { sideAPI } from "../../../services/side.service";
import _ from "lodash";

import SideEligibilityModal from "../../Modals/SideEligibilityModal";
import UserCollectionCard from './UserCollectionCard';
import UserCollectionItemSmall from './UserCollectionItemSmall';
import CustomCheckbox from '../../ui-components/CustomCheckbox';

interface CollectionsStyledProps {

};

const UserCollectionsStyled = styled.div<CollectionsStyledProps>`
    .collections-list-wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 1rem;
    }
    .toolbar-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 1rem 0;
        padding-right: .5rem;
        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            color: var(--text-secondary);
            .view-mode {
                display: flex;
                gap: 1rem;
                align-items: center;
                & button {
                    background-color: transparent;
                    border: none;
                    outline: none;
                    box-shadow: none;
                    padding: .5rem;
                    & svg path {
                        fill: var(--text-secondary-dark);
                    }
                    &.active svg path {
                        fill: var(--text-secondary-light);
                    }
                }
            }
            .checkbox-wrapper {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
        }
    }
`;

type UserCollectionsProps = {

};

const UserCollections = (props: UserCollectionsProps) => {
    const { account, user, userCollectionsData } = useSelector(
        (state: RootState) => state.user
      );
    const [sides, setSides] = useState<Side[]>([]);
    const [filteredSides, setfilteredSides] = useState<Side[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<any>(null);
    const [userCollections, setUserCollections] = useState<any[]>([]);
    const [displayEligibility, setDisplayEligibility] = useState<boolean>(false);
    const [selectedSide, setSelectedSide] = useState<Side | null>(null);
    const [viewMode, setViewMode] = useState<string>('card');

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
    <UserCollectionsStyled>
        <div>
            <div className="toolbar-wrapper">
                <h2 className="title">My Collections</h2>
                <div className="toolbar">
                    <div className="view-mode">
                        Show
                        <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 20C1.45 20 0.979333 19.8043 0.588 19.413C0.196 19.021 0 18.55 0 18V2C0 1.45 0.196 0.979 0.588 0.587C0.979333 0.195667 1.45 0 2 0H18C18.55 0 19.021 0.195667 19.413 0.587C19.8043 0.979 20 1.45 20 2V18C20 18.55 19.8043 19.021 19.413 19.413C19.021 19.8043 18.55 20 18 20H2ZM2 14V18H6V14H2ZM8 14V18H12V14H8ZM14 18H18V14H14V18ZM2 12H6V8H2V12ZM8 12H12V8H8V12ZM14 12H18V8H14V12ZM6 2H2V6H6V2ZM8 6H12V2H8V6ZM14 6H18V2H14V6Z" />
                            </svg>
                        </button>
                        <button className={viewMode === 'card' ? 'active' : ''} onClick={() => setViewMode('card')}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 18C1.45 18 0.979 17.8043 0.587 17.413C0.195667 17.021 0 16.55 0 16V2C0 1.45 0.195667 0.979 0.587 0.587C0.979 0.195667 1.45 0 2 0H16C16.55 0 17.021 0.195667 17.413 0.587C17.8043 0.979 18 1.45 18 2V16C18 16.55 17.8043 17.021 17.413 17.413C17.021 17.8043 16.55 18 16 18H2ZM10 10V16H16V10H10ZM10 8H16V2H10V8ZM8 8V2H2V8H8ZM8 10H2V16H8V10Z" />
                            </svg>
                        </button>
                    </div>
                    <div className="checkbox-wrapper">
                        With Sides
                        <CustomCheckbox />
                    </div>
                    <div className="checkbox-wrapper">
                        Only verified collections
                        <CustomCheckbox />
                    </div>
                </div>
            </div>

            <div className="collections-list-wrapper">
                {!!userCollections.length &&
                    userCollections.map((collection: any) => (
                        <>
                            {viewMode === 'card' && <UserCollectionCard collection={collection} onClick={() => setSelectedCollection(collection)} />}
                            {viewMode === 'list' && <UserCollectionItemSmall collection={collection} onClick={() => setSelectedCollection(collection)} />}
                        </>
                ))}
            </div>
        </div>

        {/* <div className="f-column w-100 overflow-auto">
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
        </div> */}

        {displayEligibility && selectedSide && (
            <SideEligibilityModal
            setDisplayEligibility={setDisplayEligibility}
            selectedSide={selectedSide}
            />
        )}
    </UserCollectionsStyled>
  );
};

export default UserCollections;