import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MoralisProvider } from "react-moralis";
import { Provider } from "react-redux";
import { store } from "./redux/store/app.store";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultView from "./components/Login/DefaultView";
import CurrentColony from "./components/CurrentColony/CurrentColony";
import "react-leaf-polls/dist/index.css";
import "react-toastify/dist/ReactToastify.css";
import "./override.css";
import "./index.css";
import { APP_ID, SERVER_URL } from "./constants/constants";

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
        background: "var(--bg-secondary-dark)",
        color: "white",
      }}
    />
    <React.StrictMode>
      <MoralisProvider
        serverUrl={SERVER_URL}
        appId={APP_ID}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path=":id" element={<CurrentColony />} />
              <Route index  element={<DefaultView />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MoralisProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
