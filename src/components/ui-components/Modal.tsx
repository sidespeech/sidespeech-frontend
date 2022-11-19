import React from "react";
import styled from "styled-components";

interface IModalContainerProps {
  height?: string;
  width?: string;
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
  .modal-footer {
    display: flex;
    justify-content: center;
  }
  .modal-content {
    width: ${(props) => (props.width ? props.width : "639px")};
    max-width: ${(props) => (props.width ? props.width : "639px")};
    padding: 16px 17px 24px 27px;
    background: var(--bg-primary);
    border-radius: 10px;
    color: var(--text);
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    text-align: center;
    font-weight: 700;
    font-size: 30px;
  }
  .modal-body {
    max-height: 75vh;
    overflow: auto;
    margin-top: 1rem;
  }
`;

export default function Modal({
  header,
  body,
  footer,
  title,
  showModal,
  backicon = false,
  height,
  width,
}: {
  header?: any;
  body: any;
  footer: any;
  title: any;
  showModal: any;
  backicon?: boolean;
  height?: string;
  width?: string;
}) {
  return (
    <ModalContainer
      height={height}
      width={width}
      onClick={() => showModal(false)}
    >
      <div className="modal-content" onClick={(ev) => ev.stopPropagation()}>
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
            <div onClick={() => showModal(false)}>
              <i className="pointer fa-solid fa-xmark size-22"></i>
            </div>
          </div>
          <div>{title}</div>
        </div>

        <div className="f-column align-center modal-body">{body}</div>
        <div className="modal-footer mt-auto">{footer}</div>
      </div>
    </ModalContainer>
  );
}
