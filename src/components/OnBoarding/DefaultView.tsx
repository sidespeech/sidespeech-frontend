import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../redux/store/app.store";
import { useNavigate } from "react-router";
import { apiService } from "../../services/api.service";
import Welcome from "./Steps/Welcome";
import Bio from "./Steps/Bio";
import PublicNFTs from "./Steps/PublicNFTs";
import Avatar from "./Steps/Avatar";

import logoComplete from "./../../assets/logoComplete.svg";

import "./DefaultView.css";

export default function OnBoarding() {
  
  const [currentStep, setCurrentStep] = useState<string>("step 1");
  const [chosenUsername, setChosenUsername] = useState<string>("");

  const updateCurrentStep = (currentStep: string) => {
    setCurrentStep(currentStep);
  }

  const updateChosenUsername = (username: string) => {
    setChosenUsername(username);
  }

  const connectedWallet = window.ethereum.selectedAddress;

  const navigate = useNavigate();

  const checkOnBoarding = async () => {
    if(connectedWallet == null) {
      navigate('/');
    } else {
      const onBoarding = await apiService.findOnBoarding(connectedWallet);
      if (!onBoarding) {
        //Redirect the user to the onboarding area.
        navigate("/");
      } 
    }
  }
  checkOnBoarding();

  return (
    <>
      <ul className="steps">
        <li 
          className={`step1 ${currentStep == 'step 1' ? "active" : ""}`}
        ></li>
        <li 
          className={`step2  ${currentStep == 'step 2' ? "active" : ""}`}
        ></li>
        <li 
          className={`step3  ${currentStep == 'step 3' ? "active" : ""}`}
        ></li>
        <li 
          className={`step4  ${currentStep == 'step 4' ? "active" : ""}`}
        ></li>
      </ul>

      <div className="content text-center">
        <div 
          className={`step-content step1 ${currentStep == 'step 1' ? "active" : ""}`}
        >
            <h1>Welcome to SideSpeech,</h1>
            <h2>Let's start, what username do you want to use?</h2>
            <Welcome updateCurrentStep={(step) => updateCurrentStep(step)} updateChosenUsername={(username) => updateChosenUsername(username)} />
        </div>

        <div 
          className={`step-content step2 ${currentStep == 'step 2' ? "active" : ""}`}
        >
            <h1>You are {chosenUsername}</h1>
            <h2>Introduce yourself in a few words</h2>
            <Bio updateCurrentStep={(step) => updateCurrentStep(step)}/>
        </div>

        <div 
          className={`step-content step3 ${currentStep == 'step 3' ? "active" : ""}`}
        >
            <h1>Your avatar</h1>
            <h2>Used by default every time you join a Side.</h2>
            <Avatar updateCurrentStep={(step) => updateCurrentStep(step)}/>
        </div>

        <div 
          className={`step-content step4 ${currentStep == 'step 4' ? "active" : ""}`}
        >
            <h1>Your public NFTs</h1>
            <h2>Choose which NFTs you want to make public</h2>
            <PublicNFTs updateCurrentStep={(step) => updateCurrentStep(step)}/>
        </div>

        <div className="logoArea">
          <img src={logoComplete} />
        </div>

      </div>
    </>
  );
}
