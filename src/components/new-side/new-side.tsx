import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import "./new-side.css";
import ContainerLeft from "../ui-components/ContainerLeft";
import TabItems from "../ui-components/TabItems";
import Informations from "../CurrentColony/settings/informations/informations";
import { Side } from "../../models/Side";
import Button from "../ui-components/Button";
import Admission from "./admission/admission";
import Channels from "../CurrentColony/settings/channels/channels";
import Invitation from "../CurrentColony/settings/invitation/invitation";
import { apiService } from "../../services/api.service";
import {
  addColony,
  updateProfiles,
  updateSidesByUserCollections,
  updateUser,
} from "../../redux/Slices/UserDataSlice";
import { RootState } from "../../redux/store/app.store";
import { Collection } from "../../models/interfaces/collection";
import _, { valuesIn } from "lodash";
import { Channel, ChannelType } from "../../models/Channel";
import { Profile, Role } from "../../models/Profile";
import { Metadata } from "../../models/Metadata";

const MAX_NUMBER_OF_COLLECTIONS = 5;

const initialStateSteps = [
  {
    label: "Informations",
    icon: "fa-solid fa-1",
    active: true,
    completed: false,
  },
  {
    label: "Admission",
    icon: "fa-solid fa-2",
    active: false,
    completed: false,
  },
  {
    label: "Channels",
    icon: "fa-solid fa-3",
    active: false,
    completed: false,
  },
  {
    label: "Invitation",
    icon: "fa-solid fa-4",
    active: false,
    completed: false,
  },
];

const initialSteps = [
  {
    label: "Informations",
    icon: "fa-solid fa-1",
    active: true,
    completed: false,
  },
  {
    label: "Admission",
    icon: "fa-solid fa-2",
    active: false,
    completed: false,
  },
  {
    label: "Channels",
    icon: "fa-solid fa-3",
    active: false,
    completed: false,
  },
  {
    label: "Invitation",
    icon: "fa-solid fa-4",
    active: false,
    completed: false,
  },
];

export interface InitialStateSide {
  sideImage: string | undefined;
  name: string;
  description: string;
  NftTokenAddress: string;
  conditions: any;
  creatorAddress: string | undefined;
}

const initialStateSide = {
  sideImage: undefined,
  name: "",
  description: "",
  NftTokenAddress: "",
  conditions: {},
  creatorAddress: window.ethereum.selectedAddress,
  priv: false
};

// Data to add collection in condition
const initialDivCollections = [
  {
    collection: "",
    trait_selected: "",
    value_selected: "",
    traits_values: [],
    numberNeeded: 1,
  },
];

const initialChannelsState = {
  currents: [
    {
      name: "Announcement",
      isVisible: true,
      type: ChannelType.Announcement,
    },
  ],
  removed: [],
  added: [],
};

const Middle = styled.div`
  overflow: auto;
  max-height: calc(100vh - 58px);
`;

