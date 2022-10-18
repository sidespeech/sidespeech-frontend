import React, { useEffect, useState } from "react";

import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store/app.store";
import { Outlet } from "react-router-dom";

// Components
import GlobalSettingsMenu from "./components/GeneralSettings/ContainerLeft/Index";
import UserColonies from "./components/UserColonies/UserColonies";
import SidesList from "./components/SidesList";

// Images
import logoSmall from "./assets/logo.svg";

import io from "socket.io-client";
import websocketService from "./services/websocket.service";

// Redux
import { connect, fetchUserDatas } from "./redux/Slices/UserDataSlice";

// API's
import { apiService } from "./services/api.service";

const socket = io("http://localhost:3000/");
function App() {
  const userData = useSelector((state: RootState) => state.user);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);
  const dispatch = useDispatch();
  let globalSettings = false;

  // Conditional for checking if we are the settings page as we need a different sidebar.
  if(window.location.pathname == '/settings') {
     globalSettings = true;
  }
  
  useEffect(() => {
    websocketService.connectToWebSocket();
    async function getUser(account: string) {
      const user = await apiService.getUserByAddress(account);
      dispatch(connect({ account: account, user: user }));
      dispatch(fetchUserDatas(account));
    }
    const account = localStorage.getItem("userAccount");
    if (account) {
      getUser(account);
    }
    return () => {
      websocketService.deconnectWebsocket();
    };
  }, []);

  return (
    <div className="main-container relative">
        <div className="left-container">
            {!globalSettings
            ? <div>
                <div>{userData.user && <UserColonies />}</div>
                <div>
                  <img width={45} height={45} src={logoSmall} alt="logo-small" />
                </div>
              </div>
            : <GlobalSettingsMenu />
          }
          
        </div>
      <div className="middle-container f-column align-center justify-center">
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default App;
