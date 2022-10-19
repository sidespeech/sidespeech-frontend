import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import UserLine from "../../../ui-components/UserLine";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./channels.css"
import { apiService } from "../../../services/api.service";


export default function Channels({
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
