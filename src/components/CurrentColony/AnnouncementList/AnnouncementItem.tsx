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
  const [comment, setComment] = useState<string>("");

  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

  useEffect(() => {
    setIsExtended(extend === announcement.id);
  }, [extend]);

  const setCommentText = (content: string) => {
    setComment(content);
  };
  const sendComment = async () => {
    try {
    } catch (error) {
      toast.error("error sending comment", { toastId: 7 });
    }
  };

  return (
    <div className="annoucement-item f-column">
      <div className="flex justify-between w-100">
        <UserBadge
          check
          color={"var(--text-red)"}
          weight={700}
          fontSize={14}
          address={announcement.creator.attributes.ethAddress}
        />
        <div className="size-11 fw-500 open-sans" style={{ color: "#7F8CA4" }}>
          {format(announcement.createdAt, "yyyy-mm-dd hh:mm")}
        </div>
      </div>
      <div>{announcement.content}</div>
      {selectedChannel && selectedChannel.type === "announcement" && (
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
                      color={getRoleColorForStyle(
                        comment.creator.attributes.role
                      )}
                      weight={700}
                      fontSize={14}
                      address={comment.creator.attributes.ethAddress}
                    />
                    <div
                      className="size-11 fw-500 open-sans"
                      style={{ color: "#7F8CA4" }}
                    >
                      {comment.createdAt.toLocaleDateString()}
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
              onChange={(e: any) => {
                setCommentText(e.target.value);
              }}
              onKeyUp={(event: any) => {
                if (event.key === "Enter") sendComment();
              }}
              onClick={(e: any) => {
                sendComment();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
