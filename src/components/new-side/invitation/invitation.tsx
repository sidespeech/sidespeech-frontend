import React, { useEffect, useState } from "react";
import { Channel } from "../../../models/Channel";
import { Colony } from "../../../models/Colony";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./invitation.css";
import { apiService } from "../../../services/api.service";

export default function Invitation({
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