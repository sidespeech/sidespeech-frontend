import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import TextArea from "../../../ui-components/TextArea";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./eligibility.css";
import { apiService } from "../../../../services/api.service";
import { addColony } from "../../../../redux/Slices/UserDataSlice";

export default function Eligibility({
  currentSide,
}: {
  currentSide: Colony;
}) {

  const dispatch = useDispatch();


  return (
    <>
    </>
  );
}
