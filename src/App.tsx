import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store/app.store";
import { Outlet } from "react-router-dom";

// Components
import GeneralSettingsMenu from "./components/GeneralSettings/ContainerLeft/Index";

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

const accountInitialState = localStorage.getItem("userAccount") && localStorage.getItem("jwtToken") && window.ethereum.selectedAddress ? window.ethereum.selectedAddress : null;

function App() {
  const [isSettingsMobileMenuOpen, setIsSettingsMobileMenuOpen] = useState<boolean>(false);
  const [account, setAccount] = useState<string>(accountInitialState)
  const [accountStatus, setAccountStatus] = useState<boolean>(false);
  const userData: any = useSelector((state: RootState) => state.user);
  
  const location = useLocation();
  const dispatch = useDispatch();

  const onBoarding = location.pathname.indexOf("/onboarding") > -1;
  let generalSettings = location.pathname.indexOf("/general-settings") > -1;

  useEffect(() => {

    websocketService.connectToWebSocket();
    
    async function getUser(account: string) {
      try {
        const user = await apiService.getUserByAddress(account);
        dispatch(connect({ account: account, user: user }));
        dispatch(fetchUserDatas(account));
        setAccountStatus(true);
      } catch (error) {
       console.error(error);
       toast.error('Ooops! Something went wrong fetching your account data', { toastId: getRandomId() });
       setAccountStatus(false);
      }
    }

    if (!!window.ethereum?.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
    }
    
    if (account) {
      console.log('has connected account');
      getUser(account);
    }

    // This is needed because MetaMask doesn't trigger a callback if somebody manually disconnects.
    const interval = setInterval(() => {

      // Need to check if they visit any route and they aren't connected it sends then back to the login screen.
      if(window.location.pathname !== '/' && !window.ethereum.selectedAddress) {
        window.location.href = '/';
        localStorage.removeItem('userAccount');
        localStorage.removeItem('jwtToken');
      } 
      
    }, 2500);

    return () => {
      clearInterval(interval)
      websocketService.deconnectWebsocket();
    };
  }, []);
  
  return (
    <div className="main-container relative">
      {onBoarding ? (
          <div 
            className={`${onBoarding ? "onboarding" : ""} middle-container f-column align-center `}
            style={{width: "100%"}}
            >
            <Outlet></Outlet>
          </div>
        ) : generalSettings ? (
              <div style={{ display: "flex", width: "100%"}}>
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
              </div>
            ) : (
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
            )
      }
    </div>
  );
}

export function useGeneralSettingsContext() {
  return useOutletContext<GeneralSettingsAccountContext>();
}

export default App;