import React from 'react';
import styled from 'styled-components';
import Button from '../../ui-components/Button';

interface SideCardJoinActionsStyledProps {

};

const SideCardJoinActionsStyled = styled.div<SideCardJoinActionsStyledProps>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    width: 100%;
    .side-actions_eligibility {
        width: 50%;
        & span {
            display: flex;
            align-items: center;
            gap: .5rem;
        }
    }
    .side-actions_joined {
        display: flex;
        align-items: center;
        gap: .5rem;
        color: var(--green);
    }
`;

interface SideCardJoinActionsProps {
    eligible?: boolean;
    joined?: boolean;
    priv?:boolean;
    onJoin?: () => void;
};

const SideCardJoinActions = ({ eligible, joined, priv, onJoin }: SideCardJoinActionsProps) => {
    return (
        <SideCardJoinActionsStyled>
            <div className="side-actions_eligibility">
                {eligible || joined ? (
                    <span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.95 11.4499L12.2375 6.16244L11.1875 5.11244L6.95 9.34994L4.8125 7.21244L3.7625 8.26244L6.95 11.4499ZM8 15.4999C6.9625 15.4999 5.9875 15.3029 5.075 14.9089C4.1625 14.5154 3.36875 13.9812 2.69375 13.3062C2.01875 12.6312 1.4845 11.8374 1.091 10.9249C0.697 10.0124 0.5 9.03744 0.5 7.99994C0.5 6.96244 0.697 5.98744 1.091 5.07494C1.4845 4.16244 2.01875 3.36869 2.69375 2.69369C3.36875 2.01869 4.1625 1.48419 5.075 1.09019C5.9875 0.696689 6.9625 0.499939 8 0.499939C9.0375 0.499939 10.0125 0.696689 10.925 1.09019C11.8375 1.48419 12.6313 2.01869 13.3063 2.69369C13.9813 3.36869 14.5155 4.16244 14.909 5.07494C15.303 5.98744 15.5 6.96244 15.5 7.99994C15.5 9.03744 15.303 10.0124 14.909 10.9249C14.5155 11.8374 13.9813 12.6312 13.3063 13.3062C12.6313 13.9812 11.8375 14.5154 10.925 14.9089C10.0125 15.3029 9.0375 15.4999 8 15.4999Z" fill="#36DA81"/>
                        </svg>
                        Eligible
                    </span>
                ) : (
                    <span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.1875 13.75L0.25 9.8125V4.1875L4.1875 0.25H9.8125L13.75 4.1875V9.8125L9.8125 13.75H4.1875ZM4.8625 10.1875L7 8.05L9.1375 10.1875L10.1875 9.1375L8.05 7L10.1875 4.8625L9.1375 3.8125L7 5.95L4.8625 3.8125L3.8125 4.8625L5.95 7L3.8125 9.1375L4.8625 10.1875Z" fill="#DC4964"/>
                        </svg>
                        Non-Eligible
                    </span>
                )}
            </div>
    
           {joined ? (
            <div className="side-actions_joined">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.16172 9.49995L0.886719 5.22495L1.95547 4.1562L5.16172 7.36245L12.043 0.481201L13.1117 1.54995L5.16172 9.49995Z" fill="#36DA81"/>
                </svg>
                Joined
            </div>
           ) :
            eligible ? (
                    <Button onClick={onJoin} width={125}>{ priv ? "Request" : "Join"}</Button>
                ) : (
                    <Button onClick={onJoin} width={125} background="var(--bg-secondary-light)">Conditions</Button>
            )}
        </SideCardJoinActionsStyled>
    );
}

export default SideCardJoinActions;