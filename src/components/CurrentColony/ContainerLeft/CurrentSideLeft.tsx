import React, { useState } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RootState } from "../../../redux/store/app.store";
import ContainerLeft from "../../ui-components/ContainerLeft";
import { breakpoints, size } from "../../../helpers/breakpoints";
import Icons from "../../ui-components/ChannelIcons";
import CurrentSideLeftContent from "./CurrentSideLeftContent";
import SidesListMobileMenu from "../SidesListMobileMenu";
import { Room } from "../../../models/Room";
import { Channel } from "../../../models/Channel";
import { reduceWalletAddressForColor } from "../../../helpers/utilities";
import { setSettingsOpen } from "../../../redux/Slices/AppDatasSlice";

interface CoverImgProps {
  backgroundImage?: string;
}

const CoverImg = styled.div<CoverImgProps>`
  height: 146px;
  width: 100%;
  background: linear-gradient(180deg, rgba(27, 29, 48, 0) 0%, #1b1d30 100%),
    linear-gradient(0deg, rgba(27, 29, 48, 0.3), rgba(27, 29, 48, 0.3)),
    url(${(props) => props.backgroundImage});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const ContainerLeftStyled = styled.div`
  width: 100%;
  ${breakpoints(
    size.lg,
    `{
    max-width: 250px;
  }`
  )}
  .sidebar-desktop {
    display: none;
    width: 100%;
    ${breakpoints(
      size.lg,
      `{
      display: flex;
    }`
    )}
  }
  .toolbar-mobile {
    ${breakpoints(
      size.lg,
      `{
      display: none;
    }`
    )}
    .side-info-header-mobile {
      width: 100%;
      background-color: transparent;
      border: none;
      outline: none;
      box-shadow: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1rem;
      & .arrow-icon {
        background-color: transparent;
        border: none;
        box-shadow: none;
        outline: none;
        transform: rotate(180deg);
      }
      & > div {
        display: flex;
        align-items: center;
        gap: 1rem;
        .user-name-address {
          display: flex;
          flex-direction: column;
          .user-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100px;
          }
          .user-address {
            color: var(--text-secondary-dark);
          }
        }
      }
      & .title-img-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
        & .image {
          width: 36px;
          height: 36px;
          border-radius: 36px;
          flex-shrink: 0;
          background-color: var(--bg-secondary);
          & img {
            width: 100%;
            object-fit: cover;
          }
        }
      }
    }
    .toolbar-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem 1rem;
      background-color: var(--bg-secondary-light);
      box-shadow: none;
      border: none;
      outline: none;
      ${breakpoints(
        size.lg,
        `{
        display: none;
      }`
      )}
      .menu-icon {
        margin-right: 1rem;
        &.back-arrow {
          transform: rotate(90deg);
        }
      }
      .icon {
        & path {
          fill: #b4c1d2;
        }
      }
    }
    .toolbar-content {
      background-color: var(--bg-secondary-light);
      transform: scaleY(0);
      position: absolute;
      &.open {
        position: relative;
        transform: scaleY(1);
        min-height: calc(100vh - 77px - 6rem);
      }
    }
  }
