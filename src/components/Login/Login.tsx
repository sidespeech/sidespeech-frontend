// Default Imports
import React, { useEffect, useState } from "react";
import { useNavigate, redirect } from "react-router-dom";

import { toast } from "react-toastify";

// Redux Slices
import {
  fetchUserDatas,
  disconnect,
  connect,
  addRoomToProfile,
} from "../../redux/Slices/UserDataSlice";

// Modals
import { Profile } from "../../models/Profile";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/app.store";

// Images
import logoSmall from "../../assets/logo.svg";
import walletIcon from "../../assets/wallet-icon.svg";

// Web3 Imports
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

// API / Socket Services
import { apiService } from "../../services/api.service";
import websocketService from "../../services/websocket.service";

// Stylings
import styled from "styled-components";
import Button from "../ui-components/Button";

export const SeparatorVertical = styled.div`
  min-height: 415px;
  border-right: 1px solid var(--bg-secondary-light);
  margin: 0px 42px;
`;

export default function Login() {
  // Setup constants for dispatch, navigate and selector methods
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redirection = useSelector((state: RootState) => state.redirect);

  function ConnectWalletArea() {
    // This is the all of the providers that are needed...
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "b49e48dbbec944eea653e7a44ca67500",
        },
      },
    };

    // Setup the web3 modal...
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    // Method for wallet connection...
    const connectWallet = async () => {
      try {
        // Open the connector
        const provider = await web3Modal.connect();

        // Set the provider.
        const library = new ethers.providers.Web3Provider(provider);

        // Grab the accounts.
        const accounts = await library.listAccounts();

        const existingUser = await apiService.findExistingWallet(accounts[0]);

        // Create a signature variable.
        let signature;

        // If there are any accounts connected then send them to the API.
        if (accounts) {
          // If there isn't an existing user then ensure that he signs the signature.
          if (existingUser == undefined) {
            // Get Signer
            const signer = library.getSigner();

            // Create the signer message
            const signerMessage = "sidespeech";

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
              return false;
            }
          }
        }

        // Send the wallet to the api service.
        const user = await apiService.walletConnection(accounts, signature);

        // Check if the existing user still needs to onboard or not.
        if (existingUser == undefined) {
          // Redirect the user to the onboarding area.
          navigate("/onboarding");
        } else {
          // Redirect the user to the general settings page.
          navigate("/");
        }

        // Dispatch the account that is connected to the redux slice.
        dispatch(connect({ account: accounts[0], user: user }));
        dispatch(fetchUserDatas(accounts[0]));

        // Set a local storage of the account
        localStorage.setItem("userAccount", accounts[0]);
        localStorage.setItem("jwtToken", user.token);

        // Listen for accounts being disconnected - this only seems to work for WalletConnect.
        provider.on("disconnect", handleDisconnect);
      } catch (err: any) {
        console.log("error", err, " message", err.message);
        if (
          typeof err !== "undefined" &&
          typeof err.message !== "undefined" &&
          err.message.includes("User Rejected")
        ) {
          toast.error("You rejected the request", {
            toastId: 6,
          });
        } else if (
          (typeof err === "string" || err instanceof String) &&
          err.includes("Modal closed by user")
        ) {
          toast.error("You closed the modal", {
            toastId: 6,
          });
        } else {
          toast.error("Something went wrong.", {
            toastId: 6,
          });
        }
      }
    };

    // Method for handling the disconnection.
    const handleDisconnect = async () => {
      // Clear all the local storage.
      localStorage.clear();

      // Reload the page to ensure logged out.
      window.location.reload();
    };

    return (
      <div
        style={{ gap: 5 }}
        className="connection-container f-column align-center justify-start"
      >
        <h2 style={{color: "white", marginBottom: 30}}>Connect your wallet to take part in a slide</h2>
        <Button 
          classes="fw-700 size-18"  
          width="170px"
          onClick={() => connectWallet()}
        >
          <img 
            src={walletIcon} 
            style={{marginRight: 10}}
            alt="Wallet Icon" 
          />
          Connect wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="f-column align-center my-auto">
      <div style={{ marginBottom: 30, textAlign: "center" }}>
        <img src={logoSmall} alt="SideSpeech-logo" />
        <h1 style={{marginTop: 0}}>SideSpeech</h1>
      </div>
      <div className="flex align-end">
        <ConnectWalletArea />
      </div>
    </div>
  );
}
