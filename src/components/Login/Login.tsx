import React, { useEffect } from "react";
import styled from "styled-components";
import Button from "../ui-components/Button";

import metamaskLogo from "../../assets/metamask.svg";
import walletConnectLogo from "../../assets/walletconnect.svg";
import { useMoralis } from "react-moralis";
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

  const {
    authenticate,
    isAuthenticated,
    Moralis,
    isAuthenticating,
    user,
    account,
    logout,
  } = useMoralis();

  useEffect(() => {
    const currentUser = Moralis.User.current();
    if (currentUser) {
      dispatch(
        connect({
          user: currentUser,
          account: currentUser.attributes.ethAddress,
        })
      );
      dispatch(fetchUserDatas(currentUser.attributes.ethAddress));
    }
  }, [Moralis.User, dispatch]);

  useEffect(() => {
    if (isAuthenticated && account) {
      dispatch(connect({ user, account }));
      dispatch(fetchUserDatas(account));
      if (redirection.to) {
        navigate(redirection.to);
        dispatch(redirect(null));
      }
    }
  }, [isAuthenticated, user, dispatch, account]);

  const logoutUser = async () => {
    dispatch(disconnect());
    logout();
  };

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Log in to Colony" })
        .then(function (user: any) {
          console.log("logged in user:", user);
          console.log(user!.get("ethAddress"));
        })
        .catch(function (error: any) {
          console.log(error);
        });
    }
  };
  const loginWalletConnect = async () => {
    if (!isAuthenticated) {
      await authenticate({
        provider: "walletconnect",
        chainId: 3,
        mobileLinks: [
          "rainbow",
          "metamask",
          "argent",
          "trust",
          "imtoken",
          "pillar",
        ],
      })
        .then(function (user: any) {
          console.log(user!.get("ethAddress"));
        })
        .catch(function (error: any) {
          console.log(error);
        });
    }
  };

  return (
    <div className="f-column align-center">
      <div style={{marginBottom: 26}}>
        <img src={logo} alt="colony-logo" />
      </div>
      <div className="flex align-end">
        <div
          style={{ gap: 40 }}
          className="connection-container f-column align-center justify-start"
        >
          <img src={metamaskLogo} alt="metamask" style={{ marginTop: 58 }} />
          <Button classes="fw-700 size-18" onClick={() => login()}>Connect to Metamask</Button>
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
          <Button classes="fw-700 size-18" onClick={() => loginWalletConnect()}>
            Use WalletConnect
          </Button>
        </div>
      </div>
    </div>
  );
}
