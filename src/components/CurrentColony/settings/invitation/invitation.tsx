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
    class: 'fa-brands fa-facebook mr-2',
    label: 'Facebook'
  },
  {
    class: 'fa-brands fa-twitter mr-2',
    label: 'Twitter'
  },
  {
    class: 'fa-brands fa-linkedin mr-2',
    label: 'Linkedin'
  }]

  const exampleUsers = [{
    name: 'User 1',
    invited: false
  },
  {
    name: 'User 2',
    invited: true
  },
  {
    name: 'User 3',
    invited: true
  },
  {
    name: 'User 4',
    invited: false
  },
  {
    name: 'User 5',
    invited: false
  },
  {
    name: 'User 6',
    invited: true
  },
  {
    name: 'User 7',
    invited: false
  },
  {
    name: 'User 8',
    invited: true
  },
  {
    name: 'User 9',
    invited: true
  },
  {
    name: 'User 10',
    invited: false
  },
  {
    name: 'User 11',
    invited: false
  },
  {
    name: 'User 12',
    invited: true
  }]

  return (
    <>

      {/* Search and Invite Section */}


      <div className="search-and-invite mb-3">
        <InputText
          placeholderColor="var(--placeholer)"
          color="var(--placeholer)"
          parentWidth={"43rem"}
          height={45}
          width="85%"
          bgColor="var(--bg-secondary-light)"
          glass={true}
          iconRightPos={{ top: 12, right: 105 }}
          placeholder={"Search by username or wallet address "}
          onChange={undefined}
          radius="5px"
        />
        <div className="f-column user-list mt-3">
          {
            exampleUsers.map(example =>
              <div className="flex mt-4 justify-between">
                <div className="flex">
                  <label className="profile-image-user f-column align-center justify-center">
                    <img style={{ height: "inherit", width: "inherit", objectFit: "cover" }}
                      src="https://images.unsplash.com/photo-1662948291101-691f9fa850d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
                      alt="file"
                    />
                  </label>
                  <label className="align-center justify-center mt-1 ml-3">{example['name']}</label>
                </div>
                <div>
                  {
                    (example['invited']) ? 
                    <label className="text-green"><i className="fa-solid fa-check mr-2"></i> Invited</label>
                    :
                    <Button classes="size-12" width={70} height={27} radius={5} onClick={undefined} background={'var(--bg-secondary-light)'}><i className="fa-solid fa-circle-plus mr-2"></i>Invite</Button>
                  }
                </div>

              </div>
            )
          }
        </div>
      </div>
      {/* Invitation Link Section */}
      <div className="f-column">
        <div className="text-primary-light mb-3 text fw-600">Invitation Link</div>
        <div className="flex mt-2 align-center">
          <InputText
            height={40}
            parentWidth={"43rem"}
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
