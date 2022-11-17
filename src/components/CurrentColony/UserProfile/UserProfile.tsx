import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../redux/store/app.store";
import { apiService } from "../../../services/api.service";
import PublicUserProfile from "../../PublicUserProfile/PublicUserProfile";

export default function UserProfile() {
  const { selectedProfile } = useSelector((state: RootState) => state.appDatas);

  useEffect(() => {}, []);

  return (
    <>{selectedProfile && <PublicUserProfile profile={selectedProfile} />}</>
  );
}
