import React from "react";
import './CustomCheckbox.css';


export default function CustomCheckbox(props:any) {
  return (
    <>
      <label className="container">
        {props.label}
        <input type="checkbox" checked={props.isChecked} onClick={props.onClick} />
        <span className="checkmark"></span>
      </label>
    </>
  );
}
