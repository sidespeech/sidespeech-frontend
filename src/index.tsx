import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import { store } from "./redux/store/app.store";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultView from "./components/Login/DefaultView";
import CurrentColony from "./components/CurrentColony/CurrentColony";
import "react-leaf-polls/dist/index.css";
import "react-toastify/dist/ReactToastify.css";
import "./override.css";
import "./index.css";
import "semantic-ui-css/semantic.min.css";
import UserProfileModal from "./components/Modals/UserProfileModal";
import CreateSideSpeechProfile from "./components/Login/CreateSideSpeechProfile";
import ViewUserProfile from "./components/Modals/ViewUserProfile";
import SettingsAdmin from "./components/CurrentColony/settings/settings";

// General Settings
import GeneralSettings from "./components/GeneralSettings/DefaultView";
import GeneralSettingsAccount from "./components/GeneralSettings/Account/Account";

import { MoralisProvider } from "react-moralis";
import UserProfile from "./components/CurrentColony/UserProfile/UserProfile";
import UserSettings from "./components/GeneralSettings/DefaultView";

ReactDOM.render(
  <Provider store={store}>
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover
      toastStyle={{
        background: "var(--bg-secondary-dark)",
        color: "white",
      }}
    />
    <React.StrictMode>
      <MoralisProvider
        serverUrl="https://nyntqrq0zh4z.usemoralis.com:2053/server"
        appId="UUQ8TnQNeOid3DJ5blkab3Jv2K9nsXDpFTasNs3f"
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<DefaultView />} />
              <Route
                path="/CreateSideSpeechProfile"
                element={<CreateSideSpeechProfile />}
              />
              <Route path="/ViewUserProfile" element={<ViewUserProfile />} />

              <Route path="/UserProfileModal" element={<UserProfileModal />} />

              <Route path="/general-settings" element={<GeneralSettingsAccount />} />
              <Route path="/general-settings/:page" element={<GeneralSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MoralisProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
