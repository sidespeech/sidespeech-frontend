import React, { useState } from "react";
import Button from "../ui-components/Button";

export default function CreateColonyProfile() {
  const [username, setUsername] = useState<string>("");

  const handleUsername = (event: any) => {
    setUsername(event.target.value);
  };

  const handleSaveProfile = () => {

  }

  return (
    <div>
      <input type={"text"} onChange={handleUsername} />
      <Button onClick={handleSaveProfile}>Save profile</Button>
      <div>Choose an image from your NFTS</div>
      
    </div>
  );
}
