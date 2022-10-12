import React, { useEffect, useState } from "react";

import "./App.css";
import { useDispatch, useSelector } from "react-redux";

import settings from "./assets/settings.svg";

import { RootState } from "./redux/store/app.store";
import { Outlet } from "react-router-dom";
import UserColonies from "./components/UserColonies/UserColonies";

import logoSmall from "./assets/logo.svg";

import io from "socket.io-client";
import websocketService from "./services/websocket.service";
import { connect } from "./redux/Slices/UserDataSlice";
import { apiService } from "./services/api.service";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

const socket = io("http://localhost:3000/");
function App() {
  const userData = useSelector((state: RootState) => state.user);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { Moralis, isInitialized, isInitializing } = useMoralis();
  const Web3Api = useMoralisWeb3Api();

  const fetchSearchNFTs = async () => {
    const options = { q: "Pancake", chain: "bsc", filter: "name" };
    const NFTs = await Web3Api.token.searchNFTs(options);
    console.log(NFTs);
  };
  useEffect(() => {
    websocketService.connectToWebScoket();
    async function getUser(account: string) {
      const user = await apiService.getUserByAddress(account);
      dispatch(connect({ account: account, user: user }));
    }
    const account = localStorage.getItem("userAccount");
    if (account) {
      getUser(account);
    }
    return () => {
      websocketService.deconnectWebsocket();
    };
  }, []);

  useEffect(() => {
    if (isInitialized) fetchSearchNFTs();
  }, [isInitializing, isInitialized]);

  return (
    <div className="main-container relative">
      <div className="left-container">
        <div>{userData.user && <UserColonies />}</div>
        <div>
          <img width={45} height={45} src={logoSmall} alt="logo-small" />
        </div>
      </div>
      <div className="middle-container f-column align-center justify-center">
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default App;
