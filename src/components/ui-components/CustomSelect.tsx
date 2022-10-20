import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./CustomSelect.css";

interface ISelectContainer {
  width?: string;
  height?: string;
}

interface ISelectCustom {
  fontSize?: number;
  fontWeight?: number;
  radius?: string;
  bgColor?:string;
}

const SelectContainer = styled.div<ISelectContainer>`
  position: relative;
  width: ${(props) => (props.width ? props.width : "148px")};
  height: ${(props) => (props.height ? props.height : "31px")};
`;

const SelectCustom = styled.select<ISelectCustom>`
  font-size: ${(props) => (props.fontSize ? props.fontSize : 11)}px;
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "400")};
  border-radius: ${(props) => (props.radius ? props.radius : "20px")};
  background: ${(props) => (props.bgColor ? props.bgColor : "var(--bg-secondary-dark)")};
`;

/**
 *
 * @param options - options to display in the select dropdown
 * @param key - key of the options to display if options is an array of Objects
 * @description  display a Select component with custom options. Return Object key if Key is present else return options
 */

export default function CustomSelect({
  valueToSet,
  onChange,
  options,
  key,
  values,
  defaut,
  width,
  height,
  arrowPosition,
  fontWeight,
  fontSize,
  radius,
  bgColor,
}: {
  onChange: any;
  options: any[];
  key?: string;
  values?: any[];
  defaut?: any;
  width?: string;
  valueToSet?: any;
  height?: string;
  arrowPosition?: any;
  fontSize?:number;
  fontWeight?:number;
  radius?:string;
  bgColor?:string;
}) {
  const [selected, setSelected] = useState(false);
  const [defautState, setDefautState] = useState(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (defaut) {
      console.log(defaut);
      setValue(defaut);
    }
  }, [defaut]);

  useEffect(() => {
    setValue(valueToSet);
  }, [valueToSet]);

  return (
    <SelectContainer width={width} height={height}>
      <SelectCustom
      fontSize={fontSize}
      bgColor={bgColor}
      fontWeight={fontWeight}
      radius={radius}
        onChange={(event: any) => {
          setValue(event.target.value);
          onChange(event);
        }}
        onClick={(event: any) => {
          setSelected(!selected);
        }}
        className="select-custom"
        value={value}
      >
        {options.map((o, index) => {
          return (
            <option key={index} value={values ? values[index] : index}>
              {key ? o[key] : o}
            </option>
          );
        })}
      </SelectCustom>
      <div
        style={arrowPosition}
        className={`select-arrow ${selected ? "selected" : ""}`}
      >
        <i className="fa-solid fs-22 fa-angle-down"></i>
      </div>
    </SelectContainer>
  );
}