`;

interface CurrentSideLeftProps {
  channel?: Channel | null;
  className?: string;
  room?: Room | null;
  setThread?: any;
  thread?: any;
}

export default function CurrentSideLeft({
  channel,
  className,
  room,
  setThread,
  thread,
}: CurrentSideLeftProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

  const [isSidesListOpen, setIsSidesListOpen] = useState<boolean>(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState<boolean>(false);

  const Icon = Icons[selectedChannel?.type || 0];

  return (
    <ContainerLeftStyled>
      <div className="sidebar-desktop">
        <ContainerLeft
          backgroundColor="var(--bg-secondary-light)"
          width="100%"
          height={100}
          paddingTop={0}
        >
          <CoverImg
            backgroundImage={currentSide?.sideImage}
            className="w-100 flex align-end justify-between px-2 py-2"
          >
            <div className="w-100 flex align-center justify-between">
              <span className="fw-700 size-14 open-sans flex align-center text-secondary">
                {currentSide?.name}
                {currentSide?.firstCollection?.safelistRequestStatus ===
                  "verified" && (
                  <svg
                    className="ml-2"
                    width="13"
                    height="14"
                    viewBox="0 0 13 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.5 0.625C6.97396 0.625 7.39714 0.74349 7.76953 0.980469C8.14193 1.21745 8.43815 1.5306 8.6582 1.91992C9.08138 1.78451 9.50456 1.76758 9.92773 1.86914C10.3509 1.9707 10.7402 2.19076 11.0957 2.5293C11.4173 2.86784 11.6289 3.2487 11.7305 3.67188C11.832 4.11198 11.8236 4.54362 11.7051 4.9668C12.0944 5.18685 12.4076 5.48307 12.6445 5.85547C12.8815 6.22786 13 6.65104 13 7.125C13 7.59896 12.8815 8.02214 12.6445 8.39453C12.4076 8.76693 12.0944 9.06315 11.7051 9.2832C11.959 10.1634 11.7559 10.9759 11.0957 11.7207C10.7402 12.0423 10.3509 12.2539 9.92773 12.3555C9.50456 12.457 9.08138 12.4486 8.6582 12.3301C8.43815 12.7194 8.14193 13.0326 7.76953 13.2695C7.39714 13.5065 6.97396 13.625 6.5 13.625C6.02604 13.625 5.60286 13.5065 5.23047 13.2695C4.85807 13.0326 4.56185 12.7194 4.3418 12.3301C3.91862 12.4486 3.48698 12.457 3.04688 12.3555C2.6237 12.2708 2.24284 12.0592 1.9043 11.7207C1.24414 10.9759 1.04102 10.1634 1.29492 9.2832C0.905599 9.06315 0.592448 8.76693 0.355469 8.39453C0.11849 8.02214 0 7.59896 0 7.125C0 6.65104 0.11849 6.22786 0.355469 5.85547C0.592448 5.48307 0.905599 5.18685 1.29492 4.9668C1.15951 4.54362 1.14258 4.11198 1.24414 3.67188C1.3457 3.2487 1.56576 2.86784 1.9043 2.5293C2.24284 2.19076 2.6237 1.9707 3.04688 1.86914C3.48698 1.78451 3.91862 1.80143 4.3418 1.91992C4.56185 1.5306 4.85807 1.21745 5.23047 0.980469C5.60286 0.74349 6.02604 0.625 6.5 0.625ZM8.9375 6.3125C9.19141 6.04167 9.19141 5.76237 8.9375 5.47461C8.66667 5.23763 8.38737 5.23763 8.09961 5.47461L5.6875 7.88672L4.67188 6.89648C4.40104 6.65951 4.12174 6.65951 3.83398 6.89648C3.59701 7.18424 3.59701 7.46354 3.83398 7.73438L5.25586 9.15625C5.54362 9.41016 5.82292 9.41016 6.09375 9.15625L8.9375 6.3125Z"
                      fill="#705CE9"
                    />
                  </svg>
                )}
              </span>
            </div>
          </CoverImg>

          <CurrentSideLeftContent />
        </ContainerLeft>
      </div>

      <div className="toolbar-mobile">
        {thread ? (
          <div className="side-info-header-mobile">
            <div>
              <button onClick={() => navigate(-1)} className="arrow-icon">
                <svg
                  className="ml-3"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M-2.29485e-07 5.25L9.13125 5.25L4.93125 1.05L6 -2.62268e-07L12 6L6 12L4.93125 10.95L9.13125 6.75L-2.95052e-07 6.75L-2.29485e-07 5.25Z"
                    fill="white"
                  />
                </svg>
              </button>

              <img
                className="profile-round pointer"
                style={{
                  backgroundColor: reduceWalletAddressForColor(
                    thread?.creator || thread?.creatorAddress
                  ),
                }}
                alt=""
                src={thread?.creator || thread?.creatorAddress || ""}
              />
              <div className="user-name-address">
                <p className="user-name size-14">
                  {thread?.creator || thread?.creatorAddress}
                </p>
                <p className="user-address size-14">13 hours ago</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsSidesListOpen((prevState) => !prevState)}
            className="side-info-header-mobile"
          >
            <div className="title-img-wrapper">
              <div className="image">
                <img src={currentSide?.sideImage} alt="" />
              </div>
              <span>{currentSide?.name}</span>
              {currentSide?.firstCollection?.safelistRequestStatus ===
                "verified" && (
                <svg
                  width="13"
                  height="14"
                  viewBox="0 0 13 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.5 0.625C6.97396 0.625 7.39714 0.74349 7.76953 0.980469C8.14193 1.21745 8.43815 1.5306 8.6582 1.91992C9.08138 1.78451 9.50456 1.76758 9.92773 1.86914C10.3509 1.9707 10.7402 2.19076 11.0957 2.5293C11.4173 2.86784 11.6289 3.2487 11.7305 3.67188C11.832 4.11198 11.8236 4.54362 11.7051 4.9668C12.0944 5.18685 12.4076 5.48307 12.6445 5.85547C12.8815 6.22786 13 6.65104 13 7.125C13 7.59896 12.8815 8.02214 12.6445 8.39453C12.4076 8.76693 12.0944 9.06315 11.7051 9.2832C11.959 10.1634 11.7559 10.9759 11.0957 11.7207C10.7402 12.0423 10.3509 12.2539 9.92773 12.3555C9.50456 12.457 9.08138 12.4486 8.6582 12.3301C8.43815 12.7194 8.14193 13.0326 7.76953 13.2695C7.39714 13.5065 6.97396 13.625 6.5 13.625C6.02604 13.625 5.60286 13.5065 5.23047 13.2695C4.85807 13.0326 4.56185 12.7194 4.3418 12.3301C3.91862 12.4486 3.48698 12.457 3.04688 12.3555C2.6237 12.2708 2.24284 12.0592 1.9043 11.7207C1.24414 10.9759 1.04102 10.1634 1.29492 9.2832C0.905599 9.06315 0.592448 8.76693 0.355469 8.39453C0.11849 8.02214 0 7.59896 0 7.125C0 6.65104 0.11849 6.22786 0.355469 5.85547C0.592448 5.48307 0.905599 5.18685 1.29492 4.9668C1.15951 4.54362 1.14258 4.11198 1.24414 3.67188C1.3457 3.2487 1.56576 2.86784 1.9043 2.5293C2.24284 2.19076 2.6237 1.9707 3.04688 1.86914C3.48698 1.78451 3.91862 1.80143 4.3418 1.91992C4.56185 1.5306 4.85807 1.21745 5.23047 0.980469C5.60286 0.74349 6.02604 0.625 6.5 0.625ZM8.9375 6.3125C9.19141 6.04167 9.19141 5.76237 8.9375 5.47461C8.66667 5.23763 8.38737 5.23763 8.09961 5.47461L5.6875 7.88672L4.67188 6.89648C4.40104 6.65951 4.12174 6.65951 3.83398 6.89648C3.59701 7.18424 3.59701 7.46354 3.83398 7.73438L5.25586 9.15625C5.54362 9.41016 5.82292 9.41016 6.09375 9.15625L8.9375 6.3125Z"
                    fill="#705CE9"
                  />
                </svg>
              )}
            </div>
            
            <Link onClick={(ev) => ev.stopPropagation()} to={`/side/${currentSide?.['name']}/settings`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.54134 15.7923V11.209H8.45801V13.0423H15.7913V13.959H8.45801V15.7923H7.54134ZM0.208008 13.959V13.0423H4.79134V13.959H0.208008ZM3.87467 10.2923V8.45898H0.208008V7.54232H3.87467V5.70898H4.79134V10.2923H3.87467ZM7.54134 8.45898V7.54232H15.7913V8.45898H7.54134ZM11.208 4.79232V0.208984H12.1247V2.04232H15.7913V2.95898H12.1247V4.79232H11.208ZM0.208008 2.95898V2.04232H8.45801V2.95898H0.208008Z" fill="#B4C1D2"/>
              </svg>
            </Link>
          </button>
        )}

        <SidesListMobileMenu
          currentSide={currentSide}
          onClose={() => setIsSidesListOpen(false)}
          open={isSidesListOpen}
        />

        <button
          onClick={() => setIsToolbarOpen((prevState) => !prevState)}
          className="toolbar-wrapper"
        >
          {isToolbarOpen ? (
            <>
              <svg
                className="menu-icon back-arrow"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12L0 6L6 0L7.06875 1.05L2.86875 5.25H12V6.75H2.86875L7.06875 10.95L6 12Z"
                  fill="#B4C1D2"
                />
              </svg>
              <span className="text-secondary">Close</span>
            </>
          ) : (
            <>
              <svg
                className="menu-icon"
                width="18"
                height="12"
                viewBox="0 0 18 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 12V10H18V12H0ZM0 7V5H18V7H0ZM0 2V0H18V2H0Z"
                  fill="#B4C1D2"
                />
              </svg>
              <Icon className="icon" />
              <span className="text-secondary">{selectedChannel?.name}</span>
            </>
          )}
        </button>

        <div
          onClick={() => setIsToolbarOpen(false)}
          className={`toolbar-content ${isToolbarOpen ? "open" : ""}`}
        >
          <CurrentSideLeftContent />
        </div>
      </div>
    </ContainerLeftStyled>
  );
}
