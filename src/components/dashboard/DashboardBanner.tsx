import React from 'react'
import styled from 'styled-components'
import InputText from "../ui-components/InputText";
import bannerImage from '../../assets/images/dashboard-banner.png';

const DashboardStyled = styled.header`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: 
        linear-gradient(0deg, rgba(112, 92, 233, 0.7) 0%, rgba(112, 92, 233, 0.322) 100%),
        url(${bannerImage});
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: 35vh;
    flex-shrink: 0;
    border-radius: 10px;
`;

interface DashboardBannerProps {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardBanner = ({searchText, setSearchText}: DashboardBannerProps) => {
  return (
    <DashboardStyled className="mb-4">
        <h1>Search and Join a Side</h1>
        <InputText 
            bgColor="rgba(0, 0, 0, 0.2)"
            color="var(--white)"
            defaultValue={searchText}
            glass
            height={43}
            iconColor="#B4C1D2"
            iconRightPos={{right: 16, top: 12}}
            onChange={(ev: any) => setSearchText(ev.target.value)}
            parentWidth="435px"
            placeholder='Search by name or collection'
            placeholderColor="var(--white)"
            radius="10px"
        />
    </DashboardStyled>
  )
}

export default DashboardBanner