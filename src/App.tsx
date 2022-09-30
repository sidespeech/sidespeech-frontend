import React, { useEffect } from "react";

import "./App.css";
import { useSelector } from "react-redux";

import settings from "./assets/settings.svg";

import { RootState } from "./redux/store/app.store";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Outlet,
} from "react-router-dom";
import UserColonies from "./components/UserColonies/UserColonies";

import signalrService from "./service/signalr.service";
import logoSmall from "./assets/logo.svg";

function App() {
  const userData = useSelector((state: RootState) => state.user);

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
