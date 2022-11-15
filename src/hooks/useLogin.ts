import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Web3Modal from "web3modal";
import { connect, fetchUserDatas } from "../redux/Slices/UserDataSlice";
import { apiService } from "../services/api.service";

export default function useLogin() {
  const dispatch = useDispatch();

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
        const signerAddr = ethers.utils.verifyMessage(signerMessage, signature);

        // Check if the signer address is the same as the connected address.
        if (signerAddr !== address) {
          return false;
        }
      }

      // Send the wallet to the api service.
      const user = await apiService.walletConnection(accounts, signature);


      // Dispatch the account that is connected to the redux slice.
      dispatch(connect({ account: accounts[0], user: user }));
      dispatch(fetchUserDatas(accounts[0]));

      // Set a local storage of the account
      localStorage.setItem("userAccount", accounts[0]);

      localStorage.setItem("jwtToken", user.token);
    }

    // Listen for accounts being disconnected - this only seems to work for WalletConnect.
    provider.on("disconnect", handleDisconnect);
  };
  const handleDisconnect = async () => {
    // Clear all the local storage.
    localStorage.clear();

    // Reload the page to ensure logged out.
    window.location.reload();
  };
  return { connectWallet };
}
