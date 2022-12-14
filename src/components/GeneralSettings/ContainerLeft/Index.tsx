import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { disconnect } from '../../../redux/Slices/UserDataSlice';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router';

// Icons
import { Link } from 'react-router-dom';
import { breakpoints, size } from '../../../helpers/breakpoints';
import { GeneralSettingsAccountContext } from '../../../App';
import BackLink from '../../ui-components/BackLink';

const GeneralSettingsMenuStyled = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: var(--super-dark);
	min-width: 100%;
	height: 100%;
	padding: 2rem 1rem;
	transition: transform 0.3s ease;
	transform: translateX(-200vw);
	z-index: 9899;
	&.open {
		transform: translateX(0);
		padding-bottom: 77px;
		${breakpoints(
			size.lg,
			`{
				padding-bottom: 2rem;
			}`
		)}
		&>div:first-of-type {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;
			${breakpoints(
				size.lg,
				`{
					display: block;
					height: auto;
				}`
			)}
		}
	}
	${breakpoints(
		size.lg,
		`{
    position: relative;
    min-width: 250px;
    transform: translateX(0);
  }`
	)}
	& .app-name {
		display: flex;
		align-items: center;
		margin-bottom: 2rem;
		gap: 1rem;
		${breakpoints(
			size.lg,
			`{
				display: none;
			}`
		)}
		& h1 {
			margin: 0;
		}
	}
	& .title {
		display: flex;
		gap: 1rem;
		align-items: center;
		& h2 {
			margin: 0;
		}
	}
	& a {
		color: inherit;
	}
	& .tiles-wrapper {
		display: flex;
		flex-direction: column;
		margin: 2rem 0;
		${breakpoints(
			size.lg,
			`{
				display: grid;
				gap: 1rem;
				grid-template-columns: repeat(2, 1fr);
			}`
		)}
		& > a {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 100%;
			color: inherit;
			${breakpoints(
				size.lg,
				`{
					display: inline;
				}`
			)}
			& .arrow-right {
				${breakpoints(
					size.lg,
					`{
          display: none;
        }`
				)}
			}
		}
		& .tile {
			background-color: transparent;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			height: 100%;
			padding: 1rem 0;
			border-radius: 10px;
			transition: background-color 0.3s ease;
			& p {
				transition: color 0.3s ease;
			}
			&.active,
			&:hover {
				p {
					${breakpoints(
						size.lg,
						`{
					color: var(--super-dark);

					}`
					)}
				}
			}
			${breakpoints(
				size.lg,
				`{
					padding: 1rem;
					background-color: var(--white-transparency-10);
					flex-direction: column;
				}`
			)}
			& svg {
				transform: scale(0.65);
				${breakpoints(
					size.lg,
					`{
					transform: scale(1);
					}`
				)}
				& path {
					transition: fill 0.3s ease;
					fill: #dcedef;
				}
			}
			&.logout-tile {
				color: var(--red);
				& svg {
					& path {
						fill: var(--red);
					}
				}
			}
			&.active,
			&:hover {
				${breakpoints(
					size.lg,
					`{
						background-color: var(--primary);
						color: var(--super-dark);
					}`
				)}
				& svg {
					& path {
						${breakpoints(
							size.lg,
							`{
								fill: var(--super-dark);
							}`
						)}
					}
				}
			}
			&.logout-tile {
				&.active,
				&:hover {
					${breakpoints(
						size.lg,
						`{
						background-color: var(--red);
					}`
					)}
					& p {
						${breakpoints(
							size.lg,
							`{
							color: var(--background)!important;
						}`
						)}
					}
				}
			}
		}
	}
	& .smaller-links {
		& a > div {
			display: flex;
			gap: 1rem;
			align-items: center;
			margin: 1rem 0;
			color: var(--inactive);
			& svg path {
				fill: var(--inactive);
			}
			&.active {
				color: var(--text);
				& svg path {
					fill: var(--text);
				}
			}
		}
	}
	& .nav-footer {
		display: none;
		${breakpoints(
			size.lg,
			`{
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }`
		)}
		& .app-name-bottom {
			display: flex;
			align-items: center;
			gap: 1rem;
			& h1 {
				margin: 0;
				font-size: 22px;
			}
		}
	}
