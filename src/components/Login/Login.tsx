import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../ui-components/Button";

import metamaskLogo from "../../assets/metamask.svg";
import walletConnectLogo from "../../assets/walletconnect.svg";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDatas,
  disconnect,
  connect,
} from "../../redux/Slices/UserDataSlice";
import { RootState } from "../../redux/store/app.store";
import { useNavigate, redirect } from "react-router-dom";
// import { redirect } from "../../redux/Slices/RedirectSlice";
import logo from "../../assets/logoComplete.svg";

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import { apiService } from "../../services/api.service";

export const SeparatorVertical = styled.div`
  min-height: 415px;
  border-right: 1px solid var(--bg-secondary-light);
  margin: 0px 42px;
`;

export default function Login() {
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
      cacheProvider: false, // optional
      providerOptions, // required
    });

    // Method for wallet connection...
    const connectWallet = async () => {
      // Open the connector
      const provider = await web3Modal.connect();

      // Set the provider.
      const library = new ethers.providers.Web3Provider(provider);

      // Grab the accounts.
      const accounts = await library.listAccounts();

      const existingUser = await apiService.findExistingWallet(accounts[0]);

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

        // Send the wallet to the api service.
        const user = await apiService.walletConnection(accounts, signature);

        // Redirect the user to the general settings page.
        navigate("/general-settings");

        // Dispatch the account that is connected to the redux slice.
        dispatch(connect({ account: accounts[0], user: user }));
        dispatch(fetchUserDatas(accounts[0]));

        // Set a local storage of the account
        localStorage.setItem("userAccount", accounts[0]);
      }

      // Listen for accounts being disconnected - this only seems to work for WalletConnect.
      provider.on("disconnect", handleDisconnect);
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
        style={{ gap: 50 }}
        className="connection-container f-column align-center justify-start"
      >
        <img
          src={walletConnectLogo}
          alt="wallet connect"
          style={{ marginTop: 89 }}
        />
        <Button classes="fw-700 size-18" onClick={() => connectWallet()}>
          Connect your wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="f-column align-center">
      <div style={{ marginBottom: 26 }}>
        <img src={logo} alt="colony-logo" />
      </div>
      <div className="flex align-end">
        <ConnectWalletArea />
      </div>
      <div
        className="flex justify-between text-secondary size-12 fw-400"
        style={{
          width: "calc(100% - 70px)",
          padding: "0px 13px",
          position: "absolute",
          bottom: 10,
          right: 0,
        }}
      >
        <div className="flex">
          <div>Privacy policy</div>
          <div className="mx-2">|</div>
          <div>Terms and Conditions</div>
        </div>
        <div> © Copyright 2022</div>
      </div>
    </div>
  );
}
