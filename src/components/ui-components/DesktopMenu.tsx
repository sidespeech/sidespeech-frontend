import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import UserSides from '../UserColonies/UserSides';
import logoSmall from '../../assets/logo.svg';

interface DesktopMenuProps {
    userData: any;
}

const DesktopMenuStyled = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .logo,
    .dashboard-icon.active {
        path {
            fill: var(--primary);
        }
    }
    .dashboard-icon {
        path {
            fill: var(--text);
        }
    }
    .logo {
    }
`;

const DesktopMenu = ({ userData }: DesktopMenuProps) => {
    const { pathname } = useLocation();
    const dashboardUrls = ['/', '/my-sides', '/search', '/invitations', '/new-side'];
    return (
        <DesktopMenuStyled>
            <div>
                <Link to="/">
                    <svg
                        className={`dashboard-icon ${dashboardUrls.includes(pathname) ? 'active' : ''}`}
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M10.4316 6.06323V0.0632324H18.4316V6.06323H10.4316ZM0.431641 10.0632V0.0632324H8.43164V10.0632H0.431641ZM10.4316 18.0632V8.06323H18.4316V18.0632H10.4316ZM0.431641 18.0632V12.0632H8.43164V18.0632H0.431641Z" />
                    </svg>
                </Link>
                {userData.user && <UserSides />}
            </div>
            <Link to={'/general-settings'}>
                {' '}
                <div className="flex align-center justify-center">
                    <svg
                        className="logo"
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M15.9588 11.243L12.7487 11.2363C11.2681 11.2363 10.0627 10.0005 10.0627 8.48261V8.28112C10.0627 6.76325 11.2681 5.52747 12.7487 5.52747H28C26.7029 3.29096 24.9733 1.39698 22.8376 0H12.7422C8.28732 0 4.67103 3.71408 4.67103 8.27441V8.47589C4.67103 9.44303 4.83481 10.3699 5.13617 11.2363C6.24988 14.4466 9.23725 16.757 12.7487 16.757L15.9588 16.7637C17.4394 16.7637 18.6448 17.9995 18.6448 19.5174V19.7189C18.6448 21.2367 17.4394 22.4725 15.9588 22.4725H0C1.29715 24.709 3.04633 26.603 5.18203 28H15.9523C20.4071 28 24.0234 24.2859 24.0234 19.7256V19.5241C24.0234 18.557 23.8596 17.6301 23.5583 16.7637C22.4576 13.5534 19.4637 11.243 15.9588 11.243Z"
                            fill="var(--primary)"
                        />
                    </svg>
                </div>
            </Link>
        </DesktopMenuStyled>
    );
};

export default DesktopMenu;
