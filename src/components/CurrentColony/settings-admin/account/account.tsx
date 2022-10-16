import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import TextArea from "../../../ui-components/TextArea";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./account.css";
import { apiService } from "../../../../services/api.service";
import { addColony } from "../../../../redux/Slices/UserDataSlice";
import { RootState } from "../../../../redux/store/app.store";

export default function Account({
  currentSide, userData
}: {
  currentSide: Colony;
  userData : any;
}) {


  const dispatch = useDispatch();

  useEffect(() => {
    console.log('currentSide Accounts:', currentSide)
    console.log('userData Accounts:', userData)
  });

  return (
    <>
           {/* Profile Picture Section */}
           <div className="f-column">
          <div className="text-primary-light mb-3 text fw-600">Account</div>


          {/* <div className="flex">
            <label
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
                <img
                style={{
                  height: "inherit",
                  width: "inherit",
                  objectFit: "cover",
                }}
                src={currentSide.sideImage}
                alt="file"
              />
              )}
            </label>

            <label className="text-primary-light fw-600 f-column align-center justify-center text-center ml-3">Use square image (1:1 ratio) to have a better rendering.</label>

            <div className="f-column align-center justify-center ml-3">
            <input
              accept=".png,.jpg,.jpeg,.webp"
              style={{ display: "none" }}
              id="input-colony-picture"
              type={"file"}
              onChange={undefined}
            />
            <label htmlFor={"input-colony-picture"}>
            <Button width={159} height={46} onClick={undefined} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}> Upload a new image</Button>
            </label>
            </div>
 
          </div> */}




        </div>
    </>
  );
}
