import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import _ from "lodash";
import { toast } from "react-toastify";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import { Poll } from "../../../models/Poll";
import { RootState } from "../../../redux/store/app.store";
import { apiService } from "../../../services/api.service";
import EmptyList from '../shared-components/EmptyList';
import Button from "../../ui-components/Button";
import { subscribeToEvent, unSubscribeToEvent } from "../../../helpers/CustomEvent";
import { EventType } from "../../../constants/EventType";
import PollItem from "./PollItem";
import { Announcement } from "../../../models/Announcement";

const PollsStyled = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0px 1rem;
  .poll-item {
    padding: 13px 16px 17px 16px;
    width: 100%;
    height: auto;
    &.border-top {
      border-top: 1px solid var(--bg-secondary-light);
    }
    .poll-item_container {
      width: 350px;
      .poll-description {
        position: relative;
        padding: 0 1rem;
        margin: 1rem 0;
        .success-message {
          color: var(--green);
        }
        .progress-message {
          color: var(--warning);
        }
        &::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 3px;
          border-radius: 3px;
        }
        &.finished::before {
          background-color: var(--green);
        }
        &.progress::before {
          background-color: var(--warning);
        }
      }
    }
  }
  .create-poll-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
  }
`;

interface PollsListProps {
  pollId?: string;
  setCreatePollModal: any;
  setThread?: any;
  thread: any;
}

export default function PollsList({ setCreatePollModal, pollId, setThread, thread }: PollsListProps) {
  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);
  // const { user } = useSelector((state: RootState) => state.user);
  const { id } = useParams()

  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const pollThread = polls.filter((poll: any) => poll.id === pollId)[0];
    setThread?.(pollThread);
  }, [polls, pollId]);

  const handleVote = async (callbackData: any, pollId: string) => {
    try {
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
        toast.success("You have now voted", { toastId: 8 });

        return voteOnPoll;
      }
    } catch (error) {
      toast.error("Error when voting", { toastId: 9 });      
    }
  };

  // Get all of the channels polls.
  const getChannelPolls = async() => {
    if (!selectedChannel) return;
    try {
      const polls = await apiService.getChannelPolls(selectedChannel.id);
      setPolls(polls);
    } catch (error) {
     toast.error('Error fetching polls', {toastId: 10}) 
    }
  }

  const handlePollAdded = ({detail}: {detail: Poll}) => {
    getChannelPolls();
  }
  
  useEffect(() => {
    subscribeToEvent(EventType.ADDED_POLL, handlePollAdded)

    return () => {
      unSubscribeToEvent(EventType.ADDED_POLL, handlePollAdded);
    }
  }, []);

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
    <PollsStyled className="w-100 overflow-auto f-column text-secondary">
        {polls.length ? 
          thread ? (
            <PollItem
              handleVote={handleVote}
              isFirstItem
              isThread
              poll={thread}
              sideId={id || ''}
            />
          ) :
            polls.map((poll: Poll, i) => (
              <PollItem
                handleVote={handleVote}
                isFirstItem={i === 0}
                isThread={false}
                poll={poll}
                sideId={id || ''}
              />
            )) : (
                <EmptyList selectedChannel={selectedChannel} />
              )}

      {!thread && (
        <div
          className="w-100"
          style={{ padding: "11px", marginTop: "auto" }}
        >
          <Button
            classes="create-poll-btn"
            width="174px"
            onClick={() => setCreatePollModal(true)}
          >
            <svg className="mr-2" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.66699 13.1666H9.33366V9.83329H12.667V8.16663H9.33366V4.83329H7.66699V8.16663H4.33366V9.83329H7.66699V13.1666ZM8.50033 17.3333C7.34755 17.3333 6.26421 17.1144 5.25033 16.6766C4.23644 16.2394 3.35449 15.6458 2.60449 14.8958C1.85449 14.1458 1.26088 13.2638 0.823659 12.25C0.385881 11.2361 0.166992 10.1527 0.166992 8.99996C0.166992 7.84718 0.385881 6.76385 0.823659 5.74996C1.26088 4.73607 1.85449 3.85413 2.60449 3.10413C3.35449 2.35413 4.23644 1.76024 5.25033 1.32246C6.26421 0.885237 7.34755 0.666626 8.50033 0.666626C9.6531 0.666626 10.7364 0.885237 11.7503 1.32246C12.7642 1.76024 13.6462 2.35413 14.3962 3.10413C15.1462 3.85413 15.7398 4.73607 16.177 5.74996C16.6148 6.76385 16.8337 7.84718 16.8337 8.99996C16.8337 10.1527 16.6148 11.2361 16.177 12.25C15.7398 13.2638 15.1462 14.1458 14.3962 14.8958C13.6462 15.6458 12.7642 16.2394 11.7503 16.6766C10.7364 17.1144 9.6531 17.3333 8.50033 17.3333Z" fill="white" />
            </svg>
            Create Poll
          </Button>
        </div>
      )}
    </PollsStyled>
  );
}