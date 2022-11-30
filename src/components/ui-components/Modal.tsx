import React from 'react';
import styled from 'styled-components';
import { breakpoints, size } from '../../helpers/breakpoints';

interface IModalContainerProps {
    height?: string;
    width?: string;
    overflow?: string;
}

const ModalContainer = styled.div<IModalContainerProps>`
    position: fixed;
    background-color: rgba(0, 0, 0, 0.4);
    top: 0px;
    left: 0px;
    z-index: 9903;
    margin: auto;
    width: 100%;
    align-items: center;
    height: 100%;
    justify-content: center;
    display: flex;
    flex-direction: column;
    .modal-footer {
        display: flex;
        justify-content: center;
    }
    .spinner-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    .modal-content {
        height: 100%;
        width: 100%;
        max-width: 100%;
        padding: 16px 17px 24px 27px;
        background: var(--background);
        border-radius: 10px;
        color: var(--text);
        display: flex;
        flex-direction: column;
        ${(props) =>
            breakpoints(
                size.md,
                `{
      width: ${props.width ? props.width : '639px'};
      max-width: ${props.width ? props.width : '639px'};
      height: ${props.height ? props.height : 'fit-content'};
    }`
            )}
    }

    .modal-header {
        text-align: center;
        font-weight: 700;
        font-size: 30px;
        & > div {
            display: grid;
            grid-template-columns: 1fr 8fr 1fr;
            .close-icon {
                grid-column: 3/4;
                background-color: var(--disable);
                border-radius: 5px;
                border: none;
                outline: none;
                box-shadow: none;
                padding: 0.5rem 0.5rem 0.3rem 0.5rem;
            }
        }
    }
    .modal-body {
        max-height: 75vh;
        overflow: ${(props) => (props.overflow ? props.overflow : 'auto')};
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
    overflow
}: {
    header?: any;
    body: any;
    footer: any;
    title: any;
    showModal: any;
    backicon?: boolean;
    height?: string;
    width?: string;
    overflow?: string;
}) {
    return (
        <ModalContainer overflow={overflow} height={height} width={width} onClick={() => showModal(false)}>
            <div className="modal-content" onClick={(ev) => ev.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        {backicon && (
                            <div className="size-17 fw-500 pointer" onClick={() => showModal(false)}>
                                <i className="fa-solid fa-arrow-left mr-2"></i>back
                            </div>
                        )}
                        {header}
                        <button className="close-icon" onClick={() => showModal(false)}>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M1.39961 13.6496L0.349609 12.5996L5.94961 6.99961L0.349609 1.39961L1.39961 0.349609L6.99961 5.94961L12.5996 0.349609L13.6496 1.39961L8.04961 6.99961L13.6496 12.5996L12.5996 13.6496L6.99961 8.04961L1.39961 13.6496Z"
                                    fill="#B4C1D2"
                                    fillOpacity="0.4"
                                />
                            </svg>
                        </button>
                    </div>
                    <div>{title}</div>
                </div>

                <div className="f-column align-center modal-body">{body}</div>
                <div className="modal-footer mt-auto">{footer}</div>
            </div>
        </ModalContainer>
    );
}