export default function NewSide() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentSide = new Side({});
  const [formData, setFormData] = useState<InitialStateSide>(initialStateSide);
  const [formError, setFormError] = useState({
    name: { exist: false, length: false },
  });
  const { userCollectionsData, user } = useSelector(
    (state: RootState) => state.user
  );

  const [steps, setSteps] = useState<any[]>(initialStateSteps);

  // Variables for Admission component
  const [divCollections, setDivCollection] = useState<any[]>(
    initialDivCollections
  );
  const [collectionHolder, setCollectionHolder] = useState<Collection[]>([]);
  const [onlyOneRequired, setOnlyOneRequired] = useState<boolean>(true);

  // Variables for Channels component
  const [channels, setChannels] = useState<any>(initialChannelsState);

  // Variables for Invitation component
  const [invitationUsers, setInvitationUsers] = useState<any>([]);
  const [userInvited, setUserInvited] = useState<any>([]);

  useEffect(() => {
    if (userCollectionsData) {
      let collections = Object.values(userCollectionsData);
      setCollectionHolder(collections);
    }
  }, [userCollectionsData]);

  useEffect(() => {
    if (user && user.profiles) {
      const getInvitationUsers = async (user: any) => {
        let userSides = user.profiles.map((p: Profile) => p.side);
        let users = await apiService.getUserFromSides(userSides);        
        let invitationsUsersObject = [];
        delete user["profiles"];
        for (let userInvite of users) {
          if (user["id"] !== userInvite["id"])
            invitationsUsersObject.push({
              name: userInvite["username"]
                ? `${userInvite["username"]} (${userInvite["accounts"]})`
                : userInvite["accounts"],
              invited: false,
              recipient: userInvite,
              sender: user,
            });
        }
        setInvitationUsers(invitationsUsersObject);
      };
      getInvitationUsers(user);
    }
  }, [user]);

  const newSideNextPreviousStep = (
    index: number,
    previous: boolean = false
  ) => {
    let current_data = { ...formData };
    let current_steps = [...steps];

    // Checking if sideImage and name stored to continu to the other steps
    if (
      (index === 0 && !current_data["sideImage"]) ||
      !current_data["name"].trim().length
    ) {
      toast.error("Missing data", { toastId: 3 });
      return;
    }

    // Set conditions and checking if there is minimum one condition to continu to the other steps
    if (index === 1) {
      let current_divs = [...divCollections];
      let conditions: any = {};
      for (let div of current_divs) {
        if (
          div["collection"].trim().length !== 0 &&
          div["trait_selected"].trim().length !== 0 &&
          div["value_selected"].trim().length !== 0
        ) {
          conditions[div["collection"]] = {};
          conditions[div["collection"]][div["trait_selected"]] =
            div["value_selected"];
          conditions[div["collection"]]["numberNeeded"] = div["numberNeeded"];
        }
      }
      if (Object.keys(conditions).length === 0) {
        toast.error("You need to enter miminum one condition", { toastId: 3 });
        return;
      }
      setFormData({ ...formData, conditions: conditions });
    }

    // Checking if every channels have name to continu to the other steps
    if (index === 2) {
      let isWrongChannels = channels["added"].filter(
        (c: Channel) => c["name"].trim().length === 0
      );
      if (isWrongChannels.length) {
        toast.error("You need to name every channels", { toastId: 3 });
        return;
      }
    }

    const currentStepsState = current_steps.map((item: any, map_i: number) => {
      if (!previous) {
        // Turn active or not for selected item
        item["active"] = map_i === index + 1 ? true : false;
        // Turn completed or not for previous or next items
        item["completed"] = map_i < index + 1 ? true : false;

        // Set condition of Side
        if (item["label"] === "Admission" && map_i === index) {
          let current_divs = [...divCollections];
          let conditions: any = {};
          for (let div of current_divs) {
            conditions[div["collection"]] = {};
            conditions[div["collection"]]["trait_type"] = div["trait_selected"];
            conditions[div["collection"]]["trait_value"] =
              div["value_selected"];
            conditions[div["collection"]]["numberNeeded"] = div["numberNeeded"];
          }
          setFormData({ ...formData, conditions: conditions });
        }
      } else {
        // Turn active or not for selected item
        item["active"] = map_i === index - 1 ? true : false;
        // Turn completed or not for previous or next items
        item["completed"] = map_i < index - 1 ? true : false;
      }

      return item;
    });

    setSteps(currentStepsState);
  };

  // Functions for information component
  const onChangeSideName = async (name: string) => {
    const valid = await validateName(name);
    if (valid) {
      setFormData({ ...formData, name: name });
    }
  };

  const validateForm = async () => {};

  // validate the name, return true if name is valid;
  const validateName = async (name: string) => {
    const exist = await apiService.isSideNameExist(name);
    const inValidLength = !(name.length < 50 && name.length > 3);
    setFormError({ ...formError, name: { exist, length: inValidLength } });
    return !(exist || inValidLength);
  };

  const onChangeSideImage = (event: any) => {
    const file = event.target.files[0];
    if (file.size > 500000) {
      toast.error("The image size has to be smaller than 500ko.");
      return;
    }
    setFormData({ ...formData, sideImage: file });
  };

  // ----- Functions for Admission component **start
  const setSideTokenAddress = async (address: string, index: number) => {
    setFormData({ ...formData, NftTokenAddress: address });
    if (address.trim().length) {
      let current_divs = [...divCollections];
      current_divs[index]["collection"] = address;
      current_divs[index]["traits_values"] = createPropertiesObject(address);
      setDivCollection(current_divs);
    }
  };

  // Creation properties object to display in conditions
  function createPropertiesObject(address: string) {
    if (!userCollectionsData) return;
    const properties = userCollectionsData[address].getCollectionProperties();
    return properties;
  }

  const setSidePropertyCondition = (event: any, index: number) => {
    const trait = event.target.value;
    if (trait.trim().length) {
      let current_divs = [...divCollections];
      current_divs[index]["trait_selected"] = trait;
      setDivCollection(current_divs);
    }
  };

  const setSideValueCondition = (event: any, index: number) => {
    const value = event.target.value;
    if (value.trim().length) {
      let current_divs = [...divCollections];
      current_divs[index]["value_selected"] = value;
      setDivCollection(current_divs);
    }
  };

  // Add collection div in condition
  const addDivCollection = () => {
    if (divCollections.length < MAX_NUMBER_OF_COLLECTIONS) {
      let current_divs = [...divCollections];
      current_divs.push({
        collection: "",
        traits_values: [],
      });
      setDivCollection(current_divs);
    } else {
      toast.error(
        "You can not create side with more than 5 linked collections.",
        { toastId: 8 }
      );
    }
  };

  const addConditionToDivCollection = (index: number) => {
    let current_divs = [...divCollections];
    current_divs[index] = {
      ...current_divs[index],
      trait_selected: "",
      value_selected: "",
    };
    setDivCollection(current_divs);
  };
  const setNumberOfNftNeededToDivCollection = (
    number: number,
    index: number
  ) => {
    let current_divs = [...divCollections];
    current_divs[index] = {
      ...current_divs[index],
      numberNeeded: number,
    };

    setDivCollection(current_divs);
  };

  // Remove collection div in condition
  const removeDivCollection = (index: number) => {
    let current_divs = [...divCollections];
    current_divs.splice(index, 1);
    setDivCollection(current_divs);
  };

  // ----- Functions for Admission component **end

  // ----- Functions for Channels component **start
  const handleRemoveChannel = (index: number, current = true) => {
    // Remove existing channel
    if (current) {
      let current_removed: Channel[] = [];
      let current_channels: Channel[] = [];
      if (channels["removed"].length) {
        current_removed = [...channels["removed"]];
      }
      if (channels["currents"].length) {
        current_channels = [...channels["currents"]];
      }
      if (!current_removed.includes(channels["currents"][index]["id"])) {
        current_removed.push(channels["currents"][index]["id"]);
      }
      current_channels.splice(index, 1);
      setChannels({
        ...channels,
        removed: current_removed,
        currents: current_channels,
      });
    }
    // Remove new channel
    else {
      let current_added: Channel[] = [];
      if (channels["added"].length) {
        current_added = [...channels["added"]];
      }
      current_added.splice(index, 1);
      setChannels({ ...channels, added: current_added });
    }
  };

  const handleAddNewChannel = () => {
    let current_added: Partial<Channel>[] = [];
    if (channels["added"].length) {
      current_added = [...channels["added"]];
    }
    current_added.push({
      name: "",
      isVisible: true,
      type: ChannelType.Announcement,
      side: formData,
      authorizeComments: false,
    });
    setChannels({ ...channels, added: current_added });
  };

  const onChangeNameChannel = (event: any, index: number, current = true) => {
    // Change name on existing channel
    if (current) {
      let current_channels = channels["currents"];
      current_channels[index]["name"] = event.target.value;
      setChannels({ ...channels, currents: current_channels });
    }
    // Change name on new channel
    else {
      let added_channels = channels["added"];
      added_channels[index]["name"] = event.target.value;
      setChannels({ ...channels, added: added_channels });
    }
  };
  const onChangeTypeChannel = (
    value: number,
    index: number,
    current = true
  ) => {
    // Change name on existing channel
    if (current) {
      let current_channels = channels["currents"];
      current_channels[index]["type"] = value;
      setChannels({ ...channels, currents: current_channels });
    }
    // Change name on new channel
    else {
      let added_channels = channels["added"];
      added_channels[index]["type"] = value;
      setChannels({ ...channels, added: added_channels });
    }
  };
  const onChangeAuthorizeCommentsChannel = (
    event: any,
    index: number,
    current = true
  ) => {
    // Change name on existing channel
    if (current) {
      let current_channels = channels["currents"];
      current_channels[index]["authorizeComments"] = event.target.checked;
      setChannels({ ...channels, currents: current_channels });
    }
    // Change name on new channel
    else {
      let added_channels = channels["added"];
      added_channels[index]["authorizeComments"] = event.target.checked;
      setChannels({ ...channels, added: added_channels });
    }
  };
  const onChangeIsVisibleChannel = (
    value: any,
    index: number,
    current = true
  ) => {
    // Change name on existing channel
    if (current) {
      let current_channels = channels["currents"];
      current_channels[index]["isVisible"] = value;
      setChannels({ ...channels, currents: current_channels });
    }
    // Change name on new channel
    else {
      let added_channels = channels["added"];
      added_channels[index]["isVisible"] = value;
      setChannels({ ...channels, added: added_channels });
    }
  };

  // ----- Functions for Channels component **end

  const onSubmit = async () => {
    setFormData({
      ...formData,
      creatorAddress: window.ethereum.selectedAddress,
    });

    try {
      if (formData.sideImage) {

        
        const data = _.cloneDeep(formData);

        data["conditions"]["requiered"] = onlyOneRequired;
        data["conditions"] = JSON.stringify(data["conditions"]);
        data["NftTokenAddress"] = data["conditions"];
        const fd = new FormData();
        fd.append("file", formData["sideImage"]);
        data["sideImage"] = await apiService.uploadImage(fd);
        data["creatorAddress"] = user?.accounts;

        const newSide = await apiService.createSide(data);

        if (channels["added"].length) {
          let added = channels["added"].map((item: any) => {
            item["side"] = newSide;
            return item;
          });
          const addedChannels = await apiService.createManyChannels(added);
        }

        const conditionObject = JSON.parse(data['conditions'])

        const conditions = Object.keys(conditionObject).reduce(function(prev:Metadata[], key:string) {
          if (key !== 'requiered') 
            prev.push({
              address : key,
              traitProperty: conditionObject[key]['trait_type'],
              traitValue: conditionObject[key]['trait_value'],
              numberNeeded: (conditionObject[key]['numberNeeded']) ? conditionObject[key]['numberNeeded'] : 1,
              required: !onlyOneRequired,
              side: newSide,
            })
          return prev
        }, [])

        const conditionsSaved = await apiService.savedMetadataConditions(conditions);

        let users = userInvited.map((u: any) => {
          u["side"] = newSide;
          return u;
        });
        if (users.length) await apiService.sendMultipleInvitations(users);
        if (user) {
          try {
            const profile = await apiService.joinSide(
              user?.id,
              newSide.id,
              Role.Admin
            );
            dispatch(updateProfiles(profile));
          } catch (error) {}
        }
        dispatch(addColony(newSide));
        dispatch(updateSidesByUserCollections(null));
        toast.success(data.name + " has been created.", {
          toastId: 4,
        });

        setSteps(initialStateSteps);
        setFormData(initialStateSide);

        navigate(`/`);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating side.", { toastId: 3 });
    }
  };

  return (
    <>
      <nav>
        <div className="menu-icon">
          <span className="fas fa-bars"></span>
        </div>
        <div className="nav-items text-primary-light size-17">
          <li>
            <i className="fa fa-circle-plus mr-2"></i>{" "}
            <label className="w-700"> Create Side </label>
          </li>
        </div>
      </nav>

      <div className="flex align-start w-100 text-left">
        <ContainerLeft>
          <label className="pl-4 sidebar-title  mb-2 mt-4">Steps</label>
          {steps.map((step: any, index: number) => {
            return (
              <TabItems
                key={index}
                className={`nav-link pl-5 pt-3 pb-3 ${
                  step["active"] ? "active" : ""
                } ${
                  step["completed"] ? "completed" : ""
                } sidebar-item text-secondary-dark`}
              >
                <i className={`${step["icon"]} mr-2`}></i>
                {step["label"]}{" "}
                {step["completed"] ? (
                  <i className="fa-solid fa-check ml-4"></i>
                ) : null}
              </TabItems>
            );
          })}
        </ContainerLeft>

        <Middle className="f-column w-100 pt-3 ml-5">
          {steps.map((step: any, index: number) => {
            return (
              <div key={index}>
                {step["label"] === "Informations" && step["active"] ? (
                  <>
                    <Informations
                      currentSide={formData}
                      onChangeNewSideName={onChangeSideName}
                      onChangeNewSideImage={onChangeSideImage}
                      formError={formError}
                    />
                  </>
                ) : step["label"] === "Admission" && step["active"] ? (
                  <>
                    <Admission
                      divCollections={divCollections}
                      collections={collectionHolder}
                      setSideTokenAddress={setSideTokenAddress}
                      setSidePropertyCondition={setSidePropertyCondition}
                      setSideValueCondition={setSideValueCondition}
                      addDivCollection={addDivCollection}
                      removeDivCollection={removeDivCollection}
                      addConditionToDivCollection={addConditionToDivCollection}
                      onlyOneRequired={onlyOneRequired}
                      setOnlyOneRequired={setOnlyOneRequired}
                      setNumberOfNftNeededToDivCollection={
                        setNumberOfNftNeededToDivCollection
                      }
                    />
                  </>
                ) : step["label"] === "Channels" && step["active"] ? (
                  <div style={{ maxWidth: "fit-content" }}>
                    <Channels
                      currentSide={currentSide}
                      channelsNewSide={channels}
                      handleRemoveChannel={handleRemoveChannel}
                      handleAddNewChannel={handleAddNewChannel}
                      onChangeNameChannel={onChangeNameChannel}
                      onChangeTypeChannel={onChangeTypeChannel}
                      onChangeAuthorizeCommentsChannel={
                        onChangeAuthorizeCommentsChannel
                      }
                      onChangeIsVisibleChannel={onChangeIsVisibleChannel}
                    />
                  </div>
                ) : step["label"] === "Invitation" && step["active"] ? (
                  <>
                    <Invitation
                      currentSide={currentSide}
                      invitationUsers={invitationUsers}
                      setUserInvited={setUserInvited}
                      userInvited={userInvited}
                    />
                  </>
                ) : null}
              </div>
            );
          })}
          <FooterButtons
            steps={steps}
            onSubmit={onSubmit}
            index={steps.findIndex((s) => s.active)}
            newSideNextPreviousStep={newSideNextPreviousStep}
          />
        </Middle>
      </div>
    </>
  );
}

const FooterButtons = ({
  index,
  newSideNextPreviousStep,
  onSubmit,
  steps,
}: any) => {
  const handleContinue = () => {
    if (steps.length === index + 1) {
      onSubmit();
    } else {
      newSideNextPreviousStep(index);
    }
  };

  return (
    <div className="flex justify-between container-next-back">
      {index > 0 && (
        <Button
          classes={"mt-4"}
          width={"159px"}
          height={46}
          onClick={() => newSideNextPreviousStep(index, true)}
          radius={10}
          color={"var(--text-primary-light)"}
          background={"transparent"}
          border={"1px solid var(--bg-secondary-light);"}
        >
          Back
        </Button>
      )}

      <Button
        classes={"mt-4"}
        width={"159px"}
        height={46}
        onClick={handleContinue}
        radius={10}
        color={"var(--text-primary-light)"}
      >
        {steps.length === index + 1 ? "Finish" : "Continue"}
      </Button>
    </div>
  );
};
