import React, { forwardRef } from "react";
import styled from "styled-components";

interface DivProps {
}

const TabItems = styled.div<DivProps>`
  cursor: pointer;
  font-family : "Inter", sans-serif;
`;

export default TabItems;
