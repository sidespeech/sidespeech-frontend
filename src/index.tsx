import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import { store } from "./redux/store/app.store";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultView from "./components/Login/DefaultView";
import CurrentColony from "./components/CurrentColony/CurrentSide";
import "react-leaf-polls/dist/index.css";
import "react-toastify/dist/ReactToastify.css";
import "./override.css";
import "./index.css";
import CreateSideSpeechProfile from "./components/Login/CreateSideSpeechProfile";
import Settings from "./components/CurrentColony/settings/Settings";
import NewSide from "./components/new-side/new-side";

// General Settings
import GeneralSettings from "./components/GeneralSettings/DefaultView";
import GeneralSettingsAccount from "./components/GeneralSettings/Account/GeneralSettingsAccount";

import UserProfile from "./components/CurrentColony/UserProfile/UserProfile";

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<DefaultView />} />
              <Route path="/my-sides" element={<DefaultView />} />
              <Route path="/invitations" element={<DefaultView />} />
              <Route path="/search" element={<DefaultView />} />
              <Route
                path="/CreateSideSpeechProfile"
                element={<CreateSideSpeechProfile />}
              />
              <Route path="new-side" element={<NewSide />} />
              <Route path=":id" element={<CurrentColony />}>
                <Route path="profile/:id" element={<UserProfile />} />
              </Route>
              <Route path=":id/settings" element={<Settings />} />
              <Route
                path="/general-settings"
                element={<GeneralSettingsAccount />}
              />
              <Route
                path="/general-settings/:page"
                element={<GeneralSettings />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
