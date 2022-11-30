import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MembersList from './members-list/members-list';
import Channels from './channels/ChannelsTab';
import Invitation from './invitation/InvitationTab';
import Informations from './informations/Information';
import SideProfileAccount from './account/SideProfileAccount';
import Requests from './requests/requests';
import { RootState } from '../../../redux/store/app.store';
import ContainerLeft from '../../ui-components/ContainerLeft';
import TabItems from '../../ui-components/TabItems';
import { setCurrentColony, setSelectedChannel, setSettingsOpen } from '../../../redux/Slices/AppDatasSlice';
import { Dot } from '../../ui-components/styled-components/shared-styled-components';
import { Role } from '../../../models/Profile';
import { State, Type } from '../../../models/Invitation';
import styled from 'styled-components';
import InputText from '../../ui-components/InputText';
import { breakpoints, size } from '../../../helpers/breakpoints';
import { useMiddleSide } from '../CurrentSide';

import userService from '../../../services/api-services/user.service';
import sideService from '../../../services/api-services/side.service';

const SettingsStyled = styled.div`
    width: 100%;
    .avatar {
        border-radius: 50%;
        margin-left: 10px;
        width: 35px;
    }

    .sidebar {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: var(--background);
        z-index: 9903;
        transition: transform 0.3s ease;
        flex-shrink: 0;
        &.closed {
            transform: translateX(-200vw);
            ${breakpoints(
                size.lg,
                `{
        transform: translateX(0);
      }`
            )}
        }
        ${breakpoints(
            size.lg,
            `{
      position: relative;
      width: 25%;
      max-width: 220px;
    }`
        )}
        & .nav-link {
            position: relative;
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.5rem 0 0.5rem 2rem;
            margin: 1rem 0;
            & svg path {
                fill: var(--text);
                fill-opacity: 0.4;
            }
            & .arrow-right {
                position: absolute;
                right: 2rem;
                top: 50%;
                transform: translateY(-50%);
                ${breakpoints(
                    size.lg,
                    `{
          display: none;
        }`
                )}
            }
            &.active {
                ${breakpoints(
                    size.lg,
                    `{
          color: var(--primary);
          background-color: transparent !important;
          border-right: 2px solid var(--primary);
        }`
                )}
                & svg path {
                    ${breakpoints(
                        size.lg,
                        `{
            fill: var(--primary);
            fill-opacity: 1;
          }`
                    )}
                }
            }
        }
    }
    .container-tab {
        overflow: auto;
        height: calc(100vh - 100px);
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0 2rem;
        flex-grow: 1;
        & > div {
            padding-bottom: 3rem;
            ${breakpoints(
                size.lg,
                `{
          padding-bottom: 0;
        }`
            )}
        }
    }
`;

