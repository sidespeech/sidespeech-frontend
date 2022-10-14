import React from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function Channels({
  currentSide,
}: {
  currentSide: Colony;
}) {

  const dispatch = useDispatch();


  return (
    <>
      <div className="row">
      </div>
    </>
  );
}
