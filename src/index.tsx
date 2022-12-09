// General imports
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './redux/store/app.store';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import App from './App';
import ChannelView from './components/CurrentColony/CurrentSideMiddle/ChannelView';
import CurrentColony from './components/CurrentColony/CurrentSide';
import CurrentSideMiddle from './components/CurrentColony/CurrentSideMiddle/CurrentSideMiddle';
import DashboardPage from './components/dashboard/DashboardPage';
import GeneralSettings from './components/GeneralSettings/DefaultView';
import GeneralSettingsAccount from './components/GeneralSettings/Account/GeneralSettingsAccount';
import Login from './components/Login/Login';
import NewSide from './components/NewSide/NewSide';
import OnBoarding from './components/OnBoarding/Onboarding';
import PublicUserProfile from './components/PublicUserProfile/PublicUserProfile';
import Settings from './components/CurrentColony/settings/Settings';
import UserProfile from './components/CurrentColony/UserProfile/UserProfile';

// Styles
import 'react-leaf-polls/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';
import './override.css';
import './index.css';
import './animations.css';

ReactDOM.render(
	<Provider store={store}>
		<ToastContainer
			position="bottom-right"
			autoClose={5000}
			hideProgressBar={true}
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable={false}
			pauseOnHover
			toastStyle={{
				background: 'var(--input)',
				color: 'white'
			}}
		/>
		<React.StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />}>
						<Route index element={<DashboardPage />} />
						<Route path="/login" element={<Login />} />
						<Route path="/my-sides" element={<DashboardPage />} />
						<Route path="/invitations" element={<DashboardPage />} />
						<Route path="/search" element={<DashboardPage />} />
						<Route path="new-side" element={<NewSide />} />
						<Route path="side/:id" element={<CurrentColony />}>
							<Route path="profile/:username" element={<UserProfile />} />
							<Route path="settings" element={<Settings />} />
							<Route path="thread/:announcementId" element={<ChannelView />} />
							<Route index element={<CurrentSideMiddle />} />
						</Route>
						<Route path="/onboarding" element={<OnBoarding />} />
						<Route path="/general-settings" element={<GeneralSettingsAccount />} />
						<Route path="/general-settings/:page" element={<GeneralSettings />} />
						<Route path="/user/:username" element={<PublicUserProfile />} />
					</Route>
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</BrowserRouter>
		</React.StrictMode>
	</Provider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
