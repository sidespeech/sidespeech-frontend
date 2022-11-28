import React, { useEffect, useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store/app.store";
import { Outlet } from "react-router-dom";

// Components
import GeneralSettingsMenu from "./components/GeneralSettings/ContainerLeft/Index";
// import UserColonies from "./components/UserColonies/UserSides";
// import SidesList from "./components/SidesList";

// Images

import websocketService from "./services/websocket.service";

// Redux
import { connect, fetchUserDatas } from "./redux/Slices/UserDataSlice";

// API's
import { apiService } from "./services/api.service";
import { getRandomId } from "./helpers/utilities";
import MobileMenu from "./components/ui-components/MobileMenu";
import DesktopMenu from "./components/ui-components/DesktopMenu";

export interface GeneralSettingsAccountContext {
  isSettingsMobileMenuOpen?: boolean;
  setIsSettingsMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function App() {
  const [isSettingsMobileMenuOpen, setIsSettingsMobileMenuOpen] = useState<boolean>(false);
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
    content =   <div className='w-100'>
                  <Outlet />
                </div>;
  } else if (generalSettings) {
    content = <div style={{ display: "flex", width: "100%"}}>
                <GeneralSettingsMenu 
                  isSettingsMobileMenuOpen={isSettingsMobileMenuOpen} 
                  setIsSettingsMobileMenuOpen={setIsSettingsMobileMenuOpen}
                />
                <Outlet 
                  context={{
                    isSettingsMobileMenuOpen,
                    setIsSettingsMobileMenuOpen
                  }}
                />

                <div className="mobile-bottom-menu">
                  <MobileMenu />
                </div>
              </div>;
  } else {
    content = <div className="containers-wrapper">
                <div className="left-container">
                  <DesktopMenu userData={userData} />
                </div>
                <div className="middle-container">
                  <Outlet />
                </div>

                <div className="mobile-bottom-menu">
                  <MobileMenu />
                </div>
              </div>;
  }

  return <div className="main-container relative">{content}</div>;
}

export function useGeneralSettingsContext() {
  return useOutletContext<GeneralSettingsAccountContext>();
}

export default App;