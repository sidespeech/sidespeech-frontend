import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Colony } from "../../models/Colony";

import Button from "../ui-components/Button";
import InputText from "../ui-components/InputText";
import Modal from "../ui-components/Modal";
import { FadeLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/app.store";

import { weiToDecimals } from "../../helpers/utilities";

import { addColony } from "../../redux/Slices/UserDataSlice";
import { setCurrentColony } from "../../redux/Slices/AppDatasSlice";

const ListContainer = styled.div`
  background-color: var(--bg-primary);
  max-height: 380px;
  border-radius: 10px;
  overflow-y: auto;
  padding-right: 8px;
`;
const ColonyBadge = styled.div`
  width: 60px;
  height: 60px;
  background-color: var(--bg-secondary-dark);
  border-radius: 30px;
  overflow: hidden;
  & img {
    object-fit: cover;
    width: 51px;
    height: 51px;
  }
`;

const ColonyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 545px;
  height: 82px;
  border-bottom: 1px solid #e1e9ef;
  padding: 21px 23px 21px 18px;
  margin-top: 8px;
`;

export default function SelectColonyModal({
  setSelectedColony,
  showModal,
  setShowProfileModal,
}: {
  setSelectedColony: any;
  showModal: any;
  setShowProfileModal: any;
}) {
  const [colonies, setColonies] = useState<Colony[]>([]);
  const [loading, setloading] = useState<boolean>(false);

  const { userTokens } = useSelector((state: RootState) => state.user);
  const { currentColony } = useSelector((state: RootState) => state.appDatas);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getColos() {}
    getColos();
  }, []);

  const handleJoinColony = async (c: Colony) => {
    if (!userTokens) return;
    const token = userTokens.ERC20Tokens?.find(
      (token) => token.token_address === c.nftTokenAddress
    );
    if (!token) {
      toast.error("No token required", { toastId: 100 });
      return;
    }

    if (res < c.tokenRequired) {
      toast.error("You do not have anaf token to join this Colony", {
        toastId: 100,
      });
      return;
    }
    try {
      setSelectedColony(c);
      setShowProfileModal(true);
      showModal(true);
    } catch (error) {
      console.log(error);
      toast.error("Error when joining the Colony.", { toastId: 5 });
    }
  };

  const handleSearchColony = (event: any) => {};

  return (
    <Modal
      showModal={showModal}
      body={
        <>
          <div className="w-100">
            <InputText
              padding={"0px 40px 0px 20px"}
              height={44}
              radius={loading ? "22px 22px 0px 0px" : "90px"}
              weight={600}
              size={16}
              color={"white"}
              onChange={handleSearchColony}
              iconRightPos={{ top: 12, right: 23 }}
              iconSize={16}
              placeholderColor={"#43475F"}
              placeholderWeight={60}
              placeholderSize={16}
              placeholder={"Search a Colony"}
            />
            {loading && (
              <div
                className="w-100 flex align-center justify-center"
                style={{
                  height: 111,
                  background: "var(--bg-primary)",
                  border: "1px solid var(--bg-secondary-dark)",
                  borderRadius: "0px 0px 22px 22px",
                }}
              >
                <FadeLoader
                  cssOverride={{
                    transform: "scale(1.2)",
                    marginTop: 22,
                    marginLeft: 22,
                  }}
                  color="var(--bg-primary-light)"
                  height={7}
                  width={7}
                  radius={7}
                />
              </div>
            )}
          </div>
          <div
            style={{ marginTop: 28, textAlign: "left" }}
            className="fw-700 size-12 w-100 mb-1"
          >
            MOST POPULAR COLONY
          </div>
          <ListContainer>
            {colonies.map((c) => {
              return (
                <ColonyItem key={c.id}>
                  <div className="flex align-center">
                    <ColonyBadge className="mr-3">
                      <img alt="colony-icon" src={c.image} />
                    </ColonyBadge>
                    <div>{c.name}</div>
                  </div>
                  <Button
                    width={89}
                    height={39}
                    onClick={() => handleJoinColony(c)}
                  >
                    Join
                  </Button>
                </ColonyItem>
              );
            })}
          </ListContainer>
        </>
      }
      footer={undefined}
      title={<span>Find an existing colony</span>}
    />
  );
}
