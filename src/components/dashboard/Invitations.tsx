import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Invitation, State } from "../../models/Invitation";
import { User } from "../../models/User";
import { RootState } from "../../redux/store/app.store";
import { apiService } from "../../services/api.service";
import Button from "../ui-components/Button";
import CustomCheckbox from "../ui-components/CustomCheckbox";
import InputText from "../ui-components/InputText";
import moment from "moment";
import { checkUserEligibility } from "../../helpers/utilities";
import Spinner from "../ui-components/Spinner";
import { Side } from "../../models/Side";
import SideEligibilityModal from "../Modals/SideEligibilityModal";
import { Link } from "react-router-dom";
import emptyListImg from '../../assets/invitations_empty_screen_shape.svg';
import { breakpoints, size } from "../../helpers/breakpoints";

interface InvitationsStyledProps {}

const InvitationsStyled = styled.main<InvitationsStyledProps>`
  .title {
    margin-top: 0;
  }
  .invitations-toolbar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    ${breakpoints(size.lg, `{
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }`)}
    & .search-input {
      width: 100%;
      ${breakpoints(size.lg, `{
        width: 40%;
      }`)}
    }
  }

  .requests-list {
    position: relative;
    padding: 20px;
    border-radius: 10px;
    flex: 1.2;
    background-color: var(--bg-secondary-dark);
    width: 96%;
    height: 6rem;
  }

  .image-collection {
    width: 70px;
    height: 70px;
    cursor: pointer;
    background: var(--bg-secondary-dark);
    border-radius: 5px;
    text-align: center;
    color: var(--bg-primary-light);
    overflow: hidden;
  }

  .date-label {
    color: var(--placeholer);
  }

  .spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    width: 100%;
    color: var(--text-secondary);
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.4;
    color: var(--text-secondary-dark);
  }

  .override-width {
    width: fit-content !important;
  }

  .no-results {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    width: 100%;
    min-height: 400px;
    color: var(--text-secondary);
    flex-direction: column;
    background-image: url(${emptyListImg});
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    margin: 80px 0;
  }

  .no-results p {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.4;
    color: var(--text-secondary-dark);
  }

  .no-results .buttons-wrapper {
    display: flex;
    gap: 1rem;
    margin-top: 2.5rem;
  }

  .no-results .buttons-wrapper a {
    color: inherit;
  }

  .list-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, calc(33% - 0.5rem)));
    grid-gap: 1rem;
    width: 100%;
  }
`;

interface InvitationsProps {}

