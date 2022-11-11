import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../redux/store/app.store";
import Login from "./Login";
import { useNavigate } from "react-router";
import { apiService } from "../../services/api.service";
import DashboardPage from "../dashboard/DashboardPage";
import OnBoarding from "./../OnBoarding/DefaultView";
import { Side } from "../../models/Side";
import "./DefaultView.css";

interface ISeparatorHorizontal {
  borderColor?: string;
  margin?: string;
}

export const SeparatorHorizontal = styled.div<ISeparatorHorizontal>`
  min-width: 535px;
  border-top: 1px solid
    ${(props) =>
      props.borderColor ? props.borderColor : "var(--bg-secondary-light)"};
  margin: ${(props) => (props.margin ? props.margin : "34px 0px 50px 0px")}; ;
`;

export default function DefaultView() {
  const [showColonyModal, setShowColonyModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showSelecteColonyModal, setShowSelecteColonyModal] =
    useState<boolean>(false);
  const [selectedColony, setSelectedColony] = useState<Side | null>(null);
  const userData = useSelector((state: RootState) => state.user);
  const redirect = useSelector((state: RootState) => state.redirect);
  const walletAddress = window.ethereum.selectedAddress;
  const navigate = useNavigate();

  let initialPage;

  if(userData.account === null || walletAddress == null) {
    initialPage = <Login />
  } else if(walletAddress) {

    const checkOnBoarding = async () => {
      const onBoarding = await apiService.findOnBoarding(walletAddress);

      if (onBoarding) {
        //Redirect the user to the onboarding area.
        navigate("/onboarding");
      } else {
        initialPage = <DashboardPage />
      }
    }
    checkOnBoarding();
  } else {
    initialPage = <DashboardPage />
  }
        
  const showProfile = () => {
    setShowProfileModal(true);
  };
  
  return (
    <>
      {initialPage}
    </>
  );
}
