import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../../redux/store/app.store';

const MobileMenuStyled = styled.nav`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 2rem;
	.menu-tab {
		svg {
			path {
				fill: var(--text);
			}
		}
		&.active {
			path {
				fill: var(--primary);
			}
		}
	}
`;

const MobileMenu = () => {
	const { pathname } = useLocation();

	const isActive = (path: string, exact?: boolean): boolean => {
		if (exact) return pathname === path;
		return pathname.includes(path);
	};
	const username = useSelector((state: RootState) => state.user.user?.username);

	return (
		<MobileMenuStyled className="fade-in">
			<Link className={`menu-tab ${isActive('/general-settings') ? 'active' : ''}`} to="/general-settings">
				<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M15.9588 11.243L12.7487 11.2363C11.2681 11.2363 10.0627 10.0005 10.0627 8.48261V8.28112C10.0627 6.76325 11.2681 5.52747 12.7487 5.52747H28C26.7029 3.29096 24.9733 1.39698 22.8376 0H12.7422C8.28732 0 4.67103 3.71408 4.67103 8.27441V8.47589C4.67103 9.44303 4.83481 10.3699 5.13617 11.2363C6.24988 14.4466 9.23725 16.757 12.7487 16.757L15.9588 16.7637C17.4394 16.7637 18.6448 17.9995 18.6448 19.5174V19.7189C18.6448 21.2367 17.4394 22.4725 15.9588 22.4725H0C1.29715 24.709 3.04633 26.603 5.18203 28H15.9523C20.4071 28 24.0234 24.2859 24.0234 19.7256V19.5241C24.0234 18.557 23.8596 17.6301 23.5583 16.7637C22.4576 13.5534 19.4637 11.243 15.9588 11.243Z"
						fill="var(--primary)"
					/>
				</svg>
			</Link>

			<Link className={`menu-tab ${isActive('/', true) ? 'active' : ''}`} to="/">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0ZM2 8H6V2H2V8ZM12 16H16V10H12V16ZM12 4H16V2H12V4ZM2 16H6V14H2V16Z" />
				</svg>
			</Link>
			<Link className={`menu-tab ${isActive('/side') ? 'active' : ''}`} to="/side/main">
				<svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 18V6L8 0L16 6V18H10V11H6V18H0Z" />
				</svg>
			</Link>
			<Link className={`menu-tab ${isActive('/search') ? 'active' : ''}`} to="/search">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.146 12.371 1.888 11.113C0.629333 9.85433 0 8.31667 0 6.5C0 4.68333 0.629333 3.14567 1.888 1.887C3.146 0.629 4.68333 0 6.5 0C8.31667 0 9.85433 0.629 11.113 1.887C12.371 3.14567 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5627 8.81267 11 7.75 11 6.5C11 5.25 10.5627 4.18733 9.688 3.312C8.81267 2.43733 7.75 2 6.5 2C5.25 2 4.18733 2.43733 3.312 3.312C2.43733 4.18733 2 5.25 2 6.5C2 7.75 2.43733 8.81267 3.312 9.688C4.18733 10.5627 5.25 11 6.5 11Z" />
				</svg>
			</Link>

			<Link className={`menu-tab ${isActive('/user') ? 'active' : ''}`} to={`/user/${username}`}>
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M3.85 15.1C4.7 14.45 5.65 13.9373 6.7 13.562C7.75 13.1873 8.85 13 10 13C11.15 13 12.25 13.1873 13.3 13.562C14.35 13.9373 15.3 14.45 16.15 15.1C16.7333 14.4167 17.1877 13.6417 17.513 12.775C17.8377 11.9083 18 10.9833 18 10C18 7.78333 17.221 5.89567 15.663 4.337C14.1043 2.779 12.2167 2 10 2C7.78333 2 5.896 2.779 4.338 4.337C2.77933 5.89567 2 7.78333 2 10C2 10.9833 2.16267 11.9083 2.488 12.775C2.81267 13.6417 3.26667 14.4167 3.85 15.1ZM10 11C9.01667 11 8.18733 10.6627 7.512 9.988C6.83733 9.31267 6.5 8.48333 6.5 7.5C6.5 6.51667 6.83733 5.68733 7.512 5.012C8.18733 4.33733 9.01667 4 10 4C10.9833 4 11.8127 4.33733 12.488 5.012C13.1627 5.68733 13.5 6.51667 13.5 7.5C13.5 8.48333 13.1627 9.31267 12.488 9.988C11.8127 10.6627 10.9833 11 10 11ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20ZM10 18C10.8833 18 11.7167 17.871 12.5 17.613C13.2833 17.3543 14 16.9833 14.65 16.5C14 16.0167 13.2833 15.6457 12.5 15.387C11.7167 15.129 10.8833 15 10 15C9.11667 15 8.28333 15.129 7.5 15.387C6.71667 15.6457 6 16.0167 5.35 16.5C6 16.9833 6.71667 17.3543 7.5 17.613C8.28333 17.871 9.11667 18 10 18ZM10 9C10.4333 9 10.7917 8.85833 11.075 8.575C11.3583 8.29167 11.5 7.93333 11.5 7.5C11.5 7.06667 11.3583 6.70833 11.075 6.425C10.7917 6.14167 10.4333 6 10 6C9.56667 6 9.20833 6.14167 8.925 6.425C8.64167 6.70833 8.5 7.06667 8.5 7.5C8.5 7.93333 8.64167 8.29167 8.925 8.575C9.20833 8.85833 9.56667 9 10 9Z" />
				</svg>
			</Link>
		</MobileMenuStyled>
	);
};

export default MobileMenu;
