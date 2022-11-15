import React, { useEffect, useState } from "react";
//redux
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUser
} from "../../../redux/Slices/UserDataSlice";
// service
import { apiService } from "../../../services/api.service";
// models
import { User } from "../../../models/User";
// ui component
import Button from "../../ui-components/Button";
import InputText from "../../ui-components/InputText";
import TextArea from "../../ui-components/TextArea";

// icons
import checkGreen from "./../../../assets/check-green.svg";

// other
import { toast } from "react-toastify";
import { reduceWalletAddress } from "../../../helpers/utilities";

export interface InitialStateBio {
  bio: string;
}
interface InitialErrorState {
  bio: boolean;
}

const initialStateError = {
  bio: true
};
const InitialStateBio = {
  bio: ""
};

type ChildProps = {
  updateCurrentStep: (step: string) => void;
}

export default function Bio({
  updateCurrentStep
}: ChildProps) {

  const [formData, setFormData] = useState<InitialStateBio>(InitialStateBio);
  const [errorData, setErrorData] =
    useState<InitialErrorState>(initialStateError);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let bioLength = formData.bio.length;

  //#region Form handlers
  const onChangeBio = (event: any) => {
    const bio = event.target.value;
    validateBio(bio);
    setFormData({ ...formData, bio: bio });
  };

  const validateBio = (bio: string) => {
    const length = bio.length;
    const validLength = length <= 500;
    setErrorData({ ...errorData, bio: validLength });
    return validLength;
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
      // await apiService.updateUser(user.id, formData)
      
      // Update the step to go to that we are on.
      updateCurrentStep("step 3");
      
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

  const goBack = () => {
    return updateCurrentStep("step 1");
  };

  const validateForm = () => {
    return validateBio(formData.bio);
  };
 
  return (
    <div className="f-row form-area">
        
      <div className="f-column mt-5">
        <div className="flex">
          <TextArea
            height={120}
            width="90%"
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            placeholder={"Describe yourself"}
            placeholderColor="var(--text-primary-light)"
            onChange={onChangeBio}
            radius="10px"
            maxLength={600}
          />
        </div>
        {!errorData.bio && (
          <div className="text-red">Max number of characters is 500.</div>
        )}
      </div>

      <div className="actions">
          <Button
            classes={"mt-3 back"}
            width={"159px"}
            height={44}
            onClick={goBack}
            radius={10}
            color={"var(--text-primary-light)"}
          >
            Back
          </Button>

          {/* Submit Button */}
          <Button
            classes={"mt-3 submit"}
            width={"159px"}
            height={44}
            onClick={onSubmit}
            radius={10}
            color={"var(--text-primary-light)"}
          >
            {bioLength == 0 ? 'Skip' : 'Continue'}
          </Button>
      </div>
     
    </div>
  );
}