const Invitations = ({}: InvitationsProps) => {
  const userData = useSelector((state: RootState) => state.user);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [filteredInvitations, setFilteredInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckedVerified, setIsCheckedVerified] = useState<boolean>(false);
  const [isCheckedEligible, setIsCheckedEligible] = useState<boolean>(false);

  // Variable for modal eligibility
  const [displayEligibility, setDisplayEligibility] = useState<boolean>(false);
  const [selectedSide, setSelectedSide] = useState<Side | null>(null);

  const getInvitations = async (user: User) => {
    let invitations = (
      await apiService.getPendingInvitationsByRecipient(user["id"])
    ).map((item: any) => {
      item["eligibility"] = checkUserEligibility(
        userData["userCollectionsData"],
        item["side"]
      );
      return item;
    });
    setInvitations(invitations);
    setFilteredInvitations(invitations);
  };

  useEffect(() => {
    if (userData && userData["user"]) getInvitations(userData["user"]);
  }, [userData]);

  const onDecline = async (invitation: Invitation, index: number) => {
    setIsLoading(true);
    await apiService.updateInvitationState(invitation["id"]!, State.Declined);
    if (userData && userData["user"]) await getInvitations(userData["user"]);
    setIsLoading(false);
    window.location.reload();
  };

  const onAccept = async (invitation: Invitation, index: number) => {
    setIsLoading(true);
    await apiService.acceptInvitation(invitation);
    if (userData && userData["user"]) await getInvitations(userData["user"]);
    setIsLoading(false);
    window.location.reload();
  };

  const onFilterByVerifiedcollection = async () => {
    setIsCheckedVerified(!isCheckedVerified);
    if (!isCheckedVerified) {
      setIsLoading(true);
      let filtered = [...filteredInvitations].filter(
        (invitation: Invitation) => {
          if (invitation["side"]["collections"].length) {
            let isVerified = invitation["side"]["collections"].find(
              (collection) => {
                let opensea = JSON.parse(collection["opensea"]);
                if (opensea["safelistRequestStatus"] === "verified")
                  return collection;
              }
            );

            if (isVerified) return invitation;
          }
        }
      );
      setFilteredInvitations(filtered);
      setIsLoading(false);
    } else setFilteredInvitations([...invitations]);
  };

  const onFilterByEligibleSide = async () => {
    setIsCheckedEligible(!isCheckedEligible);
    if (!isCheckedEligible) {
      setIsLoading(true);
      let filtered = [...filteredInvitations].filter((invitation: any) => {
        if (invitation["eligibility"][1]) return invitation;
      });
      setFilteredInvitations(filtered);
      setIsLoading(false);
    } else setFilteredInvitations([...invitations]);
  };

  const onFilterBySearchInput = async (e: any) => {
    const text = e.target.value;
    if (text.length) {
      setIsLoading(true);
      let filtered = [...invitations].filter((invitation: Invitation) => {
        const invitationStringify = JSON.stringify(invitation).toLowerCase();
        if (invitationStringify.includes(text)) return invitation;
      });
      setFilteredInvitations(filtered);
      setIsLoading(false);
    } else setFilteredInvitations([...invitations]);
  };

  const handleEligibilityCheck = (side: Side) => {
    setSelectedSide(side);
    setDisplayEligibility(true);
  };

  return (
    <InvitationsStyled>
      <h2 className="title">
        Invitations{" "}
        {filteredInvitations.length
          ? "(" + filteredInvitations.length + ")"
          : null}
      </h2>

      {/* Search Section */}
      <div className="invitations-toolbar">
          <div className="search-input">
            <InputText
              placeholderColor="var(--placeholer)"
              color="var(--placeholer)"
              height={40}
              bgColor="var(--bg-secondary-dark)"
              glass={true}
              iconRightPos={{ top: 12, right: 40 }}
              placeholder={"Search"}
              onChange={onFilterBySearchInput}
              radius="5px"
            />
          </div>
          
          <div className="flex align-center ">
            <span className="">Only verified collections</span>{" "}
            <CustomCheckbox
              isChecked={isCheckedVerified}
              onClick={onFilterByVerifiedcollection}
            />
            <span className="ml-4">Only eligible sides</span>{" "}
            <CustomCheckbox
              isChecked={isCheckedEligible}
              onClick={onFilterByEligibleSide}
            />
          </div>
      </div>

      {/* Invitations List **start */}
      {!isLoading ? (
        filteredInvitations.length ? (
          filteredInvitations.map((invitation, index) => {
            return (
              <div
                className="f-column mt-3 requests-list justify-center"
                key={index}
              >
                <div className="flex align-center justify-center justify-between">
                  {/* Side data */}
                  <div>
                    <div className="flex align-center justify-center">
                      <label className="image-collection f-column align-center justify-center">
                        <img
                          style={{
                            height: "inherit",
                            width: "inherit",
                            objectFit: "cover",
                          }}
                          src={
                            "https://images.unsplash.com/photo-1662948291101-691f9fa850d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
                          }
                          alt="file"
                        />
                      </label>
                      {/* <label className="align-center justify-center mt-2 ml-3">{request['accounts'].replace(request['accounts'].substring(4, 30), "...")}</label> */}
                      <div className="flex f-column justify-center">
                        <label className="align-center justify-center mt-2 ml-3 text-primary-light">
                          {invitation["side"]["name"]}
                        </label>
                        <label className="align-center justify-center mt-2 ml-3 flex">
                          <Button
                            width={"100px"}
                            height={25}
                            onClick={undefined}
                            radius={3}
                            background={"var(--bg-secondary-light)"}
                            fontSize={"12px"}
                            classes={"mr-2 override-width"}
                          >
                            {invitation["side"]["collections"].length
                              ? invitation["side"]["collections"][0]["name"]
                              : "Collection Name"}{" "}
                            <i className="fa-solid fa-circle-check ml-2 text-blue"></i>
                          </Button>
                          {invitation["side"]["collections"].length > 1 ? (
                            <Button
                              width={"50px"}
                              height={25}
                              onClick={undefined}
                              radius={3}
                              background={"var(--bg-secondary-light)"}
                              fontSize={"12px"}
                            >
                              + {invitation["side"]["collections"].length - 1}
                            </Button>
                          ) : null}
                        </label>
                        {invitation["eligibility"][1] ? (
                          <label className="align-center justify-center mt-2 ml-3">
                            <i className="fa-solid fa-circle-check mr-2 text-green"></i>
                            Eligible
                          </label>
                        ) : (
                          <label className="align-center justify-center mt-2 ml-3">
                            <i className="fa-solid fa-circle-xmark mr-2 text-red"></i>
                            Non-Eligible
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sender data */}
                  <div className="flex f-column justify-center">
                    <label>
                      <small className="date-label mr-3">
                        {moment
                          .utc(invitation["created_at"])
                          .local()
                          .startOf("seconds")
                          .fromNow()}
                      </small>
                      Invited By
                    </label>
                    <div className="flex mt-2">
                      <label className="profile-image-user f-column align-center justify-center">
                        <img
                          style={{
                            height: "inherit",
                            width: "inherit",
                            objectFit: "cover",
                          }}
                          src={
                            "https://images.unsplash.com/photo-1662948291101-691f9fa850d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
                          }
                          alt="file"
                        />
                      </label>
                      <label className="align-center justify-center mt-2 ml-3">
                        {invitation["recipient"]["accounts"].replace(
                          invitation["recipient"]["accounts"].substring(4, 30),
                          "..."
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Buttons section */}
                  <div className="flex align-center">
                    <Button
                      width={"159px"}
                      height={46}
                      onClick={() => onDecline(invitation, index)}
                      radius={10}
                      background={"var(--red-opacity)"}
                      color={"var(--red)"}
                      classes={"mr-4"}
                    >
                      Decline
                    </Button>

                    {invitation["eligibility"][1] ? (
                      <Button
                        width={"159px"}
                        height={46}
                        onClick={() => onAccept(invitation, index)}
                        radius={10}
                        color={"var(--text-primary-light)"}
                      >
                        Accept
                      </Button>
                    ) : (
                      <Button
                        width={"159px"}
                        height={46}
                        onClick={() =>
                          handleEligibilityCheck(invitation["side"])
                        }
                        radius={10}
                        background={"var(--bg-secondary-light)"}
                      >
                        Condition
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>
              Ooops!
              <br />
              Nothing here
            </p>
            <div className="buttons-wrapper">
              <Link to="/new-side">
                <Button
                  width={"145px"}
                  background="var(--bg-secondary-light)"
                  color="white"
                >
                  <i className="fa-solid fa-circle-plus mr-2"></i>
                  Create a Side
                </Button>
              </Link>
              <Link to="/">
                <Button width={"145px"}>Explore</Button>
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="spinner-wrapper">
          <Spinner />
        </div>
      )}
      {/* Invitations List **end */}

      {displayEligibility && selectedSide && (
        <SideEligibilityModal
          setDisplayLeaveSide={() => {}}
          setDisplayEligibility={setDisplayEligibility}
          selectedSide={selectedSide}
        />
      )}
    </InvitationsStyled>
  );
};

export default Invitations;
