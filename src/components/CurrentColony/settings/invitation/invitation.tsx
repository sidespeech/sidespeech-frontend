import React, { useEffect, useState } from "react";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import { useDispatch } from "react-redux";
import { Side } from "../../../../models/Side";
import facebook from "../../../../assets/facebook.svg";
import twitter from "../../../../assets/twitter.svg";
import linkedin from "../../../../assets/linkedin.svg";
import "./invitation.css"
import { apiService } from "../../../../services/api.service";
import { toast } from "react-toastify";


export default function Invitation({
  currentSide,
  invitationUsers,
  setUserInvited,
  userInvited
}: {
  currentSide: Side;
  invitationUsers?: any[];
  setUserInvited?:any;
  userInvited?:any;
}) {

  const dispatch = useDispatch();

  const socialsMedia = [{
    icon: facebook,
    label: "Facebook"
  },
  {
    icon: twitter,
    label: "Twitter"
  },
  {
    icon: linkedin,
    label: "LinkedIn"
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

  const [usersInvite, setUsersInvite] = useState<any>([]);


  useEffect(() => {
    if (invitationUsers) {
      setUsersInvite(invitationUsers)
    } else {
      setUsersInvite(exampleUsers)
    }
  }, [invitationUsers]);


  const addInvitationUsers = async (user:any, index:number) => {
    let currentsInvited = [...userInvited];
    let object = {
      state: 3,
      sender: user.sender,
      recipient: user.recipient,
      invitationLink : sideLink
    }

    if (!currentsInvited.find(i => i.recipient === object.recipient)) {
      setUserInvited([...userInvited, object])
      let users = [...usersInvite]
      users[index]['invited'] = true
      setUsersInvite(users);
    }
  }  
  const sideLink = `https://sidespeech.com/side/${(Math.random() + 1).toString(36).substring(7)}`;

  const handleCopyWalletAddress = () => {
    navigator.clipboard.writeText(sideLink);
    toast.success("Link copied successfuly.", { toastId: 1 });
  };

  return (
    <>

      {/* Search and Invite Section */}
    <div>Search and invite</div>
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
            usersInvite.map((user:any, index:number) =>
              <div className="flex mt-4 justify-between">
                <div className="flex">
                  <label className="profile-image-user f-column align-center justify-center">
                    <img style={{ height: "inherit", width: "inherit", objectFit: "cover" }}
                      src="https://images.unsplash.com/photo-1662948291101-691f9fa850d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
                      alt="file"
                    />
                  </label>
                  <label className="align-center justify-center mt-1 ml-3">{user['name']}</label>
                </div>
                <div>
                  {
                    (user['invited']) ? 
                    <label className="text-green"><i className="fa-solid fa-check mr-2"></i> Invited</label>
                    :
                    <Button classes="size-12" width={70} height={27} radius={5} onClick={() => addInvitationUsers(user, index)} background={'var(--bg-secondary-light)'}><i className="fa-solid fa-circle-plus mr-2"></i>Invite</Button>
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
            parentWidth={"70%"}
            width="100%"
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            placeholder="Invitation Link"
            onChange={undefined}
            disabled
            defaultValue={sideLink}
            radius="10px"
          />
          <Button classes="cursor-pointer ml-4" width={150} height={40} onClick={handleCopyWalletAddress} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}><i className="fa-solid fa-copy mr-2"></i>Copy the link</Button>
        </div>

        <label className="text-primary-light mt-4">Copy this link and share it with your friends to invite them in this side</label>
      </div>

      {/* Social Media Section*/}
      <div className="f-column mt-5">
        <div className="text-primary-light mb-3 text fw-600">Share on social networks</div>
        <div className="flex mt-2 align-center">
          {
            socialsMedia.map((social,index) =>
              <Button key={index} classes="cursor-pointer mr-2" width={100} height={40} onClick={undefined} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}><img src={social.icon} className="mr-2"/>{social.label}</Button>
            )
          }
        </div>
      </div>
    </>
  );
}
