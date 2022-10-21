import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router";

// Icons
import settingsTitle from "./../../../assets/settings-title.svg";
import accountMenuIcon from "./../../../assets/account-menu.svg";
import settingsMenuIcon from "./../../../assets/settings-menu.svg";
import themesMenuIcon from "./../../../assets/themes-menu.svg";
import privacyPolicyMenuIcon from "./../../../assets/privacy-policy-menu.svg";
import termsMenuIcon from "./../../../assets/terms-menu.svg";
import disconnectMenuIcon from "./../../../assets/disconnect-menu.svg";

export default function IndexView() {

  const navigate = useNavigate();

  return (
    <>
      <div className="globalSettingsMenu">
        <div className="title">
            <img width={45} height={45} src={settingsTitle} alt="title-logo" />
            <h1>General Settings</h1>
        </div>
        <div className="tile active">
          <div className="inner">
            <img width={45} height={45} src={accountMenuIcon} alt="logo-small" />
            <p>Account</p>
            </div>
          </div>
        <div className="tile">
          <div className="inner">
            <img width={45} height={45} src={settingsMenuIcon} alt="logo-small" />
            <p>Settings</p>
          </div>
        </div>
        <div className="tile">
          <div className="inner">
            <img width={45} height={45} src={themesMenuIcon} alt="logo-small" />
            <p>Themes</p>
          </div>
        </div>
        <div className="tile">
          <div className="inner">
            <img width={45} height={45} src={privacyPolicyMenuIcon} alt="logo-small" />
            <p>Privacy Policy</p>
          </div>
        </div>
        <div className="tile">
          <div className="inner">
            <img width={45} height={45} src={termsMenuIcon} alt="logo-small" />
            <p>Terms</p>
          </div>
        </div>
        <div className="tile">
          <div className="inner">
            <a onClick={window.ethereum.disconnect}>
              <img width={45} height={45} src={disconnectMenuIcon} alt="logo-small" />
              Disconnect
            </a>
          </div>
        </div>
      </div>
    </>
  );
}