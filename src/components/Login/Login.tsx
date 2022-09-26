import React, { useEffect } from "react";
import styled from "styled-components";
import Button from "../ui-components/Button";

import metamaskLogo from "../../assets/metamask.svg";
import walletConnectLogo from "../../assets/walletconnect.svg";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDatas,
  disconnect,
  connect,
} from "../../redux/Slices/UserDataSlice";
import { RootState } from "../../redux/store/app.store";
import { useNavigate } from "react-router-dom";
import { redirect } from "../../redux/Slices/RedirectSlice";
import logo from "../../assets/logoComplete.svg";

export const SeparatorVertical = styled.div`
  min-height: 415px;
  border-right: 1px solid var(--bg-secondary-light);
  margin: 0px 42px;
`;

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redirection = useSelector((state: RootState) => state.redirect);

  return (
    <div className="f-column align-center">
      <div style={{ marginBottom: 26 }}>
        <img src={logo} alt="colony-logo" />
      </div>
      <div className="flex align-end">
        <div
          style={{ gap: 40 }}
          className="connection-container f-column align-center justify-start"
        >
          <img src={metamaskLogo} alt="metamask" style={{ marginTop: 58 }} />
          <Button classes="fw-700 size-18" onClick={() => console.log(15)}>
            Connect to Metamask
          </Button>
        </div>
        <SeparatorVertical />
        <div
          style={{ gap: 50 }}
          className="connection-container f-column align-center justify-start"
        >
          <img
            src={walletConnectLogo}
            alt="wallet connect"
            style={{ marginTop: 89 }}
          />
          <Button classes="fw-700 size-18" onClick={() => console.log(15)}>
            Use WalletConnect
          </Button>
        </div>
      </div>
    </div>
  );
}
