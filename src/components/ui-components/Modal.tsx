import React from "react";
import styled from "styled-components";
import "./Modal.css";

interface IModalContainerProps {
  height?: string;
}

const ModalContainer = styled.div<IModalContainerProps>`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  top: 0px;
  left: 0px;
  z-index: 500;
  margin: auto;
  width: 100%;
  align-items: center;
  height: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;
  & .modal-content {
    height: ${(props) => (props.height ? props.height : "fit-content")};
  }
`;

export default function Modal({
  header,
  body,
  footer,
  title,
  showModal,
  backicon = true,
  height,
}: {
  header?: any;
  body: any;
  footer: any;
  title: any;
  showModal: any;
  backicon?: boolean;
  height?: string;
}) {
  return (
    <ModalContainer height={height}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="flex justify-between w-100">
            {backicon && (
              <div
                className="size-17 fw-500 pointer"
                onClick={() => showModal(false)}
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>back
              </div>
            )}
            {header}
            <i
              onClick={() => showModal(false)}
              className="pointer fa-solid fa-xmark size-22"
            ></i>
          </div>
          <div>{title}</div>
        </div>

        <div
          className="f-column align-center modal-body"
          style={{ marginTop: 29 }}
        >
          {body}
        </div>
        <div className="modal-footer mt-auto">{footer}</div>
      </div>
    </ModalContainer>
  );
}
