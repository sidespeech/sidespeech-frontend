import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FALLBACK_BG_IMG } from '../../constants/constants';
import { Side } from '../../models/Side';
import SideEligibilityModal from '../Modals/SideEligibilityModal';
import Spinner from '../ui-components/Spinner';
import noResultsImg from '../../assets/my_sides_empty_screen_shape.svg'
import { breakpoints, size } from '../../helpers/breakpoints';


const CARD_HEIGHT = 191;
const CARD_WIDTH = 265;

interface CardStyledProps {
  coverImage?: string;
}

const FeatureSideCardStyled = styled.div<CardStyledProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: ${CARD_HEIGHT}px;
  flex-shrink: 0;
  background-color: var(--bg-secondary);
  background-image: linear-gradient(
      180deg,
      rgba(24, 26, 43, 0) 0%,
      #181a2b 100%
    ),
    url(${(props) => props.coverImage || FALLBACK_BG_IMG});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  color: var(--text-secondary);
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  ${breakpoints(size.md, `{
    width: ${CARD_WIDTH}px;
  }`)}
  .collections {
    display: flex;
    gap: 5px;
    width: 100%;
    & span {
      background-color: var(--bg-secondary-light);
      color: var(--text-secondary-light);
      padding: 0.3rem 0.5rem;
      border-radius: 5px;
      &.collection {
        display: flex;
        align-items: center;
        width: auto;
        & > svg {
          margin-left: 1rem;
          & path {
            fill: #705ce9;
          }
        }
      }
      &.more-collections {
      }
    }
  }
`;

interface FeaturedSideCardProps {
  onJoin?: (side: Side) => void;
  side: Side;
}

const FeatureSideCard = ({ onJoin, side }: FeaturedSideCardProps) => {
  return (
    <FeatureSideCardStyled
      coverImage={side.coverImage || side.firstCollection?.imageUrl}
      onClick={() => onJoin?.(side)}
    >
      <div className="content">
        <h3>{side.name}</h3>
        {side.collectionsCount > 0 && (
          <div className="collections">
            <span className="collection">
              {side.firstCollection?.collectionName}
              {side.firstCollection.safelistRequestStatus === "verified" && (
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.87273 16L4.40455 13.5619L1.62273 12.9524L1.89318 10.1333L0 8L1.89318 5.86667L1.62273 3.04762L4.40455 2.4381L5.87273 0L8.5 1.10476L11.1273 0L12.5955 2.4381L15.3773 3.04762L15.1068 5.86667L17 8L15.1068 10.1333L15.3773 12.9524L12.5955 13.5619L11.1273 16L8.5 14.8952L5.87273 16ZM7.68864 10.7048L12.0545 6.4L10.9727 5.29524L7.68864 8.53333L6.02727 6.93333L4.94545 8L7.68864 10.7048Z" />
                </svg>
              )}
            </span>
            {side.collectionsCount > 1 && (
              <span className="more-collections">
                +{side.collectionsCount - 1}
              </span>
            )}
          </div>
        )}
      </div>
    </FeatureSideCardStyled>
  );
};

interface ListStyledProps {
  firstSide?: number;
  totalSides?: number;
}

const FeatureSidesStyled = styled.div<ListStyledProps>`
  .title {
    margin-top: 0;
  }
  .spinner-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .list-wrapper {
    position: relative;
    width: 100%;
    overflow: visible;
    & .prev-next-btn {
      position: absolute;
      z-index: 2;
      top: 50%;
      border: none;
      outline: none;
      box-shadow: none;
      height: 2rem;
      width: 2rem;
      border-radius: 2rem;
      background-color: var(--bg-secondary-light);
      &:disabled {
        opacity: 0.3;
        pointer-events: none;
      }
      &.prev-btn {
        left: 0;
        transform: translate(-50%, -50%);
      }
      &.next-btn {
        right: 0;
        transform: translate(50%, -50%);
      }
    }
    & > div {
      position: relative;
      overflow-x: hidden;
      width: 100%;
      &::after {
        position: absolute;
        content: "";
        top: 0;
        bottom: 0;
        right: 0;
        width: 50%;
        z-index: 2;
        background: linear-gradient(
          270deg,
          #242635 36.81%,
          rgba(36, 38, 53, 0) 100%
        );
        pointer-events: none;
        opacity: 0.3;
      }
      & > div {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: calc(${props => (props.totalSides || 1) * 100}% + ${props => (props.totalSides || 1) * 1}rem);
        transition: transform 0.3s ease;
        transform: translateX(-${props => ((props.firstSide || 1 - 1) * (100 / (props.totalSides || 1)))}%);
        ${props => breakpoints(size.md, `{
          transform: translateX(
            -${(props.firstSide || 1 - 1) * CARD_WIDTH}px
          );
        }`)}
        ${props => breakpoints(size.md, `{
          width: ${(props.totalSides || 1) * CARD_WIDTH}px;
        }`)}
        & > a {
          width: 100%;
        }
      }
    }
  }
  & .no-results {
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: url(${noResultsImg});
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      height: ${CARD_HEIGHT}px;
      & p {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.4;
          color: var(--text-secondary-dark);
      }
  }
`;

interface FeatureSidesProps {
  featuredSides: Side[];
  sidesLoading?: boolean;
}

const FeaturedSides = ({ featuredSides, sidesLoading }: FeatureSidesProps) => {
  const [displayEligibility, setDisplayEligibility] = useState<boolean>(false);
  const [firstSideShowing, setFirstSideShowing] = useState<number>(0);
  const [selectedSide, setSelectedSide] = useState<Side | null>(null);

  const handleEligibilityCheck = (side: Side) => {
    setSelectedSide(side);
    setDisplayEligibility(true);
  };

  return (
    <FeatureSidesStyled
      totalSides={featuredSides.length}
      firstSide={firstSideShowing}
    >
      <h2 className="title">Featured Sides</h2>
      <div>
        {sidesLoading ? (
          <div className="spinner-wrapper">
            <Spinner />
          </div>
        ) : !!featuredSides?.length ? (
          <div className="list-wrapper">
            <button
              className="prev-next-btn prev-btn"
              disabled={firstSideShowing === 0}
              onClick={() => setFirstSideShowing((prevSide) => prevSide - 1)}
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
            <div>
              <div>
                {featuredSides.map((side) => (
                  <React.Fragment key={side.id}>
                    {side.joined ? (
                      <Link to={`/${side.name}`}>
                        <FeatureSideCard side={side} />
                      </Link>
                    ) : (
                      <FeatureSideCard
                        onJoin={handleEligibilityCheck}
                        side={side}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <button
              className="prev-next-btn next-btn"
              disabled={
                featuredSides.length < 3 ||
                firstSideShowing === featuredSides.length - 1
              }
              onClick={() => setFirstSideShowing((prevSide) => prevSide + 1)}
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        ) : (
          <div className="no-results">
            <p>
              Ooops!
              <br />
              Nothing here
            </p>
          </div>
        )}
      </div>

      {displayEligibility && selectedSide && (
        <SideEligibilityModal
          setDisplayLeaveSide={() => {}}
          setDisplayEligibility={setDisplayEligibility}
          selectedSide={selectedSide}
        />
      )}
    </FeatureSidesStyled>
  );
};

export default FeaturedSides;
 