import React, { forwardRef } from "react";
import styled from "styled-components";
import sendicon from "../../assets/send-icon.svg";

interface DivProps {
  minWidth?: number;
  height?: number;
  display?: string;
  flexDirection?: string;
  paddingTop?: number;
  color?: string;
  backgroundColor?:string;
}

const ContainerLeft = styled.div<DivProps>`
  min-width: ${(props) => (props.minWidth ? props.minWidth : "200")}px;
  height: ${(props) => (props.height ? props.height : "92")}vh;
  display: ${(props) => (props.display ? props.display : "flex")};
  flex-direction: ${(props) => (props.flexDirection ? props.flexDirection : "column")};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : "11")}px;
  color: ${(props) => (props.color ? props.color : "var(--text-primary-light)")};
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : "")};
`;

export default ContainerLeft;
