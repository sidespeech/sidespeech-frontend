// import React from "react";
// import { useSelector } from "react-redux";
import styled from 'styled-components';
// import { RootState } from "../../redux/store/app.store";
import { useLocation } from 'react-router';

// Images
import comingSoon from '../../assets/themes.svg';
import { breakpoints, size } from '../../helpers/breakpoints';
import { useGeneralSettingsContext } from '../../App';

const InnerPageStyled = styled.div`
	padding: 2rem 1rem;
	&.privacy,
	&.terms {
		align-self: flex-start;
	}
	&.themes {
		width: 100%;
		height: 100%;
		.content {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			min-height: calc(100vh - 4rem - 37px - 77px);
			${breakpoints(
				size.lg,
				`{
        min-height: calc(100vh - 4rem - 37px);
      }`
			)}
			& .coming-soon {
				width: 100%;
				max-width: 700px;
				height: 400px;
				background-image: url(${comingSoon});
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center center;
			}
		}
	}
	&.privacy .content,
	&.terms .content {
		width: 100%;
		position: relative;
		flex: 1.2 1;
		max-height: calc(100vh - 56px - 77px);
		height: calc(85vh - 26px - 77px);
		margin-top: 2rem;
		${breakpoints(
			size.lg,
			`{
      max-height: calc(100vh - 56px);
      height: calc(85vh - 26px);
      max-width: 500px;
    }`
		)}
	}
	& .content {
		.inner {
			height: 100%;
			overflow-y: scroll;
			& p {
				margin-bottom: 2rem;
			}
		}
		& .fader {
			background: linear-gradient(180deg, rgba(36, 38, 53, 0) 0%, #1f212c 100%);
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 72px;
			display: flex;
			justify-content: center;
			align-items: center;
			pointer-events: none;
		}
	}
`;

const PageTitleStyled = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	& .main-icon {
		display: none;
		place-items: center;
		${breakpoints(
			size.lg,
			`{
      display: grid;
    }`
		)}
	}
	& .back-arrow-icon {
		display: grid;
		place-items: center;
		background-color: transparent;
		border: none;
		outline: none;
		box-shadow: none;
		${breakpoints(
			size.lg,
			`{
      display: none;
    }`
		)}
	}
	& h2 {
		margin: 0;
	}
