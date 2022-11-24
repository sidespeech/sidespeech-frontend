import React, { useEffect, useState } from "react";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import { useDispatch } from "react-redux";
import { Side } from "../../../../models/Side";
import facebook from "../../../../assets/facebook.svg";
import twitter from "../../../../assets/twitter.svg";
import linkedin from "../../../../assets/linkedin.svg";
import styled from 'styled-components'
import { apiService } from "../../../../services/api.service";
import { toast } from "react-toastify";
import { Profile } from "../../../../models/Profile";
import { State, Type } from "../../../../models/Invitation";
import { breakpoints, size } from "../../../../helpers/breakpoints";

const InvitationsStyled = styled.div`
  width: 100%;
  ${breakpoints(size.lg, `{
    width: 60%;
    max-width: 500px;
  }`)}
  .btn-copy {
    margin-left: -23%;
  }

  .search-and-invite {
      position: relative;
      padding: 20px;
      border-radius: 20px;
      flex: 1.2;
      background-color: var(--bg-secondary-dark);
      width: 100%;
  }

  .user-list {
      padding: 0 20px;
      /* flex: 1.2; */
      background-color: var(--bg-secondary-dark);
      width: 100%;
      height: 20rem;
      overflow-y: auto;
      overflow-x: hidden;
  }


  .profile-image-user {
      width: 25px;
      height: 25px;
      cursor: pointer;
      background: var(--bg-secondary-dark);
      border-radius: 100px;
      text-align: center;
      color: var(--bg-primary-light);
      overflow: hidden;
    }

    .copy-link-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      margin: 1rem 0;
      ${breakpoints(size.md, `{
        display: grid;
        grid-template-columns: 4fr 2fr;
      }`)}
      & button {
        order: 3;
        ${breakpoints(size.md, `{
          order: 2;
        }`)}
      }
      & label {
        order: 2;
        grid-column: 1/3;
        ${breakpoints(size.md, `{
          order: 3;
        }`)}
      }
    }
    .media-btns-wrapper {
      ${breakpoints(size.md, `{
        margin-top: 2rem;
      }`)}
      .media-btns {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 1rem;
        ${breakpoints(size.md, `{
          justify-content: flex-start;
        }`)}
        .media-btn {
          ${breakpoints(size.md, `{
            max-width: 140px;
          }`)}
        }
      }
    }
`;


export default function Invitation({
  currentSide,
  userData,
  invitationUsers,
  setUserInvited,
  userInvited
}: {
  currentSide: Side;
  userData?: any;
  invitationUsers?: any[];
  setUserInvited?: any;
  userInvited?: any;
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

  const [usersInvite, setUsersInvite] = useState<any>([]);
  const [invited, setInvited] = useState<any>([]);


  useEffect(() => {
    if (invitationUsers) {
      setUsersInvite(invitationUsers)
    } else {
      if (userData && userData['user'] && userData['user']['profiles']) {
        const getInvitationUsers = async (user: any) => {
          let userSides = user.profiles.map((p: Profile) => p.side);
          let users = await apiService.getUserFromSides(userSides);
          let invitationsUsersObject = []
          for (let userInvite of users) {
            if (user['id'] !== userInvite['id'])
              invitationsUsersObject.push({
                name: (userInvite['username']) ? `${userInvite['username']} (${userInvite['accounts']})` : userInvite['accounts'],
                invited: (userInvite['invitations'].find((item:any) => item['sideId'] === currentSide['id'])) ? true : false,
                recipient: userInvite,
                sender: user
              })
          }
          setUsersInvite(invitationsUsersObject)
        }
        getInvitationUsers(userData['user']);
      }

    }
  }, [invitationUsers, userData, currentSide]);


  const addInvitationUsers = async (user: any, index: number) => {
    if (userInvited) {
      let currentsInvited = [...userInvited];
      let object = {
        state: State.Pending,
        type: Type.Invitation,
        sender: user.sender,
        recipient: user.recipient,
        invitationLink: sideLink
      }

      if (!currentsInvited.find(i => i.recipient === object.recipient)) {
        setUserInvited([...userInvited, object])
        let users = [...usersInvite]
        users[index]['invited'] = true
        setUsersInvite(users);
      }
    } else {
      delete user['sender']['profiles'];

      let object = {
        state: State.Pending,
        type: Type.Invitation,
        sender: { ...user.sender },
        recipient: user.recipient,
        invitationLink: sideLink,
        side: currentSide
      }
      await apiService.sendSingleInvitation(object);

      let users = [...usersInvite]
      users[index]['invited'] = true
      setUsersInvite(users);
    }

  }
  const sideLink = `https://sidespeech.com/side/invitation/${(Math.random() + 1).toString(36).substring(7)}`;

  const handleCopyWalletAddress = () => {
    navigator.clipboard.writeText(sideLink);
    toast.success("Link copied successfuly.", { toastId: 1 });
  };

  return (
    <InvitationsStyled>

      {/* Search and Invite Section */}
      <div className="text-primary-light mb-3 text fw-600">Search and invite</div>
      <div className="search-and-invite mb-3">
        <InputText
          placeholderColor="var(--placeholer)"
          color="var(--placeholer)"
          parentWidth={"100%"}
          height={45}
          width="100%"
          bgColor="var(--bg-secondary-light)"
          glass={true}
          iconRightPos={{ top: 12, right: 20 }}
          placeholder={"Search by username or wallet address "}
          onChange={undefined}
          radius="5px"
        />
        <div className="f-column user-list mt-3">
          {
            usersInvite.map((user: any, index: number) =>
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
                      <Button classes="size-12" width={"70px"} height={27} radius={5} onClick={() => addInvitationUsers(user, index)} background={'var(--bg-secondary-light)'}><i className="fa-solid fa-circle-plus mr-2"></i>Invite</Button>
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
        <div className="copy-link-wrapper">
          <InputText
            height={40}
            parentWidth={"100%"}
            width="100%"
            bgColor="var(--bg-secondary-dark)"
            glass={false}
            placeholder="Invitation Link"
            onChange={undefined}
            disabled
            defaultValue={sideLink}
            radius="10px"
          />
          <Button classes="cursor-pointer" width="100%" height={40} onClick={handleCopyWalletAddress} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}>
            Copy the link
          </Button>
          <label className="text-primary-light">Copy this link and share it with your friends to invite them in this side</label>
        </div>

      </div>

      {/* Social Media Section*/}
      <div className="media-btns-wrapper f-column">
        <div className="text-primary-light mb-3 text fw-600">Share on social networks</div>
        <div className="media-btns">
          {
            socialsMedia.map((social, index) =>
              <Button key={index} classes="media-btn cursor-pointer" width={"100%"} height={40} onClick={undefined} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}><img src={social.icon} className="mr-2" />{social.label}</Button>
            )
          }
        </div>
      </div>
    </InvitationsStyled>
  );
}