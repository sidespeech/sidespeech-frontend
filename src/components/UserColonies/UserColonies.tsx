import React, { useEffect, useState } from "react";
import CreateColonyModal from "../Modals/CreateColonyModal";
import "./UserColonies.css";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { EventType } from "../../constants/EventType";
import { subscribeToEvent, unSubscribeToEvent } from "../../helpers/CustomEvent";
import { Announcement } from "../../models/Announcement";
import { RootState } from "../../redux/store/app.store"; import { flattenChannels } from "../../redux/Slices/UserDataSlice";
import { Side } from "../../models/Side";
import { Channel } from "diagnostics_channel";
import { Dot } from "../ui-components/styled-components/shared-styled-components";
import { apiService } from "../../services/api.service";
;



export default function UserColonies() {
  const userData = useSelector((state: RootState) => state.user);
  const [showCreateModal, setshowCreateModal] = useState<boolean>(false);
  const [collectionHolder, setCollectionHolder] = useState<string[]>([]);
  const [isSubscribe, setIsSubscribe] = useState<boolean>(false);
  const [dots, setDots] = useState<any>({});
  const { currentSide } = useSelector((state: RootState) => state.appDatas);

  const navigate = useNavigate();

  const displayColony = (id: string) => {
    navigate(id);
  };

  const changeStateModal = (value: boolean) => {
    // Iteration throw nft user to get every collection is holder
    let collections = Object.keys(userData["userCollectionsData"]);
    setCollectionHolder(collections);
    setshowCreateModal(value);
  };

  useEffect(() => {
    if (userData && userData.sides.length > 0 && !isSubscribe) {
    }

    return () => { };
  }, [userData]);

  const handleReceiveAnnouncement = ({ detail }: { detail: Announcement }) => {
    for (let side of userData.sides) {
      let channels_ids = side.channels.map((c: any) => c.id);
      if (channels_ids.includes(detail.channelId) && currentSide!['id'] !== side['id']) {
        let number = dots[side.id] || 0;
        setDots({ ...dots, [side.id]: ++number });
      }
    }
  };

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
    // if (currentSide && dots[currentSide.id] > 0)
    //   setDots({ ...dots, [currentSide.id]: 0 });
    return () => {
      unSubscribeToEvent(
        EventType.RECEIVE_ANNOUNCEMENT,
        handleReceiveAnnouncement
      );
    };
  }, [dots, userData, currentSide]);


  useEffect(() => {
    const account = localStorage.getItem('userAccount')
    async function getChannelNotifications(account: string) {
      const notifications = await apiService.getNotification(account!);
      let dots_object: any = { ...dots }
      const currentChannelsIds = currentSide!.channels.map((c: any) => c.id)
      for (let notification of notifications) {
        if (currentSide!['id'] in dots_object && !(currentChannelsIds.includes(notification['name']))) dots_object[currentSide!['id']] = dots_object[currentSide!['id']]++
        else if (currentChannelsIds.includes(notification['name'])) {
          dots_object[currentSide!['id']] = 0
          // await apiService.deleteNotification(notification['name'], account!);
        }
        else dots_object[currentSide!['id']] = 1
      }
      setDots(dots_object);
    }
    if (currentSide && account) getChannelNotifications(account);
  }, [currentSide]);

  return (
    <>
      <div className="f-column align-center mt-3" style={{ gap: 15 }}>
        {userData.sides.map((c, i) => {
          return (
              <div
                onClick={() => {
                  displayColony(c.id);
                }}
                className="colony-badge pointer"
                key={c.id}
              >
                <img alt="colony-icon" src={c.sideImage} />
                {c && dots[c.id] > 0 && <Dot className="badge-notification">{dots[c.id]}</Dot>}
              </div>
          );
        })}
        <Link to={"/new-side"}>
          <i
            className="fa-solid fa-plus mt-3 size-24 pointer text-secondary-dark"
          // onClick={() => changeStateModal(true)}
          ></i>
        </Link>
      </div>
      {showCreateModal && (
        <CreateColonyModal
          showModal={setshowCreateModal}
          collections={collectionHolder}
        />
      )}
    </>
  );
}
