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
        // <>
        //   <div className="middle-container-center relative">
        //     <div className="f-column align-center" style={{ zIndex: 20 }}>
        //       <div className="fw-700 size-40 text-white">
        //         Welcome to SideSpeech
        //       </div>
        //       <div className="text-secondary fw-400 size-20">
        //         {reduceWalletAddress(userData.account || "")}
        //       </div>
        //       <SeparatorHorizontal />
        //       <span className="fw-400 size-22 text-secondary">
        //         What do you want to do?
        //       </span>

        //       <Button
        //         classes="fw-700 size-22 button-margin"
        //         width={367}
        //         height={66}
        //         onClick={() => navigate("/UserProfileModal")}
        //       >
        //         Create a Side server
        //       </Button>
        //       <Button
        //         classes="fw-700 size-22"
        //         width={367}
        //         height={66}
        //         onClick={() => setShowSelecteColonyModal(true)}
        //       >
        //         Find an existing Side server
        //       </Button>
        //     </div>
        //     <img
        //       className="absolute"
        //       style={{ zIndex: 0 }}
        //       src={logoShape}
        //       alt="shape"
        //     />
        //   </div>
        // </>
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
