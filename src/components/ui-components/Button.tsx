import React from "react";
import styled from "styled-components";

interface ButtonProps {
  width?: number;
  height?: number;
  disabled?: any;
}

const CustomButton = styled.div<ButtonProps>`
  width: ${(props) => (props.width ? props.width : 251)}px;
  height: ${(props) => (props.height ? props.height : 48)}px;
  color: white;
  background: var(--button-primary);
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default function Button({
  children,
  onClick,
  width,
  height,
  classes,
  disabled,
}: {
  children: any;
  onClick: any;
  width?: number;
  height?: number;
  classes?: string;
  disabled?: any;
}) {
  return (
    <CustomButton
      className={classes}
      width={width}
      height={height}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </CustomButton>
  );
}
