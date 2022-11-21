import React from 'react'
import styled from 'styled-components'
import InputText from "../ui-components/InputText";
import bannerImage from '../../assets/images/dashboard-banner.svg';
import { breakpoints, size } from '../../helpers/breakpoints';

const DashboardStyled = styled.header`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    flex-shrink: 0;
    border-radius: 10px;
    ${breakpoints(size.xs, `{height: 40px;}`)};
    ${breakpoints(size.lg, `{
        height: 35vh;, 
        background-image: 
        linear-gradient(0deg, rgba(112, 92, 233, 0.7) 0%, rgba(112, 92, 233, 0.322) 100%), url(${bannerImage});
      }`)};
    & .desktop-toolbar {
      ${breakpoints(size.xs, `{display: none;}`)};
      ${breakpoints(size.lg, `{display: block;}`)};
    }
    & .mobile-toolbar {
      ${breakpoints(size.xs, `{display: block;}`)};
      ${breakpoints(size.lg, `{display: none;}`)};
    }
`;

interface DashboardBannerProps {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardBanner = ({searchText, setSearchText}: DashboardBannerProps) => {
  return (
    <DashboardStyled className="mb-4">
        <div className="desktop-toolbar">
          <h1>Search and Join a Side</h1>
          <InputText 
            bgColor="rgba(0, 0, 0, 0.2)"
            color="var(--white)"
            glass
            height={43}
            iconColor="#B4C1D2"
            iconRightPos={{right: 16, top: 12}}
            onChange={(ev: any) => setSearchText(ev.target.value)}
            parentWidth="435px"
            placeholder='Search by name or collection'
            placeholderColor="var(--white)"
            radius="10px"
            value={searchText}
            />
        </div>

        <div className="mobile-toolbar">
mobile toolbar
        </div>
    </DashboardStyled>
  )
}

export default DashboardBanner