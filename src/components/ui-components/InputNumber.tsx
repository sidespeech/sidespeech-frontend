// @ts-nocheck
import React, { InputHTMLAttributes, useRef } from "react";
import styled from "styled-components";

const InputNumber = styled.input`
  height: 44px;
  width: 73px;
  border-radius: 7px;
  background-color: var(--disable);
`;

const style = {
  plusDiv: {
    background: "rgba(125, 166, 220, 0.1)",
    textAlign: "center",
},
lessDiv: {
    background: "rgba(125, 166, 220, 0.1)",
    textAlign: "center",
    paddingBottom: 1,
    marginTop: -1,
  },
  container: {
    width: "23px",
    height: "36px",
    borderRadius: "5px",
    overflow: "hidden",
    top: 4,
    right: 4,
  },
};

export default function CustomInputNumber({ onChange,defaultValue }: any) {
  const ref = useRef<HTMLInputElement>(null);

  const signClick = (value: number) => {
    if (ref.current) {
      const currentValue = ref.current.valueAsNumber;
      const res = currentValue + value;
      if (res < 0) return;
      ref.current.valueAsNumber = res;
      onChange(res);
    }
  };

  return (
    <div className="relative" style={{ width: "fit-content" }}>
      <InputNumber ref={ref} type={"number"} defaultValue={defaultValue} />
      <div className="f-column absolute" style={style.container}>
        <div style={style.plusDiv} onClick={() => signClick(1)}>
          +
        </div>
        <div style={style.lessDiv} onClick={() => signClick(-1)}>
          -
        </div>
      </div>
    </div>
  );
}
