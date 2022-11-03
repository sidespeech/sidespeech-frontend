import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Side } from '../../models/Side';
import { sideAPI } from "../../services/side.service";

const CARD_HEIGHT = 191;
const CARD_WIDTH = 265;

interface ListStyledProps {

}

const FeatureSidesStyled = styled.div<ListStyledProps>`
    .title {
        margin-top: 0;
    }
    .list-wrapper {
        display: flex;
        gap: 1rem;
        overflow-x: hidden;
        width: 100%;
    }
`;

interface CardStyledProps {
    coverImage?: string;
}

const FeatureSideCardStyled = styled.div<CardStyledProps>`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: ${CARD_WIDTH}px;
    height: ${CARD_HEIGHT}px;
    flex-shrink: 0;
    background-color: var(--bg-secondary);
    background-image: url(${(props) => props.coverImage});
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    color: var(--text-secondary);
    border-radius: 10px;
    padding: 1rem;
`;

type FeatureSidesProps = {
}

const FeatureSideCard = ({ side }: { side: Side }) => {
    console.log(side.NftTokenAddress)
    return <FeatureSideCardStyled coverImage={side.coverImage}>
        <div className="content">
            <h3>{side.name}</h3>
            <div className="collections">

            </div>
        </div>
    </FeatureSideCardStyled>
}

const FeaturedSides = (props: FeatureSidesProps) => {
    const [featuredSides, setFeaturedSides] = useState<Side[]>([]);

    useEffect(() => {
        async function getAllFeaturedSides() {
            const response = await sideAPI.getAllFeaturedSides();
            setFeaturedSides(response);
        }
        getAllFeaturedSides();
    }, [])

  return (
    <FeatureSidesStyled>
        <h2 className="title">Featured Sides</h2>
        <div className="list-wrapper">
        {!!featuredSides?.length && featuredSides.map(side => (
            <Link to={`/${side.id}`}>
                <FeatureSideCard side={side} />
            </Link>
            ))}
        </div>
    </FeatureSidesStyled>
  )
}

export default FeaturedSides