import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
import _ from "lodash";
import { toast } from "react-toastify";
import { formatDistance } from "date-fns";

import { apiService } from "../../../services/api.service";
import { Announcement } from "../../../models/Announcement";
import { Comment } from "../../../models/Comment";
import UserBadge from "../../ui-components/UserBadge";
import { RootState } from "../../../redux/store/app.store";
import { ChannelType } from "../../../models/Channel";
import MessageContent from "../../ui-components/MessageContent";
import Comments from "../shared-components/Comments";
import {
  fixURL,
  getRandomId,
  reduceWalletAddressForColor,
} from "../../../helpers/utilities";
import Accordion from "../../ui-components/Accordion";
import { useNavigate, useParams } from "react-router-dom";
import {
  subscribeToEvent,
  unSubscribeToEvent,
} from "../../../helpers/CustomEvent";
import { EventType } from "../../../constants/EventType";
import websocketService from "../../../services/websocket.service";

const AnnouncementItemStyled = styled.div`
  width: 100%;
  padding: 13px 16px 17px 16px;
  gap: 8px;
  color: var(--text-secondary);
  &.border-bottom {
    border-bottom: 1px solid var(--bg-secondary-light);
  }
`;

interface AnnouncementItemProps {
  announcement: Announcement;
  authorizeComments?: boolean;
  className?: string;
  isThread?: boolean;
}

export default function AnnouncementItem({
  announcement,
  authorizeComments,
  className,
  isThread,
}: AnnouncementItemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const { id } = useParams();

  const { selectedChannel, currentSide } = useSelector(
    (state: RootState) => state.appDatas
  );
  const { account } = useSelector((state: RootState) => state.user);
  const [data, setData] = useState<any>({ profile: null, url: "" });

  // This will handle sending an comment to the api.
  const handleComment = async (value: string) => {
    // This will need to be made dynamic.
    const creatorAddress = account;
    try {
      const newComment = await apiService.sendComment(
        value,
        creatorAddress,
        announcement.id
      );
      setComments([...comments, newComment]);
      websocketService.sendComment(newComment);
    } catch (error) {
      console.error(error);
      toast.error("There has been an error when commenting this announcement", {
        toastId: getRandomId(),
      });
    }
  };

  const handleReceiveComment = useCallback(
    ({ detail }: { detail: any }) => {
      setComments([...detail["announcement"]["comments"], detail]);
    },
    [selectedChannel]
  );

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_COMMENT, handleReceiveComment);
    return () => {
      unSubscribeToEvent(EventType.RECEIVE_COMMENT, handleReceiveComment);
    };
  }, [comments, handleReceiveComment]);

  useEffect(() => {
    const profile = currentSide?.profiles.find(
      (p) => p.user.accounts.toLowerCase() === announcement.creatorAddress.toLowerCase()
    );
    if (profile) {
      const url = profile?.profilePicture?.metadata?.image
        ? fixURL(profile.profilePicture?.metadata?.image)
        : "";
      setData({ profile: profile, url: url });
    }
  }, [currentSide]);

  return (
    <AnnouncementItemStyled className={`${className} f-column`}>
      <div className="flex w-100 gap-20">
        <UserBadge
          check
          color={reduceWalletAddressForColor(announcement.creatorAddress)}
          weight={700}
          fontSize={14}
          avatar={data.url}
          username={data.profile?.user.username}
        />
        <div
          className="size-11 fw-500 open-sans"
          style={{ color: "var(--text-secondary-dark)" }}
        >
          {formatDistance(
            new Date(Number.parseInt(announcement.timestamp)),
            new Date(),
            {
              addSuffix: true,
            }
          )}
        </div>
      </div>

      <MessageContent message={announcement.content} />

      {authorizeComments &&
        selectedChannel &&
        selectedChannel.type === ChannelType.Announcement && (
          <Comments
            channel={announcement}
            comments={comments}
            isThread={!!isThread}
            handleComment={handleComment}
            sideId={id || ""}
          />
        )}
    </AnnouncementItemStyled>
  );
}
