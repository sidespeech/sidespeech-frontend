import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import { useDispatch, useSelector } from "react-redux";
import { connect, fetchUserDatas } from "../../../redux/Slices/UserDataSlice";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./new-side.css";
import { RootState } from "../../../redux/store/app.store";
import ContainerLeft from "../ui-components/ContainerLeft";
import TabItems from "../ui-components/TabItems";
import Informations from "../CurrentColony/settings/informations/informations";
import { Side } from "../../models/Side";
import Button from "../ui-components/Button";
import Admission from "./admission/admission";
import Channels from "../CurrentColony/settings/channels/channels";
import Invitation from "../CurrentColony/settings/invitation/invitation";
import { apiService } from "../../services/api.service";
import { addColony } from "../../redux/Slices/UserDataSlice";

const initialStateSteps = [
  {
    label: 'Informations',
    icon: 'fa-solid fa-1',
    active: true,
    completed: false,
  },
  {
    label: 'Admission',
    icon: 'fa-solid fa-2',
    active: false,
    completed: false,
  },
  {
    label: 'Channels',
    icon: 'fa-solid fa-3',
    active: false,
    completed: false,
  },
  {
    label: 'Invitation',
    icon: 'fa-solid fa-4',
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
  creatorAddress: localStorage.getItem("userAccount")
};

// Data to add collection in condition
const initialDivCollections = [
  {
    collection: "",
    trait_selected: "",
    value_selected: "",
    traits_values: []
  }
];

const initialChannelsState = {
  currents: [{
    name: "Announcement",
    isVisible: true,
    type: 0
  }],
  removed: [],
  added: []
};

export default function NewSide(
) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentSide = new Side({});
  const [formData, setFormData] = useState<InitialStateSide>(initialStateSide);
  const userData = useSelector((state: RootState) => state.user);
  const [steps, setSteps] = useState<any>(initialStateSteps);

  // Variables for Admission component
  const [divCollections, setDivCollection] = useState<any[]>(initialDivCollections);
  const [collectionHolder, setCollectionHolder] = useState<string[]>([]);
  const [tokenProperties, setTokenProperties] = useState<any>({});
  const [tokenSelected, setTokenSelected] = useState<string>("");
  const [propertySelected, setPropertySelected] = useState<any>({});

  // Variables for Channels component
  const [channels, setChannels] = useState<any>(initialChannelsState);

  useEffect(() => {
    if (!userData["nfts"].length) {
      navigate(`/`)
    } else {
      let collections = userData["nfts"]
        .map((item: any) => item.token_address)
        .filter((value: any, index: number, self: any) => self.indexOf(value) === index);
      setCollectionHolder(collections);
    }
  }, []);

  const newSideNextPreviousStep = (index: number, previous: boolean = false) => {
    const currentStepsState = steps.map((item: any, map_i: number) => {

      if (!previous) {
        // Turn active or not for selected item
        item['active'] = (map_i === index + 1) ? true : false;
        // Turn completed or not for previous or next items
        item['completed'] = (map_i < index + 1) ? true : false;

        // Set condition of Side
        if (item['label'] === 'Admission' && map_i === index) {
          let current_divs = [...divCollections]
          let conditions: any = {};
          for (let div of current_divs) {
            conditions[div['collection']] = {};
            conditions[div['collection']][div['trait_selected']] = div['value_selected'];
          }
          setFormData({ ...formData, conditions: conditions });
        }
      } else {
        // Turn active or not for selected item
        item['active'] = (map_i === index - 1) ? true : false;
        // Turn completed or not for previous or next items
        item['completed'] = (map_i < index - 1) ? true : false;
      }


      return item
    });
    setSteps(currentStepsState);
  };

  // Functions for information component
  const onChangeSideName = (name: string) => {
    setFormData({ ...formData, name: name });
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
  const setSideTokenAddress = async (event: any, index: number) => {
    const address = event.target.value;
    setFormData({ ...formData, NftTokenAddress: address });
    if (address.trim().length) {
      let current_divs = [...divCollections];
      current_divs[index]['collection'] = address
      current_divs[index]['traits_values'] = createPropertiesObject(address);
      setDivCollection(current_divs);
    }

  };

  // Creation properties object to display in conditions
  function createPropertiesObject(address: string) {
    const properties = userData['nfts'].reduce(function (filtered: any, current: any) {
      if (current['token_address'] === address && current['metadata'] && JSON.parse(current['metadata'])['attributes']) {
        let attributes = JSON.parse(current['metadata'])['attributes'];
        if (Array.isArray(attributes)) {
          for (let attribute of attributes) {
            let property_exists = filtered.filter(function (o: any) { return o['property']['value'] == attribute['trait_type'] }).length > 0;
            if (property_exists) {
              for (let element of filtered) {
                if (element['property']['value'] == attribute['trait_type']) {
                  let value_exists = element['values'].filter(function (o: any) { return o['value'] == attribute['value'] }).length > 0;
                  if (!value_exists) element['values'].push({ label: attribute['value'], value: attribute['value'] })
                }
              }
            } else {
              filtered.push({ property: { label: attribute['trait_type'], value: attribute['trait_type'] }, values: [{ label: attribute['value'], value: attribute['value'] }] },)
            }

          }
        }

      }
      return filtered;

    }, []);
    return properties
  }

  const setSidePropertyCondition = (event: any, index: number) => {
    const trait = event.target.value;
    if (trait.trim().length) {
      let current_divs = [...divCollections];
      current_divs[index]['trait_selected'] = trait
      setDivCollection(current_divs);
    }
  };

  const setSideValueCondition = (event: any, index: number) => {
    const value = event.target.value;
    if (value.trim().length) {
      let current_divs = [...divCollections];
      current_divs[index]['value_selected'] = value
      setDivCollection(current_divs);
    }
  };

  // Add collection div in condition
  const addDivCollection = () => {
    let current_divs = [...divCollections];
    current_divs.push({
      collection: "",
      traits_values: []
    });
    setDivCollection(current_divs)
  };

  const addConditionToDivCollection = (index: number) => {
    let current_divs = [...divCollections];
    current_divs[index] = { ...current_divs[index], trait_selected: "", value_selected: "" }
    setDivCollection(current_divs)
  };

  // Remove collection div in condition
  const removeDivCollection = (index: number) => {
    let current_divs = [...divCollections];
    current_divs.splice(index, 1);
    setDivCollection(current_divs)
  };

  // ----- Functions for Admission component **end

  // ----- Functions for Channels component **start
  const handleRemoveChannel = (index: number, current = true) => {

    // Remove existing channel
    if (current) {
      let current_removed: Channel[] = [];
      let current_channels: Channel[] = [];
      if (channels['removed'].length) {
        current_removed = [...channels['removed']];
      }
      if (channels['currents'].length) {
        current_channels = [...channels['currents']];
      }
      if (!current_removed.includes(channels['currents'][index]['id'])) {
        current_removed.push(channels['currents'][index]['id']);
      }
      current_channels.splice(index, 1);
      setChannels({ ...channels, removed: current_removed, currents: current_channels });
    }
    // Remove new channel
    else {
      let current_added: Channel[] = []
      if (channels['added'].length) {
        current_added = [...channels['added']]
      }
      current_added.splice(index, 1);
      setChannels({ ...channels, added: current_added })
    }
  };

  const handleAddNewChannel = () => {
    let current_added: Channel[] = []
    if (channels['added'].length) {
      current_added = [...channels['added']]
    }
    current_added.push({
      name: "",
      isVisible: true,
      type: 2,
      side: formData
    });
    setChannels({ ...channels, added: current_added })
  };

  const onChangeNameChannel = (event: any, index: number, current = true) => {
    // Change name on existing channel
    if (current) {
      let current_channels = channels['currents'];
      current_channels[index]['name'] = event.target.value;
      setChannels({ ...channels, currents: current_channels })
    }
    // Change name on new channel
    else {
      let added_channels = channels['added'];
      added_channels[index]['name'] = event.target.value;
      setChannels({ ...channels, added: added_channels })
    }
  };

  // ----- Functions for Channels component **end

  const onSubmit = async () => {
    console.log('formData from onClick :', formData)
    console.log('channels from onClick :', channels)
    // Save file input to IPFS
    try {
      if (formData.sideImage) {
        formData['conditions'] = JSON.stringify(formData['conditions']);
        const newSide = await apiService.createSide(formData);

        if (channels['added'].length) {
          let added = channels['added'].map((item:any) => {
            item['side'] = newSide;
            return item;
          })
          const addedChannels = await apiService.createManyChannels(added);
          console.log('addedChannels :', addedChannels)
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
  }

  return (
    <>
      <nav>
        <div className="menu-icon">
          <span className="fas fa-bars"></span>
        </div>
        <div className="nav-items text-primary-light size-17">
          <li><i className="fa fa-circle-plus mr-2"></i> <label className='w-700'> Create Side </label></li>
        </div>
      </nav>

      <div className="flex align-start w-100 text-left">
        <ContainerLeft>
          <label className="pl-4 sidebar-title  mb-2 mt-4">Steps</label>
          {steps.map((step: any, index: number) => {
            return (
              <TabItems key={index} className={`nav-link pl-5 pt-3 pb-3 ${step['active'] ? 'active' : ''} ${step['completed'] ? 'completed' : ''} sidebar-item text-secondary-dark`}><i className={`${step['icon']} mr-2`}></i>{step['label']} {step['completed'] ? <i className="fa-solid fa-check ml-4"></i> : null}</TabItems>
            );
          })}
        </ContainerLeft>

        <div className="f-column w-100 pt-3 ml-5">
          {steps.map((step: any, index: number) => {
            return (
              <div key={index}> {
                (step['label'] === 'Informations' && step['active']) ?
                  <>
                    <Informations currentSide={formData} onChangeNewSideName={onChangeSideName} onChangeNewSideImage={onChangeSideImage} />
                    <div className="f-column mt-3 align-end w-80">
                      <Button width={159} height={46} onClick={() => newSideNextPreviousStep(index)} radius={10} color={'var(--text-primary-light)'}>Continue</Button>
                    </div>
                  </>
                  : (step['label'] === 'Admission' && step['active']) ?
                    <>
                      <Admission currentSide={currentSide} divCollections={divCollections} collections={collectionHolder}
                        setSideTokenAddress={setSideTokenAddress} tokenProperties={tokenProperties}
                        setSidePropertyCondition={setSidePropertyCondition} setSideValueCondition={setSideValueCondition}
                        addDivCollection={addDivCollection} propertySelected={propertySelected} removeDivCollection={removeDivCollection}
                        addConditionToDivCollection={addConditionToDivCollection}
                      />
                      <div className="flex justify-between container-next-back">
                        <Button classes={"mt-3"} width={159} height={46} onClick={() => newSideNextPreviousStep(index, true)} radius={10} color={'var(--text-primary-light)'} background={'transparent'} border={'1px solid var(--bg-secondary-light);'}>Back</Button>
                        <Button classes={"mt-3"} width={159} height={46} onClick={() => newSideNextPreviousStep(index)} radius={10} color={'var(--text-primary-light)'}>Continue</Button>
                      </div>

                    </>
                    : (step['label'] === 'Channels' && step['active']) ?
                      <>
                        <Channels currentSide={currentSide} channelsNewSide={channels}
                          handleRemoveChannel={handleRemoveChannel} handleAddNewChannel={handleAddNewChannel}
                          onChangeNameChannel={onChangeNameChannel} />
                        <div className="flex justify-between container-next-back">
                          <Button classes={"mt-3"} width={159} height={46} onClick={() => newSideNextPreviousStep(index, true)} radius={10} color={'var(--text-primary-light)'} background={'transparent'} border={'1px solid var(--bg-secondary-light);'}>Back</Button>
                          <Button classes={"mt-3"} width={159} height={46} onClick={() => newSideNextPreviousStep(index)} radius={10} color={'var(--text-primary-light)'}>Continue</Button>
                        </div>                      </>
                      : (step['label'] === 'Invitation' && step['active']) ?
                        <>
                          <Invitation currentSide={currentSide} />
                          <div className="flex justify-between container-next-back">
                            <Button classes={"mt-3"} width={159} height={46} onClick={() => newSideNextPreviousStep(index, true)} radius={10} color={'var(--text-primary-light)'} background={'transparent'} border={'1px solid var(--bg-secondary-light);'}>Back</Button>
                            <Button classes={"mt-3"} width={159} height={46} onClick={onSubmit} radius={10} color={'var(--text-primary-light)'}>Finish</Button>
                          </div>
                        </> : null
              }
              </div>
            );
          })}
          {/* <Button classes="mt-5" onClick={onClick}>Test</Button> */}
        </div>
      </div>
    </>
  );
}
