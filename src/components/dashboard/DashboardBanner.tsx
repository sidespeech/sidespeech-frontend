import React from 'react';
import styled from 'styled-components';
import InputText from '../ui-components/InputText';
import bannerImage from '../../assets/images/dashboard-banner.svg';
import { breakpoints, size } from '../../helpers/breakpoints';
import { Link, useLocation } from 'react-router-dom';

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
    ${breakpoints(size.xs, `{height: 77px;}`)};
    ${breakpoints(
        size.lg,
        `{
      height: 35vh;
      border-radius: 10px;
      margin-bottom: 1rem;
      background-image: 
        linear-gradient(0deg, rgba(112, 92, 233, 0.7) 0%, rgba(112, 92, 233, 0.322) 100%), url(${bannerImage});
      }`
    )};
    &.search-page {
        height: 35vh;
        background-image: linear-gradient(0deg, rgba(112, 92, 233, 0.7) 0%, rgba(112, 92, 233, 0.322) 100%),
            url(${bannerImage});
    }
    & .desktop-toolbar {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        h1 {
            margin: 0;
        }
        ${breakpoints(
            size.xs,
            `{
        display: none;
        &.search-page {
          display: flex;
        }
      }`
        )};
        ${breakpoints(
            size.lg,
            `{
        display: flex;
      }`
        )};
        .input-wrapper {
            width: 90vw;
            ${breakpoints(
                size.md,
                `{
          width: 435px;
        }`
            )}
        }
    }
    & .mobile-toolbar {
        ${breakpoints(size.xs, `{display: flex;}`)};
        ${breakpoints(size.lg, `{display: none;}`)};
        width: 100%;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        &.search-page {
            display: none;
        }
        h1 {
            margin: 0;
        }
    }
`;

const SearchPageHeader = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: row !important;
    align-items: center;
    justify-content: space-between;
    & > div {
        display: flex;
        align-items: center;
        gap: 1rem;
        & svg {
            transform: scale(1.3);
        }
        & h1 {
            margin: 0;
        }
    }
    ${breakpoints(
        size.lg,
        `{
      display: none;
    }`
    )}
`;

interface DashboardBannerProps {
    searchText: string;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardBanner = ({ searchText, setSearchText }: DashboardBannerProps) => {
    const { pathname } = useLocation();

    return (
        <>
            {pathname === '/search' && (
                <SearchPageHeader>
                    <div>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill="#B4C1D2"
                                d="M14.7656 14.6738L10.8398 10.748C11.6992 9.67383 12.1387 8.41406 12.1582 6.96875C12.1191 5.25 11.5234 3.81445 10.3711 2.66211C9.21875 1.50977 7.7832 0.914062 6.06445 0.875C4.3457 0.914062 2.91016 1.50977 1.75781 2.66211C0.625 3.81445 0.0390625 5.25 0 6.96875C0.0390625 8.6875 0.634766 10.123 1.78711 11.2754C2.91992 12.4277 4.3457 13.0234 6.06445 13.0625C7.5293 13.043 8.78906 12.6035 9.84375 11.7441L13.7695 15.6699C13.9453 15.8066 14.1211 15.875 14.2969 15.875C14.4922 15.875 14.6582 15.8066 14.7949 15.6699C15.0684 15.3379 15.0586 15.0059 14.7656 14.6738ZM1.40625 6.96875C1.44531 5.64062 1.9043 4.53711 2.7832 3.6582C3.66211 2.7793 4.76562 2.32031 6.09375 2.28125C7.42188 2.32031 8.52539 2.7793 9.4043 3.6582C10.2832 4.53711 10.7422 5.64062 10.7812 6.96875C10.7422 8.29688 10.2832 9.40039 9.4043 10.2793C8.52539 11.1582 7.42188 11.6172 6.09375 11.6562C4.76562 11.6172 3.66211 11.1582 2.7832 10.2793C1.9043 9.40039 1.44531 8.29688 1.40625 6.96875Z"
                            />
                        </svg>
                        <h1>Search</h1>
                    </div>

                    <Link to="/new-side" onClick={() => setSearchText('')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
                                fill="#B4C1D2"
                            />
                        </svg>
                    </Link>
                </SearchPageHeader>
            )}

            <DashboardStyled className={`${pathname === '/search' ? 'search-page' : ''}`}>
                <div className={`desktop-toolbar ${pathname === '/search' ? 'search-page' : ''}`}>
                    <h1>Search and Join a Side</h1>
                    <div className="input-wrapper">
                        <InputText
                            bgColor="rgba(0, 0, 0, 0.2)"
                            color="var(--white)"
                            glass
                            height={43}
                            iconColor="#B4C1D2"
                            iconRightPos={{ right: 16, top: 12 }}
                            onChange={(ev: any) => setSearchText(ev.target.value)}
                            placeholder="Search by name or collection"
                            placeholderColor="var(--white)"
                            radius="10px"
                            value={searchText}
                        />
                    </div>
                </div>

                <div className={`mobile-toolbar ${pathname === '/search' ? 'search-page' : ''}`}>
                    <div className="flex gap-20 align-center">
                        <Link to="/">
                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 19 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill="var(--text)"
                                    d="M10.4316 6.06323V0.0632324H18.4316V6.06323H10.4316ZM0.431641 10.0632V0.0632324H8.43164V10.0632H0.431641ZM10.4316 18.0632V8.06323H18.4316V18.0632H10.4316ZM0.431641 18.0632V12.0632H8.43164V18.0632H0.431641Z"
                                />
                            </svg>
                        </Link>
                        <h1>Dashboard</h1>
                    </div>

                    <div className="flex gap-20 align-center">
                        <Link to="/search">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill="#B4C1D2"
                                    d="M14.7656 14.6738L10.8398 10.748C11.6992 9.67383 12.1387 8.41406 12.1582 6.96875C12.1191 5.25 11.5234 3.81445 10.3711 2.66211C9.21875 1.50977 7.7832 0.914062 6.06445 0.875C4.3457 0.914062 2.91016 1.50977 1.75781 2.66211C0.625 3.81445 0.0390625 5.25 0 6.96875C0.0390625 8.6875 0.634766 10.123 1.78711 11.2754C2.91992 12.4277 4.3457 13.0234 6.06445 13.0625C7.5293 13.043 8.78906 12.6035 9.84375 11.7441L13.7695 15.6699C13.9453 15.8066 14.1211 15.875 14.2969 15.875C14.4922 15.875 14.6582 15.8066 14.7949 15.6699C15.0684 15.3379 15.0586 15.0059 14.7656 14.6738ZM1.40625 6.96875C1.44531 5.64062 1.9043 4.53711 2.7832 3.6582C3.66211 2.7793 4.76562 2.32031 6.09375 2.28125C7.42188 2.32031 8.52539 2.7793 9.4043 3.6582C10.2832 4.53711 10.7422 5.64062 10.7812 6.96875C10.7422 8.29688 10.2832 9.40039 9.4043 10.2793C8.52539 11.1582 7.42188 11.6172 6.09375 11.6562C4.76562 11.6172 3.66211 11.1582 2.7832 10.2793C1.9043 9.40039 1.44531 8.29688 1.40625 6.96875Z"
                                />
                            </svg>
                        </Link>

                        <Link to="/new-side" onClick={() => setSearchText('')}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
                                    fill="#B4C1D2"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </DashboardStyled>
        </>
    );
};

export default DashboardBanner;
