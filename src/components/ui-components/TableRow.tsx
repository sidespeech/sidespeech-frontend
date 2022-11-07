import React, { useEffect, useState } from "react";
import { getRoleColor, reduceWalletAddress } from "../../helpers/utilities";
import CustomSelect from "./CustomSelect";
import check from "../../assets/check.svg";
import { first } from "lodash";
import Button from "./Button";
import { Side } from "../../models/Side";

export default function TableRow({
  side,
  user,
}: {
  side: Side;
  user: any;
}) {
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [connectedUserIsCreator, setConnectedUserIsCreator] =
    useState<boolean>(false);
  const [newRole, setNewRole] = useState("");

  const handleRoleChange = (event: any) => {
    setNewRole(event.target.value);
  };

  const getRole = (address:string) => {
    return (address === side['creatorAddress']) ? 'Administrator' : 'User'
  };

  useEffect(() => {
  }, []);

  const handleSaveRole = async () => { };

  return (
    <tr>
      <td>
        <div className="flex">
          <span className="profile-round-small mr-1">
            <img
              style={{ width: "inherit", height: "inherit", objectFit: "cover" }}
              // src={user.get("user")?.get("profilePicture")?.url}
              src={user["profilePicture"]}
              alt="profile"
            />
            {/* <img alt="verified" src={check} /> */}
          </span>
          {/* <span className="fw-400 size-12 ml-2">{user.get("username")}</span> */}
          {/* <span className="fw-400 size-12 ml-2 text-primary-light">{(user["username"].length > 25) ? user["username"].slice(0, 20) + '...' : user["username"]}</span> */}
          <span className="fw-400 size-12 ml-2 text-primary-light">{(user["username"].length > 25) ? user["username"].slice(0, 20) + '...' : user["username"]}</span>
        </div>
      </td>
      <td>
        {connectedUserIsCreator ? (
          !isCreator && (
            <>
              <CustomSelect
                options={["User", "Moderator1", "Moderator2", "Moderator3"]}
                values={["User", "Moderator1", "Moderator2", "Moderator3"]}
                // valueToSet={user.get("role").get("name")}
                valueToSet={getRole(user['username'])}
                onChange={handleRoleChange}
              />
              <i
                className="fa-solid fa-check ml-4 pointer"
                onClick={handleSaveRole}
                title="Save new role"
              ></i>
              <i className="fa-solid fa-trash ml-4" title="Delete user"></i>
            </>
          )
        ) : (
          // <span className={getRoleColor(user.attributes.role.get("name"))}>
          <span className={getRoleColor(getRole(user['username'])) + ' flex-1 ml-5 align-center text-center'}>
            {/* {user.get("role").get("name")} */}
            {getRole(user['username'])}
          </span>
        )}
      </td>
      <td className="flex-1 ml-5 align-center text-center">
        {(getRole(user['username']) !== "Administrator") ? 
        <Button
          width={70}
          height={35}
          onClick={undefined}
          radius={10}
          background={'var(--bg-secondary-light)'}
          color={'red'}
        ><i className="fa-solid fa-right-from-bracket mr-1"></i> Eject</Button>
        : null
      }
      </td>
    </tr>
    // <div className="flex align-center my-2">
    //   <div className="flex flex-1 align-end">
    //     <span className="profile-round-small mr-1">
    //       <img
    //         style={{ width: "inherit", height: "inherit", objectFit: "cover" }}
    //         // src={user.get("user")?.get("profilePicture")?.url}
    //         src={user["profilePicture"]}
    //         alt="profile"
    //       />
    //       {/* <img alt="verified" src={check} /> */}
    //     </span>
    //     {/* <span className="fw-400 size-12 ml-2">{user.get("username")}</span> */}
    //     <span className="fw-400 size-12 ml-2 text-primary-light">{(user["username"].length > 25) ? user["username"].slice(0, 20) + '...' : user["username"]}</span>
    //   </div>
    //   <div className="flex flex-1 align-center size-12">
    // {connectedUserIsCreator ? (
    //   !isCreator && (
    //     <>
    //       <CustomSelect
    //         options={["User", "Moderator1", "Moderator2", "Moderator3"]}
    //         values={["User", "Moderator1", "Moderator2", "Moderator3"]}
    //         // valueToSet={user.get("role").get("name")}
    //         valueToSet={user["role"]}
    //         onChange={handleRoleChange}
    //       />
    //       <i
    //         className="fa-solid fa-check ml-4 pointer"
    //         onClick={handleSaveRole}
    //         title="Save new role"
    //       ></i>
    //       <i className="fa-solid fa-trash ml-4" title="Delete user"></i>
    //     </>
    //   )
    // ) : (
    //   // <span className={getRoleColor(user.attributes.role.get("name"))}>
    //   <span className={getRoleColor(user["role"]) + ' flex-1 align-center text-center'}>
    //     {/* {user.get("role").get("name")} */}
    //     {user["role"]}
    //   </span>
    // )}
    //   </div>
    //   <div className="flex-1 ml-5 align-center text-center">
    // <Button width={70} height={35} onClick={undefined} radius={10} background={'var(--bg-secondary-light)'} color={'var(--text-primary-light)'}>Eject</Button>
    //   </div>
    // </div>
  );
}
