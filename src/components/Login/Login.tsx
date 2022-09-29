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
import { useNavigate } from "react-router-dom";
import { redirect } from "../../redux/Slices/RedirectSlice";
import logo from "../../assets/logoComplete.svg";


import WalletConnectProvider from '@walletconnect/web3-provider';


export const SeparatorVertical = styled.div`
  min-height: 415px;
  border-right: 1px solid var(--bg-secondary-light);
  margin: 0px 42px;
`;

export function MetaMaskArea() {

  // Setting up the states
  // const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false);
  const [ethereumAccount, setEthereumAccount] = useState<string | null>(null);
  
  // Handle the connecting a metamask wallet.
  async function connectMetamaskWallet(): Promise<void> {

    //to get around type checking
    (window as any).ethereum
      .request({
          method: "eth_requestAccounts",
      })
      .then((accounts : string[]) => {
        setEthereumAccount(accounts[0]);
      })
      .catch((error: any) => {
          alert(`Something went wrong: ${error}`);
      });
  }

  return (
    <div
      style={{ gap: 40 }}
      className="connection-container f-column align-center justify-start"
    >
      <img src={metamaskLogo} alt="metamask" style={{ marginTop: 58 }} />
      <Button classes="fw-700 size-18" onClick={() => connectMetamaskWallet()}>
        Connect to Metamask
      </Button>
    </div>
  )

}



export function WalletConnectArea() {

  // Create WalletConnect Provider
  const provider = new WalletConnectProvider({
    infuraId: "b49e48dbbec944eea653e7a44ca67500",
  });

  // The action for popup modal.
  async function walletConnect(): Promise<void> {
    await provider.enable();

    const message = hexlify(toUtf8Bytes(messageToSign))

    // provider.connector.signPersonalMessage.

    provider.on("accountsChanged", (chainId: number) => {
      alert(chainId);
    });

    // When they disconnect the wallet....
    provider.on("disconnect", (code: number, reason: string) => {
      alert(code);
    });
    
  }

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
      <Button classes="fw-700 size-18" onClick={() => walletConnect()}>
        Use WalletConnect
      </Button>
    </div>
  )

}

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redirection = useSelector((state: RootState) => state.redirect);

  return (
    <div className="f-column align-center">
      <div style={{ marginBottom: 26 }}>
        <img src={logo} alt="colony-logo" />
      </div>
      <div className="flex align-end">
        <MetaMaskArea />
        <SeparatorVertical />
        <WalletConnectArea />
      </div>
    </div>
  );
}
