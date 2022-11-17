import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from 'styled-components';
// import {
//   getRoleColor,
//   getRoleColorForStyle,
//   reduceWalletAddress,
// } from "../../../helpers/utilities";
import { Editor } from 'react-draft-wysiwyg';
import { Announcement } from "../../../models/Announcement";
import { Comment } from "../../../models/Comment";
// import check from "../../../assets/check.svg";
import UserBadge from "../../ui-components/UserBadge";
import MessageInput from "../../ui-components/MessageInput";

// import { toast } from "react-toastify";
import _ from "lodash";
import { formatDistance } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/app.store";
import { apiService } from "../../../services/api.service";
// import { channel } from "diagnostics_channel";
import { ChannelType } from "../../../models/Channel";
import MessageContent from "../../ui-components/MessageContent";
import Button from "../../ui-components/Button";
import { toast } from "react-toastify";
import { getRandomId, reduceWalletAddressForColor } from "../../../helpers/utilities";
import Accordion from "../../ui-components/Accordion";
import { useNavigate, useParams } from "react-router-dom";
import { subscribeToEvent, unSubscribeToEvent } from "../../../helpers/CustomEvent";
import { EventType } from "../../../constants/EventType";
import websocketService from "../../../services/websocket.service";

const AnnouncementItemStyled = styled.div`
  width: 100%;
  /* min-height: 104px; */
  padding: 13px 16px 17px 16px;
  gap: 8px;
  color: var(--text-secondary);
  &.border-bottom {
    border-bottom: 1px solid var(--bg-secondary-light);
  }
  .comments-container {
    width: 100%;
    padding-left: 47px;
    overflow: hidden;
    gap: 10px;
    display: flex;
    flex-direction: column;
    height: calc(90vh - 220px);
    & .comments-scroll-container {
      overflow-y: scroll;
    }
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
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);
  const { account } = useSelector((state: RootState) => state.user);

  const ref = useRef<Editor>(null);

  // This will handle sending an comment to the api.
  const handleComment = async (value: string) => {
    console.log('value handleComment :', value)

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
       toast.error('There has been an error when commenting this announcement', {toastId: getRandomId()}) 
      }


  };

  const handleReceiveComment = useCallback(({ detail }: { detail: any }) => {
    setComments([...detail['announcement']['comments'], detail]);
  }, [selectedChannel]);

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_COMMENT, handleReceiveComment);
    return () => {
      unSubscribeToEvent(
        EventType.RECEIVE_COMMENT,
        handleReceiveComment
      );
    };
  }, [comments, handleReceiveComment]);

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
        <Accordion
          AccordionButton={() => (
            <div className="flex align-center gap-20">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="var(--text-secondary)" d="M0.5 11.75V1.25C0.5 1.0375 0.572 0.85925 0.716 0.71525C0.8595 0.57175 1.0375 0.5 1.25 0.5H11C11.2125 0.5 11.3905 0.57175 11.534 0.71525C11.678 0.85925 11.75 1.0375 11.75 1.25V8C11.75 8.2125 11.678 8.3905 11.534 8.534C11.3905 8.678 11.2125 8.75 11 8.75H3.5L0.5 11.75ZM4.25 12.5C4.0375 12.5 3.85925 12.428 3.71525 12.284C3.57175 12.1405 3.5 11.9625 3.5 11.75V10.25H13.25V3.5H14.75C14.9625 3.5 15.1405 3.57175 15.284 3.71525C15.428 3.85925 15.5 4.0375 15.5 4.25V15.5L12.5 12.5H4.25Z" />
              </svg>
              <span className="fw-700 size-10">
                {announcement.comments?.length + comments.length || 0} Replies
              </span>
              {!isThread && (
                <Button
                  background="var(--bg-secondary-light)"
                  fontSize="12px"
                  height={30}
                  onClick={() => navigate(`/${id}/thread/${announcement.id}`)}
                  radius={7}
                  width="160px"
                >
                  See the comments
                  <svg className="arrow-icon ml-3" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-2.29485e-07 5.25L9.13125 5.25L4.93125 1.05L6 -2.62268e-07L12 6L6 12L4.93125 10.95L9.13125 6.75L-2.95052e-07 6.75L-2.29485e-07 5.25Z" fill="white"/>
                  </svg>
                </Button>
              )}
            </div>
          )}
          hideOpenIcon
          locked
          openInitialState={!!isThread}
        >
          <div className="comments-container mt-3">
            <div
              className="comments-scroll-container"
            >
              {_.orderBy(
                  announcement.comments.concat(comments),
                  ["timestamp"],
                  ["asc"]
                ).map((comment: Comment) => (
                  <div
                    className=""
                    key={comment.content + getRandomId()}
                    style={{
                      gap: 8,
                      padding: "3px 0px 12px 0px",
                      borderTop: "1px solid var(--bg-secondary-light)",
                    }}
                  >
                    <div className="flex gap-20 w-100">
                      <UserBadge
                        check
                        color={reduceWalletAddressForColor(comment.creatorAddress)}
                        weight={700}
                        fontSize={14}
                        address={comment.creatorAddress}
                      />
                      <div
                        className="size-11 fw-500 open-sans"
                        style={{ color: "#7F8CA4" }}
                      >
                        {formatDistance(
                          new Date(Number.parseInt(comment.timestamp)),
                          new Date(),
                          {
                            addSuffix: true
                          }
                        )}
                      </div>
                    </div>
                    <MessageContent message={comment.content} />
                  </div>
                )
              )}

            </div>
          </div>
          <div style={{marginTop: 'auto'}}>
            <MessageInput
              id={`sendcomment-${announcement.id}`}
              imageUpload
              onSubmit={handleComment}
              placeholder={"Type your message here"}
              radius="10px"
              ref={ref}
              size={14}
              weight={600}
            />
          </div>
        </Accordion>
      )}
    </AnnouncementItemStyled>
  );
}
