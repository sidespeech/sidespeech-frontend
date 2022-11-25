import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  checkUserEligibility,
  fixURL,
  getRandomId,
} from "../../helpers/utilities";
import { NFT } from "../../models/interfaces/nft";
import { Role } from "../../models/Profile";
import { Side, SideStatus } from "../../models/Side";
import { RootState } from "../../redux/store/app.store";
import { apiService } from "../../services/api.service";
import Button from "../ui-components/Button";
import Modal from "../ui-components/Modal";
import { RoundedImageContainer } from "../ui-components/styled-components/shared-styled-components";
import { OpenSeaRequestStatus } from "../../models/interfaces/collection";
import Eligibility from "../CurrentColony/settings/eligibility/eligibility";
import { toast } from "react-toastify";
import {
  addUserParsedSide,
  updateProfiles,
} from "../../redux/Slices/UserDataSlice";
import { State, Type } from "../../models/Invitation";

const eligibilityTexts = {
  success: {
    title: "You are eligible.",
    message:
      "Your wallet meets the requirements to join this Side. You can now join it.",
  },
  error: {
    title: "You are not eligible.",
    message: "Your wallet does not meets the requirements to join this Side.",
  },
  inactive: {
    title: "You are not eligible.",
    message:
      "You are no longer eligible for this Side, get the NFTs you need to regain access or choose a Sub-admin user to leave the Side.",
  },
};

interface IEligibilityResultProps {
  isEligible: boolean;
  info: boolean;
}

const EligibilityResult = styled.div<IEligibilityResultProps>`
  width: 100%;
  background-color: ${(props) =>
    props.info
      ? "var(--primary-opacity)"
      : props.isEligible
      ? "var(--green-opacity)"
      : "var(--red-opacity)"};
  border: 1px solid
    ${(props) =>
      props.info
        ? "var(--primary)"
        : props.isEligible
        ? "var(--green)"
        : "var(--red)"};
  & div:first-child {
    color: ${(props) =>
      props.info
        ? "var(--primary)"
        : props.isEligible
        ? "var(--green)"
        : "var(--red)"};
  }
  padding: 30px;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 30px;
  text-align: left;
`;
interface ISideEligibilityModalProps {
  selectedSide: Side;
  setDisplayEligibility: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayLeaveSide: React.Dispatch<React.SetStateAction<boolean>>;
  isSideAdmin?: boolean;
}

export default function SideEligibilityModal(
  props: ISideEligibilityModalProps
) {
  const dispatch = useDispatch();

  const { userCollectionsData, user } = useSelector(
    (state: RootState) => state.user
  );

  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<any>([]);

  const handleJoinSide = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      if (props.selectedSide["private"] === true) {
        let sender: any = { ...user };
        delete sender["profiles"];
        const object = {
          state: State.Pending,
          type: Type.Request,
          sender: sender,
          recipient: props.selectedSide["creatorAddress"],
          side: props.selectedSide,
        };
        await apiService.sendRequestPrivateSide(object);
      } else {
        const profile = await apiService.joinSide(
          user.id,
          props.selectedSide.id,
          Role.User
        );
        props.setDisplayEligibility?.(false);
        dispatch(updateProfiles(profile));
        dispatch(addUserParsedSide(props.selectedSide));
        toast.success("Great! You join the side", { toastId: 26 });
      }
    } catch (error: any) {
      if (error.statusCode === "403") {
        toast.error("you do not meet the requirements to join this side.", {
          toastId: 15,
        });
      } else {
        toast.error("Ooops! Something went wrong joining this Sides", {
          toastId: 25,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    if (userCollectionsData) {
      const [res, isEligible] = checkUserEligibility(
        userCollectionsData,
        props.selectedSide
      );

      console.log('userCollectionsData :', userCollectionsData)
      console.log('props.selectedSide :', props.selectedSide)
      console.log('[res, isEligible] :', [res, isEligible])

      setIsEligible(isEligible);
      setDetails(res);
    }
  }, [userCollectionsData]);

  if (!userCollectionsData) return null;

  return (
    <Modal
      body={
        <>
          <RoundedImageContainer height="104px" width="104px" radius={60}>
            <img src={props.selectedSide?.sideImage} width="100%" alt="side" />
          </RoundedImageContainer>
          <h2>{props.selectedSide.name}</h2>
          <div className="text-center">{props.selectedSide.description}</div>
          <EligibilityResult
            isEligible={
              isEligible && props.selectedSide.status === SideStatus.active
            }
            info={
              !props.isSideAdmin &&
              props.selectedSide.status === SideStatus.inactive
            }
          >
            {props.selectedSide.status === SideStatus.active ? (
              <>
                <div>
                  {isEligible ? (
                    <i className="fa-solid fa-circle-check mr-2"></i>
                  ) : (
                    <i className="fa-solid fa-circle-xmark mr-2"></i>
                  )}
                  {isEligible
                    ? eligibilityTexts.success.title
                    : eligibilityTexts.error.title}
                </div>
                <div>
                  {isEligible
                    ? eligibilityTexts.success.message
                    : eligibilityTexts.error.message}
                </div>
              </>
            ) : (
              <>
                <div>
                  {!props.isSideAdmin ? (
                    <i className="fa-solid fa-circle-info mr-2"></i>
                  ) : (
                    <i className="fa-solid fa-circle-xmark mr-2"></i>
                  )}
                  {!props.isSideAdmin
                    ? "Inactive side"
                    : eligibilityTexts.inactive.title}
                </div>
                <div>
                  {!props.isSideAdmin
                    ? " This side is currently inactive. Waiting for a new Administrator. Please try again later."
                    : eligibilityTexts.inactive.message}
                </div>
              </>
            )}
          </EligibilityResult>
          <Eligibility side={props.selectedSide} />
        </>
      }
      footer={
        props.selectedSide.status === SideStatus.active ? (
          <Button
            classes="mt-3 ml-auto"
            width="121px"
            height={44}
            disabled={!isEligible || isLoading}
            children={
              props.selectedSide["private"] === true
                ? "Send Request"
                : "Join now"
            }
            onClick={handleJoinSide}
          />
        ) : (
          <>
            {" "}
            {props.isSideAdmin && (
              <Button
                classes="mt-3 ml-auto"
                width="185px"
                height={44}
                background={"var(--disable)"}
                children={"Choose a sub-admin"}
                onClick={() => {
                  props.setDisplayLeaveSide(true);
                  props.setDisplayEligibility(false);
                }}
              />
            )}
          </>
        )
      }
      title={undefined}
      showModal={props.setDisplayEligibility}
    />
  );
}
