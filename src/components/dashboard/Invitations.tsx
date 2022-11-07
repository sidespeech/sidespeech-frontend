import React from 'react';
import styled from 'styled-components';

interface InvitationsStyledProps {}

const InvitationsStyled = styled.main<InvitationsStyledProps>`
  .title {
    margin-top: 0;
  }
`;

interface InvitationsProps {}

const Invitations = ({}: InvitationsProps) => {
  return (
    <InvitationsStyled>
       <h2 className="title">Invitations</h2>
    </InvitationsStyled>
  )
}

export default Invitations