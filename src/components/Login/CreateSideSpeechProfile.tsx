import React, { useState } from "react";
import Button from "../ui-components/Button";
import "./DefaultView.css";

export default function CreateSideSpeechProfile() {
  const [username, setUsername] = useState<string>("");

  const handleUsername = (event: any) => {
    setUsername(event.target.value);
  };

  const handleSaveProfile = () => {};

  return (
    <div>
      <input type={"text"} id="username" onChange={handleUsername} />
      <Button onClick={handleSaveProfile}>Save profile</Button>
      <div>Choose an image from your NFTS</div>
    </div>
  );
}
