import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { disconnect } from "../../../redux/Slices/UserDataSlice";
import styled from "styled-components";
import { useNavigate } from "react-router";

// Icons
import logoComplete from "./../../../assets/logoComplete.svg";
import settingsTitle from "./../../../assets/settings-title.svg";
import accountMenuIcon from "./../../../assets/account-menu.svg";
import settingsMenuIcon from "./../../../assets/settings-menu.svg";
import themesMenuIcon from "./../../../assets/themes-menu.svg";
import privacyShieldIcon from "../../../assets/privacy-shield.svg";
import termsPaperIcon from "../../../assets/terms-paper.svg";
import disconnectMenuIcon from "./../../../assets/disconnect-menu.svg";
import { Link } from "react-router-dom";

export default function IndexView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(disconnect());
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div className="globalSettingsMenu">
        <div className="title">
          <img width={45} height={45} src={settingsTitle} alt="title-logo" />
          <h1>General Settings</h1>
        </div>
        <div className="tile cursor-pointer">
          <div className="inner">
            <a href="/general-settings">
              <img
                width={45}
                height={45}
                src={accountMenuIcon}
                alt="logo-small"
              />
              <p>Account</p>
            </a>
          </div>
        </div>
        <div className="tile cursor-pointer">
          <div className="inner">
            <a href="/general-settings">
              <img
                width={45}
                height={45}
                src={settingsMenuIcon}
                alt="logo-small"
              />
              <p>Settings</p>
            </a>
          </div>
        </div>
        <div className="tile cursor-pointer">
          <div className="inner">
            <a href="/general-settings/themes">
              <img width={45} height={45} src={themesMenuIcon} alt="logo-small" />
              <p>Themes</p>
            </a>
          </div>
        </div>
        <div className="tile cursor-pointer">
          <div className="inner">
            <a onClick={logout}>
              <img
                width={45}
                height={45}
                src={disconnectMenuIcon}
                alt="logo-small"
              />
              Disconnect
            </a>
          </div>
        </div>

        <div className="smaller-links">
            <div className="cursor-pointer">
                <a href="/general-settings/privacy">
                  <img
                    width={22}
                    height={22}
                    src={privacyShieldIcon}
                    alt="logo-small"
                  />
                  Privacy Policy
                </a>
            </div>
            <div className="cursor-pointer">
                <a href="/general-settings/terms">
                  <img
                    width={22}
                    height={22}
                    src={termsPaperIcon}
                    alt="logo-small"
                  />
                  Terms and Conditions
                </a>
            </div>
        </div>
      </div>
      <div className="nav-footer text-left">
        <Link to={"/"} className="mt-auto text-main">
          <i className="fa-solid fa-arrow-left mr-2"></i> Back
        </Link>
        <img 
          src={logoComplete}
          className="logoComplete"
          width={174}
          height={44}
        />
      </div>
    </>
  );
}
