import React, { useState } from "react";
import InputText from "./InputText";
import { disconnect } from "../../redux/Slices/UserDataSlice";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/app.store";
import { Room } from "../../models/Room";
import { fixURL } from "../../helpers/utilities";

export default function MiddleContainerHeader({ room }: { room: Room | null }) {
  const [displayProfile, setDisplayProfile] = useState<boolean>(false);

  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const { user, currentProfile } = useSelector(
    (state: RootState) => state.user
  );

  return (
    <div className="middle-container-top">
      {room && (
        <div className="size-20 mr-auto ml-3">
          {room.getRoomNameForUser(currentProfile?.username)}
        </div>
      )}
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
        src={fixURL(
          user?.profiles?.find((a) => a.side?.id === currentSide?.id)
            ?.profilePicture.token_uri || ""
        )}
      />
    </div>
  );
}