`;

export const Icons = {
	profile: () => (
		<svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M11.4001 9.4417C10.1223 9.4417 9.03619 8.99448 8.14175 8.10003C7.2473 7.20559 6.80008 6.11948 6.80008 4.8417C6.80008 3.58948 7.2473 2.5095 8.14175 1.60177C9.03619 0.695055 10.1223 0.241699 11.4001 0.241699C12.6779 0.241699 13.764 0.695055 14.6584 1.60177C15.5529 2.5095 16.0001 3.58948 16.0001 4.8417C16.0001 6.11948 15.5529 7.20559 14.6584 8.10003C13.764 8.99448 12.6779 9.4417 11.4001 9.4417ZM0.666748 20.5584V18.0284C0.666748 17.3895 0.852281 16.7951 1.22335 16.2451C1.59339 15.6962 2.08508 15.2684 2.69841 14.9617C4.15508 14.2717 5.60562 13.7539 7.05002 13.4084C8.49339 13.0639 9.94342 12.8917 11.4001 12.8917C12.8567 12.8917 14.3073 13.0639 15.7517 13.4084C17.1951 13.7539 18.6451 14.2717 20.1017 14.9617C20.7151 15.2684 21.2073 15.6962 21.5784 16.2451C21.9484 16.7951 22.1334 17.3895 22.1334 18.0284V20.5584H0.666748ZM2.20008 19.025H20.6001V18.0284C20.6001 17.6706 20.4917 17.3445 20.275 17.0501C20.0573 16.7567 19.7568 16.5078 19.3734 16.3034C18.0956 15.69 16.7862 15.2239 15.445 14.905C14.1028 14.585 12.7545 14.425 11.4001 14.425C10.0456 14.425 8.69784 14.585 7.35668 14.905C6.0145 15.2239 4.70453 15.69 3.42675 16.3034C3.04342 16.5078 2.74339 16.7567 2.52668 17.0501C2.30895 17.3445 2.20008 17.6706 2.20008 18.0284V19.025ZM11.4001 7.90837C12.2434 7.90837 12.9656 7.60783 13.5667 7.00677C14.1667 6.40672 14.4667 5.68503 14.4667 4.8417C14.4667 3.99837 14.1667 3.27668 13.5667 2.67663C12.9656 2.07557 12.2434 1.77503 11.4001 1.77503C10.5567 1.77503 9.83506 2.07557 9.23502 2.67663C8.63395 3.27668 8.33342 3.99837 8.33342 4.8417C8.33342 5.68503 8.63395 6.40672 9.23502 7.00677C9.83506 7.60783 10.5567 7.90837 11.4001 7.90837Z"
				fill="#DCEDEF"
			/>
		</svg>
	),
	themes: () => (
		<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M14.3234 28.2001C12.4579 28.2001 10.6884 27.8362 9.01503 27.1084C7.34063 26.3795 5.88396 25.3951 4.64503 24.1552C3.40508 22.9162 2.42068 21.4534 1.69183 19.7668C0.964009 18.0801 0.600098 16.2912 0.600098 14.4001C0.600098 12.4834 0.970653 10.6818 1.71176 8.9951C2.45288 7.30843 3.46232 5.84512 4.7401 4.60516C6.01788 3.36623 7.51952 2.38899 9.24503 1.67343C10.9695 0.957875 12.8157 0.600098 14.7834 0.600098C16.5723 0.600098 18.2718 0.90012 19.8818 1.50016C21.4918 2.10123 22.9101 2.93843 24.1368 4.01176C25.3634 5.0851 26.3473 6.36287 27.0884 7.8451C27.8295 9.32732 28.2001 10.9501 28.2001 12.7134C28.2001 15.0901 27.5167 16.9879 26.15 18.4067C24.7823 19.8245 22.9101 20.5334 20.5334 20.5334H17.8118C17.1729 20.5334 16.6362 20.7573 16.2018 21.205C15.7673 21.6517 15.5501 22.1818 15.5501 22.7951C15.5501 23.434 15.7418 23.9773 16.1251 24.425C16.5084 24.8717 16.7001 25.389 16.7001 25.9768C16.7001 26.7179 16.4895 27.2735 16.0684 27.6435C15.6462 28.0146 15.0645 28.2001 14.3234 28.2001ZM5.96676 15.1668C6.40121 15.1668 6.76563 15.0196 7.06003 14.7252C7.35341 14.4318 7.5001 14.0679 7.5001 13.6334C7.5001 13.199 7.35341 12.8346 7.06003 12.5402C6.76563 12.2468 6.40121 12.1001 5.96676 12.1001C5.53232 12.1001 5.1679 12.2468 4.8735 12.5402C4.58012 12.8346 4.43343 13.199 4.43343 13.6334C4.43343 14.0679 4.58012 14.4318 4.8735 14.7252C5.1679 15.0196 5.53232 15.1668 5.96676 15.1668ZM10.5668 9.03343C11.0012 9.03343 11.3656 8.88674 11.66 8.59336C11.9534 8.29896 12.1001 7.93454 12.1001 7.5001C12.1001 7.06565 11.9534 6.70123 11.66 6.40683C11.3656 6.11345 11.0012 5.96676 10.5668 5.96676C10.1323 5.96676 9.76841 6.11345 9.47503 6.40683C9.18063 6.70123 9.03343 7.06565 9.03343 7.5001C9.03343 7.93454 9.18063 8.29896 9.47503 8.59336C9.76841 8.88674 10.1323 9.03343 10.5668 9.03343ZM18.2334 9.03343C18.6679 9.03343 19.0323 8.88674 19.3267 8.59336C19.6201 8.29896 19.7668 7.93454 19.7668 7.5001C19.7668 7.06565 19.6201 6.70123 19.3267 6.40683C19.0323 6.11345 18.6679 5.96676 18.2334 5.96676C17.799 5.96676 17.4351 6.11345 17.1417 6.40683C16.8473 6.70123 16.7001 7.06565 16.7001 7.5001C16.7001 7.93454 16.8473 8.29896 17.1417 8.59336C17.4351 8.88674 17.799 9.03343 18.2334 9.03343ZM22.8334 15.1668C23.2679 15.1668 23.6318 15.0196 23.9252 14.7252C24.2196 14.4318 24.3668 14.0679 24.3668 13.6334C24.3668 13.199 24.2196 12.8346 23.9252 12.5402C23.6318 12.2468 23.2679 12.1001 22.8334 12.1001C22.399 12.1001 22.0351 12.2468 21.7417 12.5402C21.4473 12.8346 21.3001 13.199 21.3001 13.6334C21.3001 14.0679 21.4473 14.4318 21.7417 14.7252C22.0351 15.0196 22.399 15.1668 22.8334 15.1668ZM14.3234 26.6668C14.6045 26.6668 14.8156 26.609 14.9567 26.4935C15.0967 26.379 15.1668 26.2068 15.1668 25.9768C15.1668 25.619 14.9751 25.2357 14.5918 24.8268C14.2084 24.4179 14.0168 23.7534 14.0168 22.8334C14.0168 21.709 14.3873 20.789 15.1284 20.0734C15.8695 19.3579 16.7768 19.0001 17.8501 19.0001H20.5334C22.4501 19.0001 23.9517 18.4312 25.0384 17.2935C26.124 16.1568 26.6668 14.6301 26.6668 12.7134C26.6668 9.59565 25.4723 7.05288 23.0834 5.0851C20.6934 3.11732 17.9268 2.13343 14.7834 2.13343C11.2312 2.13343 8.23508 3.32176 5.79503 5.69843C3.35396 8.0751 2.13343 10.9757 2.13343 14.4001C2.13343 17.799 3.32841 20.6934 5.71836 23.0834C8.1073 25.4723 10.9757 26.6668 14.3234 26.6668Z"
				fill="#DCEDEF"
			/>
		</svg>
	),
	privacy: () => (
		<svg width="23" height="29" viewBox="0 0 23 29" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M9.78984 18.7698L17.3798 11.1798L16.3065 10.0682L9.78984 16.5848L6.49317 13.3265L5.41984 14.3998L9.78984 18.7698ZM11.3998 28.1232C8.30762 27.2287 5.74542 25.3693 3.71324 22.5449C1.68208 19.7215 0.666504 16.5465 0.666504 13.0198V4.73984L11.3998 0.714844L22.1332 4.73984V13.0198C22.1332 16.5465 21.1171 19.7215 19.0849 22.5449C17.0537 25.3693 14.4921 27.2287 11.3998 28.1232ZM11.3998 26.5132C14.0576 25.6698 16.2554 23.9832 17.9932 21.4532C19.7309 18.9232 20.5998 16.1121 20.5998 13.0198V5.77484L11.3998 2.36318L2.19984 5.77484V13.0198C2.19984 16.1121 3.06873 18.9232 4.8065 21.4532C6.54428 23.9832 8.74206 25.6698 11.3998 26.5132Z"
				fill="#DCEDEF"
			/>
		</svg>
	),
	terms: () => (
		<svg width="23" height="29" viewBox="0 0 23 29" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M6.03317 22.8334H16.7665V21.3001H6.03317V22.8334ZM6.03317 16.7001H16.7665V15.1668H6.03317V16.7001ZM3.15817 28.2001C2.44262 28.2001 1.8487 27.964 1.37644 27.4917C0.903148 27.0184 0.666504 26.424 0.666504 25.7084V3.09176C0.666504 2.37621 0.903148 1.78179 1.37644 1.3085C1.8487 0.836231 2.44262 0.600098 3.15817 0.600098H15.2332L22.1332 7.5001V25.7084C22.1332 26.424 21.897 27.0184 21.4248 27.4917C20.9515 27.964 20.3571 28.2001 19.6415 28.2001H3.15817ZM14.4665 8.26676V2.13343H3.15817C2.90262 2.13343 2.67926 2.22952 2.4881 2.4217C2.29593 2.61285 2.19984 2.83621 2.19984 3.09176V25.7084C2.19984 25.964 2.29593 26.1873 2.4881 26.3785C2.67926 26.5707 2.90262 26.6668 3.15817 26.6668H19.6415C19.8971 26.6668 20.1204 26.5707 20.3116 26.3785C20.5037 26.1873 20.5998 25.964 20.5998 25.7084V8.26676H14.4665Z"
				fill="#DCEDEF"
			/>
		</svg>
	)
};

export const PageTitle = ({ title, Icon, onBack }: { title: string; Icon: any; onBack?: any }) => (
	<PageTitleStyled className="fade-in">
		<div className="main-icon">
			<Icon />
		</div>
		<button onClick={onBack} className="back-arrow-icon">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825L9.425 14.6L8 16Z" fill="#DCEDEF" />
			</svg>
		</button>
		<h2>{title}</h2>
	</PageTitleStyled>
);

export default function DefaultView() {
	const { setIsSettingsMobileMenuOpen } = useGeneralSettingsContext();

	const location = useLocation();

	switch (location.pathname) {
		case '/general-settings/themes':
			return (
				<InnerPageStyled className="themes">
					<PageTitle title="Themes" Icon={Icons.themes} onBack={() => setIsSettingsMobileMenuOpen?.(true)} />
					<div className="content">
						<div className="coming-soon"></div>
					</div>
				</InnerPageStyled>
			);

		case '/general-settings/privacy':
			return (
				<InnerPageStyled className="privacy">
					<PageTitle
						title="Privacy Policy"
						Icon={Icons.privacy}
						onBack={() => setIsSettingsMobileMenuOpen?.(true)}
					/>
					<div className="fade-in-delay content">
						<div className="inner">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
						</div>
						<div className="fader"></div>
					</div>
				</InnerPageStyled>
			);

		case '/general-settings/terms':
			return (
				<InnerPageStyled className="fade-in-delay terms">
					<PageTitle
						title="Terms and conditions"
						Icon={Icons.terms}
						onBack={() => setIsSettingsMobileMenuOpen?.(true)}
					/>
					<div className="content">
						<div className="inner">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
							<h3>Some heading</h3>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
								ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
								auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque.
							</p>
						</div>
						<div className="fader"></div>
					</div>
				</InnerPageStyled>
			);
			break;

		default:
			return <div className="">404</div>;
	}
}
