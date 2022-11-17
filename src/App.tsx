import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store/app.store";
import { Outlet } from "react-router-dom";

// Components
import GeneralSettingsMenu from "./components/GeneralSettings/ContainerLeft/Index";
import UserColonies from "./components/UserColonies/UserSides";
// import SidesList from "./components/SidesList";

// Images
import logoSmall from "./assets/logo.svg";

import websocketService from "./services/websocket.service";

// Redux
import { connect, fetchUserDatas } from "./redux/Slices/UserDataSlice";

// API's
import { apiService } from "./services/api.service";
import { getRandomId } from "./helpers/utilities";

function App() {
  const userData: any = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  let onBoarding = false;
  let generalSettings = false;
  let content;

  useEffect(() => {
    let account = localStorage.getItem("userAccount") || null;

    websocketService.connectToWebSocket();
    async function getUser(account: string) {
      try {
        const user = await apiService.getUserByAddress(account);
        dispatch(connect({ account: account, user: user }));
        dispatch(fetchUserDatas(account));
      } catch (error) {
       console.error(error);
       toast.error('Ooops! Something went wrong fetching your account data', { toastId: getRandomId() });
      }
    }
    if (!!window.ethereum?.selectedAddress) {
      account = window.ethereum.selectedAddress;
    }

    if (account) {
      getUser(account);
    }
    return () => {
      websocketService.deconnectWebsocket();
    };
  }, []);


  if (location.pathname.indexOf("/onboarding") > -1) {
    onBoarding = true;
  }
  if (location.pathname.indexOf("/general-settings") > -1) {
    generalSettings = true;
  }
  
  if (onBoarding) {
    content =   <div className="middle-container f-column align-center onboarding" style={{width: "100%"}}>
                  <Outlet></Outlet>
                </div>;
  } else if (generalSettings) {
    content = <div style={{ display: "flex", width: "100%"}}>
                <div className="left-container global">
                  <GeneralSettingsMenu />
                </div>
                <div className="general-settings">
                  <Outlet></Outlet>
                </div>
              </div>;
  } else {
    content = <div style={{ display: "flex", width: "100%"}}>
              <div className="left-container">
                <div>
                  <Link to="/">
                      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.4316 6.06323V0.0632324H18.4316V6.06323H10.4316ZM0.431641 10.0632V0.0632324H8.43164V10.0632H0.431641ZM10.4316 18.0632V8.06323H18.4316V18.0632H10.4316ZM0.431641 18.0632V12.0632H8.43164V18.0632H0.431641Z" fill="#705CE9"/>
                      </svg>
                  </Link>  
                  {userData.user && <UserColonies />}
                </div>
                <Link to={"/general-settings"}>
                  {" "}
                  <div>
                    <img width={45} height={45} src={logoSmall} alt="logo-small" />
                  </div>
                </Link>
              </div>
              <div className="middle-container f-column align-center justify-center">
                <Outlet></Outlet>
              </div>
            </div>;
  }

  return <div className="main-container relative">{content}</div>;
}

export default App;