import React, { useEffect } from "react";

import "./App.css";
import { useSelector } from "react-redux";

import settings from "./assets/settings.svg";

import { RootState } from "./redux/store/app.store";
import { Outlet } from "react-router-dom";
import UserColonies from "./components/UserColonies/UserColonies";
import moralisService from "./service/moralis.service";
import signalrService from "./service/signalr.service";
import logoSmall from "./assets/logo.svg";
import UserProfileModal from "./components/Modals/UserProfileModal";
import { useMoralis } from "react-moralis";

function App() {
  const userData = useSelector((state: RootState) => state.user);

  const { isInitialized, Moralis } = useMoralis();

  useEffect(() => {

    signalrService.connectToSignalR();
    async function initPlugins() {
      const user = Moralis.User.current();
      console.log(user);
      if (isInitialized) {
        await Moralis.initPlugins();
      }
    }

    initPlugins();
  }, [isInitialized]);

  return (
    <div className="main-container relative">
      <div className="left-container">
        <div>{userData.user && <UserColonies />}</div>
        <div>
          <img width={45} height={45} src={logoSmall} alt="logo-small" />
        </div>
      </div>
      <div className="middle-container f-column align-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
