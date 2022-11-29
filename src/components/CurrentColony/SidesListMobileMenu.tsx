import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { breakpoints, size } from '../../helpers/breakpoints';
import { Side } from '../../models/Side';
import { RootState } from '../../redux/store/app.store';

const SidesListMobileMenuStyled = styled.div`
    position: fixed;
    width: 100vw;
    height: 130vh;
    top: -15vh;
    left: 0;
    z-index: 9902;
    pointer-events: none;
    opacity: 0;
    transition: opacity .3s ease;
    background-color: var(--bg-secondary-dark);
    ${breakpoints(size.lg, `{
        display: none;
    }`)}    
    .menu-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 80%;
        height: 100%;
        background-color: var(--bg-primary);
        padding: 15vh 0;
        transition: transform .3s ease;
        transform: translateX(-200vw);
        & .content {
            display: flex;
            flex-direction: column;
            flex: 1 0;
            padding: 2rem 0;
            gap: 1rem;
            & h2 {
                font-size: 1.5rem;
                margin: 0;
                padding: 0 1rem;
            }
            & .sides-list {
                display: flex;
                flex-direction: column;
                flex: 1 0;
                & .side-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    color: inherit;
                    &.active {
                        background-color: var(--bg-secondary);
                    }
                    & .side-image {
                        width: 36px;
                        height: 36px;
                        border-radius: 36px;
                        background-color: var(--bg-secondary);
                        & > img {
                            width: 100%;
                            object-fit: cover;
                        }
                    }
                }
            }
        }
        & .footer {
            width: 100%;
            background-color: var(--bg-secondary);
            padding: 1rem .5rem;
            & a {
                padding: .5rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                color: var(--text-secondary);
                width: 100%;
            }
        }
    }
    &.open {
        opacity: 1;
        pointer-events: all;
        & .menu-wrapper {
            transform: translateX(0);
        }
    }
`;

interface SidesListMobileMenuProps {
    currentSide: Side | null;
    onClose: any;
    open: boolean;
}

