import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { getRandomId } from '../../../helpers/utilities';
import { Role } from '../../../models/Profile';
import { Side } from '../../../models/Side';
import { removeSide } from '../../../redux/Slices/UserDataSlice';
import LeaveSideConfirmationModal from '../../Modals/LeaveSideConfirmationModal';
import Button from '../../ui-components/Button';
import LeavSideAsAdmin from '../../ui-components/LeavSideAsAdmin';
import Modal from '../../ui-components/Modal';
import { Dot } from '../../ui-components/styled-components/shared-styled-components';

interface SideCardUserActionsStyledProps {}

const SideCardUserActionsStyled = styled.div<SideCardUserActionsStyledProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    .action-btn {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: transparent;
        box-shadow: none;
        border: none;
        outline: none;
        width: 70px;
        .action-btn_icon {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            height: 2.5rem;
            width: 2.5rem;
            border-radius: 2.5rem;
            overflow: hidden;
            background-color: var(--disable);
            margin-bottom: 0.5rem;
        }
        .action-btn_dot {
            position: absolute;
            top: 0;
            right: 0.5rem;
        }
    }
`;

interface SideCardUserActionsProps {
    alertsCount: number;
    messagesCount: number;
    onNavigate?: () => void;
    side: Side;
    userProfiles: any[];
}

const SideCardUserActions = ({
    alertsCount,
    messagesCount,
    onNavigate,
    side,
    userProfiles
}: SideCardUserActionsProps) => {
    const [isLeaveConfirmationModalOpen, setIsLeaveConfirmationModalOpen] = useState<boolean>(false);

    const sideProfile = userProfiles.find((profile) => profile.side.id === side.id);

    const isSideAdmin = sideProfile?.role === Role.Admin || sideProfile?.role === Role.subadmin;

    return (
        <>
            <SideCardUserActionsStyled>
                <button className="action-btn" onClick={onNavigate}>
                    <div className="action-btn_icon">
                        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2.33317 13.6667C1.87484 13.6667 1.48262 13.5037 1.1565 13.1775C0.829837 12.8509 0.666504 12.4584 0.666504 12V2.00004C0.666504 1.54171 0.829837 1.14948 1.1565 0.823374C1.48262 0.496707 1.87484 0.333374 2.33317 0.333374H15.6665C16.1248 0.333374 16.5173 0.496707 16.844 0.823374C17.1701 1.14948 17.3332 1.54171 17.3332 2.00004V12C17.3332 12.4584 17.1701 12.8509 16.844 13.1775C16.5173 13.5037 16.1248 13.6667 15.6665 13.6667H2.33317ZM8.99984 7.83337L15.6665 3.66671V2.00004L8.99984 6.16671L2.33317 2.00004V3.66671L8.99984 7.83337Z"
                                fill="#B4C1D2"
                                fillOpacity="0.4"
                            />
                        </svg>
                    </div>
                    Messages
                    {messagesCount > 0 && (
                        <div className="action-btn_dot">
                            <Dot>{messagesCount}</Dot>
                        </div>
                    )}
                </button>
                <button className="action-btn" onClick={onNavigate}>
                    <div className="action-btn_icon">
                        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.333496 14.8333V13.1666H2.00016V7.33329C2.00016 6.18051 2.34738 5.15607 3.04183 4.25996C3.73627 3.3644 4.63905 2.77774 5.75016 2.49996V1.91663C5.75016 1.5694 5.87183 1.2744 6.11516 1.03163C6.35794 0.788293 6.65294 0.666626 7.00016 0.666626C7.34738 0.666626 7.64239 0.788293 7.88516 1.03163C8.1285 1.2744 8.25016 1.5694 8.25016 1.91663V2.49996C9.36127 2.77774 10.2641 3.3644 10.9585 4.25996C11.6529 5.15607 12.0002 6.18051 12.0002 7.33329V13.1666H13.6668V14.8333H0.333496ZM7.00016 17.3333C6.54183 17.3333 6.14961 17.1702 5.8235 16.8441C5.49683 16.5175 5.3335 16.125 5.3335 15.6666H8.66683C8.66683 16.125 8.50377 16.5175 8.17766 16.8441C7.851 17.1702 7.4585 17.3333 7.00016 17.3333Z"
                                fill="#B4C1D2"
                                fillOpacity="0.4"
                            />
                        </svg>
                    </div>
                    Alerts
                    {alertsCount > 0 && (
                        <div className="action-btn_dot">
                            <Dot>{alertsCount}</Dot>
                        </div>
                    )}
                </button>
                <button className="action-btn" onClick={() => setIsLeaveConfirmationModalOpen(true)}>
                    <div className="action-btn_icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2.16667 15.5C1.70833 15.5 1.31583 15.3369 0.989167 15.0108C0.663055 14.6842 0.5 14.2917 0.5 13.8333V2.16667C0.5 1.70833 0.663055 1.31583 0.989167 0.989167C1.31583 0.663055 1.70833 0.5 2.16667 0.5H8V2.16667H2.16667V13.8333H8V15.5H2.16667ZM11.3333 12.1667L10.1875 10.9583L12.3125 8.83333H5.5V7.16667H12.3125L10.1875 5.04167L11.3333 3.83333L15.5 8L11.3333 12.1667Z"
                                fill="#DC4964"
                            />
                        </svg>
                    </div>
                    Leave
                </button>
            </SideCardUserActionsStyled>

            {isLeaveConfirmationModalOpen && (
                <LeaveSideConfirmationModal
                    side={side}
                    isSideAdmin={isSideAdmin}
                    setIsLeaveConfirmationModalOpen={setIsLeaveConfirmationModalOpen}
                />
            )}
        </>
    );
};

export default SideCardUserActions;
