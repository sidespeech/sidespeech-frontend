import React, { useEffect, useRef, useState } from "react";
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
import "./AnnouncementItem.css";
import MessageInput from "../../ui-components/MessageInput";

// import { toast } from "react-toastify";
import _ from "lodash";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/app.store";
import { apiService } from "../../../services/api.service";
// import { channel } from "diagnostics_channel";
import { ChannelType } from "../../../models/Channel";
import MessageContent from "../../ui-components/MessageContent";

export default function AnnouncementItem({
  announcement,
  handleExtendComments,
  extend,
}: {
  announcement: Announcement;
  handleExtendComments: any;
  extend: string;
}) {
  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);
  const { account } = useSelector((state: RootState) => state.user);

  const ref = useRef<Editor>(null);

  useEffect(() => {
    setIsExtended(extend === announcement.id);
  }, [extend]);

  // This will handle sending an comment to the api.
  const handleComment = async (value: string) => {
    // This will need to be made dynamic.
    const creatorAddress = account;

    const newComment = await apiService.sendComment(
      value,
      creatorAddress,
      announcement.id
    );
    setComments([...comments, newComment]);
  };

  return (
    <div className="annoucement-item f-column">
      <div className="flex justify-between w-100">
        <UserBadge
          check
          color={"var(--text-red)"}
          weight={700}
          fontSize={14}
          address={announcement.creatorAddress}
        />
        <div className="size-11 fw-500 open-sans" style={{ color: "#7F8CA4" }}>
          {format(
            new Date(Number.parseInt(announcement.timestamp)),
            "yyyy-mm-dd hh:mm"
          )}
        </div>
      </div>
      <MessageContent message={announcement.content} />
      {selectedChannel && selectedChannel.type === ChannelType.Announcement && (
        <div className="pointer">
          <i className="fa-solid fa-comment-dots mr-2"></i>
          <span
            onClick={() => handleExtendComments(announcement.id)}
            className="fw-700 size-10"
          >
            {announcement.comments?.length + comments.length || 0} replies
          </span>
          <div
            className={`comments-container mt-3  ${isExtended ? "extend" : ""}`}
          >
            {_.orderBy(
              announcement.comments.concat(comments),
              ["timestamp"],
              ["desc"]
            ).map((comment: Comment) => {
              return (
                <div
                  className="f-column "
                  style={{
                    gap: 8,
                    padding: "3px 0px 12px 0px",
                    borderTop: "1px solid var(--bg-secondary-light)",
                  }}
                >
                  <div className="flex justify-between w-100">
                    <UserBadge
                      check
                      color="asd"
                      weight={700}
                      fontSize={14}
                      address={comment.creatorAddress}
                    />
                    <div
                      className="size-11 fw-500 open-sans"
                      style={{ color: "#7F8CA4" }}
                    >
                      {format(
                        new Date(Number.parseInt(comment.timestamp)),
                        "yyyy-mm-dd hh:mm"
                      )}
                    </div>
                  </div>
                  <MessageContent message={comment.content} />
                </div>
              );
            })}

          <MessageInput
            ref={ref}
            size={14}
            weight={600}
            imageUpload
            id="sendmessage"
            radius="10px"
            placeholder={"Type your message here"}
            onSubmit={handleComment}
          />
          </div>
        </div>
      )}
    </div>
  );
}
