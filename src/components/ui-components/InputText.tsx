import React, { forwardRef } from "react";
import styled from "styled-components";
import sendicon from "../../assets/send-icon.svg";

interface InputTextPropsType {
  maxWidth?: number;
  disabled?: any;
  id?: any;
  maxLength?: number;
  iconSize?: number;
  width?: number | string;
  parentWidth?: number | string;
  height?: number;
  bgColor?: string;
  placeholderColor?: string;
  placeholder?: string;
  border?: string;
  padding?: string;
  radius?: string;
  color?: string;
  size?: number;
  weight?: number;
  placeholderWeight?: number;
  placeholderSize?: number;
  onChange?: any;
  iconRightPos?: { top: number; right: number };
  glass?: boolean;
  message?: boolean;
  onClick?: any;
  onKeyUp?: any;
  defaultValue?: string;
}

interface InputProps {
  id?: any;
  maxWidth?: number;
  disabled?: any;
  maxLength?: number;
  width?: number | string;
  parentWidth?: number | string;
  height?: number | string;
  bgColor?: string;
  border?: string;
  padding?: string;
  radius?: string;
  color?: string;
  size?: number;
  weight?: number;
  placeholderColor?: string;
  placeholderWeight?: number;
  placeholderSize?: number;
  onChange: any;
  type: string;
}

const Input = styled.input<InputProps>`
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "")}px;
  width: ${(props) => (props.width ? props.width : "100%")};
  border: ${(props) => (props.border ? props.border : "")};
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : "var(--bg-secondary-dark)"};
  border-radius: ${(props) => (props.radius ? props.radius : "40px")};
  height: ${(props) => (props.height ? props.height : 35)}px;
  color: ${(props) =>
    props.color ? props.color : "var(--text-secondary-dark)"};
  padding: ${(props) => (props.padding ? props.padding : "0px 20px")};
  font-size: ${(props) => (props.size ? props.size : "15")}px;
  font-weight: ${(props) => (props.weight ? props.weight : "400")};
  &::placeholder {
    color: ${(props) =>
      props.placeholderColor
        ? props.placeholderColor
        : "var(--bg-secondary-light)"};
    font-size: ${(props) =>
      props.placeholderSize ? props.placeholderSize : "15"}px;
    font-weight: ${(props) =>
      props.placeholderWeight ? props.placeholderWeight : "400"};
  }
`;

const InputText = forwardRef((props: InputTextPropsType, ref: any) => {
  return (
    <div
      className="relative input-container"
      style={{ width: props.parentWidth ? props.parentWidth : "100%" }}
    >
      <Input
        id={props.id}
        ref={ref}
        width={props.width}
        maxLength={props.maxLength}
        height={props.height}
        radius={props.radius}
        disabled={props.disabled}
        size={props.size}
        weight={props.weight}
        color={props.color}
        placeholderWeight={props.placeholderWeight}
        placeholderSize={props.placeholderSize}
        placeholderColor={props.placeholderColor}
        border={props.border}
        bgColor={props.bgColor}
        placeholder={props.placeholder}
        type={"text"}
        onChange={props.onChange}
        onKeyUp={props.onKeyUp}
        defaultValue={props.defaultValue}
      />
      {props.glass && (
        <span
          className="absolute"
          style={{ ...props.iconRightPos, color: props.color }}
        >
          <i
            className="fa-solid fa-magnifying-glass"
            style={{ fontSize: props.iconSize }}
          ></i>
        </span>
      )}
      {props.message && (
        <span
          className="absolute pointer"
          onClick={props.onClick}
          style={props.iconRightPos}
        >
          <img src={sendicon} alt="send-icon" />
        </span>
      )}
    </div>
  );
});
export default InputText;
