import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../redux/store/app.store";
import Login from "./Login";
import CreateColonyModal from "../Modals/CreateColonyModal";
import SelectColonyModal from "../Modals/SelectColonyModal";
import "./DefaultView.css";
import UserProfileModal from "../Modals/UserProfileModal";
import { useNavigate } from "react-router";

import CurrentColony from "../CurrentColony/CurrentColony";

interface ISeparatorHorizontal {
  borderColor?: string;
  margin?: string;
}

export const SeparatorHorizontal = styled.div<ISeparatorHorizontal>`
  min-width: 535px;
  border-top: 1px solid
    ${(props) =>
      props.borderColor ? props.borderColor : "var(--bg-secondary-light)"};
  margin: ${(props) => (props.margin ? props.margin : "34px 0px 50px 0px")}; ;
`;

export default function DefaultView() {
  const [showColonyModal, setShowColonyModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showSelecteColonyModal, setShowSelecteColonyModal] =
    useState<boolean>(false);
  const [selectedColony, setSelectedColony] = useState<Colony | null>(null);
  const userData = useSelector((state: RootState) => state.user);

  /**** 
   * 
   *  Will change to persisted reducer eventually....
   * 
  ***/
  
   const userStorage = localStorage.getItem("userAccount");

  const navigate = useNavigate();

  const showProfile = () => {
    setShowProfileModal(true);
  };

  return (
    <>
      {userData.account === null && userStorage == null ? (
        <Login />
      ) : (
        <CurrentColony />
      )}

      {showColonyModal && <CreateColonyModal showModal={setShowColonyModal} />}
      {showSelecteColonyModal && (
        <SelectColonyModal
          setSelectedColony={setSelectedColony}
          setShowProfileModal={showProfile}
          showModal={setShowSelecteColonyModal}
        />
      )}

      {selectedColony && showProfileModal && (
        <UserProfileModal
          colony={selectedColony}
          showModal={setShowProfileModal}
          join
        />
      )}
    </>
  );
}
