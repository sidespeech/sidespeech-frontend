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
          <tr className="text-primary-light text-center">
            <th>Members ({currentSide.profiles.length})</th>
            <th>Permission</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {_.orderBy(currentSide.profiles, (m) =>
              m['role']
            ).map((m) => {
              return <TableRow key={m.id} user={m} side={currentSide} />;
            })} 
        </tbody>
      </table>
    </>
  );
}
