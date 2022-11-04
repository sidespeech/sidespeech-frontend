import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import TextArea from "../../../ui-components/TextArea";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./requests.css";
import { apiService } from "../../../../services/api.service";
import { addColony } from "../../../../redux/Slices/UserDataSlice";
import { RootState } from "../../../../redux/store/app.store";
import { Side } from "../../../../models/Side";
import { User } from "../../../../models/User";


export default function Requests({
  currentSide, userData
}: {
  currentSide: Colony;
  userData: any;
}) {


  const dispatch = useDispatch();

  useEffect(() => {
    console.log('currentSide :', currentSide)
    console.log('userData :', userData)

    const getInvitationUsers = async (user:User, currentSide:Side) => {
      // let userSides = user.profiles.map((p:Profile) => p.side);
      // let users = await apiService.getUserFromSides(userSides);
      // let invitationsUsersObject = []
      // delete user['profiles'];
      // for (let userInvite of users) {
      //   if (user['id'] !== userInvite['id'])
      //   invitationsUsersObject.push({
      //     name : (userInvite['username']) ? `${userInvite['username']} (${userInvite['accounts']})` : userInvite['accounts'],
      //     invited: false,
      //     recipient : userInvite,
      //     sender: user
      //   })
      // }
      // setInvitationUsers(invitationsUsersObject)
    }  
    getInvitationUsers(userData, currentSide);


    }, [currentSide, userData]);

  return (
    <>
    </>
  );
}
