import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addColony } from "../../redux/Slices/UserDataSlice";

import Button from "../ui-components/Button";
import InputText from "../ui-components/InputText";
import Modal from "../ui-components/Modal";
import { useNavigate } from "react-router";
import CustomSelect from "../ui-components/CustomSelect";
import { apiService } from "../../services/api.service";
import nftsService from "../../services/nfts.service";
import { RootState } from "../../redux/store/app.store";
import _ from "lodash";

export interface InitialState {
  sideImage: string | null;
  name: string;
  NftTokenAddress: string;
  websiteUrl: string;
  conditions: any;
  creatorAddress: string | null;
}

export interface InitialValueTokenProperties {
  label: string;
  value: string;
}

export interface InitialTokenProperties {
  property: InitialValueTokenProperties;
  values: InitialValueTokenProperties[];
}

const initialState = {
  sideImage: null,
  name: "",
  NftTokenAddress: "",
  websiteUrl: "",
  conditions: {},
  creatorAddress: localStorage.getItem("userAccount")
};

// Data to add collection in condition
const initialDivCollections = {
  customDiv: ['collection1']     // set initial state with one div
};


// export default function CreateColonyModal({ showModal }: { showModal: any }) {
export default function CreateColonyModal({ showModal, collections }: { showModal: any, collections: string[] }) {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<InitialState>(initialState);

  const [tokenProperties, setTokenProperties] = useState<any>({});

  const [propertySelected, setPropertySelected] = useState<any>({});
  const [tokenSelected, setTokenSelected] = useState<string>("");

  const [divCollections, setDivCollection] = useState<any>(initialDivCollections);

  // Add collection div in condition
  const addDivCollection = () => {
    let currentDivs = divCollections.customDiv;
    currentDivs.push(`collection${currentDivs.length + 1}`);
    setDivCollection({ customDiv: currentDivs })
  };

  const setSideName = (event: any) => {
    const name = event.target.value;
    setFormData({ ...formData, name: name });
  };

  // Creation properties object to display in conditions
  function createPropertiesObject(address: string) {
    const foo = _.flatten(
      Object.values(userData["userCollectionsData"]).map((value: any) => value.nfts)
    );
    const properties = foo.reduce(function (filtered, current) {
      if (current['token_address'] === address && current['metadata'] && JSON.parse(current['metadata'])['attributes']) {
        let attributes = JSON.parse(current['metadata'])['attributes'];
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
      return filtered;

    }, []);
    return properties
  }

  const setSideTokenAddress = async (event: any, div:string) => {
    const address = event.target.value;
    setFormData({ ...formData, NftTokenAddress: address });
    if (address.trim().length) {
      const properties = createPropertiesObject(address);
      const current_object_properties = tokenProperties
      current_object_properties[div] = properties
      setTokenProperties(current_object_properties);
    } else setTokenProperties([]);
    setTokenSelected(address);
  };

  const setSidePropertyCondition = (event: any, div:string) => {
    let conditions
    if (event.target.value.trim().length) {
      conditions = { ...formData.conditions }
      conditions[formData.NftTokenAddress] = {}
      conditions[formData.NftTokenAddress][event.target.value] = ""
    } else conditions = {}
    setFormData({ ...formData, conditions: conditions });

    // Define or modify property selected
    let current_property_selected = propertySelected
    current_property_selected[div] = event.target.value
    setPropertySelected(current_property_selected);
  };

  const setSideValueCondition = (event: any) => {
    let conditions = formData['conditions'];
    let item = conditions[tokenSelected];
    let key = Object.keys(item)[0] || null;
    if (key) conditions[tokenSelected][key] = event.target.value
    setFormData({ ...formData, conditions: conditions });
  };

  const setSideWebsiteUrl = (event: any) => {
    const url = event.target.value;
    setFormData({ ...formData, websiteUrl: url });
  };

  const setSideImage = (event: any) => {
    const file = event.target.files[0];
    if (file.size > 500000) {
      toast.error("The image size has to be smaller than 500ko.");
      return;
    }
    setFormData({ ...formData, sideImage: URL.createObjectURL(file) });
  };
  const navigate = useNavigate();
  const saveSide = async () => {
    // Save file input to IPFS
    try {
      if (formData.sideImage) {
        formData['conditions'] = JSON.stringify(formData['conditions']);
        const newSide = await apiService.createSide(formData);
        dispatch(addColony(newSide));
        showModal(false);
        toast.success(formData.name + " has been created.", {
          toastId: 4,
        });
      }

    } catch (error) {
      console.log(error);
      toast.error("Error creating colony.", { toastId: 3 });
    }
  };

  return (
    <Modal
      showModal={showModal}
      body={
        <>
          <div className="f-column">
            <label htmlFor="name" className="size-14 fw-400 mb-1 text-left">
              Side server name
            </label>
            <InputText
              id="servername"
              maxLength={40}
              glass={false}
              width={"400px"}
              padding={"0px 40px 0px 20px"}
              height={40}
              onChange={setSideName}
              iconRightPos={{ top: 6, right: 16 }}
              placeholder={"Enter your Side server name"}
            />
          </div>
          <div
            className="flex justify-center mt-4 w-100"
            style={{ maxWidth: 400 }}
          >
            <div className="f-column justify-center align-center">
              <div className="size-14 fw-400 mb-3">Upload SideSpeech image</div>
              <input
                accept=".png,.jpg,.jpeg,.webp"
                style={{ display: "none" }}
                id="input-colony-picture"
                type={"file"}
                onChange={setSideImage}
              />
              <label
                htmlFor={"input-colony-picture"}
                className="upload-colony-image f-column align-center justify-center"
              >
                {formData.sideImage ? (
                  <img
                    style={{
                      height: "inherit",
                      width: "inherit",
                      objectFit: "cover",
                    }}
                    src={formData.sideImage}
                    alt="file"
                  />
                ) : (
                  <>
                    <i className="fa-solid fa-camera size-30 mb-1 mt-2"></i>
                    <span>
                      <i className="fa-solid fa-plus size-20"></i>
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="f-column mb-4">
            <label htmlFor="name" className="size-14 fw-400 mb-1 text-left">
              Collections
            </label>
            {divCollections.customDiv.map((current: any, i: number) => {
              return <div className="collection-item" key={current}>
                <div className="f-column mt-4 mb-3">
                  <label htmlFor="name" className="size-14 fw-400 mb-1 text-left">
                    NFT or Token address
                  </label>
                  <CustomSelect
                    width={"400px"}
                    height={"40px"}
                    fontSize={12}
                    fontWeight={700}
                    arrowPosition={{ top: 12, right: 15 }}
                    values={(collections.length) ? ['', ...collections] : [""]}
                    options={(collections.length) ? ['Choose NFT collection', ...collections] : ["You don't hold any nfts"]}
                    onChange={(event:any) => setSideTokenAddress(event, current)}
                  />
                </div>

                <div className="f-column mb-3">
                  <label htmlFor="name" className="size-14 fw-400 mb-1 text-left">
                    Features
                  </label>

                  <div
                    className="flex justify-between w-100"
                    style={{ maxWidth: 400 }}
                  >

                    <CustomSelect
                      width={"400px"}
                      height={"40px"}
                      fontSize={12}
                      fontWeight={700}
                      arrowPosition={{ top: 12, right: 15 }}
                      values={(tokenProperties.hasOwnProperty(current) && tokenProperties[current].length) ? ["", ...(tokenProperties[current].map((item:any) => item['property']['value']))]: [""]}
                      options={(tokenProperties.hasOwnProperty(current) && tokenProperties[current].length) ? ["Select Property", ...(tokenProperties[current].map((item:any) => item['property']['label']))] : ["Select NFT Collection"]}
                      onChange={(event:any) => setSidePropertyCondition(event, current)}
                    />
                    <CustomSelect
                      width={"400px"}
                      height={"40px"}
                      fontSize={12}
                      fontWeight={700}
                      arrowPosition={{ top: 12, right: 15 }}
                      values={(tokenProperties.hasOwnProperty(current) && tokenProperties[current].length) ? ["", ...((tokenProperties[current].find((item:any) => item['property']['value'] === propertySelected[current]) || { values: [] })['values']).map((item: any) => item['value'])] : [""]}
                      options={(tokenProperties.hasOwnProperty(current) && tokenProperties[current].length) ? ["Select Value", ...((tokenProperties[current].find((item:any) => item['property']['value'] === propertySelected[current]) || { values: [] })['values']).map((item: any) => item['label'])] : ["Select NFT Collection"]}
                      onChange={setSideValueCondition}
                    />
                  </div>
                </div>
              </div>
            })}
            <Button width={130} height={35} onClick={() => addDivCollection()}>
              + Add a collection
            </Button>
          </div>

          <div className="f-column">
            <label htmlFor="website" className="size-14 fw-400 mb-1 text-left">
              Website link
            </label>
            <InputText
              id="website"
              glass={false}
              width={"400px"}
              padding={"0px 40px 0px 20px"}
              height={40}
              onChange={setSideWebsiteUrl}
              iconRightPos={{ top: 6, right: 16 }}
              placeholder={"Enter your Website link"}
            />
          </div>
        </>
      }
      footer={
        <Button
          classes="mt-3"
          width={159}
          height={46}
          onClick={() => saveSide()}
        >
          Create
        </Button>
      }
      title={<span>Create a new Side server</span>}
    />
  );
}
