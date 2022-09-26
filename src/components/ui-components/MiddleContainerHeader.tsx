import React, { useState } from "react";
import InputText from "./InputText";
import { disconnect } from "../../redux/Slices/UserDataSlice";

import { useDispatch, useSelector } from "react-redux";
import UserProfileModal from "../Modals/UserProfileModal";
import { RootState } from "../../redux/store/app.store";

export default function MiddleContainerHeader() {
  const [displayProfile, setDisplayProfile] = useState<boolean>(false);

  const { currentColony } = useSelector((state: RootState) => state.appDatas);
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className="middle-container-top">
      <InputText
        width={"335px"}
        padding={"0px 40px 0px 20px"}
        height={35}
        onChange={undefined}
        iconRightPos={{ top: 6, right: 16 }}
        placeholder={""}
      />
      <img
        onClick={() => setDisplayProfile(true)}
        className="profile-round pointer"
        alt="profile"
        src={user?.get("profilePicture")?.url}
      />
      {displayProfile && currentColony && (
        <UserProfileModal
          colony={currentColony}
          showModal={setDisplayProfile}
        />
      )}
    </div>
  );
}
