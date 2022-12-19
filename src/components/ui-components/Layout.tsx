import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../redux/store/app.store';
import DesktopMenu from './DesktopMenu';
import GeneralSettingsMenu from '../GeneralSettings/ContainerLeft/Index';
import MobileMenu from './MobileMenu';
import { useLocation } from 'react-router-dom';
import { breakpoints, size } from '../../helpers/breakpoints';

const LayoutStyled = styled.div`
	height: 100vh;
	max-height: 100vh;
	display: flex;
	overflow: hidden;
	& .left-container {
		background-color: var(--super-dark);
		width: 70px;
		display: none;
		flex-direction: column;
		text-align: center;
		justify-content: space-between;
		padding: 1rem 0;
		${breakpoints(
			size.lg,
			`{
            display: flex;
        }`
		)}
	}
	& .middle-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: var(--background);
		width: 100%;
		padding-bottom: 77px;
		${breakpoints(
			size.lg,
			`{
            width: calc(100% - 70px);
			padding-bottom: 0;
        }`
		)}
		&.full-screen {
			${breakpoints(
				size.lg,
				`{
				width: 100%;
			}`
			)}
		}
	}
	.mobile-bottom-menu {
		position: fixed;
		bottom: 0;
		left: 0;
		margin: 0;
		width: 100vw;
		height: 77px;
		background-color: var(--panels-gray);
		z-index: 9900;
		${breakpoints(
			size.lg,
			`{
            display: none;
        }`
		)}
	}
`;

interface LayoutProps {
	children: any;
	generalSettings?: boolean;
	isSettingsMobileMenuOpen?: boolean;
	setIsSettingsMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Layout = ({ children, isSettingsMobileMenuOpen, setIsSettingsMobileMenuOpen }: LayoutProps) => {
	const location = useLocation();

	const userData: any = useSelector((state: RootState) => state.user);
	const isAuth = userData.account;

	const onBoarding = location.pathname.indexOf('/onboarding') > -1;
	const login = location.pathname === '/login';
	const generalSettings = location.pathname.indexOf('/general-settings') > -1;

	return (
		<LayoutStyled>
			{generalSettings && isAuth ? (
				<GeneralSettingsMenu
					isSettingsMobileMenuOpen={isSettingsMobileMenuOpen}
					setIsSettingsMobileMenuOpen={setIsSettingsMobileMenuOpen}
				/>
			) : onBoarding || login ? null : (
				<div className="left-container">
					<DesktopMenu userData={userData} />
				</div>
			)}
			<div
				className={`middle-container ${
					(generalSettings && isAuth) || !onBoarding || !login ? 'full-screen' : ''
				}`}
			>
				{children}
			</div>
			{!onBoarding && !login && isAuth && (
				<div className="mobile-bottom-menu">
					<MobileMenu />
				</div>
			)}
		</LayoutStyled>
	);
};

export default Layout;