const SidesListMobileMenu = ({currentSide, onClose, open}: SidesListMobileMenuProps) => {
    const userData = useSelector((state: RootState) => state.user);

  return (
    <SidesListMobileMenuStyled onClick={onClose} className={open ? 'open' : ''}>
        <div className="menu-wrapper">
            <div className="content">
                <h2>Sides</h2>
                <div className="sides-list">
                    {userData.sides.map(side => (
                        <Link to={`/side/${side.name}`} key={side.id} className={`side-item ${currentSide?.id === side.id ? 'active' : ''}`}>
                            <div className="side-image">
                                <img src={side.sideImage} alt="" />
                            </div>
                            {side.name}
                        </Link>
                    ))}
                </div>
            </div>

            <nav className="footer">
                <Link to="/new-side">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.54167 13.125H9.45833V9.45833H13.125V8.54167H9.45833V4.875H8.54167V8.54167H4.875V9.45833H8.54167V13.125ZM9 17.25C7.85417 17.25 6.78106 17.0324 5.78067 16.5973C4.77967 16.1616 3.90883 15.5731 3.16817 14.8318C2.42689 14.0912 1.83839 13.2203 1.40267 12.2193C0.967555 11.2189 0.75 10.1458 0.75 9C0.75 7.85417 0.967555 6.78075 1.40267 5.77975C1.83839 4.77936 2.42689 3.90853 3.16817 3.16725C3.90883 2.42658 4.77967 1.83839 5.78067 1.40267C6.78106 0.967555 7.85417 0.75 9 0.75C10.1458 0.75 11.2192 0.967555 12.2203 1.40267C13.2206 1.83839 14.0915 2.42658 14.8328 3.16725C15.5734 3.90853 16.1616 4.77936 16.5973 5.77975C17.0324 6.78075 17.25 7.85417 17.25 9C17.25 10.1458 17.0324 11.2189 16.5973 12.2193C16.1616 13.2203 15.5734 14.0912 14.8328 14.8318C14.0915 15.5731 13.2206 16.1616 12.2203 16.5973C11.2192 17.0324 10.1458 17.25 9 17.25ZM9 16.3333C11.0472 16.3333 12.7812 15.6229 14.2021 14.2021C15.6229 12.7812 16.3333 11.0472 16.3333 9C16.3333 6.95278 15.6229 5.21875 14.2021 3.79792C12.7812 2.37708 11.0472 1.66667 9 1.66667C6.95278 1.66667 5.21875 2.37708 3.79792 3.79792C2.37708 5.21875 1.66667 6.95278 1.66667 9C1.66667 11.0472 2.37708 12.7812 3.79792 14.2021C5.21875 15.6229 6.95278 16.3333 9 16.3333Z" fill="#B4C1D2"/>
                    </svg>
                    Create a new Side
                </Link>
                <Link to={`/user/${userData?.user?.username}`}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.68333 14.0188C4.4625 13.4688 5.2875 13.0297 6.15833 12.7015C7.02917 12.3727 7.97639 12.2083 9 12.2083C10.0236 12.2083 10.9708 12.3727 11.8417 12.7015C12.7125 13.0297 13.5375 13.4688 14.3167 14.0188C14.9278 13.3924 15.4167 12.6551 15.7833 11.8068C16.15 10.9592 16.3333 10.0236 16.3333 9C16.3333 6.96806 15.6193 5.23769 14.1911 3.80892C12.7623 2.38075 11.0319 1.66667 9 1.66667C6.96806 1.66667 5.238 2.38075 3.80983 3.80892C2.38106 5.23769 1.66667 6.96806 1.66667 9C1.66667 10.0236 1.85 10.9592 2.21667 11.8068C2.58333 12.6551 3.07222 13.3924 3.68333 14.0188ZM9 9.45833C8.22083 9.45833 7.56786 9.19464 7.04108 8.66725C6.51369 8.14047 6.25 7.4875 6.25 6.70833C6.25 5.92917 6.51369 5.27589 7.04108 4.7485C7.56786 4.22172 8.22083 3.95833 9 3.95833C9.77917 3.95833 10.4321 4.22172 10.9589 4.7485C11.4863 5.27589 11.75 5.92917 11.75 6.70833C11.75 7.4875 11.4863 8.14047 10.9589 8.66725C10.4321 9.19464 9.77917 9.45833 9 9.45833ZM9 17.25C7.85417 17.25 6.77708 17.0361 5.76875 16.6083C4.76042 16.1806 3.88592 15.5963 3.14525 14.8557C2.40397 14.1144 1.81944 13.2396 1.39167 12.2312C0.963889 11.2229 0.75 10.1458 0.75 9C0.75 7.85417 0.963889 6.77708 1.39167 5.76875C1.81944 4.76042 2.40397 3.88561 3.14525 3.14433C3.88592 2.40367 4.76042 1.81944 5.76875 1.39167C6.77708 0.963889 7.85417 0.75 9 0.75C10.1458 0.75 11.2229 0.963889 12.2312 1.39167C13.2396 1.81944 14.1144 2.40367 14.8557 3.14433C15.5963 3.88561 16.1806 4.76042 16.6083 5.76875C17.0361 6.77708 17.25 7.85417 17.25 9C17.25 10.1458 17.0361 11.2229 16.6083 12.2312C16.1806 13.2396 15.5963 14.1144 14.8557 14.8557C14.1144 15.5963 13.2396 16.1806 12.2312 16.6083C11.2229 17.0361 10.1458 17.25 9 17.25ZM9 16.3333C9.84028 16.3333 10.6693 16.1842 11.4869 15.886C12.304 15.5884 13.0104 15.1875 13.6062 14.6833C13.0104 14.1944 12.3229 13.8125 11.5437 13.5375C10.7646 13.2625 9.91667 13.125 9 13.125C8.08333 13.125 7.23175 13.2625 6.44525 13.5375C5.65814 13.8125 4.97431 14.1944 4.39375 14.6833C4.98958 15.1875 5.69603 15.5884 6.51308 15.886C7.33075 16.1842 8.15972 16.3333 9 16.3333ZM9 8.54167C9.51944 8.54167 9.95486 8.36597 10.3063 8.01458C10.6576 7.66319 10.8333 7.22778 10.8333 6.70833C10.8333 6.18889 10.6576 5.75347 10.3063 5.40208C9.95486 5.05069 9.51944 4.875 9 4.875C8.48056 4.875 8.04514 5.05069 7.69375 5.40208C7.34236 5.75347 7.16667 6.18889 7.16667 6.70833C7.16667 7.22778 7.34236 7.66319 7.69375 8.01458C8.04514 8.36597 8.48056 8.54167 9 8.54167Z" fill="#B4C1D2"/>
                    </svg>
                    Profile
                </Link>
                <Link to={`/side/${currentSide?.['name']}/settings`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.54134 15.7923V11.209H8.45801V13.0423H15.7913V13.959H8.45801V15.7923H7.54134ZM0.208008 13.959V13.0423H4.79134V13.959H0.208008ZM3.87467 10.2923V8.45898H0.208008V7.54232H3.87467V5.70898H4.79134V10.2923H3.87467ZM7.54134 8.45898V7.54232H15.7913V8.45898H7.54134ZM11.208 4.79232V0.208984H12.1247V2.04232H15.7913V2.95898H12.1247V4.79232H11.208ZM0.208008 2.95898V2.04232H8.45801V2.95898H0.208008Z" fill="#B4C1D2"/>
                    </svg>
                    Preferences
                </Link>
            </nav>
        </div>
    </SidesListMobileMenuStyled>
  )
}

export default SidesListMobileMenu