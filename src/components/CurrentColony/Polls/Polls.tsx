import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Poll } from "../../../models/Poll";
import { RootState } from "../../../redux/store/app.store";
import UserBadge from "../../ui-components/UserBadge";
import { LeafPoll, Result } from "react-leaf-polls";
import { apiService } from "../../../services/api.service";

import "./Polls.css";

import { toast } from "react-toastify";

import _ from "lodash";
import { format } from "date-fns";

export default function Polls() {

  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);
  const { user } = useSelector((state: RootState) => state.user);

  const [polls, setPolls] = useState<Poll[]>([]);

  const walletAddress = window.ethereum.selectedAddress;

  const customTheme = {
    textColor: "var(--text-secondary)",
    mainColor: "#705CE9",
    backgroundColor: "#705CE94D",
    alignment: "center",
  };

  const handleVote = async (callbackData: any, pollId: string) => {

    const voteOnPoll = await apiService.voteOnPoll(window.ethereum.selectedAddress, callbackData.optionId, Date.now().toString());

    try {
      toast.success("You have now voted", { toastId: 8 });
    } catch (error) {
      toast.error("Error when voting", { toastId: 9 });
    }
   
    return voteOnPoll;
  };

  // Get all of the channels polls.
  const getChannelPolls = async() => {
    const polls = await apiService.getChannelPolls();
    setPolls(polls);
  }

  useEffect(() => {
    function updateScroll() {
      var element = document.getElementById("polls-list");
      if (element) element.scrollTop = element.scrollHeight;
    }
    getChannelPolls();
    updateScroll();
  }, [selectedChannel]);

  if (!selectedChannel) return <></>;

  return (
    <div id="polls-list" className="text-secondary w-100">
      {polls.map((poll: Poll) => {

        const thePollOptions = poll.pollOption.map((option: any, index: any) => {
          return { id: index, optionId: option.id, text: option.text, votes: option.votes };
        });

        console.log(poll.votes.some((v) => v.user.id === walletAddress));
        return (
          <div className="w-100 poll-item">
            <div key={poll.id} className="flex justify-between w-100">
              <UserBadge
                check
                color={"var(--red)"}
                weight={700}
                fontSize={14}
                address={window.ethereum.selectedAddress}
              />
              <div
                className="size-11 fw-500 open-sans"
                style={{ color: "#7F8CA4" }}
              >
                {/* {format(poll.timestamp, "yyyy-mm-dd hh:mm")} */}
              </div>
            </div>
            <div className="flex poll-override">
              {
                <LeafPoll
                  type={"multiple"}
                  question={poll.question}
                  results= {thePollOptions}
                  theme={customTheme}
                  isVoted={poll.votes.some((v) => v.user === walletAddress)}
                  onVote={(callbackData: any) => handleVote(callbackData, poll.id)}
                />
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}
