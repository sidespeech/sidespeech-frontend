import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
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
  updateUser,
} from "../../redux/Slices/UserDataSlice";
import { RootState } from "../../redux/store/app.store";
import { Collection } from "../../models/interfaces/collection";
import _, { valuesIn } from "lodash";
import { Channel, ChannelType } from "../../models/Channel";
import { Role } from "../../models/Profile";

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

export interface InitialStateSide {
  sideImage: string | undefined;
  name: string;
  description: string;
  NftTokenAddress: string;
  conditions: any;
  creatorAddress: string | null;
}

const initialStateSide = {
  sideImage: undefined,
  name: "",
  description: "",
  NftTokenAddress: "",
  conditions: {},
  creatorAddress: localStorage.getItem("userAccount"),
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

  useEffect(() => {
    if (userCollectionsData) {
      let collections = Object.values(userCollectionsData);
      setCollectionHolder(collections);
    }
  }, [userCollectionsData]);

  const newSideNextPreviousStep = (
    index: number,
    previous: boolean = false
  ) => {
    let current_data = { ...formData };

    // Checking if sideImage and name stored to continu to the other steps
    if (!current_data["sideImage"] || !current_data["name"].trim().length) {
      toast.error("Missing data", { toastId: 3 });
      return;
    }

    const currentStepsState = steps.map((item: any, map_i: number) => {
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
            conditions[div["collection"]][div["trait_selected"]] =
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
    console.log(inValidLength);
    setFormError({ ...formError, name: { exist, length: inValidLength } });
    return !(exist || inValidLength);
  };

  const onChangeSideImage = (event: any) => {
    const file = event.target.files[0];
    if (file.size > 500000) {
      toast.error("The image size has to be smaller than 500ko.");
      return;
    }
    setFormData({ ...formData, sideImage: URL.createObjectURL(file) });
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
    let current_added: Channel[] = [];
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
    console.log(event);
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
    console.log("formData from onClick :", formData);
    console.log("channels from onClick :", channels);
    // Save file input to IPFS
    try {
      if (formData.sideImage) {
        formData["conditions"] = JSON.stringify(formData["conditions"]);
        formData["NftTokenAddress"] = formData["conditions"];
        const newSide = await apiService.createSide(formData);

        if (channels["added"].length) {
          let added = channels["added"].map((item: any) => {
            item["side"] = newSide;
            return item;
          });
          const addedChannels = await apiService.createManyChannels(added);
        }
        if (user) {
          try {
            const profile = await apiService.joinSide(
              user?.id,
              newSide.id,
              Role.Admin
            );
            console.log("profile", profile);
            dispatch(updateProfiles(profile));
          } catch (error) {}
        }
        dispatch(addColony(newSide));
        toast.success(formData.name + " has been created.", {
          toastId: 4,
        });
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
                    <Invitation currentSide={currentSide} />
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
          width={159}
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
        width={159}
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
