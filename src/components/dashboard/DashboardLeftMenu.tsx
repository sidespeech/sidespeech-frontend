import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { breakpoints, size } from '../../helpers/breakpoints';
import { checkUserEligibility } from '../../helpers/utilities';
import { User } from '../../models/User';
import { RootState } from '../../redux/store/app.store';
import invitationService from '../../services/api-services/invitation.service';
import Button from '../ui-components/Button';
import { Dot } from '../ui-components/styled-components/shared-styled-components';

const DashboardLeftMenuStyled = styled.aside`
    ${breakpoints(size.lg, `{flex: 1 0;}`)};
    & .title {
        margin-top: 0;
        ${breakpoints(size.xs, `{display: none;}`)};
        ${breakpoints(size.lg, `{display: block;}`)};
    }
    & .navigation-menu ul {
        width: 100%;
        padding: 0;
        display: flex;
        ${breakpoints(size.xs, `{flex-direction: row; gap: 1rem; margin: 0;}`)};
        ${breakpoints(size.lg, `{flex-direction: column; gap: 0; margin: 1rem 0;}`)};
        & .menu-item {
            width: 100%;
            display: flex;
            list-style: none;
            padding: 10px;
            cursor: pointer;
            border-radius: 10px;
            color: var(--inactive);
            transition: background-color 0.3s ease;
            ${breakpoints(size.lg, `{ padding: 1rem 10px;}`)};
            & svg {
                margin-right: 1rem;
                opacity: 0.4;
                transition: opacity 0.3s ease;
                & path {
                    transition: fill 0.3s ease;
                    fill: var(--inactive);
                }
            }
            &.active {
                background-color: var(--white-transparency-10);
                color: var(--white);
                & svg {
                    opacity: 1;
                    & path {
                        fill: var(--primary);
                    }
                }
            }
            &:hover,
            &:focus {
                background-color: var(--white-transparency-10);
            }
        }
    }
    .add-side-btn {
        ${breakpoints(size.xs, `{display: none;}`)};
        ${breakpoints(size.lg, `{display: flex;}`)};
        svg {
            margin-right: 1rem;
        }
    }
    &.search-page {
        display: none;
        ${breakpoints(
            size.lg,
            `{
            display: block;
        }`
        )}
    }
`;