const Icons = {
    informations: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.69961 19.5L7.29961 16.45C7.03294 16.3667 6.76228 16.2417 6.48761 16.075C6.21228 15.9083 5.95794 15.7333 5.72461 15.55L2.89961 16.75L0.599609 12.75L3.04961 10.9C3.01628 10.75 2.99561 10.6 2.98761 10.45C2.97894 10.3 2.97461 10.15 2.97461 10C2.97461 9.86667 2.97894 9.725 2.98761 9.575C2.99561 9.425 3.01628 9.26667 3.04961 9.1L0.599609 7.25L2.89961 3.275L5.72461 4.45C5.95794 4.26667 6.21228 4.096 6.48761 3.938C6.76228 3.77933 7.03294 3.65 7.29961 3.55L7.69961 0.5H12.2996L12.6996 3.55C12.9996 3.66667 13.2703 3.79567 13.5116 3.937C13.7536 4.079 13.9996 4.25 14.2496 4.45L17.0996 3.275L19.3996 7.25L16.9246 9.125C16.9579 9.29167 16.9746 9.44167 16.9746 9.575V10C16.9746 10.1333 16.9703 10.2707 16.9616 10.412C16.9536 10.554 16.9329 10.7167 16.8996 10.9L19.3496 12.75L17.0496 16.75L14.2496 15.55C13.9996 15.75 13.7456 15.925 13.4876 16.075C13.2289 16.225 12.9663 16.35 12.6996 16.45L12.2996 19.5H7.69961ZM9.99961 13C10.8329 13 11.5413 12.7083 12.1246 12.125C12.7079 11.5417 12.9996 10.8333 12.9996 10C12.9996 9.16667 12.7079 8.45833 12.1246 7.875C11.5413 7.29167 10.8329 7 9.99961 7C9.16628 7 8.45794 7.29167 7.87461 7.875C7.29128 8.45833 6.99961 9.16667 6.99961 10C6.99961 10.8333 7.29128 11.5417 7.87461 12.125C8.45794 12.7083 9.16628 13 9.99961 13ZM9.99961 11.5C9.58294 11.5 9.22894 11.354 8.93761 11.062C8.64561 10.7707 8.49961 10.4167 8.49961 10C8.49961 9.58333 8.64561 9.22933 8.93761 8.938C9.22894 8.646 9.58294 8.5 9.99961 8.5C10.4163 8.5 10.7703 8.646 11.0616 8.938C11.3536 9.22933 11.4996 9.58333 11.4996 10C11.4996 10.4167 11.3536 10.7707 11.0616 11.062C10.7703 11.354 10.4163 11.5 9.99961 11.5ZM8.99961 18H10.9746L11.3246 15.325C11.8413 15.1917 12.3079 15 12.7246 14.75C13.1413 14.5 13.5496 14.1833 13.9496 13.8L16.4246 14.85L17.4246 13.15L15.2496 11.525C15.3329 11.2583 15.3873 11 15.4126 10.75C15.4373 10.5 15.4496 10.25 15.4496 10C15.4496 9.73333 15.4373 9.47933 15.4126 9.238C15.3873 8.996 15.3329 8.75 15.2496 8.5L17.4246 6.85L16.4496 5.15L13.9246 6.2C13.5913 5.85 13.1913 5.53733 12.7246 5.262C12.2579 4.98733 11.7913 4.79167 11.3246 4.675L10.9996 2H9.02461L8.67461 4.675C8.17461 4.79167 7.70794 4.975 7.27461 5.225C6.84128 5.475 6.42461 5.79167 6.02461 6.175L3.54961 5.15L2.57461 6.85L4.72461 8.45C4.64128 8.7 4.58294 8.95 4.54961 9.2C4.51628 9.45 4.49961 9.71667 4.49961 10C4.49961 10.2667 4.51628 10.525 4.54961 10.775C4.58294 11.025 4.64128 11.275 4.72461 11.525L2.57461 13.15L3.54961 14.85L6.02461 13.8C6.40794 14.1833 6.81628 14.5 7.24961 14.75C7.68294 15 8.15794 15.1917 8.67461 15.325L8.99961 18Z" />
        </svg>
    ),
    members: () => (
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.799805 15.3002V13.0752C0.799805 12.5585 0.933138 12.1002 1.1998 11.7002C1.46647 11.3002 1.8248 10.9835 2.2748 10.7502C3.2248 10.3002 4.17914 9.9462 5.1378 9.6882C6.09581 9.42953 7.1498 9.3002 8.2998 9.3002C9.4498 9.3002 10.5041 9.42953 11.4628 9.6882C12.4208 9.9462 13.3748 10.3002 14.3248 10.7502C14.7748 10.9835 15.1331 11.3002 15.3998 11.7002C15.6665 12.1002 15.7998 12.5585 15.7998 13.0752V15.3002H0.799805ZM17.7998 15.3002V12.9502C17.7998 12.3002 17.6371 11.6792 17.3118 11.0872C16.9871 10.4959 16.5331 9.98353 15.9498 9.5502C16.6165 9.6502 17.2498 9.8042 17.8498 10.0122C18.4498 10.2209 19.0248 10.4669 19.5748 10.7502C20.0915 11.0335 20.4915 11.3629 20.7748 11.7382C21.0581 12.1129 21.1998 12.5169 21.1998 12.9502V15.3002H17.7998ZM8.2998 7.7002C7.33314 7.7002 6.50814 7.3542 5.8248 6.6622C5.14147 5.97086 4.7998 5.1502 4.7998 4.2002C4.7998 3.23353 5.14147 2.40853 5.8248 1.7252C6.50814 1.04186 7.33314 0.700195 8.2998 0.700195C9.26647 0.700195 10.0915 1.04186 10.7748 1.7252C11.4581 2.40853 11.7998 3.23353 11.7998 4.2002C11.7998 5.1502 11.4581 5.97086 10.7748 6.6622C10.0915 7.3542 9.26647 7.7002 8.2998 7.7002ZM16.9248 4.2002C16.9248 5.1502 16.5831 5.97086 15.8998 6.6622C15.2165 7.3542 14.3915 7.7002 13.4248 7.7002C13.3248 7.7002 13.1871 7.68753 13.0118 7.6622C12.8371 7.63753 12.6915 7.60853 12.5748 7.5752C12.9748 7.09186 13.2791 6.56286 13.4878 5.9882C13.6958 5.41286 13.7998 4.81686 13.7998 4.2002C13.7998 3.56686 13.6915 2.96686 13.4748 2.4002C13.2581 1.83353 12.9581 1.30853 12.5748 0.825195C12.7081 0.775195 12.8498 0.741862 12.9998 0.725195C13.1498 0.708529 13.2915 0.700195 13.4248 0.700195C14.3915 0.700195 15.2165 1.04186 15.8998 1.7252C16.5831 2.40853 16.9248 3.23353 16.9248 4.2002ZM2.2998 13.8002H14.2998V13.0752C14.2998 12.8752 14.2458 12.6919 14.1378 12.5252C14.0291 12.3585 13.8665 12.2169 13.6498 12.1002C12.8165 11.6835 11.9665 11.3625 11.0998 11.1372C10.2331 10.9125 9.2998 10.8002 8.2998 10.8002C7.2998 10.8002 6.36247 10.9125 5.4878 11.1372C4.61247 11.3625 3.76647 11.6835 2.9498 12.1002C2.71647 12.2169 2.5498 12.3585 2.4498 12.5252C2.3498 12.6919 2.2998 12.8752 2.2998 13.0752V13.8002ZM8.2998 6.2002C8.8498 6.2002 9.3208 6.0042 9.7128 5.6122C10.1041 5.22086 10.2998 4.7502 10.2998 4.2002C10.2998 3.6502 10.1041 3.1792 9.7128 2.7872C9.3208 2.39586 8.8498 2.2002 8.2998 2.2002C7.7498 2.2002 7.27914 2.39586 6.8878 2.7872C6.4958 3.1792 6.2998 3.6502 6.2998 4.2002C6.2998 4.7502 6.4958 5.22086 6.8878 5.6122C7.27914 6.0042 7.7498 6.2002 8.2998 6.2002Z" />
        </svg>
    ),
    requests: () => (
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.125 9.7502V6.7502H14.125V5.2502H17.125V2.2502H18.625V5.2502H21.625V6.7502H18.625V9.7502H17.125ZM8 7.7002C7.03333 7.7002 6.20833 7.3542 5.525 6.6622C4.84167 5.97086 4.5 5.1502 4.5 4.2002C4.5 3.23353 4.84167 2.40853 5.525 1.7252C6.20833 1.04186 7.03333 0.700195 8 0.700195C8.96667 0.700195 9.79167 1.04186 10.475 1.7252C11.1583 2.40853 11.5 3.23353 11.5 4.2002C11.5 5.1502 11.1583 5.97086 10.475 6.6622C9.79167 7.3542 8.96667 7.7002 8 7.7002ZM0.5 15.3002V13.0752C0.5 12.5919 0.633333 12.1419 0.9 11.7252C1.16667 11.3085 1.525 10.9835 1.975 10.7502C2.95833 10.2669 3.95433 9.90419 4.963 9.6622C5.971 9.42086 6.98333 9.3002 8 9.3002C9.01667 9.3002 10.0293 9.42086 11.038 9.6622C12.046 9.90419 13.0417 10.2669 14.025 10.7502C14.475 10.9835 14.8333 11.3085 15.1 11.7252C15.3667 12.1419 15.5 12.5919 15.5 13.0752V15.3002H0.5ZM2 13.8002H14V13.0752C14 12.8752 13.9417 12.6919 13.825 12.5252C13.7083 12.3585 13.55 12.2169 13.35 12.1002C12.4833 11.6835 11.6043 11.3625 10.713 11.1372C9.821 10.9125 8.91667 10.8002 8 10.8002C7.08333 10.8002 6.179 10.9125 5.287 11.1372C4.39567 11.3625 3.51667 11.6835 2.65 12.1002C2.45 12.2169 2.29167 12.3585 2.175 12.5252C2.05833 12.6919 2 12.8752 2 13.0752V13.8002ZM8 6.2002C8.55 6.2002 9.021 6.0042 9.413 5.6122C9.80433 5.22086 10 4.7502 10 4.2002C10 3.6502 9.80433 3.1792 9.413 2.7872C9.021 2.39586 8.55 2.2002 8 2.2002C7.45 2.2002 6.97933 2.39586 6.588 2.7872C6.196 3.1792 6 3.6502 6 4.2002C6 4.7502 6.196 5.22086 6.588 5.6122C6.97933 6.0042 7.45 6.2002 8 6.2002Z" />
        </svg>
    ),
    channels: () => (
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.9498 8.7501V7.2501H19.5748V8.7501H15.9498ZM17.0998 15.4751L14.1998 13.3001L15.1248 12.1251L18.0248 14.2751L17.0998 15.4751ZM15.0748 3.8501L14.1748 2.6501L17.0748 0.475098L17.9748 1.6751L15.0748 3.8501ZM3.2498 14.4751V10.5751H2.2248C1.7248 10.5751 1.2998 10.4001 0.949805 10.0501C0.599805 9.7001 0.424805 9.2751 0.424805 8.7751V7.2251C0.424805 6.7251 0.599805 6.3001 0.949805 5.9501C1.2998 5.6001 1.7248 5.4251 2.2248 5.4251H6.0998L10.5748 2.7501V13.2501L6.0998 10.5751H4.7498V14.4751H3.2498ZM11.9498 11.1251V4.8751C12.3498 5.24176 12.6708 5.69176 12.9128 6.2251C13.1541 6.75843 13.2748 7.3501 13.2748 8.0001C13.2748 8.6501 13.1541 9.24176 12.9128 9.7751C12.6708 10.3084 12.3498 10.7584 11.9498 11.1251ZM2.2248 6.9251C2.15814 6.9251 2.09147 6.95843 2.0248 7.0251C1.95814 7.09176 1.9248 7.15843 1.9248 7.2251V8.7751C1.9248 8.84176 1.95814 8.90843 2.0248 8.9751C2.09147 9.04176 2.15814 9.0751 2.2248 9.0751H6.4998L9.0748 10.5751V5.4251L6.4998 6.9251H2.2248Z" />
        </svg>
    ),
    invitation: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.25 14.75H10.75V10.75H14.75V9.25H10.75V5.25H9.25V9.25H5.25V10.75H9.25V14.75ZM10 19.5C8.68333 19.5 7.446 19.25 6.288 18.75C5.12933 18.25 4.125 17.575 3.275 16.725C2.425 15.875 1.75 14.8707 1.25 13.712C0.75 12.554 0.5 11.3167 0.5 10C0.5 8.68333 0.75 7.44567 1.25 6.287C1.75 5.129 2.425 4.125 3.275 3.275C4.125 2.425 5.12933 1.75 6.288 1.25C7.446 0.75 8.68333 0.5 10 0.5C11.3167 0.5 12.5543 0.75 13.713 1.25C14.871 1.75 15.875 2.425 16.725 3.275C17.575 4.125 18.25 5.129 18.75 6.287C19.25 7.44567 19.5 8.68333 19.5 10C19.5 11.3167 19.25 12.554 18.75 13.712C18.25 14.8707 17.575 15.875 16.725 16.725C15.875 17.575 14.871 18.25 13.713 18.75C12.5543 19.25 11.3167 19.5 10 19.5ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" />
        </svg>
    ),
    account: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.025 15.3C4.875 14.6667 5.8 14.1667 6.8 13.8C7.8 13.4333 8.86667 13.25 10 13.25C11.1333 13.25 12.2 13.4333 13.2 13.8C14.2 14.1667 15.125 14.6667 15.975 15.3C16.5917 14.6167 17.0833 13.825 17.45 12.925C17.8167 12.025 18 11.05 18 10C18 7.78333 17.221 5.89567 15.663 4.337C14.1043 2.779 12.2167 2 10 2C7.78333 2 5.896 2.779 4.338 4.337C2.77933 5.89567 2 7.78333 2 10C2 11.05 2.18333 12.025 2.55 12.925C2.91667 13.825 3.40833 14.6167 4.025 15.3ZM10 10.75C9.08333 10.75 8.31267 10.4373 7.688 9.812C7.06267 9.18733 6.75 8.41667 6.75 7.5C6.75 6.58333 7.06267 5.81267 7.688 5.188C8.31267 4.56267 9.08333 4.25 10 4.25C10.9167 4.25 11.6873 4.56267 12.312 5.188C12.9373 5.81267 13.25 6.58333 13.25 7.5C13.25 8.41667 12.9373 9.18733 12.312 9.812C11.6873 10.4373 10.9167 10.75 10 10.75ZM10 19.5C8.68333 19.5 7.446 19.25 6.288 18.75C5.12933 18.25 4.125 17.575 3.275 16.725C2.425 15.875 1.75 14.8707 1.25 13.712C0.75 12.554 0.5 11.3167 0.5 10C0.5 8.68333 0.75 7.44567 1.25 6.287C1.75 5.129 2.425 4.125 3.275 3.275C4.125 2.425 5.12933 1.75 6.288 1.25C7.446 0.75 8.68333 0.5 10 0.5C11.3167 0.5 12.5543 0.75 13.713 1.25C14.871 1.75 15.875 2.425 16.725 3.275C17.575 4.125 18.25 5.129 18.75 6.287C19.25 7.44567 19.5 8.68333 19.5 10C19.5 11.3167 19.25 12.554 18.75 13.712C18.25 14.8707 17.575 15.875 16.725 16.725C15.875 17.575 14.871 18.25 13.713 18.75C12.5543 19.25 11.3167 19.5 10 19.5ZM10 18C10.9 18 11.771 17.854 12.613 17.562C13.4543 17.2707 14.2 16.8667 14.85 16.35C14.2 15.85 13.4623 15.4583 12.637 15.175C11.8123 14.8917 10.9333 14.75 10 14.75C9.06667 14.75 8.18767 14.8877 7.363 15.163C6.53767 15.4377 5.8 15.8333 5.15 16.35C5.8 16.8667 6.54567 17.2707 7.387 17.562C8.229 17.854 9.1 18 10 18ZM10 9.25C10.5 9.25 10.9167 9.08333 11.25 8.75C11.5833 8.41667 11.75 8 11.75 7.5C11.75 7 11.5833 6.58333 11.25 6.25C10.9167 5.91667 10.5 5.75 10 5.75C9.5 5.75 9.08333 5.91667 8.75 6.25C8.41667 6.58333 8.25 7 8.25 7.5C8.25 8 8.41667 8.41667 8.75 8.75C9.08333 9.08333 9.5 9.25 10 9.25Z" />
        </svg>
    )
};

