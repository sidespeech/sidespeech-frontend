import React, { useEffect, useState } from "react";

//redux
import { useDispatch } from "react-redux";

import {
  updateUser
} from "../../../redux/Slices/UserDataSlice";

// service
import { apiService } from "../../../services/api.service";

// ui component
import Button from "../../ui-components/Button";
import InputText from "../../ui-components/InputText";

// other
import { toast } from "react-toastify";

export interface InitialStateUser {
  username: string;
}
interface InitialErrorState {
  username: boolean;
}

const initialStateError = {
  username: true
};
const initialStateUser = {
  username: ""
};

type ChildProps = {
  updateCurrentStep: (step: string) => void;
  updateChosenUsername: (username: string) => void;
 }

export default function Welcome({
  updateCurrentStep,
  updateChosenUsername,
}: ChildProps) {

  const [specialCharacters, setSpecialCharacters] = useState<boolean>(true);
  const [availableUsername, setAvailableUsername] = useState<boolean>(false);
  const [minMaxCharacters, setMinMaxCharacters] = useState<boolean>(false);

  const [formData, setFormData] = useState<InitialStateUser>(initialStateUser);
  const [errorData, setErrorData] =
    useState<InitialErrorState>(initialStateError);

  const dispatch = useDispatch();

  //#region Form handlers
  const onChangeUsername = async (event: any) => {
    const username = event.target.value;

    const re = new RegExp("^[a-zA-Z0-9]*$");
    const isValid = re.test(username);

    // Setting state of the special characters.
    isValid ? setSpecialCharacters(true) : setSpecialCharacters(false);

    // Setting state of the min characters.
    username.length >= 5 && username.length <= 15 ? setMinMaxCharacters(true) : setMinMaxCharacters(false);
    
    if(minMaxCharacters) {
      const checkUsername = await apiService.findExistingUsername(username);
      !checkUsername ? setAvailableUsername(true) : setAvailableUsername(false);
    }

    setFormData({ ...formData, username: username });
  };

  //#region Submit functions

  const onSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please ensure all requirements met.", {
        toastId: 3,
      });
      return false;
    }
    try {

      // Update the step to go to that we are on.
      updateCurrentStep("step 2");

      // Update the set username...
      updateChosenUsername(formData.username);

      dispatch(updateUser({ ...formData }));
    
    } catch (error) {
      toast.error("There has been an issue updating your account.", {
        toastId: 3,
      });
      console.log(error);
    }
  };
  //#endregion

  //#region Form validation

  const validateForm = () => {
    return specialCharacters && minMaxCharacters && availableUsername ? true : false;
  };

  return (
    <div className="f-row form-area">
        
      {/* Username Section */}
      <div className="f-column mt-5">
        <div className="flex">
          <InputText
            height={40}
            width="25%"
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            color="#fff"
            placeholderColor="var(--text-primary-light)"
            placeholder={"Your username"}
            onChange={onChangeUsername}
            radius="10px"
            maxLength={15}
          />
        </div>
        <div className="requirements">
          <div 
           className={`rule ${!specialCharacters ? "error" : ""}`}
          >
            <p>No special characters</p>
          </div>
          <div className={`rule ${!availableUsername ? "error" : ""}`}>
            <p>Available</p>
          </div>
          <div
            className={`rule ${!minMaxCharacters ? "error" : ""}`}
          >
            <p>Between 5 and 15 Characters</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        classes={"mt-5 mx-auto"}
        width={"121px"}
        height={44}
        onClick={onSubmit}
        radius={10}
        color={"var(--text-primary-light)"}
      >
        Continue{" "}
      </Button>
    </div>
  );
}