const DashboardLeftMenu = ({
    currentTab,
    setSearchText,
    tabKeys
}: {
    currentTab: string;
    setSearchText: any;
    tabKeys: {
        [key: string]: string;
    };
}) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const userData = useSelector((state: RootState) => state.user);
    const [invitations, setInvitations] = useState<any[]>([]);

    const getInvitations = async (user: User) => {
        const pendingInvitations = await invitationService.getPendingInvitationsByRecipient(user['id']);
        let invitations = pendingInvitations.map((item: any) => {
            item['eligibility'] = checkUserEligibility(userData['userCollectionsData'], item['side']);
            return item;
        });
        setInvitations(invitations);
    };

    useEffect(() => {
        if (userData && userData['user']) getInvitations(userData['user']);
    }, [userData]);

    return (
        <DashboardLeftMenuStyled className={pathname === '/search' ? 'search-page' : ''}>
            <h2 className="title">Dashboard</h2>
            <nav className="navigation-menu">
                <ul>
                    <li
                        className={`menu-item ${currentTab === tabKeys.explore ? 'active' : ''}`}
                        onClick={() => {
                            setSearchText('');
                            navigate(tabKeys.explore);
                        }}
                    >
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 20.3125C8.61667 20.3125 7.31667 20.0498 6.1 19.5245C4.88333 18.9998 3.825 18.2875 2.925 17.3875C2.025 16.4875 1.31267 15.4292 0.788 14.2125C0.262667 12.9958 0 11.6958 0 10.3125C0 8.92917 0.262667 7.62917 0.788 6.4125C1.31267 5.19583 2.025 4.1375 2.925 3.2375C3.825 2.3375 4.88333 1.62483 6.1 1.0995C7.31667 0.574833 8.61667 0.3125 10 0.3125C11.3833 0.3125 12.6833 0.574833 13.9 1.0995C15.1167 1.62483 16.175 2.3375 17.075 3.2375C17.975 4.1375 18.6873 5.19583 19.212 6.4125C19.7373 7.62917 20 8.92917 20 10.3125C20 11.6958 19.7373 12.9958 19.212 14.2125C18.6873 15.4292 17.975 16.4875 17.075 17.3875C16.175 18.2875 15.1167 18.9998 13.9 19.5245C12.6833 20.0498 11.3833 20.3125 10 20.3125ZM9 18.2625V16.3125C8.45 16.3125 7.97933 16.1168 7.588 15.7255C7.196 15.3335 7 14.8625 7 14.3125V13.3125L2.2 8.5125C2.15 8.8125 2.104 9.1125 2.062 9.4125C2.02067 9.7125 2 10.0125 2 10.3125C2 12.3292 2.66267 14.0958 3.988 15.6125C5.31267 17.1292 6.98333 18.0125 9 18.2625ZM15.9 15.7125C16.2333 15.3458 16.5333 14.9498 16.8 14.5245C17.0667 14.0998 17.2877 13.6582 17.463 13.1995C17.6377 12.7415 17.771 12.2708 17.863 11.7875C17.9543 11.3042 18 10.8125 18 10.3125C18 8.67917 17.546 7.1875 16.638 5.8375C15.7293 4.4875 14.5167 3.5125 13 2.9125V3.3125C13 3.8625 12.8043 4.33317 12.413 4.7245C12.021 5.1165 11.55 5.3125 11 5.3125H9V7.3125C9 7.59583 8.90433 7.83317 8.713 8.0245C8.521 8.2165 8.28333 8.3125 8 8.3125H6V10.3125H12C12.2833 10.3125 12.521 10.4082 12.713 10.5995C12.9043 10.7915 13 11.0292 13 11.3125V14.3125H14C14.4333 14.3125 14.825 14.4415 15.175 14.6995C15.525 14.9582 15.7667 15.2958 15.9 15.7125Z" />
                        </svg>
                        Explore
                    </li>
                    <li
                        className={`menu-item ${currentTab === tabKeys.mySides ? 'active' : ''}`}
                        onClick={() => {
                            setSearchText('');
                            navigate(tabKeys.mySides);
                        }}
                    >
                        <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 2.3125H4V12.3125H0V2.3125ZM5 0.3125H15V14.3125H5V0.3125ZM16 2.3125H20V12.3125H16V2.3125ZM7 2.3125V12.3125H13V2.3125H7Z" />
                        </svg>
                        My sides
                    </li>
                    <li
                        className={`menu-item ${currentTab === tabKeys.invitations ? 'active' : ''} justify-between`}
                        onClick={() => {
                            setSearchText('');
                            navigate(tabKeys.invitations);
                        }}
                    >
                        <div className="inner-item flex">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M2 15.3125C1.45 15.3125 0.979333 15.1168 0.588 14.7255C0.196 14.3335 0 13.8625 0 13.3125V5.4625C0 5.2125 0.0710001 4.9665 0.213 4.7245C0.354333 4.48317 0.55 4.29583 0.8 4.1625L8.5 0.3125L16.05 4.1625C16.25 4.2625 16.4207 4.42083 16.562 4.6375C16.704 4.85417 16.8 5.07917 16.85 5.3125H13.925L8.5 2.5625L2 5.7875V15.3125ZM5 19.3125C4.45 19.3125 3.97933 19.1168 3.588 18.7255C3.196 18.3335 3 17.8625 3 17.3125V8.3125C3 7.7625 3.196 7.2915 3.588 6.8995C3.97933 6.50817 4.45 6.3125 5 6.3125H18C18.55 6.3125 19.021 6.50817 19.413 6.8995C19.8043 7.2915 20 7.7625 20 8.3125V17.3125C20 17.8625 19.8043 18.3335 19.413 18.7255C19.021 19.1168 18.55 19.3125 18 19.3125H5ZM11.5 13.6625L5 10.3125V17.3125H18V10.3125L11.5 13.6625ZM11.5 11.6625L18 8.3125H5L11.5 11.6625Z" />
                            </svg>
                            Invitations
                        </div>
                        {invitations.length ? (
                            <div className="inner-item flex align-center">
                                <Dot>{invitations.length}</Dot>
                            </div>
                        ) : null}
                    </li>
                </ul>
                <Link to="/new-side" onClick={() => setSearchText('')}>
                    <Button classes="add-side-btn">
                        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7.66699 13.1666H9.33366V9.83329H12.667V8.16663H9.33366V4.83329H7.66699V8.16663H4.33366V9.83329H7.66699V13.1666ZM8.50033 17.3333C7.34755 17.3333 6.26421 17.1144 5.25033 16.6766C4.23644 16.2394 3.35449 15.6458 2.60449 14.8958C1.85449 14.1458 1.26088 13.2638 0.823659 12.25C0.385881 11.2361 0.166992 10.1527 0.166992 8.99996C0.166992 7.84718 0.385881 6.76385 0.823659 5.74996C1.26088 4.73607 1.85449 3.85413 2.60449 3.10413C3.35449 2.35413 4.23644 1.76024 5.25033 1.32246C6.26421 0.885237 7.34755 0.666626 8.50033 0.666626C9.6531 0.666626 10.7364 0.885237 11.7503 1.32246C12.7642 1.76024 13.6462 2.35413 14.3962 3.10413C15.1462 3.85413 15.7398 4.73607 16.177 5.74996C16.6148 6.76385 16.8337 7.84718 16.8337 8.99996C16.8337 10.1527 16.6148 11.2361 16.177 12.25C15.7398 13.2638 15.1462 14.1458 14.3962 14.8958C13.6462 15.6458 12.7642 16.2394 11.7503 16.6766C10.7364 17.1144 9.6531 17.3333 8.50033 17.3333Z"
                                fill="white"
                            />
                        </svg>
                        Create my own side
                    </Button>
                </Link>
            </nav>
        </DashboardLeftMenuStyled>
    );
};

export default DashboardLeftMenu;
