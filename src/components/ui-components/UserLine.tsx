import React, { useEffect, useState } from "react";
import { getRoleColor, reduceWalletAddress } from "../../helpers/utilities";
import CustomSelect from "./CustomSelect";
import check from "../../assets/check.svg";
import { Colony } from "../../models/Colony";
import { first } from "lodash";

export default function UserLine({
  colony,
  user,
}: {
  colony: Colony;
  user: any;
}) {
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [connectedUserIsCreator, setConnectedUserIsCreator] =
    useState<boolean>(false);
  const [newRole, setNewRole] = useState("");

  const handleRoleChange = (event: any) => {
    setNewRole(event.target.value);
  };

  const handleSaveRole = async () => {};

  return (
    <div className="flex align-center my-2">
      <div className="flex flex-1 align-end">
        <span className="profile-round-small mr-1">
          <img
            style={{ width: "inherit", height: "inherit", objectFit: "cover" }}
            src={user.get("user")?.get("profilePicture")?.url}
            alt="profile"
          />
          {/* <img alt="verified" src={check} /> */}
        </span>
        <span className="fw-400 size-12 ml-2">{user.get("username")}</span>
      </div>
      <div className="flex flex-1 align-center size-12">
        {connectedUserIsCreator ? (
          !isCreator && (
            <>
              <CustomSelect
                options={["User", "Moderator1", "Moderator2", "Moderator3"]}
                values={["User", "Moderator1", "Moderator2", "Moderator3"]}
                valueToSet={user.get("role").get("name")}
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
          <span className={getRoleColor(user.attributes.role.get("name"))}>
            {user.get("role").get("name")}
          </span>
        )}
      </div>
    </div>
  );
}
