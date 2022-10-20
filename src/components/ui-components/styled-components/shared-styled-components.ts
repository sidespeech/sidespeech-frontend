import styled from "styled-components";

export const Dot = styled.div`
  width: 15px;
  height: 15px;
  color: white;
  background-color: var(--text-red);
  weight: 700;
  font-size: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 1px 2px 0px;
`;

interface IRoundedImageContainerProps {
  width: string;
  height: string;
  radius: number;
}
export const RoundedImageContainer = styled.div<IRoundedImageContainerProps>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  min-width: ${(props) => props.width};
  min-height: ${(props) => props.height};
  background-color: var(--bg-secondary-dark);
  border: 1px solid black;
  border-radius: ${(props) => props.radius}px;
  margin: 0px 12px;
  overflow: hidden;
  & img {
    object-fit: cover;
  }
`;
