import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../redux/store/app.store";
import { useNavigate } from "react-router";
import "./DefaultView.css";


export default function DefaultView() {

  const navigate = useNavigate();


  return (
    <>
      Forms will render here...
    </>
  );
}
