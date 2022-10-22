import React from "react";
import { useSelector } from "react-redux";

// CSS Import
import "./../DefaultView.css";
import "./Account.css";

// Example NFT icon.
import { RootState } from "../../../redux/store/app.store";
import NftsCollections from "./NftsCollections";
import UserGeneralInformations from "./UserGeneralInformations";

export default function GeneralSettingsAccount() {
  const userData = useSelector((state: RootState) => state.user);

  return (
    <>
      {userData && userData.user && (
        <div className="account">
          <UserGeneralInformations user={userData.user} />

          <NftsCollections
            user={userData.user}
            userCollectionsData={userData.userCollectionsData}
          />
        </div>
      )}
    </>
  );
}