`;

export default function IndexView({
	isSettingsMobileMenuOpen,
	setIsSettingsMobileMenuOpen
}: GeneralSettingsAccountContext) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const logout = () => {
		setIsSettingsMobileMenuOpen?.(false);
		dispatch(disconnect());
		navigate('/');
	};

	return (
		<GeneralSettingsMenuStyled className={`${isSettingsMobileMenuOpen ? 'open' : ''}`}>
			<div className="fade-in-left">
				<div>
					<div className="app-name">
						<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M15.9588 11.243L12.7487 11.2363C11.2681 11.2363 10.0627 10.0005 10.0627 8.48261V8.28112C10.0627 6.76325 11.2681 5.52747 12.7487 5.52747H28C26.7029 3.29096 24.9733 1.39698 22.8376 0H12.7422C8.28732 0 4.67103 3.71408 4.67103 8.27441V8.47589C4.67103 9.44303 4.83481 10.3699 5.13617 11.2363C6.24988 14.4466 9.23725 16.757 12.7487 16.757L15.9588 16.7637C17.4394 16.7637 18.6448 17.9995 18.6448 19.5174V19.7189C18.6448 21.2367 17.4394 22.4725 15.9588 22.4725H0C1.29715 24.709 3.04633 26.603 5.18203 28H15.9523C20.4071 28 24.0234 24.2859 24.0234 19.7256V19.5241C24.0234 18.557 23.8596 17.6301 23.5583 16.7637C22.4576 13.5534 19.4637 11.243 15.9588 11.243Z"
								fill="var(--primary)"
							/>
						</svg>
						<h1>SideSpeech</h1>
					</div>
					<div className="title">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M8.87294 23.8602L8.40276 20.0987C8.14808 20.0008 7.90828 19.8832 7.68338 19.7461C7.45769 19.609 7.2371 19.462 7.0216 19.3053L3.52462 20.7746L0.292114 15.1912L3.31891 12.8991C3.29932 12.7619 3.28953 12.6295 3.28953 12.5018V11.7083C3.28953 11.5814 3.29932 11.4493 3.31891 11.3122L0.292114 9.02006L3.52462 3.43665L7.0216 4.90597C7.2371 4.74924 7.46239 4.60231 7.69749 4.46517C7.93258 4.32803 8.16767 4.21049 8.40276 4.11253L8.87294 0.351074H15.3379L15.8081 4.11253C16.0628 4.21049 16.303 4.32803 16.5287 4.46517C16.7536 4.60231 16.9738 4.74924 17.1893 4.90597L20.6863 3.43665L23.9188 9.02006L20.892 11.3122C20.9116 11.4493 20.9214 11.5814 20.9214 11.7083V12.5018C20.9214 12.6295 20.9018 12.7619 20.8626 12.8991L23.8894 15.1912L20.6569 20.7746L17.1893 19.3053C16.9738 19.462 16.7485 19.609 16.5134 19.7461C16.2783 19.8832 16.0432 20.0008 15.8081 20.0987L15.3379 23.8602H8.87294ZM12.1642 16.2197C13.3005 16.2197 14.2702 15.8181 15.0735 15.0149C15.8767 14.2117 16.2783 13.2419 16.2783 12.1056C16.2783 10.9694 15.8767 9.99961 15.0735 9.19638C14.2702 8.39315 13.3005 7.99154 12.1642 7.99154C11.0084 7.99154 10.0335 8.39315 9.23968 9.19638C8.44664 9.99961 8.05012 10.9694 8.05012 12.1056C8.05012 13.2419 8.44664 14.2117 9.23968 15.0149C10.0335 15.8181 11.0084 16.2197 12.1642 16.2197Z"
								fill="#DCEDEF"
							/>
						</svg>
						<h2>General Settings</h2>
					</div>
					<div className="tiles-wrapper">
						<Link onClick={() => setIsSettingsMobileMenuOpen?.(false)} to="/general-settings">
							<div className={`${location.pathname === '/general-settings' ? 'active' : ''} tile`}>
								<svg
									width="23"
									height="21"
									viewBox="0 0 23 21"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M11.4001 9.4417C10.1223 9.4417 9.03619 8.99448 8.14175 8.10003C7.2473 7.20559 6.80008 6.11948 6.80008 4.8417C6.80008 3.58948 7.2473 2.5095 8.14175 1.60177C9.03619 0.695055 10.1223 0.241699 11.4001 0.241699C12.6779 0.241699 13.764 0.695055 14.6584 1.60177C15.5529 2.5095 16.0001 3.58948 16.0001 4.8417C16.0001 6.11948 15.5529 7.20559 14.6584 8.10003C13.764 8.99448 12.6779 9.4417 11.4001 9.4417ZM0.666748 20.5584V18.0284C0.666748 17.3895 0.852281 16.7951 1.22335 16.2451C1.59339 15.6962 2.08508 15.2684 2.69841 14.9617C4.15508 14.2717 5.60562 13.7539 7.05002 13.4084C8.49339 13.0639 9.94342 12.8917 11.4001 12.8917C12.8567 12.8917 14.3073 13.0639 15.7517 13.4084C17.1951 13.7539 18.6451 14.2717 20.1017 14.9617C20.7151 15.2684 21.2073 15.6962 21.5784 16.2451C21.9484 16.7951 22.1334 17.3895 22.1334 18.0284V20.5584H0.666748ZM2.20008 19.025H20.6001V18.0284C20.6001 17.6706 20.4917 17.3445 20.275 17.0501C20.0573 16.7567 19.7568 16.5078 19.3734 16.3034C18.0956 15.69 16.7862 15.2239 15.445 14.905C14.1028 14.585 12.7545 14.425 11.4001 14.425C10.0456 14.425 8.69784 14.585 7.35668 14.905C6.0145 15.2239 4.70453 15.69 3.42675 16.3034C3.04342 16.5078 2.74339 16.7567 2.52668 17.0501C2.30895 17.3445 2.20008 17.6706 2.20008 18.0284V19.025ZM11.4001 7.90837C12.2434 7.90837 12.9656 7.60783 13.5667 7.00677C14.1667 6.40672 14.4667 5.68503 14.4667 4.8417C14.4667 3.99837 14.1667 3.27668 13.5667 2.67663C12.9656 2.07557 12.2434 1.77503 11.4001 1.77503C10.5567 1.77503 9.83506 2.07557 9.23502 2.67663C8.63395 3.27668 8.33342 3.99837 8.33342 4.8417C8.33342 5.68503 8.63395 6.40672 9.23502 7.00677C9.83506 7.60783 10.5567 7.90837 11.4001 7.90837Z" />
								</svg>
								<p>Account</p>
							</div>
							<svg
								className="arrow-right"
								width="7"
								height="12"
								viewBox="0 0 7 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M1.34696 11.4163L0.385498 10.4549L4.84071 5.99967L0.385498 1.54447L1.34696 0.583008L6.76362 5.99967L1.34696 11.4163Z"
									fill="#B6E5E5"
									fill-opacity="0.3"
								/>
							</svg>
						</Link>
						<Link onClick={() => setIsSettingsMobileMenuOpen?.(false)} to="/general-settings/themes">
							<div className={`${location.pathname === '/general-settings/themes' ? 'active' : ''} tile`}>
								<svg
									width="29"
									height="29"
									viewBox="0 0 29 29"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M14.3233 28.1503C12.4578 28.1503 10.6883 27.7864 9.01491 27.0586C7.34051 26.3297 5.88384 25.3453 4.64491 24.1054C3.40495 22.8664 2.42055 21.4036 1.69171 19.717C0.963887 18.0303 0.599976 16.2414 0.599976 14.3503C0.599976 12.4336 0.970531 10.632 1.71164 8.94529C2.45275 7.25863 3.4622 5.79532 4.73997 4.55536C6.01775 3.31643 7.5194 2.33918 9.24491 1.62363C10.9694 0.908071 12.8155 0.550293 14.7833 0.550293C16.5722 0.550293 18.2716 0.850315 19.8816 1.45036C21.4916 2.05143 22.91 2.88863 24.1366 3.96196C25.3633 5.03529 26.3472 6.31307 27.0883 7.79529C27.8294 9.27751 28.2 10.9003 28.2 12.6636C28.2 15.0403 27.5166 16.938 26.1499 18.3569C24.7822 19.7747 22.91 20.4836 20.5333 20.4836H17.8116C17.1728 20.4836 16.6361 20.7075 16.2016 21.1552C15.7672 21.6019 15.55 22.132 15.55 22.7453C15.55 23.3842 15.7416 23.9275 16.125 24.3752C16.5083 24.8219 16.7 25.3392 16.7 25.927C16.7 26.6681 16.4894 27.2236 16.0682 27.5937C15.6461 27.9648 15.0644 28.1503 14.3233 28.1503ZM5.96664 15.117C6.40109 15.117 6.76551 14.9698 7.05991 14.6754C7.35329 14.382 7.49998 14.0181 7.49998 13.5836C7.49998 13.1492 7.35329 12.7848 7.05991 12.4904C6.76551 12.197 6.40109 12.0503 5.96664 12.0503C5.5322 12.0503 5.16778 12.197 4.87338 12.4904C4.58 12.7848 4.43331 13.1492 4.43331 13.5836C4.43331 14.0181 4.58 14.382 4.87338 14.6754C5.16778 14.9698 5.5322 15.117 5.96664 15.117ZM10.5666 8.98363C11.0011 8.98363 11.3655 8.83694 11.6599 8.54356C11.9533 8.24916 12.1 7.88474 12.1 7.45029C12.1 7.01585 11.9533 6.65143 11.6599 6.35703C11.3655 6.06365 11.0011 5.91696 10.5666 5.91696C10.1322 5.91696 9.76829 6.06365 9.47491 6.35703C9.18051 6.65143 9.03331 7.01585 9.03331 7.45029C9.03331 7.88474 9.18051 8.24916 9.47491 8.54356C9.76829 8.83694 10.1322 8.98363 10.5666 8.98363ZM18.2333 8.98363C18.6678 8.98363 19.0322 8.83694 19.3266 8.54356C19.62 8.24916 19.7666 7.88474 19.7666 7.45029C19.7666 7.01585 19.62 6.65143 19.3266 6.35703C19.0322 6.06365 18.6678 5.91696 18.2333 5.91696C17.7989 5.91696 17.435 6.06365 17.1416 6.35703C16.8472 6.65143 16.7 7.01585 16.7 7.45029C16.7 7.88474 16.8472 8.24916 17.1416 8.54356C17.435 8.83694 17.7989 8.98363 18.2333 8.98363ZM22.8333 15.117C23.2678 15.117 23.6317 14.9698 23.925 14.6754C24.2194 14.382 24.3666 14.0181 24.3666 13.5836C24.3666 13.1492 24.2194 12.7848 23.925 12.4904C23.6317 12.197 23.2678 12.0503 22.8333 12.0503C22.3989 12.0503 22.035 12.197 21.7416 12.4904C21.4472 12.7848 21.3 13.1492 21.3 13.5836C21.3 14.0181 21.4472 14.382 21.7416 14.6754C22.035 14.9698 22.3989 15.117 22.8333 15.117ZM14.3233 26.617C14.6044 26.617 14.8155 26.5592 14.9566 26.4437C15.0966 26.3292 15.1666 26.157 15.1666 25.927C15.1666 25.5692 14.975 25.1858 14.5916 24.777C14.2083 24.3681 14.0166 23.7036 14.0166 22.7836C14.0166 21.6592 14.3872 20.7392 15.1283 20.0236C15.8694 19.3081 16.7766 18.9503 17.85 18.9503H20.5333C22.45 18.9503 23.9516 18.3814 25.0382 17.2437C26.1238 16.107 26.6666 14.5803 26.6666 12.6636C26.6666 9.54585 25.4722 7.00307 23.0832 5.03529C20.6933 3.06752 17.9266 2.08363 14.7833 2.08363C11.2311 2.08363 8.23495 3.27196 5.79491 5.64863C3.35384 8.02529 2.13331 10.9258 2.13331 14.3503C2.13331 17.7492 3.32829 20.6436 5.71824 23.0336C8.10717 25.4225 10.9755 26.617 14.3233 26.617Z" />
								</svg>
								<p>Themes</p>
							</div>
							<svg
								className="arrow-right"
								width="7"
								height="12"
								viewBox="0 0 7 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M1.34696 11.4163L0.385498 10.4549L4.84071 5.99967L0.385498 1.54447L1.34696 0.583008L6.76362 5.99967L1.34696 11.4163Z"
									fill="#B6E5E5"
									fill-opacity="0.3"
								/>
							</svg>
						</Link>
						<button className="tile logout-tile" onClick={logout}>
							<svg
								width="25"
								height="27"
								viewBox="0 0 25 27"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M2.89328 26.1502C2.20328 26.1502 1.62163 25.914 1.14834 25.4418C0.676075 24.9685 0.439941 24.3741 0.439941 23.6585V2.57516C0.439941 1.85961 0.676075 1.2657 1.14834 0.793429C1.62163 0.32014 2.20328 0.0834961 2.89328 0.0834961H12.7449V1.61683H2.89328C2.66328 1.61683 2.4527 1.71292 2.26154 1.9051C2.06936 2.09625 1.97327 2.31961 1.97327 2.57516V23.6585C1.97327 23.9141 2.06936 24.1374 2.26154 24.3286C2.4527 24.5207 2.66328 24.6168 2.89328 24.6168H12.7449V26.1502H2.89328ZM18.9549 18.5602L17.8816 17.4485L21.4083 13.8835H8.14494V12.3502H21.4083L17.8816 8.78516L18.9549 7.6735L24.3599 13.1168L18.9549 18.5602Z" />
							</svg>
							<p>Disconnect</p>
						</button>
					</div>
				</div>

				<div className="smaller-links">
					<Link onClick={() => setIsSettingsMobileMenuOpen?.(false)} to="/general-settings/privacy">
						<div className={`${location.pathname === '/general-settings/privacy' ? 'active' : ''}`}>
							<svg
								width="14"
								height="18"
								viewBox="0 0 14 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M6.03754 11.6375L10.575 7.1L9.93337 6.43542L6.03754 10.3313L4.06671 8.38333L3.42504 9.025L6.03754 11.6375ZM7.00004 17.2292C5.15143 16.6944 3.61968 15.5828 2.40479 13.8943C1.19051 12.2064 0.583374 10.3083 0.583374 8.2V3.25L7.00004 0.84375L13.4167 3.25V8.2C13.4167 10.3083 12.8093 12.2064 11.5944 13.8943C10.3801 15.5828 8.84865 16.6944 7.00004 17.2292ZM7.00004 16.2667C8.58893 15.7625 9.90282 14.7542 10.9417 13.2417C11.9806 11.7292 12.5 10.0486 12.5 8.2V3.86875L7.00004 1.82917L1.50004 3.86875V8.2C1.50004 10.0486 2.01948 11.7292 3.05837 13.2417C4.09726 14.7542 5.41115 15.7625 7.00004 16.2667Z" />
							</svg>
							Privacy Policy
						</div>
					</Link>
					<Link onClick={() => setIsSettingsMobileMenuOpen?.(false)} to="/general-settings/terms">
						<div className={`${location.pathname === '/general-settings/terms' ? 'active' : ''}`}>
							<svg
								width="14"
								height="18"
								viewBox="0 0 14 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M3.79171 14.0666H10.2084V13.1499H3.79171V14.0666ZM3.79171 10.3999H10.2084V9.48324H3.79171V10.3999ZM2.07296 17.2749C1.64518 17.2749 1.29012 17.1337 1.00779 16.8514C0.724846 16.5685 0.583374 16.2131 0.583374 15.7853V2.26449C0.583374 1.83671 0.724846 1.48135 1.00779 1.1984C1.29012 0.916069 1.64518 0.774902 2.07296 0.774902H9.29171L13.4167 4.8999V15.7853C13.4167 16.2131 13.2755 16.5685 12.9932 16.8514C12.7103 17.1337 12.3549 17.2749 11.9271 17.2749H2.07296ZM8.83337 5.35824V1.69157H2.07296C1.92018 1.69157 1.78665 1.74901 1.67237 1.8639C1.55749 1.97818 1.50004 2.11171 1.50004 2.26449V15.7853C1.50004 15.9381 1.55749 16.0716 1.67237 16.1859C1.78665 16.3008 1.92018 16.3582 2.07296 16.3582H11.9271C12.0799 16.3582 12.2134 16.3008 12.3277 16.1859C12.4426 16.0716 12.5 15.9381 12.5 15.7853V5.35824H8.83337Z" />
							</svg>
							Terms and Conditions
						</div>
					</Link>
				</div>
			</div>

			<div className="fade-in-left nav-footer">
				<Link to="/">
					<BackLink />
				</Link>
				<div className="app-name-bottom">
					<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M15.9588 11.243L12.7487 11.2363C11.2681 11.2363 10.0627 10.0005 10.0627 8.48261V8.28112C10.0627 6.76325 11.2681 5.52747 12.7487 5.52747H28C26.7029 3.29096 24.9733 1.39698 22.8376 0H12.7422C8.28732 0 4.67103 3.71408 4.67103 8.27441V8.47589C4.67103 9.44303 4.83481 10.3699 5.13617 11.2363C6.24988 14.4466 9.23725 16.757 12.7487 16.757L15.9588 16.7637C17.4394 16.7637 18.6448 17.9995 18.6448 19.5174V19.7189C18.6448 21.2367 17.4394 22.4725 15.9588 22.4725H0C1.29715 24.709 3.04633 26.603 5.18203 28H15.9523C20.4071 28 24.0234 24.2859 24.0234 19.7256V19.5241C24.0234 18.557 23.8596 17.6301 23.5583 16.7637C22.4576 13.5534 19.4637 11.243 15.9588 11.243Z"
							fill="var(--primary)"
						/>
					</svg>
					<h1>SideSpeech</h1>
				</div>
			</div>
		</GeneralSettingsMenuStyled>
	);
}
