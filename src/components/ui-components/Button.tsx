import React from "react";
import styled from "styled-components";

interface ButtonProps {
  width?: number;
  height?: number;
  disabled?: any;
  radius?: number;
  background?: string;
  color?: string;
  border?: string;
}

const CustomButton = styled.button<ButtonProps>`
  width: ${(props) => (props.width ? props.width : 251)}px;
  height: ${(props) => (props.height ? props.height : 48)}px;
  color: ${(props) => (props.background ? props.color : "white")};
  background: ${(props) =>
    props.background ? props.background : "var(--button-primary)"};
  border-radius: ${(props) => (props.radius ? props.radius : 10)}px;
  border: ${(props) => (props.border ? props.border : "none")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  pointer-events: ${(props) => (props.disabled ? "none" : "all")};
  filter: ${props => props.disabled && "grayscale(1)"};
  opacity: ${props => props.disabled && 0.2}
`;

export default function Button({
  children,
  onClick,
  width,
  height,
  classes,
  disabled,
  radius,
  background,
  color,
  border,
}: {
  children: any;
  onClick?: any;
  width?: number;
  height?: number;
  classes?: string;
  disabled?: any;
  radius?: number;
  background?: string;
  color?: string;
  border?: string;
}) {
  return (
    <CustomButton
      className={classes}
      width={width}
      border={border}
      height={height}
      onClick={onClick}
      disabled={disabled}
      radius={radius}
      background={background}
      color={color}
    >
      {children}
    </CustomButton>
  );
}
