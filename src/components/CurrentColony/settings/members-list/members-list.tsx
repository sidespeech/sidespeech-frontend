import React, { useEffect } from "react";
import TableRow from "../../../ui-components/TableRow";
import _ from "lodash";
import { useDispatch } from "react-redux";
import "./members-list.css"
import { Side } from "../../../../models/Side";

export default function MembersList({
  currentSide,
}: {
  currentSide: Side;
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
