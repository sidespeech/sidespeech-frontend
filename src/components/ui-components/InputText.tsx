import React, { forwardRef } from "react";
import styled from "styled-components";
import sendicon from "../../assets/send-icon.svg";

interface InputTextPropsType {
  bgColor?: string;
  border?: string;
  className?: string;
  color?: string;
  defaultValue?: string;
  disabled?: any;
  focus?: boolean;
  glass?: boolean;
  height?: number;
  iconRightPos?: { top: number; right: number };
  iconSize?: number;
  id?: any;
  maxLength?: number;
  maxWidth?: number;
  message?: boolean;
  onChange?: any;
  onClick?: any;
  onKeyUp?: any;
  onBlur?: any;
  padding?: string;
  parentWidth?: number | string;
  placeholder?: string;
  placeholderColor?: string;
  placeholderSize?: number;
  placeholderWeight?: number;
  radius?: string;
  size?: number;
  weight?: number;
  width?: number | string;
}

interface InputProps {
  bgColor?: string;
  border?: string;
  color?: string;
  disabled?: any;
  height?: number | string;
  id?: any;
  maxLength?: number;
  maxWidth?: number;
  onChange: any;
  padding?: string;
  parentWidth?: number | string;
  placeholderColor?: string;
  placeholderSize?: number;
  placeholderWeight?: number;
  radius?: string;
  size?: number;
  type: string;
  weight?: number;
  width?: number | string;
}

const Input = styled.input<InputProps>`
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "")}px;
  width: ${(props) => (props.width ? props.width : "100%")};
  border: ${(props) => (props.border ? props.border : "")};
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : "var(--bg-secondary-light)"};
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
        : "#B4C1D266"};
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
        autoFocus={props.focus}
        bgColor={props.bgColor}
        border={props.border}
        className={props.className}
        color={props.color}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        height={props.height}
        id={props.id}
        maxLength={props.maxLength}
        onBlur={props.onBlur}
        onChange={props.onChange}
        onKeyUp={props.onKeyUp}
        placeholder={props.placeholder}
        placeholderColor={props.placeholderColor}
        placeholderSize={props.placeholderSize}
        placeholderWeight={props.placeholderWeight}
        radius={props.radius}
        ref={ref}
        size={props.size}
        type={"text"}
        weight={props.weight}
        width={props.width}
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
