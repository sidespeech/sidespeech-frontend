import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  checkUserEligibility,
  fixURL
} from "../../helpers/utilities";
import { NFT } from "../../models/interfaces/nft";
import { Side } from "../../models/Side";
import { RootState } from "../../redux/store/app.store";
import { apiService } from "../../services/api.service";
import Button from "../ui-components/Button";
import Modal from "../ui-components/Modal";
import { RoundedImageContainer } from "../ui-components/styled-components/shared-styled-components";

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
`;
const NftImage = styled.img`
  min-height: 62px;
  min-width: 62px;
  height: 62px;
  width: 62px;
  border-radius: 7px;
  object-fit: cover;
`;

interface ISideEligibilityModalProps {
  selectedSide: Side;
  setDisplayEligibility: any;
}

export default function SideEligibilityModal(
  props: ISideEligibilityModalProps
) {
  const { userCollectionsData, user } = useSelector((state: RootState) => state.user);

  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [details, setDetails] = useState<any[]>([]);

  const handleJoinSide = () => {
    if (user) apiService.joinSide(user.id, props.selectedSide.id);
  };

  useEffect(() => {
    if (userCollectionsData) {
      const res = checkUserEligibility(userCollectionsData, props.selectedSide);
      setIsEligible(!res.some((r) => r.type === "error") && res.length > 0);
      setDetails(res);
    }
  }, [userCollectionsData]);

  return (
    <Modal
      body={
        <>
          <RoundedImageContainer height="104px" width="104px" radius={60}>
            <img src={props.selectedSide?.sideImage} width="100%" alt="side" />
          </RoundedImageContainer>
          <h2>{props.selectedSide.name}</h2>
          <div>{props.selectedSide.description}</div>
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
            <div>Conditions</div>
            {details.map((d) => {
              console.log(d)
              return (
                <div className="f-column">
                  <div>{userCollectionsData[d.id].name}</div>
                  <div className="flex">
                    {d.usefulNfts.map((nft: NFT) => {
                      const metadata = nft.metadata;
                      return (
                        <div>
                          {userCollectionsData[d.id].name} #{nft.token_id}
                          <div>
                            <NftImage
                              src={fixURL(metadata.image)}
                              alt="nft visual"
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div>
                      <div>{d.property}</div>
                      <div>{d.value}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ConditionsContainer>
        </>
      }
      footer={<Button children={"Join now"} onClick={handleJoinSide} />}
      title={undefined}
      showModal={props.setDisplayEligibility}
    />
  );
}