const initialStateTabs = {
    menu: [
        {
            title: 'Settings',
            admin: true,
            items: [
                { active: true, Icon: Icons['informations'], label: 'Informations' },
                { active: false, Icon: Icons['members'], label: 'Members' },
                { active: false, Icon: Icons['requests'], label: 'Requests' },
                { active: false, Icon: Icons['channels'], label: 'Channels' },
                { active: false, Icon: Icons['invitation'], label: 'Invitation' }
            ]
        },
        {
            title: 'Profile',
            admin: false,
            items: [
                { active: false, Icon: Icons['account'], label: 'Account' }
                // { active: false, icon: "fa-solid fa-circle-check", label: "Eligibility" }
            ]
        }
    ]
};

export default function Settings() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentSide, settingsOpen } = useSelector((state: RootState) => state.appDatas);
    const userData = useSelector((state: RootState) => state.user);

    const [tabs, setTabs] = useState<any>(initialStateTabs);
    const { isMobileMenuOpen, setIsMobileMenuOpen } = useMiddleSide();

    // Requests notifications :
    const [requests, setRequests] = useState<any[]>([]);

    const handleTabs = (tabName: any) => {
        async function getSide() {
            if (currentSide) {
                const res = await sideService.getSideById(currentSide['id']);
                dispatch(setCurrentColony(res));
                dispatch(setSelectedChannel(res.channels.find((c) => c.type === 0) || res.channels[0]));
            }
        }
        getSide();

        let currentTabState = { ...tabs };
        for (const submenu of tabs['menu']) {
            for (const data of submenu['items']) {
                data['active'] = data['label'] === tabName ? true : false;
            }
        }
        setTabs(currentTabState);
    };

    useEffect(() => {
        if (!currentSide) {
            navigate(`/`);
        } else {
            !settingsOpen && dispatch(setSettingsOpen(true));
            userData && userData['currentProfile'] && userData['currentProfile']['role'] === Role.Admin
                ? handleTabs('Informations')
                : handleTabs('Account');
        }
        return () => {
            dispatch(setSettingsOpen(false));
        };
    }, []);

    // Getting request for display notification :
    const getRequestsUsers = async (requestsOrdered: any[]) => {
        let ids = requestsOrdered.map((invitation: any) => invitation['senderId']);
        const users = (await userService.getUsersByIds(ids)).reduce((prev: any, current: any, index: number) => {
            let obj = {
                accounts: '',
                created_at: '',
                image: '',
                id: '',
                user_id: ''
            };
            const current_request = requestsOrdered.find((item) => item['senderId'] === current['id']);

            obj['accounts'] = current['accounts'];
            obj['created_at'] = current_request['created_at'];
            obj['id'] = current_request['id'];
            obj['user_id'] = current['id'];
            obj['image'] =
                'https://images.unsplash.com/photo-1662948291101-691f9fa850d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80';

            prev.push(obj);

            return prev;
        }, []);
        setRequests(users);
    };

    useEffect(() => {
        updateRequestNotifications();
    }, [currentSide, userData]);

    const updateRequestNotifications = async () => {
        if (currentSide && userData && userData['user']) {
            let requestsOrdered = currentSide['invitations'].filter(
                (invitation: any) => invitation['type'] === Type.Request && invitation['state'] === State.Pending
            );
            getRequestsUsers(requestsOrdered);
        }
    };

    return (
        <SettingsStyled>
            {currentSide ? (
                <div className="flex align-start w-100">
                    <div className={`sidebar ${!isMobileMenuOpen ? 'closed' : ''}`}>
                        {tabs['menu'].map((submenu: any, index: number) => {
                            return (
                                //
                                submenu['admin'] === true ? (
                                    userData &&
                                    userData['currentProfile'] &&
                                    userData['currentProfile']['role'] === 0 ? (
                                        <div key={index} className="mt-2">
                                            <label className="pl-4 sidebar-title">{submenu['title']}</label>

                                            {submenu['items'].map((subtitle: any, index: number) => {
                                                return (
                                                    <>
                                                        <div>
                                                            <TabItems
                                                                cursor="pointer"
                                                                key={subtitle['label']}
                                                                className={`nav-link flex ${
                                                                    subtitle['active'] ? 'active' : ''
                                                                } sidebar-item text-secondary-dark`}
                                                                onClick={(e) => {
                                                                    setIsMobileMenuOpen(false);
                                                                    handleTabs(subtitle['label']);
                                                                }}
                                                            >
                                                                <subtitle.Icon />
                                                                {subtitle['label']}
                                                                {subtitle['label'] === 'Requests' && requests.length ? (
                                                                    <Dot className="ml-4">{requests.length}</Dot>
                                                                ) : null}
                                                                <svg
                                                                    className="arrow-right"
                                                                    width="7"
                                                                    height="12"
                                                                    viewBox="0 0 7 12"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path d="M1.3472 11.4163L0.385742 10.4549L4.84095 5.99967L0.385742 1.54447L1.3472 0.583008L6.76387 5.99967L1.3472 11.4163Z" />
                                                                </svg>
                                                            </TabItems>
                                                        </div>
                                                    </>
                                                );
                                            })}
                                        </div>
                                    ) : null
                                ) : (
                                    <div key={index} className="mt-2">
                                        <label className="pl-4 sidebar-title">{submenu['title']}</label>

                                        {submenu['items'].map((subtitle: any, index: number) => {
                                            return (
                                                <TabItems
                                                    cursor="pointer"
                                                    key={subtitle['label']}
                                                    className={`nav-link ${
                                                        subtitle['active'] ? 'active' : ''
                                                    } sidebar-item text-secondary-dark`}
                                                    onClick={(e) => {
                                                        setIsMobileMenuOpen(false);
                                                        handleTabs(subtitle['label']);
                                                    }}
                                                >
                                                    <subtitle.Icon />
                                                    {subtitle['label']}
                                                    <svg
                                                        className="arrow-right"
                                                        width="7"
                                                        height="12"
                                                        viewBox="0 0 7 12"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M1.3472 11.4163L0.385742 10.4549L4.84095 5.99967L0.385742 1.54447L1.3472 0.583008L6.76387 5.99967L1.3472 11.4163Z" />
                                                    </svg>
                                                </TabItems>
                                            );
                                        })}
                                    </div>
                                )
                            );
                        })}
                    </div>

                    <div className="container-tab">
                        {tabs['menu'].map((submenu: any, index: number) => {
                            return (
                                <div key={index}>
                                    {submenu['items'].map((subtitle: any, index: number) => {
                                        return subtitle['label'] == 'Informations' && subtitle['active'] ? (
                                            <Informations currentSide={currentSide} userData={userData} />
                                        ) : subtitle['label'] == 'Members' && subtitle['active'] ? (
                                            <MembersList currentSide={currentSide} />
                                        ) : subtitle['label'] == 'Requests' && subtitle['active'] ? (
                                            <Requests
                                                currentSide={currentSide}
                                                userData={userData}
                                                updateRequestNotifications={updateRequestNotifications}
                                            />
                                        ) : subtitle['label'] == 'Channels' && subtitle['active'] ? (
                                            <Channels currentSide={currentSide} />
                                        ) : subtitle['label'] == 'Invitation' && subtitle['active'] ? (
                                            <Invitation currentSide={currentSide} userData={userData} />
                                        ) : subtitle['label'] == 'Account' && subtitle['active'] ? (
                                            <SideProfileAccount currentSide={currentSide} userData={userData} />
                                        ) : null;
                                        // (subtitle['label'] == 'Eligibility' && subtitle['active']) ? <Eligibility currentSide={currentSide} /> : null
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </SettingsStyled>
    );
}
