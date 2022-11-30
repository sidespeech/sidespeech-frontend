import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';

const CustomCheckboxStyled = styled.div`
    /* Customize the label (the container) */
    .checkbox-container {
        display: block;
        position: relative;
        padding-right: calc(20px + 1rem);
        height: 20px;
        cursor: pointer;
        font-size: 1rem;
        color: var(--text);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* Hide the browser's default checkbox */
    .checkbox-container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* Create a custom checkbox */
    .checkmark {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 20px;
        background-color: var(--input);
        border: 1px solid var(--inactive);
        border-radius: 5px;
    }

    /* On mouse-over, add a grey background color */
    .checkbox-container:hover input ~ .checkmark {
        background-color: transparent;
    }

    /* When the checkbox is checked, add a blue background */
    .checkbox-container input:checked ~ .checkmark {
        background-color: var(--primary);
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
        content: '';
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    .checkbox-container input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    .checkbox-container .checkmark:after {
        left: 7px;
        top: 3px;
        width: 5px;
        height: 10px;
        border: 1px solid var(--white);
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;

interface CustomCheckboxProps {
    className?: string;
    id?: string;
    isChecked?: boolean;
    label?: string;
    onClick?: MouseEventHandler | undefined;
    style?: object;
}

export default function CustomCheckbox({ className, id, isChecked, label, onClick, style }: CustomCheckboxProps) {
    return (
        <CustomCheckboxStyled className={className} id={id} style={style}>
            <label className="checkbox-container">
                {label}
                <input type="checkbox" defaultChecked={isChecked} onClick={onClick} />
                <span className="checkmark"></span>
            </label>
        </CustomCheckboxStyled>
    );
}
