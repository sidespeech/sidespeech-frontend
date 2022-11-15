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
  iconColor?: string;
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
  value?: string;
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
  value?: string;
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
        value={props.value}
        weight={props.weight}
        width={props.width}
      />
      {props.glass && (
        <span
          className="absolute"
          style={{ ...props.iconRightPos, color: props.color }}
        >
          <svg style={{ transform: `scale(${props.iconSize || 1})` }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path style={{fill: props.iconColor || '#B4C1D2'}} d="M14.7656 14.6738L10.8398 10.748C11.6992 9.67383 12.1387 8.41406 12.1582 6.96875C12.1191 5.25 11.5234 3.81445 10.3711 2.66211C9.21875 1.50977 7.7832 0.914062 6.06445 0.875C4.3457 0.914062 2.91016 1.50977 1.75781 2.66211C0.625 3.81445 0.0390625 5.25 0 6.96875C0.0390625 8.6875 0.634766 10.123 1.78711 11.2754C2.91992 12.4277 4.3457 13.0234 6.06445 13.0625C7.5293 13.043 8.78906 12.6035 9.84375 11.7441L13.7695 15.6699C13.9453 15.8066 14.1211 15.875 14.2969 15.875C14.4922 15.875 14.6582 15.8066 14.7949 15.6699C15.0684 15.3379 15.0586 15.0059 14.7656 14.6738ZM1.40625 6.96875C1.44531 5.64062 1.9043 4.53711 2.7832 3.6582C3.66211 2.7793 4.76562 2.32031 6.09375 2.28125C7.42188 2.32031 8.52539 2.7793 9.4043 3.6582C10.2832 4.53711 10.7422 5.64062 10.7812 6.96875C10.7422 8.29688 10.2832 9.40039 9.4043 10.2793C8.52539 11.1582 7.42188 11.6172 6.09375 11.6562C4.76562 11.6172 3.66211 11.1582 2.7832 10.2793C1.9043 9.40039 1.44531 8.29688 1.40625 6.96875Z" />
          </svg>
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
