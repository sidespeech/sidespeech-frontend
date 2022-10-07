import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Poll } from "../../../models/Poll";
import { RootState } from "../../../redux/store/app.store";
import UserBadge from "../../ui-components/UserBadge";
import { LeafPoll, Result } from "react-leaf-polls";
import "./Polls.css";

import { toast } from "react-toastify";

import _ from "lodash";
import { format } from "date-fns";

export default function Polls() {
  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);
  const { user } = useSelector((state: RootState) => state.user);
  const customTheme = {
    textColor: "var(--text-secondary)",
    mainColor: "#705CE9",
    backgroundColor: "#705CE94D",
    alignment: "center",
  };

  const handleVote = async (a: any, pollId: string) => {
    try {
    } catch (error) {
      toast.error("Error when voting", { toastId: 9 });
    }
  };

  useEffect(() => {
    function updateScroll() {
      var element = document.getElementById("polls-list");
      if (element) element.scrollTop = element.scrollHeight;
    }
    updateScroll();
  }, [selectedChannel]);

  if (!selectedChannel) return <></>;

  return (
    <div id="polls-list" className="text-secondary w-100">
      {_.orderBy(selectedChannel.polls, "createdAt").map((poll: Poll) => {
        return (
          <div className="w-100 poll-item">
            <div key={poll.id} className="flex justify-between w-100">
              <UserBadge
                check
                color={"var(--text-red)"}
                weight={700}
                fontSize={14}
                address={poll.creator.attributes.ethAddress}
              />
              <div
                className="size-11 fw-500 open-sans"
                style={{ color: "#7F8CA4" }}
              >
                {format(poll.createdAt, "yyyy-mm-dd hh:mm")}
              </div>
            </div>
            {/* <div>{poll.question}</div> */}
            <div className="flex poll-override">
              {
                <LeafPoll
                  type={"multiple"}
                  question={poll.question}
                  results={poll.answers.map((a, index) => {
                    const votes = poll.votes.filter(
                      (v) => v.selectedAnswer === index
                    );
                    return { id: index, text: a, votes: votes.length };
                  })}
                  theme={customTheme}
                  isVoted={poll.votes.some((v) => v.user.id === user.id)}
                  onVote={(a: any) => handleVote(a, poll.id)}
                />
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}
