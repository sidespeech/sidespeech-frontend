import React, { useEffect } from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./channels.css"

export default function Channels({
  currentSide,
}: {
  currentSide: Colony;
}) {

  const dispatch = useDispatch();

  return (
    <>
      <div className="f-column">
        <div className="text-primary-light mb-3 text fw-600">Channels</div>
        {
          currentSide['channels'].map((channel: any) =>
            <div className="flex mt-2 align-center">
              <i className="fa-solid fa-grip-lines fa-lg mr-2 text-secondary-dark"></i>
              <InputText
                placeholderColor="var(--text-primary-light)"
                key={channel['id']}
                height={40}
                width="50%"
                bgColor="var(--bg-secondary-dark)"
                glass={false}
                placeholder={"# " + channel['name']}
                onChange={undefined}
                radius="10px"
              />
              <i className="fa-solid fa-circle-minus fa-xl remove-icon text-red"></i>
            </div>
          )
        }

        <Button classes="ml-4 mt-2" width={298} height={40} onClick={undefined} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}><i className="fa-solid fa-plus mr-2"></i>Create a channel</Button>

        {/* Submit Button */}
        <Button classes={"mt-5"} width={159} height={46} onClick={undefined} radius={10} color={'var(--text-primary-light)'}>Save </Button>
      </div>
    </>
  );
}
