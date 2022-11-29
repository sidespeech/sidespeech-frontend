import React, { useEffect, useState } from "react";
import { fixURL, getRoleColor, reduceWalletAddress } from "../../helpers/utilities";
import CustomSelect from "./CustomSelect";
import check from "../../assets/check.svg";
import { first } from "lodash";
import Button from "./Button";
import { Side } from "../../models/Side";
import { Profile } from "../../models/Profile";
import defaultPP from "../../assets/default-pp.webp";
import profileService from "../../services/api-services/profile.service";

export default function TableRow({
  side,
  user,
}: {
  side: Side;
  user: Profile;
}) {
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [connectedUserIsCreator, setConnectedUserIsCreator] =
    useState<boolean>(false);
  const [newRole, setNewRole] = useState("");

  const handleRoleChange = (event: any) => {
    setNewRole(event.target.value);
  };

  const getRole = (role: number) => {
    if (role === 0) return "Administrator";
    else if (role === 2) return "Sub-Admin";
    else return "User";
  };

  useEffect(() => {}, []);

  const onClickEject = async (user: any) => {
    await profileService.removeProfile(user["id"]);
    window.location.reload();
  };

  const handleSaveRole = async () => {};

  return (
    <tr>
      <td>
        <div className="flex">
          <span className="profile-round-small mr-1">
            <img
              style={{
                width: "20px",
                height: "20px",
                objectFit: "cover",
                borderRadius: 10
              }}
              src={fixURL(user["profilePicture"]?.metadata?.image || defaultPP)}
              alt="profile"
            />
          </span>
          <span className="fw-400 size-12 ml-2 text-primary-light">
            {user["username"].length > 25
              ? user["username"].replace(
                  user["username"].substring(4, 34),
                  "..."
                )
              : user["username"]}
          </span>
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
                valueToSet={getRole(user["role"])}
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
          <span
            className={
              getRoleColor(getRole(user["role"])) +
              " flex-1 ml-5 align-center text-center"
            }
          >
            {getRole(user["role"])}
          </span>
        )}
      </td>
      <td className="flex-1 ml-5 align-center text-center">
        {getRole(user["role"]) !== "Administrator" ? (
          <Button
            width={"70px"}
            height={35}
            onClick={() => onClickEject(user)}
            radius={10}
            background={"var(--bg-secondary-light)"}
            color={"red"}
          >
            <i className="fa-solid fa-right-from-bracket mr-1"></i> Eject
          </Button>
        ) : null}
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

