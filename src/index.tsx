import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import { store } from './redux/store/app.store';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DefaultView from './components/Login/DefaultView';
import CurrentColony from './components/CurrentColony/CurrentSide';
import 'react-leaf-polls/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';
import './override.css';
import './index.css';
import Settings from './components/CurrentColony/settings/Settings';
import NewSide from './components/NewSide/NewSide';

// Onboarding
import OnBoarding from './components/OnBoarding/Onboarding';

// General Settings
import GeneralSettings from './components/GeneralSettings/DefaultView';
import GeneralSettingsAccount from './components/GeneralSettings/Account/GeneralSettingsAccount';

import UserProfile from './components/CurrentColony/UserProfile/UserProfile';
import PublicUserProfile from './components/PublicUserProfile/PublicUserProfile';
import CurrentSideMiddle from './components/CurrentColony/CurrentSideMiddle/CurrentSideMiddle';
import ChannelView from './components/CurrentColony/CurrentSideMiddle/ChannelView';

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
                        <Route index element={<DefaultView />} />
                        <Route path="/my-sides" element={<DefaultView />} />
                        <Route path="/invitations" element={<DefaultView />} />
                        <Route path="/search" element={<DefaultView />} />
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
