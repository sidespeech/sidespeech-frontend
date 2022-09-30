import React, { useEffect, useState } from "react";

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

import logoSmall from "./assets/logo.svg";
import UserProfileModal from "./components/Modals/UserProfileModal";
import CreateSideSpeechProfile from "./components/Login/CreateSideSpeechProfile";
import ViewUserProfile from "./components/Modals/ViewUserProfile";
import Randoms from "./components/Login/Randoms";
import io from "socket.io-client";
import CurrentColony from "./components/CurrentColony/CurrentColony";

const socket = io("http://localhost:3000/");
function App() {
  const userData = useSelector((state: RootState) => state.user);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      setIsConnected(false);
    });

    socket.on("message", async (data) => {
      console.log(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  const blue = () => {
    socket.emit("sendMessage", {
      message: "hello",
      room: "blue",
    });
  };
  const red = () => {
    socket.emit("sendMessage", {
      message: "hello",
      room: "red",
    });
  };
  const yellow = () => {
    socket.emit("sendMessage", {
      message: "hello",
      room: "yellow",
    });
  };
  const connect1 = () => {
    socket.emit("login", {
      name: "bernard",
      rooms: ["blue", "red", "yellow"],
    });
  };
  const connect2 = () => {
    socket.emit("login", {
      name: "patrick",
      rooms: ["blue", "yellow"],
    });
  };
  const connect3 = () => {
    socket.emit("login", {
      name: "george",
      rooms: ["red", "yellow"],
    });
  };

  return (
    <div className="main-container relative">
      <button onClick={blue}>Blue room</button>
      <button onClick={red}>Red room</button>
      <button onClick={yellow}>yellow room</button>
      <button onClick={connect1}>bernard</button>
      <button onClick={connect2}>patrick</button>
      <button onClick={connect3}>george</button>
      <div className="left-container">
        <div>{userData.user && <UserColonies />}</div>
        <div>
          <img width={45} height={45} src={logoSmall} alt="logo-small" />
        </div>
      </div>
      <div className="middle-container f-column align-center justify-center">
        <Outlet></Outlet>
        <Routes>
          <Route
            path="/CreateSideSpeechProfile"
            element={<CreateSideSpeechProfile />}
          />
          <Route path="/CurrentColony" element={<CurrentColony />} />
          <Route path="/UserProfileModal" element={<UserProfileModal />} />
          <Route path="/Randoms" element={<Randoms />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
