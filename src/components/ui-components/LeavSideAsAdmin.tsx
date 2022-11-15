import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import InputText from './InputText';

interface LeaveSideAsAdminStyledProps {};

const LeaveSideAsAdminStyled = styled.div<LeaveSideAsAdminStyledProps>`
    background-color: rgba(240, 158, 34, 0.1);
    border: 1px solid var(--warning);
    border-radius: 10px;
    padding: 1.5rem;
    .leave-title {
        color: var(--warning);
        margin: 0;
    }

    .leave-subtitle {
        margin-bottom: .5rem;
    }
    
    .leave-description_secondary {
        max-width: 340px;
        opacity: .4;
    }

    .leave-button {
        width: 35%;
        transition: background-color .3s ease;
        &:disabled {
            background-color: transparent;
            border: none;
            outline: none;
            box-shadow: none;
        }
    }
`;

interface LeaveSideAsAdminProps {
    className?: string;
    id?: string;
    style?: any;
};

const LeavSideAsAdmin = ({ className, id, style }: LeaveSideAsAdminProps) => {
    const [newSubAdmin, setNewSubAdmin] = useState<any>(null);

  return (
    <LeaveSideAsAdminStyled className={className} id={id} style={style}>
        <div className='flex align-center mb-4'>
            <svg className="mr-2" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.75 13.75C1.3375 13.75 0.98425 13.6033 0.69025 13.3097C0.39675 13.0157 0.25 12.6625 0.25 12.25V1.75C0.25 1.3375 0.39675 0.98425 0.69025 0.69025C0.98425 0.39675 1.3375 0.25 1.75 0.25H7V1.75H1.75V12.25H7V13.75H1.75ZM10 10.75L8.96875 9.6625L10.8812 7.75H4.75V6.25H10.8812L8.96875 4.3375L10 3.25L13.75 7L10 10.75Z" fill="#F09E22"/>
            </svg>
            <h3 className="leave-title">Leave the Side</h3>
        </div>

        <p>To leave a Side, you must define a sub-admin-user who will become the new administrator.</p>

        <h4 className="leave-subtitle">Define a sub-admin user</h4>

        <p className="leave-description_secondary">Search for a username or wallet address registered on SideSpeech</p>

        <div className="flex align-center justify-between gap-20 mt-4">
            <InputText 
                bgColor="rgba(0, 0, 0, 0.2)"
                className="leave-input"
                color="var(--white)"
                height={43}
                onChange={(ev: any) => setNewSubAdmin(ev.target.value)}
                placeholder="Type something"
                placeholderColor="var(--white)"
                radius="10px"
                value={newSubAdmin}
            />

            <Button 
                background='var(--red)' 
                classes="leave-button"
                disabled={!newSubAdmin}
            >Leave the Side</Button>
        </div>
    </LeaveSideAsAdminStyled>
  )
}

export default LeavSideAsAdmin