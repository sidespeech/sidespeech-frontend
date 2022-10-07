import React, { useEffect, useState } from "react";
import {
  getRoleColor,
  getRoleColorForStyle,
  reduceWalletAddress,
} from "../../../helpers/utilities";
import { Announcement, Comment } from "../../../models/Colony";
import check from "../../../assets/check.svg";
import UserBadge from "../../ui-components/UserBadge";
import "./AnnouncementItem.css";
import InputText from "../../ui-components/InputText";

import { toast } from "react-toastify";
import _ from "lodash";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/app.store";
import { apiService } from "../../../services/api.service";
import { channel } from "diagnostics_channel";

export default function AnnouncementItem({
  announcement,
  handleExtendComments,
  extend,
}: {
  announcement: any;
  handleExtendComments: any;
  extend: string;
}) {
  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

  useEffect(() => {
    setIsExtended(extend === announcement.id);
  }, [extend]);

  const setCommentText = (content: string) => {
    setComment(content);
  };

  // This will handle sending an comment to the api.
  const handleComment = (value: string) => {
    // This will need to be made dynamic.
    const creatorAddress = "0xFa446636A9e57ab763C1C70F80ea3c7C3969F397";

    apiService.sendComment(value, creatorAddress);
  };

  return (
    <div className="annoucement-item f-column">
      <div className="flex justify-between w-100">
        <UserBadge
          check
          color={"var(--text-red)"}
          weight={700}
          fontSize={14}
          address={"announcement.creator.attributes.ethAddress"}
        />
        <div className="size-11 fw-500 open-sans" style={{ color: "#7F8CA4" }}>
          {format(
            new Date(Number.parseInt(announcement.timestamp)),
            "yyyy-mm-dd hh:mm"
          )}
        </div>
      </div>
      <div>{announcement.content}</div>
      {selectedChannel && selectedChannel.type === ChannelType.Announcement && (
        <div className="pointer">
          <i className="fa-solid fa-comment-dots mr-2"></i>
          <span
            onClick={() => handleExtendComments(announcement.id)}
            className="fw-700 size-10"
          >
            {announcement.comments?.length || 0} replies
          </span>
          <div
            className={`comments-container mt-3  ${isExtended ? "extend" : ""}`}
          >
            {_.orderBy(announcement.comments, "createdAt").map((comment) => {
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
                      address={"test"}
                    />
                    <div
                      className="size-11 fw-500 open-sans"
                      style={{ color: "#7F8CA4" }}
                    >
                      {comment.timestamp}
                    </div>
                  </div>
                  <div>{comment.content}</div>
                </div>
              );
            })}
            <InputText
              size={14}
              weight={600}
              glass={false}
              message
              iconRightPos={{ top: 15, right: 18 }}
              height={45}
              radius="10px"
              placeholder={""}
              onChange={(event: any) => {
                setCommentText(event.target.value);
              }}
              onKeyUp={(event: any) => {
                if (event.key === "Enter") handleComment(comment);
              }}
              onClick={(e: any) => {
                handleComment(comment);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export enum ChannelType {
  Announcement,
  Poll,
  Textual,
}
