import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { EventType } from "../../constants/EventType";
import {
  subscribeToEvent,
  unSubscribeToEvent,
} from "../../helpers/CustomEvent";
import { Announcement } from "../../models/Announcement";
import { RootState } from "../../redux/store/app.store";
// import { flattenChannels } from "../../redux/Slices/UserDataSlice";
import { Side, SideStatus } from "../../models/Side";
// import { Channel } from "diagnostics_channel";
import { Dot } from "../ui-components/styled-components/shared-styled-components";
import { apiService } from "../../services/api.service";
import { Profile, Role } from "../../models/Profile";
import { NotificationType } from "../../models/Notification";
import SideEligibilityModal from "../Modals/SideEligibilityModal";
import LeaveSideConfirmationModal from "../Modals/LeaveSideConfirmationModal";

const UserSidesStyled = styled.div`
  .colony-badge {
    width: 50px;
    height: 50px;
    background-color: var(--bg-secondary-dark);
    border: 1px solid black;
    border-radius: 25px;
    margin: 0px 12px;
    overflow: hidden;
    z-index: 50;
    transition: border 0.2s ease;
    &.active {
      border: 2px solid var(--primary);
    }
  }
  .colony-badge > img {
    object-fit: cover;
    width: 51px;
    height: 51px;
  }

  .badge-notification {
    position: absolute;
    margin-top: -21px;
  }
`;

export default function UserSides() {
  const { id: currentSideId } = useParams();
  const navigate = useNavigate();

  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const userData = useSelector((state: RootState) => state.user);

  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [displayLeaveSide, setDisplayLeaveSide] = useState<boolean>(false);
  const [side, setSide] = useState<Side | null>(null);

  // const [showCreateModal, setshowCreateModal] = useState<boolean>(false);
  // const [collectionHolder, setCollectionHolder] = useState<string[]>([]);
  // const [isSubscribe, setIsSubscribe] = useState<boolean>(false);
  const [dots, setDots] = useState<any>({});

  const displaySide = (side: Side) => {
    if (side.status === SideStatus.inactive) {
      setSide(side);
      setDisplayModal(true);
    } else {
      navigate(side.id);
    }
  };

  const handleReceiveAnnouncement = ({ detail }: { detail: Announcement }) => {
    const account = localStorage.getItem("userAccount");
    if (currentSide && account) getAndSetRoomNotifications(account);
  };

  const handleReceiveMessage = async (m: any) => {
    const { detail } = m;
    const account = localStorage.getItem("userAccount");
    if (currentSide && account) getAndSetRoomNotifications(account);
  };

  // LISTENING WS =====================================================================
  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
    return () => {
      unSubscribeToEvent(
        EventType.RECEIVE_ANNOUNCEMENT,
        handleReceiveAnnouncement
      );
    };
  }, [dots, userData, currentSide]);

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    return () => {
      unSubscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  }, [dots, userData, currentSide]);
  // LISTENING WS =====================================================================

  // Function to get notification from db and assign them to the state variable
  async function getAndSetRoomNotifications(account: string) {
    const notifications = await apiService.getNotification(account!);
    let dots_object: any = { ...dots };

    const currentChannelsIds = currentSide!.channels.map((c: any) => c.id);
    for (let notification of notifications) {
      if (
        currentChannelsIds.includes(notification["name"]) ||
        currentSide?.profiles.find((p: Profile) =>
          p.rooms.some((el) => el.id === notification["name"])
        )
      ) {
        dots_object[currentSide!["id"]] = 0;
      } else {
        let sideFounded: any;

        if (notification["type"] == NotificationType.Channel) {
          sideFounded = userData.sides.find((s: Side) => {
            return s.channels.find((c: any) => c.id === notification["name"]);
          });
        } else {
          sideFounded = userData.sides.find((s: Side) => {
            return s.profiles.find((p: Profile) => {
              return p.rooms.find((el) => el.id === notification["name"]);
            });
          });
        }

        if (currentSide && sideFounded!["id"] !== currentSide["id"])
          dots_object[sideFounded!["id"]] =
            dots_object[sideFounded!["id"]]++ || 1;
      }
    }
    notifications.length ? setDots(dots_object) : setDots({});
  }

  useEffect(() => {
    const account = localStorage.getItem("userAccount");
    if (currentSide && account) getAndSetRoomNotifications(account);
  }, [currentSide]);

  const sideProfile = userData.user?.profiles.find(
    (profile) => profile.side.id === side?.id
  );

  const isSideAdmin =
    sideProfile?.role === Role.Admin || sideProfile?.role === Role.subadmin;

  return (
    <>
      <UserSidesStyled
        className="f-column align-center mt-3"
        style={{ gap: 15 }}
      >
        {userData.sides.map((c, i) => {
          return (
            <div
              onClick={() => {
                displaySide(c);
              }}
              className={`colony-badge pointer ${
                currentSideId === c.id ? "active" : ""
              }`}
              key={c.id}
            >
              <img alt="colony-icon" src={c.sideImage} />
              {c && dots[c.id] > 0 && (
                <Dot className="badge-notification">{dots[c.id]}</Dot>
              )}
            </div>
          );
        })}
        {/* <Link to={"/new-side"}>
          <i
            className="fa-solid fa-plus mt-3 size-24 pointer text-secondary-dark"
            // onClick={() => changeStateModal(true)}
          ></i>
        </Link> */}
        {displayModal && side && (
          <SideEligibilityModal
            selectedSide={side}
            setDisplayEligibility={setDisplayModal}
            setDisplayLeaveSide={setDisplayLeaveSide}
            isSideAdmin={isSideAdmin}
          />
        )}
        {displayLeaveSide && side && (
          <LeaveSideConfirmationModal
            side={side}
            setIsLeaveConfirmationModalOpen={setDisplayLeaveSide}
            isSideAdmin={isSideAdmin}
          />
        )}
      </UserSidesStyled>
    </>
  );
}
