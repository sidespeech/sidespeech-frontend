import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { checkUserEligibility, fixURL } from "../../helpers/utilities";
import { NFT } from "../../models/interfaces/nft";
import { Role } from "../../models/Profile";
import { Side } from "../../models/Side";
import { RootState } from "../../redux/store/app.store";
import { apiService } from "../../services/api.service";
import Button from "../ui-components/Button";
import Modal from "../ui-components/Modal";
import { RoundedImageContainer } from "../ui-components/styled-components/shared-styled-components";
import check from "../../assets/check.svg";
import { OpenSeaRequestStatus } from "../../models/interfaces/collection";

const eligibilityTexts = {
  success: {
    title: "Nice",
    message:
      "Your wallet meets the requirements to join this Side. You can now join it.",
  },
  error: {
    title: "Sadly",
    message: "Your wallet does not meets the requirements to join this Side.",
  },
};

interface IEligibilityResultProps {
  isEligible: boolean;
}

const ConditionsContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  background-color: #00000033;
  padding: 23px 28px 10px 30px;
`;

const ConfitionItem = styled.div`
  width: 100%;
  padding: 19px 0px 23px 0px;
  display: flex;
`;

const ErrorNft = styled.div`
  background: var(--disable);
  border: 1px dashed var(--inactive);
  border-radius: 7px;
  height: 62px;
  width: 62px;
  left: 72px;
`;

const EligibilityResult = styled.div<IEligibilityResultProps>`
  width: 100%;
  background-color: ${(props) =>
    props.isEligible ? "var(--green-opacity)" : "var(--red-opacity)"};
  border: 1px solid
    ${(props) => (props.isEligible ? "var(--green)" : "var(--red)")};
  & div:first-child {
    color: ${(props) => (props.isEligible ? "var(--green)" : "var(--red)")};
  }
  padding: 30px;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 30px;
`;
const NftImage = styled.img`
  min-height: 62px;
  min-width: 62px;
  height: 62px;
  width: 62px;
  border-radius: 7px;
  object-fit: cover;
`;
const Chip = styled.span`
  width: fit-content;
  border-radius: 5px;
  background-color: var(--disable);
  padding: 1px 8px;
`;
interface ISideEligibilityModalProps {
  selectedSide: Side;
  setDisplayEligibility: any;
}

export default function SideEligibilityModal(
  props: ISideEligibilityModalProps
) {
  const { userCollectionsData, user } = useSelector(
    (state: RootState) => state.user
  );

  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [details, setDetails] = useState<any>([]);

  const handleJoinSide = () => {
    if (user) apiService.joinSide(user.id, props.selectedSide.id, Role.User);
  };

  useEffect(() => {
    if (userCollectionsData) {
      const [res, isEligible] = checkUserEligibility(
        userCollectionsData,
        props.selectedSide
      );
      setIsEligible(isEligible);
      setDetails(res);
    }
  }, [userCollectionsData]);

  if (!userCollectionsData) return;

  return (
    <Modal
      body={
        <>
          <RoundedImageContainer height="104px" width="104px" radius={60}>
            <img src={props.selectedSide?.sideImage} width="100%" alt="side" />
          </RoundedImageContainer>
          <h2>{props.selectedSide.name}</h2>
          <div className="text-center">
            {props.selectedSide.description}fseufnuseif fesfiesuf ieufnesif
            pkzpof esibfse qbzdnizqdn esfnoesinf qnqzdo fesfunqoidfnoif eoinff
            qzidnf ofo fisnfe onq foie qonf qefjnosne sseonso ienf qopa pesoj
            q,, neqen eonfo oenfoes
          </div>
          <EligibilityResult isEligible={isEligible}>
            <div>
              {isEligible
                ? eligibilityTexts.success.title
                : eligibilityTexts.error.title}
            </div>
            <div>
              {isEligible
                ? eligibilityTexts.success.message
                : eligibilityTexts.error.message}
            </div>
          </EligibilityResult>
          <ConditionsContainer>
            <div className="fw-700 mb-4">Conditions</div>
            <div
              className="w-100"
              style={{ maxHeight: "30vh", overflow: "auto",paddingRight: 10, paddingTop: 10 }}
            >
              {Object.values(details).map((d: any) => {
                return d.map((v: any) => {
                  if (v.type.includes("number")) return;
                  const nft = v.usefulNfts ? v.usefulNfts[0] : null;
                  const num = v.usefulNfts?.length - 1;
                  const collection = userCollectionsData[v.id];
                  const isError = v.type.includes("error");
                  return (
                    <>
                      <div className="f-column">
                        <div
                        className="flex justify-between align-center"
                          style={{
                            borderBottom: "1px solid var(--disable)",
                            paddingBottom: 10,
                          }}
                        >
                          <div className="flex align-center">
                            {" "}
                            <span className="mr-2">-</span>
                            {collection?.name}{" "}
                            {collection?.openseaData.safelistRequestStatus ===
                              OpenSeaRequestStatus.verified && (
                              <img alt="check" width={18} className="ml-2" src={check} />
                            )}
                          </div>
                            {isError ? (
                              <i className="fa-solid fa-circle-xmark text-red size-18"></i>
                            ) : (
                              <i className="fa-solid fa-circle-check text-green size-18"></i>
                            )}
                        </div>
                        <ConfitionItem>
                          {v.type === "error-attributes" && <ErrorNft />}
                          {v.type === "success-attributes" && (
                            <NftImage
                              src={fixURL(nft.metadata.image)}
                              alt="nft visual"
                            />
                          )}

                          <div className="f-column justify-evenly ml-3">
                            {v.type === "success-attributes" && (
                              <div>
                                <span>
                                  {collection.name} #{nft.token_id}{" "}
                                  {num > 0 && <Chip> +{num}</Chip>}
                                </span>
                              </div>
                            )}
                            <div>
                              <span className={`${isError ? "text-red" : "text-green"} mr-5`}>
                                {isError ? (
                                  <i className="fa-solid fa-xmark mr-1"></i>
                                ) : (
                                  <i className="fa-solid fa-check mr-1"></i>
                                )}
                                1{" - "}
                                {v.property}
                              </span>
                              <span>{v.value}</span>
                            </div>
                          </div>
                        </ConfitionItem>
                      </div>
                    </>
                  );
                });
              })}
            </div>
          </ConditionsContainer>
        </>
      }
      footer={
        <Button
          classes="mt-3"
          disabled={!isEligible}
          children={"Join now"}
          onClick={handleJoinSide}
        />
      }
      title={undefined}
      showModal={props.setDisplayEligibility}
    />
  );
}
