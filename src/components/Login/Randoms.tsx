import React, { useState } from "react";

import { Form, Button } from "semantic-ui-react";

export default function Randoms() {
  return (
    <Form>
      <label>First Name</label>
      <input placeholder="First Name" type="text" />

      <label>Last Name</label>
      <input placeholder="Last Name" type="text" />

      <label>Email</label>
      <input placeholder="Email" type="email" />

      <label>Password</label>
      <input placeholder="Password" type="password" />

      <Button type="submit">Submit</Button>
    </Form>
  );
}
