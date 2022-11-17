import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from 'styled-components';
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
import { getRandomId, reduceWalletAddressForColor } from "../../../helpers/utilities";

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
  className?: string;
  isThread?: boolean;
}

export default function AnnouncementItem({
  announcement,
  className,
  isThread
}: AnnouncementItemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const { id } = useParams();

  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);
  const { account } = useSelector((state: RootState) => state.user);

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
      } catch (error) {
       console.error(error);
       toast.error('There has been an error when commenting this announcement', {toastId: getRandomId()}) 
      }
  };

  return (
    <AnnouncementItemStyled className={`${className} f-column`}>
      <div className="flex w-100 gap-20">
        <UserBadge
          check
          color={reduceWalletAddressForColor(announcement.creatorAddress)}
          weight={700}
          fontSize={14}
          address={announcement.creatorAddress}
        />
        <div className="size-11 fw-500 open-sans" style={{ color: "var(--text-secondary-dark)" }}>
          {formatDistance(
            new Date(Number.parseInt(announcement.timestamp)), 
            new Date(), 
            {
              addSuffix: true
            }
          )}
        </div>
      </div>

      <MessageContent message={announcement.content} />

      {selectedChannel && selectedChannel.type === ChannelType.Announcement && (
        <Comments 
          channel={announcement}
          comments={comments}
          isThread={!!isThread}
          handleComment={handleComment}
          sideId={id || ''}

        />
      )}
    </AnnouncementItemStyled>
  );
}
