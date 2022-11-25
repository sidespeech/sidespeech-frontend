import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Channel } from "../../../models/Channel";
import { Profile } from "../../../models/Profile";
import { setSelectedChannel } from "../../../redux/Slices/AppDatasSlice";
import { setSelectedRoom } from "../../../redux/Slices/ChatSlice";
import { RootState } from "../../../redux/store/app.store";
import { apiService } from "../../../services/api.service";
import websocketService from "../../../services/websocket.service";
import ChannelsList from "./ChannelsList/ChannelsList";
import SideUserList from "./SideUserList/SideUserList";
import {
  subscribeToEvent,
  unSubscribeToEvent,
} from "../../../helpers/CustomEvent";
import { EventType } from "../../../constants/EventType";
import { Announcement } from "../../../models/Announcement";
import { addRoomToProfile } from "../../../redux/Slices/UserDataSlice";
import { toast } from "react-toastify";
import { getRandomId } from "../../../helpers/utilities";
import Accordion from "../../ui-components/Accordion";
import { NotificationType } from "../../../models/Notification";


const SidebarStyled = styled.div`
  max-height: 100vh;
  overflow-y: scroll;
  .selected-channel {
    border-radius: 7px;
    background-color: var(--bg-primary);
  }
`;

export default function CurrentSideLeftContent() {
  const { account } = useSelector((state: RootState) => state.user);
  // const [displayColonySettings, setDisplayColonySettings] = useState<boolean>(false);
  // const [displayNewChannelModal, setDisplayNewChannelModal] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // const [isMod, setIsMod] = useState<boolean>(false);
  // const [displayUserProfile, setDisplayUserProfile] = useState<boolean>(false);
  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const dispatch = useDispatch();

  // Variables for notifications Channels
  const [dotsChannel, setDotsChannel] = useState<any>({});
  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

  // Variables for notifications Private Message
  const [dotsPrivateMessage, setDotsPrivateMessage] = useState<any>({});
  const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);
  const { user } = useSelector((state: RootState) => state.user);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  const onChannelSelected = (c: Channel) => {
    dispatch(setSelectedChannel(c));
    dispatch(setSelectedRoom(null));
    setSelectedUser(null);
  };

  const handleSelectedUser = async (
    profile: Profile,
    currentProfile: Profile
  ) => {
    try {
      // set selected user
      setSelectedUser(profile);
      // getting account
      const connectedAccount = localStorage.getItem("userAccount");
      // getting room for given profile id
      let room = currentProfile?.getRoom(profile.id);

      if (!currentProfile || !connectedAccount || !user) return;
      // if room not exist in profile
      if (!room) {
        // creating the room
        room = await apiService.createRoom(currentProfile.id, profile.id);
        // add this room in the user websocket
        websocketService.addRoomToUsers(room.id, [user.id, profile.user.id]);
        // add the room to profile
        dispatch(addRoomToProfile(room));
      }
      // selecting the room
      dispatch(setSelectedRoom(room));
      dispatch(setSelectedChannel(null));
    } catch (error) {
      console.error(error);
      toast.error("There has been an error opening the room", {
        toastId: getRandomId(),
      });
    }
  };

  // const handleDisplayColonySettings = () => {
  //   if (isAdmin) setDisplayColonySettings(true);
  // };

  const handleReceiveAnnouncement = ({ detail }: { detail: Announcement }) => {
    const account = localStorage.getItem("userAccount");
    if (account) getAndSetRoomNotifications(account, true);
  };

  const handleReceiveMessage = async (m: any) => {
    const { detail } = m;
    const account = localStorage.getItem("userAccount");
    if (account) getAndSetRoomNotifications(account, true);
  };

  // Function to get notification from db and assign them to the state variable
  async function getAndSetRoomNotifications(account: string, from_ws = false) {
    const notifications = await apiService.getNotification(account!);
 
    let dotsPrivateMessageCopy: any = {};
    let dotsChannelCopy: any = { ...dotsChannel };
    for (let notification of notifications) {
      if (notification["type"] === NotificationType.Channel) {
        if (!selectedChannel && notification["name"] in dotsChannelCopy)
          dotsChannelCopy[notification.name] += 1;
        else if (
          selectedChannel &&
          notification["name"] === selectedChannel!.id
        ) {
          dotsChannelCopy[notification["name"]] = 0;
          await apiService.deleteNotification(selectedChannel!.id, account!);
        } else dotsChannelCopy[notification["name"]] = 1;
      } else {
        if (!selectedRoom && notification["name"] in dotsPrivateMessageCopy) {
          dotsPrivateMessageCopy[notification.name] += 1;
        } else if (selectedRoom && notification["name"] === selectedRoom!.id) {
          dotsPrivateMessageCopy[notification["name"]] = 0;
          await apiService.deleteNotification(selectedRoom!.id, account!);
        } else dotsPrivateMessageCopy[notification["name"]] = 1;
      }
    }
    if (
      JSON.stringify(dotsPrivateMessageCopy) !==
      JSON.stringify(dotsPrivateMessage)
    )
      setDotsPrivateMessage(dotsPrivateMessageCopy);
    if (JSON.stringify(dotsChannelCopy) !== JSON.stringify(dotsChannel)) {
      setDotsChannel(dotsChannelCopy);
    }
  }

  // LISTENING WS =====================================================================
  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    return () => {
      unSubscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  });

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
    return () => {
      unSubscribeToEvent(
        EventType.RECEIVE_ANNOUNCEMENT,
        handleReceiveAnnouncement
      );
    };
  });
  // LISTENING WS =====================================================================

  useEffect(() => {
    setIsAdmin(currentSide?.creatorAddress === account);
  }, [currentSide, account]);

  useEffect(() => {
    const account = localStorage.getItem("userAccount");
    if (account) getAndSetRoomNotifications(account);
  }, [selectedRoom, selectedChannel]);

  if (!currentSide) return <>No side selected</>;

  return (
    <>
      <SidebarStyled className="px-1">
        <Accordion
          AccordionButton={() => (
            <span className="fw-400 size-11 flex align-center">
              <svg
                className="mr-2"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.875 9.83366L7.16667 5.12533L11.875 0.416992L16.5833 5.12533L11.875 9.83366ZM0.5 8.16699V1.50033H7.16667V8.16699H0.5ZM8.83333 16.5003V9.83366H15.5V16.5003H8.83333ZM0.5 16.5003V9.83366H7.16667V16.5003H0.5ZM2.16667 6.50033H5.5V3.16699H2.16667V6.50033ZM11.8958 7.50033L14.25 5.14616L11.8958 2.79199L9.54167 5.14616L11.8958 7.50033ZM10.5 14.8337H13.8333V11.5003H10.5V14.8337ZM2.16667 14.8337H5.5V11.5003H2.16667V14.8337Z"
                  fill="#B4C1D2"
                />
              </svg>
              <p className="size-14">
                Channels ({currentSide.channels.length || 0})
              </p>
            </span>
          )}
        >
          <ChannelsList
            channels={currentSide.channels}
            dots={dotsChannel}
            onChannelSelected={onChannelSelected}
          />
        </Accordion>

        <Accordion
          AccordionButton={() => (
            <span className="fw-400 size-11 flex align-center">
              <svg
                className="mr-2"
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.833008 13.6668V11.3335C0.833008 10.8613 0.954674 10.4271 1.19801 10.031C1.44079 9.63544 1.76356 9.3335 2.16634 9.12516C3.02745 8.69461 3.90245 8.37155 4.79134 8.156C5.68023 7.941 6.58301 7.8335 7.49967 7.8335C8.41634 7.8335 9.31912 7.941 10.208 8.156C11.0969 8.37155 11.9719 8.69461 12.833 9.12516C13.2358 9.3335 13.5586 9.63544 13.8013 10.031C14.0447 10.4271 14.1663 10.8613 14.1663 11.3335V13.6668H0.833008ZM15.833 13.6668V11.1668C15.833 10.5557 15.663 9.96877 15.323 9.406C14.9825 8.84377 14.4997 8.36127 13.8747 7.9585C14.583 8.04183 15.2497 8.18405 15.8747 8.38516C16.4997 8.58683 17.083 8.8335 17.6247 9.12516C18.1247 9.40294 18.5066 9.71183 18.7705 10.0518C19.0344 10.3924 19.1663 10.7641 19.1663 11.1668V13.6668H15.833ZM7.49967 7.00016C6.58301 7.00016 5.79829 6.67377 5.14551 6.021C4.49273 5.36822 4.16634 4.5835 4.16634 3.66683C4.16634 2.75016 4.49273 1.96544 5.14551 1.31266C5.79829 0.659885 6.58301 0.333496 7.49967 0.333496C8.41634 0.333496 9.20106 0.659885 9.85384 1.31266C10.5066 1.96544 10.833 2.75016 10.833 3.66683C10.833 4.5835 10.5066 5.36822 9.85384 6.021C9.20106 6.67377 8.41634 7.00016 7.49967 7.00016ZM15.833 3.66683C15.833 4.5835 15.5066 5.36822 14.8538 6.021C14.2011 6.67377 13.4163 7.00016 12.4997 7.00016C12.3469 7.00016 12.1525 6.98294 11.9163 6.9485C11.6802 6.9135 11.4858 6.87516 11.333 6.8335C11.708 6.38905 11.9961 5.896 12.1972 5.35433C12.3988 4.81266 12.4997 4.25016 12.4997 3.66683C12.4997 3.0835 12.3988 2.521 12.1972 1.97933C11.9961 1.43766 11.708 0.944607 11.333 0.500163C11.5275 0.430718 11.7219 0.385441 11.9163 0.36433C12.1108 0.343774 12.3052 0.333496 12.4997 0.333496C13.4163 0.333496 14.2011 0.659885 14.8538 1.31266C15.5066 1.96544 15.833 2.75016 15.833 3.66683ZM2.49967 12.0002H12.4997V11.3335C12.4997 11.1807 12.4616 11.0418 12.3855 10.9168C12.3088 10.7918 12.208 10.6946 12.083 10.6252C11.333 10.2502 10.5761 9.96877 9.81217 9.781C9.04829 9.59377 8.27745 9.50016 7.49967 9.50016C6.7219 9.50016 5.95106 9.59377 5.18717 9.781C4.42329 9.96877 3.66634 10.2502 2.91634 10.6252C2.79134 10.6946 2.69079 10.7918 2.61467 10.9168C2.53801 11.0418 2.49967 11.1807 2.49967 11.3335V12.0002ZM7.49967 5.3335C7.95801 5.3335 8.35051 5.17016 8.67718 4.8435C9.00329 4.51738 9.16634 4.12516 9.16634 3.66683C9.16634 3.2085 9.00329 2.81627 8.67718 2.49016C8.35051 2.1635 7.95801 2.00016 7.49967 2.00016C7.04134 2.00016 6.64912 2.1635 6.32301 2.49016C5.99634 2.81627 5.83301 3.2085 5.83301 3.66683C5.83301 4.12516 5.99634 4.51738 6.32301 4.8435C6.64912 5.17016 7.04134 5.3335 7.49967 5.3335Z"
                  fill="#B4C1D2"
                />
              </svg>
              <p className="size-14">
                Members ({currentSide.profiles.length || 0})
              </p>
            </span>
          )}
        >
          <SideUserList
            dots={dotsPrivateMessage}
            handleSelectedUser={handleSelectedUser}
            selectedUser={selectedUser}
          />
        </Accordion>

        <Accordion
          AccordionButton={() => (
            <span className="fw-400 size-11 flex align-center">
              <svg
                className="mr-2"
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.33366 13.6668C1.87533 13.6668 1.4831 13.5038 1.15699 13.1777C0.830326 12.851 0.666992 12.4585 0.666992 12.0002V2.00016C0.666992 1.54183 0.830326 1.14961 1.15699 0.823496C1.4831 0.496829 1.87533 0.333496 2.33366 0.333496H15.667C16.1253 0.333496 16.5178 0.496829 16.8445 0.823496C17.1706 1.14961 17.3337 1.54183 17.3337 2.00016V12.0002C17.3337 12.4585 17.1706 12.851 16.8445 13.1777C16.5178 13.5038 16.1253 13.6668 15.667 13.6668H2.33366ZM9.00033 7.8335L2.33366 3.66683V12.0002H15.667V3.66683L9.00033 7.8335ZM9.00033 6.16683L15.667 2.00016H2.33366L9.00033 6.16683ZM2.33366 3.66683V2.00016V12.0002V3.66683Z"
                  fill="#B4C1D2"
                />
              </svg>
              <p className="size-14">
                Conversations ({currentSide.profiles.length || 0})
              </p>
            </span>
          )}
        >
          <SideUserList
            dots={dotsPrivateMessage}
            handleSelectedUser={handleSelectedUser}
            selectedUser={selectedUser}
          />
        </Accordion>
      </SidebarStyled>
    </>
  );
}
