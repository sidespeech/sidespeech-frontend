import React from "react";
import styled from "styled-components";

interface ButtonProps {
  width?: number;
  height?: number;
  disabled?: any;
  radius?: number;
  background?: string;
  color?: string;
}

const CustomButton = styled.div<ButtonProps>`
  width: ${(props) => (props.width ? props.width : 251)}px;
  height: ${(props) => (props.height ? props.height : 48)}px;
  color: ${(props) => (props.background ? props.color : "white")};
  background: ${(props) =>
    props.background ? props.background : "var(--button-primary)"};
  border-radius: ${(props) => (props.radius ? props.radius : 100)}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400px;
  pointer-events: all;
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
}: {
  children: any;
  onClick: any;
  width?: number;
  height?: number;
  classes?: string;
  disabled?: any;
  radius?: number;
  background?: string;
  color?: string;
}) {
  return (
    <CustomButton
      className={classes}
      width={width}
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
