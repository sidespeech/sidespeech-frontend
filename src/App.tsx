import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store/app.store";
import { Outlet } from "react-router-dom";

// Components
import GeneralSettingsMenu from "./components/GeneralSettings/ContainerLeft/Index";
// import SidesList from "./components/SidesList";

// Images

import websocketService from "./services/websocket-services/websocket.service";

// Redux
import { connect, fetchUserDatas } from "./redux/Slices/UserDataSlice";

// API's
import { getRandomId } from "./helpers/utilities";
import MobileMenu from "./components/ui-components/MobileMenu";
import DesktopMenu from "./components/ui-components/DesktopMenu";
import userService from "./services/api-services/user.service";
import _ from "lodash";

function App() {
  const userData: any = useSelector((state: RootState) => state.user);

  const location = useLocation();
  const dispatch = useDispatch();

  let account =
    localStorage.getItem("userAccount") &&
    localStorage.getItem("jwtToken") &&
    window.ethereum.selectedAddress
      ? window.ethereum.selectedAddress
      : null;
  let onBoarding = false;
  let generalSettings = false;
  let accountStatus = false;
  let content;

  useEffect(() => {
    websocketService.connectToWebSocket();

    async function getUser(account: string) {
      try {
        const user = await userService.getUserByAddress(account);
        dispatch(connect({ account: account, user: user }));
        dispatch(fetchUserDatas(account));
        accountStatus = true;
      } catch (error) {
        console.error(error);
        toast.error("Ooops! Something went wrong fetching your account data", {
          toastId: getRandomId(),
        });
        accountStatus = false;
      }
    }

    if (!!window.ethereum?.selectedAddress) {
      account = window.ethereum.selectedAddress;
    }

    if (account) {
      console.log("has connected account");
      getUser(account);
    }

    // This is needed because MetaMask doesn't trigger a callback if somebody manually disconnects.
    const interval = setInterval(() => {
      // Need to check if they visit any route and they aren't connected it sends then back to the login screen.
      if (
        window.location.pathname !== "/" &&
        !window.ethereum.selectedAddress
      ) {
        window.location.href = "/";
        localStorage.removeItem("userAccount");
        localStorage.removeItem("jwtToken");
      }
    }, 2500);

    return () => {
      clearInterval(interval);
      websocketService.deconnectWebsocket();
    };
  }, []);

  if (location.pathname.indexOf("/onboarding") > -1) {
    onBoarding = true;
  }
  if (location.pathname.indexOf("/general-settings") > -1) {
    generalSettings = true;
  }

  if (account) {
    if (generalSettings) {
      content = (
        <div style={{ display: "flex", width: "100%" }}>
          <div className="left-container global">
            <GeneralSettingsMenu />
          </div>
          <div className="general-settings">
            <Outlet></Outlet>
          </div>
          <div className="mobile-bottom-menu">
            <MobileMenu />
          </div>
        </div>
      );
    } else if (onBoarding) {
      content = (
        <div
          className={`${
            onBoarding ? "onboarding" : ""
          } middle-container f-column align-center `}
          style={{ width: "100%" }}
        >
          <Outlet></Outlet>
        </div>
      );
    } else {
      content = (
        <div className="containers-wrapper">
          <div className="left-container">
            <DesktopMenu userData={userData} />
          </div>
          <div className="middle-container">
            <Outlet></Outlet>
          </div>
          <div className="mobile-bottom-menu">
            <MobileMenu />
          </div>
        </div>
      );
    }
  } else {
    content = (
      <div
        className={`middle-container f-column align-center login`}
        style={{ width: "100%" }}
      >
        <Outlet></Outlet>
      </div>
    );
  }

  return <div className="main-container relative">{content}</div>;
}

export default App;
