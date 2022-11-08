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

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

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

     // This is the all of the providers that are needed...
     const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "b49e48dbbec944eea653e7a44ca67500",
        },
      },
    };

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

     // Open the connector
     const provider = await web3Modal.connect();

     // Set the provider.
     const library = new ethers.providers.Web3Provider(provider);

     let signature;
 
      // Get Signer
      const signer = library.getSigner();

      // Create the signer message
      const signerMessage = "SideSpeech DAO Vote";

      // Create the signature signing message.
      signature = await signer.signMessage(signerMessage);

      // Grab the wallet address
      const address = await signer.getAddress();

      // Get the signer address.
      const signerAddr = ethers.utils.verifyMessage(
        signerMessage,
        signature
      );

      // Check if the signer address is the same as the connected address.
      if (signerAddr !== address) {

        toast.error("Error when voting", { toastId: 9 });

        return false;
      
      } else {

        const voteOnPoll = await apiService.voteOnPoll(window.ethereum.selectedAddress, callbackData.optionId, Date.now().toString());

        try {
          toast.success("You have now voted", { toastId: 8 });
        } catch (error) {
          toast.error("Error when voting", { toastId: 9 });
        }

        return voteOnPoll;
      }
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
          return { id: index, optionId: option.id, text: option.text, votes: option.votes};
        });

        // We'll check if the user has voted.
        const checkUserVoted = poll.votes.some((v) => v.user == walletAddress);

        console.log('The poll votes object is: ', poll.votes);
        console.log('The userId is: ', poll.votes[0].user);
        console.log('The wallet address is: ', walletAddress);
        //console.log(checkUserVoted);

        return (
          <div className="w-100 poll-item" key={poll.id}>
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
                  isVoted={true}
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
