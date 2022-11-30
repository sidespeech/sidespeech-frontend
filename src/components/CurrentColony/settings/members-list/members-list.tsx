// import React, { useEffect } from "react";
import styled from 'styled-components';
import TableRow from '../../../ui-components/TableRow';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { Side } from '../../../../models/Side';

const MembersListStyled = styled.div`
    .comments-container {
        max-height: 0px;
        transition: max-height 0.3s;
        margin-left: 47px;
        overflow: hidden;
        gap: 10px;
        display: flex;
        flex-direction: column;
    }
    .comments-container.extend {
        max-height: 400px;
        border-top: 1px solid var(--disable);
        overflow: auto;
    }

    .member-list {
        background-color: var(--background);
        width: 60%;
        min-height: 96px;
        border-radius: 10px;
    }
`;

export default function MembersList({ currentSide }: { currentSide: Side }) {
    const dispatch = useDispatch();

    const handleInvitePeople = () => {};

    return (
        <MembersListStyled>
            <table className="member-list">
                <thead>
                    <tr className="text-primary-light text-center">
                        <th>Members ({currentSide.profiles.length})</th>
                        <th>Permission</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {_.orderBy(currentSide.profiles, (m) => m['role']).map((m) => {
                        return <TableRow key={m.id} user={m} side={currentSide} />;
                    })}
                </tbody>
            </table>
        </MembersListStyled>
    );
}
