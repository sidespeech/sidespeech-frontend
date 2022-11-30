import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../redux/store/app.store';
import { useNavigate } from 'react-router';
import Welcome from './Steps/Welcome';
import Bio from './Steps/Bio';
import PublicNFTs from './Steps/PublicNFTs';
import Avatar from './Steps/Avatar';

import logoComplete from './../../assets/logoComplete.svg';
import { breakpoints, size } from '../../helpers/breakpoints';
import userService from '../../services/api-services/user.service';

const OnBoardingStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    background: var(--panels-gray);
    padding: 10vh 0 5vh 0;
    .content {
        width: 100%;
    }
    h1 {
        color: #fff;
        margin: 0;
    }
    h2 {
        margin: 0;
    }
    .steps {
        counter-reset: step;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 3rem;
        width: 100%;
        & li {
            position: relative;
            display: inline-block;
            list-style: none;
            text-align: center;
            &::before {
                content: counter(step);
                counter-increment: step;
                width: 40px;
                height: 40px;
                line-height: 40px;
                border-radius: 100%;
                display: block;
                text-align: center;
                background-color: rgba(125, 166, 220, 0.1);
                color: var(--inactive);
            }
            &::after {
                content: '';
                position: absolute;
                width: 3rem;
                height: 1px;
                background-color: var(--disable);
                top: 50%;
                right: 0;
                transform: translate(100%, -50%);
                z-index: 1;
            }
            &:last-child::after {
                content: none;
            }
            &.active {
                color: white;
            }
            &.active::before {
                background: var(--primary);
                color: var(--text);
            }
            &.complete::after {
                background-color: var(--primary);
                color: var(--text);
            }
        }
    }

    .step-content {
        display: none;
        &.active {
            display: block;
        }
    }

    .nft-step {
        display: flex;
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
        height: 45vh;
        padding-top: 1rem;
    }
    .my-nfts {
        max-width: 480px;
        margin: 0 auto;
        height: 100%;
        padding-bottom: 45px;
    }

    .actions {
        display: flex;
        justify-content: space-between;
        margin-top: 5rem;
        padding: 0 2rem;
        width: 100%;
        ${breakpoints(
            size.md,
            `{
      max-width: 480px;
      margin: 2rem auto 0 auto;
    }`
        )}
        &.first-step {
            ${breakpoints(
                size.md,
                `{
        justify-content: center;
      }`
            )}
        }
        & button {
            &.back {
                background-color: transparent;
                border: 1px solid rgba(125, 166, 220, 0.1);
            }
            &.skip {
                background-color: rgba(125, 166, 220, 0.1);
            }
            &.submit {
                background-color: var(--primary);
            }
        }
    }
`;

export default function OnBoarding() {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [chosenUsername, setChosenUsername] = useState<string>('');

    const updateCurrentStep = (currentStep: number) => {
        setCurrentStep(currentStep);
    };

    const updateChosenUsername = (username: string) => {
        setChosenUsername(username);
    };

    const connectedWallet = window.ethereum.selectedAddress;

    const navigate = useNavigate();

    const checkOnBoarding = async () => {
        if (connectedWallet == null) {
            navigate('/');
        } else {
            const onBoarding = await userService.findOnBoarding(connectedWallet);
            if (!onBoarding) {
                //Redirect the user to the onboarding area.
                navigate('/');
            }
        }
    };
    checkOnBoarding();

    return (
        <OnBoardingStyled className="onboarding">
            <ul className="steps">
                <li className={`step1 ${currentStep >= 1 ? 'active' : ''} ${currentStep > 2 ? 'complete' : ''}`}></li>
                <li className={`step2  ${currentStep >= 2 ? 'active' : ''} ${currentStep > 3 ? 'complete' : ''}`}></li>
                <li className={`step3  ${currentStep >= 3 ? 'active' : ''} ${currentStep > 4 ? 'complete' : ''}`}></li>
                <li className={`step4  ${currentStep >= 4 ? 'active' : ''}`}></li>
            </ul>

            <div className="content text-center">
                <div className={`step-content step1 ${currentStep == 1 ? 'active' : ''}`}>
                    <h1>Welcome to SideSpeech,</h1>
                    <h2>Let's start, what username do you want to use?</h2>
                    <Welcome
                        updateCurrentStep={(step) => updateCurrentStep(step)}
                        updateChosenUsername={(username) => updateChosenUsername(username)}
                    />
                </div>

                <div className={`step-content step2 ${currentStep == 2 ? 'active' : ''}`}>
                    <h1>You are {chosenUsername}</h1>
                    <h2>Introduce yourself in a few words</h2>
                    <Bio updateCurrentStep={(step) => updateCurrentStep(step)} />
                </div>

                <div className={`step-content step3 ${currentStep == 3 ? 'active' : ''}`}>
                    <h1>Your avatar</h1>
                    <h2>Used by default every time you join a Side.</h2>
                    <Avatar updateCurrentStep={(step) => updateCurrentStep(step)} />
                </div>

                <div className={`step-content step4 ${currentStep == 4 ? 'active' : ''}`}>
                    <h1>Your public NFTs</h1>
                    <h2>Choose which NFTs you want to make public</h2>
                    <PublicNFTs updateCurrentStep={(step) => updateCurrentStep(step)} />
                </div>
            </div>

            <div className="logoArea">
                <img src={logoComplete} />
            </div>
        </OnBoardingStyled>
    );
}
