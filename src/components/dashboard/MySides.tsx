import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Collection } from '../../models/interfaces/collection';
import { Side } from '../../models/Side';
import { RootState } from '../../redux/store/app.store';
import Button from '../ui-components/Button';
import CustomCheckbox from '../ui-components/CustomCheckbox';
import CustomSelect from '../ui-components/CustomSelect';
import SideCardItem from './shared-components/SideCardItem';

interface MySidesStyledProps {}

const MySidesStyled = styled.main<MySidesStyledProps>`
  width: 100%;
  .title {
    margin-top: 0;
  }
  .my-sides-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0 2rem 0;
    .collection-select, .verified-checkbox {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .collection-select {
      justify-content: space-between;
      background-color: var(--bg-secondary-dark);
      padding: .5rem 1rem;
      width: 40%;
      border-radius: 10px;
    }
  }

  .no-results, .spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    width: 100%;
    min-height: 400px;
    color: var(--text-secondary);
  }
  .no-results {
    flex-direction: column;
    background-image: url();
    background-position: center center;
    backgound-size: contain;
    background-repeat: no-repeat;
    & p {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.4;
      color: var(--text-secondary-dark);
    }
    & .buttons-wrapper {
      display: flex;
      gap: 1rem;
      margin-top: 2.5rem;
      & a {
        color: inherit;
      }
      & button svg {
        margin-right: .5rem;
      }
    }
  }
  .list-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, calc(33% - .5rem)));
    grid-gap: 1rem;
    width: 100%;
  }
`;

interface MySidesProps {
  collections: Collection[];
};

const MySides = ({ collections }: MySidesProps) => {
  const [isOnlyVerifiedCollectionsChecked, setIsOnlyVerifiedCollectionsChecked] = useState<boolean>(false);
  const [userSides, setUserSides] = useState<Side[]>([])

  const { sides } = useSelector(
    (state: RootState) => state.user
);

useEffect(() => {
  if (sides) {
    let filteredSides = sides;
    // if (isOnlyVerifiedCollectionsChecked) filteredSides = filteredSides.filter(side => side);
    setUserSides(filteredSides);
  }
}, [isOnlyVerifiedCollectionsChecked, sides])

  return (
    <MySidesStyled>
      <h2 className="title">My sides ({userSides.length})</h2>

      <div className="my-sides-toolbar">
        <div className="collection-select">
          <label>Collection</label>
          <CustomSelect 
            onChange={()=> {}}
            options={['All', ...collections.map(collection => collection.openseaData?.collectionName)]}
            placeholder="Select a collection"
            valueToSet={''}
            values={['all', ...collections.map(collection => collection.address)]}
            width="70%"
          />
        </div>

        <div className="verified-checkbox">
          <CustomCheckbox 
            isChecked={isOnlyVerifiedCollectionsChecked}
            label='Only with verified collections' 
            onClick={() => setIsOnlyVerifiedCollectionsChecked(!isOnlyVerifiedCollectionsChecked)} 
          />
        </div>
      </div>

      {!!userSides?.length ? (
            <div className="list-wrapper">
              {userSides.map(side => (
                <Link key={side.id} to={`/${side.id}`}>
                  <SideCardItem side={side} userSides />
                </Link>
              ))}
            </div>
          ) : (
              <div className="no-results">
                  <p>Ooops!<br/>Nothing here</p>
                  <div className="buttons-wrapper">
                    <Link to="/new-side">
                      <Button width={145} background="var(--bg-secondary-light)">
                        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.66699 13.1666H9.33366V9.83329H12.667V8.16663H9.33366V4.83329H7.66699V8.16663H4.33366V9.83329H7.66699V13.1666ZM8.50033 17.3333C7.34755 17.3333 6.26421 17.1144 5.25033 16.6766C4.23644 16.2394 3.35449 15.6458 2.60449 14.8958C1.85449 14.1458 1.26088 13.2638 0.823659 12.25C0.385881 11.2361 0.166992 10.1527 0.166992 8.99996C0.166992 7.84718 0.385881 6.76385 0.823659 5.74996C1.26088 4.73607 1.85449 3.85413 2.60449 3.10413C3.35449 2.35413 4.23644 1.76024 5.25033 1.32246C6.26421 0.885237 7.34755 0.666626 8.50033 0.666626C9.6531 0.666626 10.7364 0.885237 11.7503 1.32246C12.7642 1.76024 13.6462 2.35413 14.3962 3.10413C15.1462 3.85413 15.7398 4.73607 16.177 5.74996C16.6148 6.76385 16.8337 7.84718 16.8337 8.99996C16.8337 10.1527 16.6148 11.2361 16.177 12.25C15.7398 13.2638 15.1462 14.1458 14.3962 14.8958C13.6462 15.6458 12.7642 16.2394 11.7503 16.6766C10.7364 17.1144 9.6531 17.3333 8.50033 17.3333Z" fill="white"/>
                        </svg>
                        Create a Side
                      </Button>
                    </Link>
                    <Link to="/">
                      <Button width={145}>Explore</Button>
                    </Link>
                  </div>
              </div>
            )
      }
    </MySidesStyled>
  )
}

export default MySides