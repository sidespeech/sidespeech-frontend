// @ts-nocheck
import React, { InputHTMLAttributes, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

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

export default function CustomInputNumber({ onChange,defaultValue, collections, currentDiv }: any) {
  const ref = useRef<HTMLInputElement>(null);

  const signClick = (value: number) => {

    // Checking if there is collection selected
    if (!currentDiv || (ref.current && currentDiv['collection'].length)) {
      const currentCollection = collections.find(elem => elem['address'] === currentDiv['collection'])
      const currentValue = ref.current.valueAsNumber;

      // Checking if the user hold more than number selected
      if (currentCollection['numDistinctTokensOwned'] > currentValue || value < 0) {
        const res = currentValue + value;
        if (res <= 0) {
          toast.error("You need to choose minimum 1 quantity", { toastId: 8 });
          return;
        }
        ref.current.valueAsNumber = res;
        onChange(res);
      } else toast.error(`You are holder of ${currentValue} NFT ${currentValue > 1 ? "s" : ""} from this collection`, { toastId: 8 });
    } else toast.error("You need to choose collection first", { toastId: 9 });
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
