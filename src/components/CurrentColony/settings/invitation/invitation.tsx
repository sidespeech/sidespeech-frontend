import React from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./invitation.css"


export default function Invitation({
  currentSide,
}: {
  currentSide: Colony;
}) {

  const dispatch = useDispatch();
  const socialsMedia = [{
    class : 'fa-brands fa-facebook mr-2',
    label : 'Facebook'
  },
  {
    class : 'fa-brands fa-twitter mr-2',
    label : 'Twitter'
  },
  {
    class : 'fa-brands fa-linkedin mr-2',
    label : 'Linkedin'
  }]

  return (
    <>
    {/* Invitation Link Section */}
      <div className="f-column">
        <div className="text-primary-light mb-3 text fw-600">Invitation Link</div>
        <div className="flex mt-2 align-center">
          <InputText
            height={40}
            width="50%"
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            placeholder="Invitation Link"
            onChange={undefined}
            radius="10px"
          />
          <Button classes="btn-copy cursor-pointer" width={150} height={40} onClick={undefined} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}><i className="fa-solid fa-copy mr-2"></i>Copy the link</Button>
        </div>

        <label className="text-primary-light mt-4">Copy this link and share it with your friends to invite them in this side</label>
      </div>
      
      {/* Social Media Section*/}
      <div className="f-column mt-5">
        <div className="text-primary-light mb-3 text fw-600">Share on social networks</div>
        <div className="flex mt-2 align-center">
          {
            socialsMedia.map(social => 
              <Button key={social.class} classes="cursor-pointer mr-2" width={100} height={40} onClick={undefined} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}><i className={social.class}></i>{social.label}</Button>
              )
          }
        </div>
      </div>
    </>
  );
}
