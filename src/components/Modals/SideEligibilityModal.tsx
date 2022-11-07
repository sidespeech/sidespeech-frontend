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
import { OpenSeaRequestStatus } from "../../models/interfaces/collection";
import Eligibility from "../CurrentColony/settings/eligibility/eligibility";

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

  if (!userCollectionsData) return<></>;

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
          <Eligibility side={props.selectedSide} />
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
