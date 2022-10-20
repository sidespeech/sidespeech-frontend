import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store/app.store";

import CreateColonyModal from "../Modals/CreateColonyModal";
import "./UserColonies.css";

export default function UserColonies() {
  const userData = useSelector((state: RootState) => state.user);
  const [showCreateModal, setshowCreateModal] = useState<boolean>(false);
  const [collectionHolder, setCollectionHolder] = useState<string[]>([]);
  const [isSubscribe, setIsSubscribe] = useState<boolean>(false);

  const navigate = useNavigate();

  const displayColony = (id: string) => {
    navigate(id);
  };

  const changeStateModal = (value: boolean) => {
    // Iteration throw nft user to get every collection is holder
    let collections = Object.keys(userData["nfts"]);
    setCollectionHolder(collections);
    setshowCreateModal(value);
  };

  useEffect(() => {
    if (userData && userData.sides.length > 0 && !isSubscribe) {
    }

    return () => {};
  }, [userData]);

  return (
    <>
      <div className="f-column align-center mt-3" style={{ gap: 15 }}>
        {userData.sides.map((c) => {
          return (
            <div
              onClick={() => {
                displayColony(c.id);
              }}
              className="colony-badge pointer"
              key={c.id}
            >
              <img alt="colony-icon" src={c.sideImage} />
            </div>
          );
        })}
        <Link to={"/"}>
          <i
            className="fa-solid fa-plus mt-3 size-24 pointer text-secondary-dark"
            onClick={() => changeStateModal(true)}
          ></i>
        </Link>
      </div>
      {showCreateModal && (
        <CreateColonyModal
          showModal={setshowCreateModal}
          collections={collectionHolder}
        />
      )}
    </>
  );
}
