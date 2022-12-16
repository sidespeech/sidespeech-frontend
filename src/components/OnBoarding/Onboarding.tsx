import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import Welcome from './Steps/Welcome';
import Bio from './Steps/Bio';
import PublicNFTs from './Steps/PublicNFTs';
import Avatar from './Steps/Avatar';

import { breakpoints, size } from '../../helpers/breakpoints';
import userService from '../../services/api-services/user.service';
import useWalletAddress from '../../hooks/useWalletAddress';

const OnBoardingStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	background: var(--background);
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
				font-weight: 700;
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
				color: var(--background);
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
				color: var(--text);
			}
			&.skip {
				background-color: rgba(125, 166, 220, 0.1);
				color: var(--text);
			}
			&.submit {
				background-color: var(--primary);
			}
		}
	}
	& .logoArea {
		display: flex;
		align-items: center;
		gap: 1rem;
		& p {
			font-size: 22px;
			font-weight: 700;
			${breakpoints(
				size.lg,
				`{
                font-size: 2rem;
            }`
			)}
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

	const { loadingWallet, walletAddress } = useWalletAddress();

	const navigate = useNavigate();

	const checkOnBoarding = useCallback(async () => {
		if (walletAddress == null) {
			navigate('/');
		} else {
			const onBoarding = await userService.findOnBoarding(walletAddress);
			if (!onBoarding) {
				//Redirect the user to the onboarding area.
				navigate('/');
			}
		}
	}, [walletAddress]);

	useEffect(() => {
		if (!loadingWallet) checkOnBoarding();
	}, [loadingWallet]);

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
						updateCurrentStep={step => updateCurrentStep(step)}
						updateChosenUsername={username => updateChosenUsername(username)}
					/>
				</div>

				<div className={`step-content step2 ${currentStep == 2 ? 'active' : ''}`}>
					<h1>You are {chosenUsername}</h1>
					<h2>Introduce yourself in a few words</h2>
					<Bio updateCurrentStep={step => updateCurrentStep(step)} />
				</div>

				<div className={`step-content step3 ${currentStep == 3 ? 'active' : ''}`}>
					<h1>Your avatar</h1>
					<h2>Used by default every time you join a Side.</h2>
					<Avatar updateCurrentStep={step => updateCurrentStep(step)} />
				</div>

				<div className={`step-content step4 ${currentStep == 4 ? 'active' : ''}`}>
					<h1>Your public NFTs</h1>
					<h2>Choose which NFTs you want to make public</h2>
					<PublicNFTs updateCurrentStep={step => updateCurrentStep(step)} />
				</div>
			</div>

			<div className="logoArea">
				<svg
					className="logo"
					width="28"
					height="28"
					viewBox="0 0 28 28"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M15.9588 11.243L12.7487 11.2363C11.2681 11.2363 10.0627 10.0005 10.0627 8.48261V8.28112C10.0627 6.76325 11.2681 5.52747 12.7487 5.52747H28C26.7029 3.29096 24.9733 1.39698 22.8376 0H12.7422C8.28732 0 4.67103 3.71408 4.67103 8.27441V8.47589C4.67103 9.44303 4.83481 10.3699 5.13617 11.2363C6.24988 14.4466 9.23725 16.757 12.7487 16.757L15.9588 16.7637C17.4394 16.7637 18.6448 17.9995 18.6448 19.5174V19.7189C18.6448 21.2367 17.4394 22.4725 15.9588 22.4725H0C1.29715 24.709 3.04633 26.603 5.18203 28H15.9523C20.4071 28 24.0234 24.2859 24.0234 19.7256V19.5241C24.0234 18.557 23.8596 17.6301 23.5583 16.7637C22.4576 13.5534 19.4637 11.243 15.9588 11.243Z"
						fill="var(--primary)"
					/>
				</svg>
				<p>SideSpeech</p>
			</div>
		</OnBoardingStyled>
	);
}
