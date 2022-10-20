import React, { useEffect, useState } from "react";
import Button from "./../../ui-components/Button";
import InputText from "./../../ui-components/InputText";
import TextArea from "./../../ui-components/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { disconnect } from "../../../redux/Slices/UserDataSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { apiService } from "./../../../services/api.service";

// CSS Import
import "./../DefaultView.css";
import "./Account.css";

// Example NFT icon.
import nftIcon from "./../../../assets/example-nft.svg";
import searchIcon from "./../../../assets/search.svg";
import copyIcon from "./../../../assets/copy-icon.svg";
import closeWalletIcon from "./../../../assets/close-wallet.svg";
import { RootState } from "../../../redux/store/app.store";

export interface InitialStateProfile {
  profilePicture: string | undefined;
  username: string;
  bio: string;
}

const initialStateProfile = {
  profilePicture: undefined,
  username: "",
  bio: "",
};

export default function GeneralSettingsAccount() {
  const collections = [
    {
      id: "001",
      name: "Moonbirds",
    },
    {
      id: "002",
      name: "BAYC",
    },
    {
      id: "003",
      name: "Crypto Punks",
    },
  ];

  const nfts = [
    {
      id: "001",
    },
    {
      id: "002",
    },
    {
      id: "003",
    },
  ];

  const [formData, setFormData] =
    useState<InitialStateProfile>(initialStateProfile);

  const [openCollection, setOpenCollection] = useState(
    new Array(collections.length).fill(false)
  );
  const [checkedState, setCheckedState] = useState(
    new Array(nfts.length).fill(false)
  );
  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const walletAddress = window.ethereum.selectedAddress;

  const handleCollectionShowing = (position: any) => {
    const updatedCollectionShowing = openCollection.map((item, index) =>
      index === position ? !item : item
    );
    setOpenCollection(updatedCollectionShowing);
  };

  const handleNftChange = (position: any) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const handleSelectAll = () => {
    const updatedCheckedState = checkedState.map(
      (item, index) => (item = true)
    );
    setCheckedState(updatedCheckedState);
  };

  const countSelected = () => {
    console.log(checkedState);
  };

  const handleCopyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  const logout = () => {
    dispatch(disconnect());
    localStorage.clear();
    navigate("/");
  };

  const onChangeUsername = (event: any) => {
    const username = event.target.value;
    setFormData({ ...formData, username: username });
  };

  const onSubmit = async () => {
    if (!userData || !userData.currentProfile) return;
    try {
      if (!formData.profilePicture) {
        delete formData["profilePicture"];
      }
      const updatedProfile = await apiService.updateProfile(
        userData["currentProfile"]["id"],
        formData
      );
      toast.success(formData.username + " has been updated.", {
        toastId: 4,
      });
    } catch (error) {
      toast.error("There has been an issue updating your account.", {
        toastId: 3,
      });
      console.log(error);
    }
  };
  return (
    <>
      <div className="account">
        <div className="f-row form-area">
          {/* Profile Picture Section */}
          {/* <div className="f-column">
            <div className="text-primary-light mb-3 text fw-600">Account</div>

            <div className="flex">
            <label
                className="upload-colony-image f-column align-center justify-center"
            >
                {formData.profilePicture ? (
                <img
                    style={{
                    height: "inherit",
                    width: "inherit",
                    objectFit: "cover",
                    }}
                    src={formData.profilePicture}
                    alt="file"
                />
                ) : (
                <img
                    style={{
                    height: "inherit",
                    width: "inherit",
                    objectFit: "cover",
                    }}
                    src={userData ? userData.currentProfile.profilePicture : ''}
                    alt="file"
                />
                )}
            </label>
            <label className="text-primary-light fw-600 f-column align-center justify-center text-center ml-3">Choose an NFT from your wallet as your account avatar</label>

            <div className="f-column align-center justify-center ml-3">
                <input
                accept=".png,.jpg,.jpeg,.webp"
                style={{ display: "none" }}
                id="input-colony-picture"
                type={"file"}
                onChange={undefined}
                />
                <label htmlFor={"input-colony-picture"}>
                <Button width={159} height={46} onClick={undefined} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}>Select an NFT</Button>
                </label>
            </div>
            </div>

        </div> */}

          {/* Username Section */}
          <div className="f-column mt-5">
            <div className="text-primary-light mb-3 text fw-600">Username</div>
            <div className="flex">
              <InputText
                height={40}
                width="70%"
                bgColor="var(--bg-secondary-dark)"
                glass={false}
                placeholderColor="var(--text-primary-light)"
                placeholder={userData && userData.currentProfile  ? userData.currentProfile.username : ""}
                onChange={onChangeUsername}
                radius="10px"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="f-column mt-5">
            <div className="text-primary-light mb-3 text fw-600">Bio</div>
            <div className="flex">
              <TextArea
                height={120}
                width="90%"
                bgColor="var(--bg-secondary-dark)"
                glass={false}
                placeholder={"Describe yourself"}
                placeholderColor="var(--text-primary-light)"
                onChange={undefined}
                radius="10px"
              />
            </div>
          </div>

          {/* Wallet Section */}
          <div className="f-column mt-5">
            <div className="text-primary-light mb-3 text fw-600">
              Connected wallet
            </div>
            <div className="flex">
              <InputText
                height={40}
                width="100%"
                parentWidth={"80%"}
                bgColor="var(--bg-secondary-dark)"
                glass={false}
                placeholder={userData && userData.account ? userData.account : ""}
                onChange={undefined}
                disabled={true}
                defaultValue={walletAddress}
                radius="10px"
              />
              <div className="copy" onClick={handleCopyWalletAddress}>
                <p>Copy</p> <img src={copyIcon} />
              </div>
              <div className="closeWallet cursor-pointer" onClick={logout}>
                <img src={closeWalletIcon} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            classes={"mt-3"}
            width={159}
            height={46}
            onClick={onSubmit}
            radius={10}
            color={"var(--text-primary-light)"}
          >
            Save{" "}
          </Button>
        </div>

        <div className="f-row my-nfts">
          <p>
            My public NFTS (<span className="selected">0</span>/6)
          </p>
          <InputText
            height={40}
            width="100%"
            bgColor="var(--bg-primary)"
            glass={false}
            placeholder="Search NFT"
            onChange={undefined}
            radius="10px"
          />
          <i className="search-icon">
            <img src={searchIcon} />
          </i>

          {collections.map(({ id, name }, index) => {
            return (
              <div className={`nftCollection`} key={index}>
                <div className="head">
                  <div
                    className="float-left"
                    onClick={() => handleCollectionShowing(index)}
                  >
                    <div
                      className={`minus ${openCollection[index] ? "plus" : ""}`}
                    ></div>
                    <div className="title">{name}</div>
                  </div>
                  <div className="float-right">
                    <div className="selected">
                      Public : <span className="selected">0</span>/{nfts.length}
                    </div>
                    <a className="selectAll" onClick={() => handleSelectAll()}>
                      Select All
                    </a>
                  </div>
                </div>

                <div
                  className={`nfts ${
                    openCollection[index] ? "closed" : "open"
                  }`}
                >
                  {nfts.map(({ id }, index) => {
                    return (
                      <div
                        className={`the-nft ${
                          checkedState[index] ? "selected" : ""
                        }`}
                        key={index}
                      >
                        <div className="inner">
                          {checkedState[index] ? (
                            <div className="status">Public</div>
                          ) : (
                            ""
                          )}
                          <img src={nftIcon} />
                          <div className="detail text-center">
                            <div className="number">
                              <p>#{id}</p>
                            </div>
                            <div className="public">
                              <p>Public</p>
                              <div className="checkarea">
                                <input
                                  type="checkbox"
                                  id={`nft-${index}`}
                                  name={id}
                                  value={id}
                                  checked={checkedState[index]}
                                  onChange={() => handleNftChange(index)}
                                />
                                <label htmlFor={`nft-${index}`}>Toggle</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="submitArea">
            {/* Submit Button */}
            <Button
              classes={"mt-3"}
              width={159}
              height={46}
              radius={10}
              color={"var(--text-primary-light)"}
            >
              Save Collection
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
