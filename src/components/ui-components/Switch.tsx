import React, { useEffect, useState } from "react";
import "./Switch.css";

export default function Switch(props: any) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(props.value);
  }, [props.value]);

  const handleOnClick = (event: any) => {
    setIsChecked(!isChecked);
    props.onClick(!isChecked);
  };

  return (
    <label className="switch">
      <input type="checkbox" checked={isChecked} readOnly onClick={handleOnClick} />
      <span className="slider round"></span>
      <span className="left-text">{props.left || ""}</span>
      <span className="right-text">{props.right || ""}</span>
    </label>
  );
}
