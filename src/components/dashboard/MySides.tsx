import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Side } from '../../models/Side';
import { sideAPI } from '../../services/side.service';
import CustomCheckbox from '../ui-components/CustomCheckbox';
import CustomSelect from '../ui-components/CustomSelect';
import Spinner from '../ui-components/Spinner';
import SideCardItem from './shared-components/SideCardItem';

interface MySidesStyledProps {}

const MySidesStyled = styled.main<MySidesStyledProps>`
  .title {
    margin-top: 0;
  }
  .my-sides-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0;
    .collection-select, .verified-checkbox {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .collection-select {
      justify-content: space-between;
      background-color: var(--bg-secondary);
      padding: .5rem 1rem;
      width: 40%;
    }
  }

  .no-results, .spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    width: 100%;
    min-height: 200px;
    color: var(--text-secondary);
  }
  .list-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
  }
`;

interface MySidesProps {};

const MySides = ({}: MySidesProps) => {
  const [sidesLoading, setSidesLoading] = useState<boolean>(false);
  const [userSides, setUserSides] = useState<Side[]>([]);

  useEffect(() => {
    async function getUserSides() {
      setSidesLoading(true);
      const response = await sideAPI.getAllSides();
      setUserSides(response);
      setSidesLoading(false);
    }

    getUserSides();
  }, [])

  return (
    <MySidesStyled>
      <h2 className="title">My sides ({userSides.length})</h2>

      <div className="my-sides-toolbar">
        <div className="collection-select">
          <label>Collection</label>
          <CustomSelect 
            onChange={()=> {}}
            options={[]}
            placeholder="Select a collection"
            width="70%"
          />
        </div>

        <div className="verified-checkbox">
          <label>Only with verified collections</label>
          <CustomCheckbox />
        </div>
      </div>

      {sidesLoading ? (
        <div className="spinner-wrapper">
            <Spinner />
        </div>
        ) : !!userSides?.length ? (
            <div className="list-wrapper">
              {userSides.map(side => (
                <SideCardItem side={side} />
              ))}
            </div>
          ) : (
              <div className="no-results">
                  <p>No results</p>
              </div>
            )
      }
    </MySidesStyled>
  )
}

export default MySides