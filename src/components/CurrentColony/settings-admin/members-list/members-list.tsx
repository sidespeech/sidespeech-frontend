import React, { useEffect } from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import { format } from "date-fns";
import UserLine from "../../../ui-components/UserLine";
import TableRow from "../../../ui-components/TableRow";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./members-list.css"
import styled from "styled-components";

export default function MembersList({
  currentSide,
}: {
  currentSide: Colony;
}) {

  const dispatch = useDispatch();

  const handleInvitePeople = () => {
  };

  return (
    <>
      <table className="member-list">
        <thead>
          <tr className="text-primary-light">
            <th>Members ({currentSide.profiles.length})</th>
            <th>Permission</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {_.orderBy(currentSide.profiles, (m) =>
              m['role']
            ).map((m) => {
              return <TableRow key={m.id} user={m} colony={currentSide} />;
            })} 
        </tbody>
      </table>
    </>
    // <>
    //     {/* <div className="w-100">
    //       <span className="fw-500 size-12 flex w-100 mt-2 justify-between px-1">
    //         <InputText
    //           width={"335px"}
    //           padding={"0px 40px 0px 20px"}
    //           height={36}
    //           radius={"90px"}
    //           weight={500}
    //           size={12}
    //           onChange={console.log}
    //           iconRightPos={{ top: 11, right: 18 }}
    //           iconSize={14}
    //           color="var(--text-secondary)"
    //           placeholderWeight={500}
    //           placeholderSize={12}
    //           placeholder={"Search"}
    //           glass
    //         />
    //         <Button width={124} height={32} onClick={handleInvitePeople}>
    //           <i className="fa-solid fa-user-plus mr-2"></i>
    //           <span className="fw-400 size-11">Invite people</span>
    //         </Button>
    //       </span>
    //     </div> */}
    //     <div className="member-list mt-3" style={{ minHeight: 360 }}>
    //       <div
    //         className="fw-500 size-12 flex w-100 pl-4 pb-2 pt-3 text-secondary-dark"
    //         style={{ borderBottom: "1px solid var(--text-secondary-dark)" }}
    //       >
    //         <span className="flex-1 text-center">Member</span>
    //         <span className="flex-1 text-center">Permission</span>
    //         <span className="flex-1 text-center">Actions</span>
    //       </div>
          // <div className="w-100 pl-4 pb-2 pt-3">
          //   {/* {_.orderBy(currentSide.members, (m) =>
          //     m.get("role").get("name")
          //   ).map((m) => {
          //     return <UserLine key={m.id} user={m} colony={currentSide} />;
          //   })} */}
          //   {_.orderBy(currentSide.profiles, (m) =>
          //     m['role']
          //   ).map((m) => {
          //     return <UserLine key={m.id} user={m} colony={currentSide} />;
          //   })}
          // </div>
    //     </div>
    //     <div className="my-3 mr-auto">
    //       <div className="fw-400 size-14">Conditions</div>
    //       <div className="fw-400 size-12">Required token to enter: 1</div>
    //     </div>
    // </>
  );
}
