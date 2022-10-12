import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Input } from "semantic-ui-react";
import { addColony } from "../../redux/Slices/UserDataSlice";

import Button from "../ui-components/Button";
import InputText from "../ui-components/InputText";
import Modal from "../ui-components/Modal";
import { useNavigate } from "react-router";
import CustomSelect from "../ui-components/CustomSelect";
import { apiService } from "../../services/api.service";

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


export default function CreateColonyModal({ showModal }: { showModal: any }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<InitialState>(initialState);

  const [tokenProperties, setTokenProperties] = useState<any[]>([]);

  const [propertySelected, setPropertySelected] = useState<string>("");
  const [tokenSelected, setTokenSelected] = useState<string>("");

  const setSideName = (event: any) => {
    const name = event.target.value;
    setFormData({ ...formData, name: name });
  };

  const setSideTokenAddress = (event: any) => {
    const address = event.target.value;

    // if (!Web3.utils.isAddress(event.target.value, CONFIG.NETWORK.ID)) {
    //   toast.error("This address is not an Ethereum Address",{toastId: 1});
    //   return;
    // }

    setFormData({ ...formData, NftTokenAddress: address });
    if (address.trim().length) {
      // -- fetching properties and values of the collection from blockchain or opensea --
      const properties = [
        { property: { label: 'Background', value: 'background' }, values: [{ label: 'Red', value: 'red' }, { label: 'Blue', value: 'blue' }, { label: 'Green', value: 'green' }] },
        { property: { label: 'Clothes', value: 'clothes' }, values: [{ label: 'Striped Tee', value: 'striped_tee' }, { label: 'Black T', value: 'black_t' }, { label: 'Navy Striped Tee', value: 'navy_striped_tee' }] }
      ]
      setTokenProperties(properties);
    } else setTokenProperties([]);

    setTokenSelected(address);

  };

  const setSidePropertyCondition = (event: any) => {
    let conditions
    if (event.target.value.trim().length) {
      conditions = { ...formData.conditions }
      conditions[formData.NftTokenAddress] = {}
      conditions[formData.NftTokenAddress][event.target.value] = ""
    } else conditions = {}
    setFormData({ ...formData, conditions: conditions });
    setPropertySelected(event.target.value);
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
      if (formData.sideImage){
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
          <div className="f-column mt-4 mb-3">
            <label htmlFor="name" className="size-14 fw-400 mb-1 text-left">
              NFT or Token address
            </label>
            <InputText
              id="address"
              glass={false}
              width={"400px"}
              padding={"0px 40px 0px 20px"}
              height={40}
              onChange={setSideTokenAddress}
              iconRightPos={{ top: 6, right: 16 }}
              placeholder={"Paste the address of your NFT or Token"}
              placeholderSize={14}
              placeholderWeight={400}
              placeholderColor="var(--placeholder)"
            />
          </div>

          <div className="f-column mt-4 mb-3">
            <label htmlFor="name" className="size-14 fw-400 mb-1 text-left">
              Features
            </label>

            <div
              className="flex justify-between mt-4 w-100"
              style={{ maxWidth: 400 }}
            >

              <CustomSelect
                width={"400px"}
                height={"40px"}
                fontSize={12}
                fontWeight={700}
                arrowPosition={{ top: 12, right: 15 }}
                values={["", ...(tokenProperties.map(item => item['property']['value']))]}
                options={(tokenProperties.length) ? ["Select Property", ...(tokenProperties.map(item => item['property']['label']))] : ["Select NFT Collection"]}
                onChange={setSidePropertyCondition}
              />
              <CustomSelect
                width={"400px"}
                height={"40px"}
                fontSize={12}
                fontWeight={700}
                arrowPosition={{ top: 12, right: 15 }}
                values={(propertySelected.trim().length) ? ["", ...(tokenProperties.find(item => item['property']['value'] === propertySelected )['values']).map((item:any) => item['label']) ]  : [""]}
                options={(propertySelected.trim().length) ? ["Select Value", ...(tokenProperties.find(item => item['property']['value'] === propertySelected )['values']).map((item:any) => item['label']) ]  : ["Select NFT Collection"]}
                onChange={setSideValueCondition}
              />
            </div>
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
