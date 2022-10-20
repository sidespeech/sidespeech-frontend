import React, { forwardRef } from "react";
import styled from "styled-components";

interface DivProps {
  cursor?: string;
}

const TabItems = styled.div<DivProps>`
  cursor: ${(props) => (props.cursor ? props.cursor : "")};
  font-family : "Inter", sans-serif;
`;

export default TabItems;
