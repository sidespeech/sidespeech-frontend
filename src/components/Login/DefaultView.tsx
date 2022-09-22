import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../redux/store/app.store";
import Login from "./Login";
import MiddleContainerHeader from "../ui-components/MiddleContainerHeader";
import CreateColonyModal from "../Modals/CreateColonyModal";
import SelectColonyModal from "../Modals/SelectColonyModal";
import Button from "../ui-components/Button";
import logoShape from "../../assets/logoshape.svg";
import "./DefaultView.css";
import { reduceWalletAddress } from "../../helpers/utilities";
import UserProfileModal from "../Modals/UserProfileModal";
import { Colony } from "../../models/Colony";

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

  const showProfile = () => {
    setShowProfileModal(true);
  };

  return (
    <>
      {userData.user ? (
        <>
          <div className="middle-container-center relative">
            <div className="f-column align-center" style={{ zIndex: 20 }}>
              <div className="fw-700 size-40 text-white">Welcome to Colony</div>
              <div className="text-secondary fw-400 size-20">
                {reduceWalletAddress(userData.account || "")}
              </div>
              <SeparatorHorizontal />
              <span className="fw-400 size-22 text-secondary">
                What do you want to do?
              </span>
              <Button
                classes="fw-700 size-22 button-margin"
                width={367}
                height={66}
                onClick={() => setShowColonyModal(true)}
              >
                Create a new Colony
              </Button>
              <Button
                classes="fw-700 size-22"
                width={367}
                height={66}
                onClick={() => setShowSelecteColonyModal(true)}
              >
                Find an existing Colony
              </Button>
            </div>
            <img
              className="absolute"
              style={{ zIndex: 0 }}
              src={logoShape}
              alt="shape"
            />
          </div>
        </>
      ) : (
        <Login />
      )}

      {showColonyModal && <CreateColonyModal showModal={setShowColonyModal} />}
      {showSelecteColonyModal && (
        <SelectColonyModal
          setSelectedColony={setSelectedColony}
          setShowProfileModal={showProfile}
          showModal={setShowSelecteColonyModal}
        />
      )}
      <div
        className="flex justify-between text-secondary size-12 fw-400"
        style={{
          width: "calc(100% - 70px)",
          padding: "0px 13px",
          position: "absolute",
          bottom: 10,
          right: 0,
        }}
      >
        <div className="flex">
          <div>Privacy policy</div>
          <div className="mx-2">|</div>
          <div>Terms and Conditions</div>
        </div>
        <div> © Copyright 2022</div>
      </div>
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
