import React, { useState } from 'react';
import styled from 'styled-components';

interface ExpandButtonStyledProps {
    open?: boolean;
  }
  
  const ExpandButtonStyled = styled.button<ExpandButtonStyledProps>`
    background-color: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    & svg {
      transition: transform .3s ease;
      transform: ${props => props.open ? 'rotate(180deg)' : ''};
    }
  `;

interface ExpandButtonProps {
    onClick?: any;
    open?: boolean; 
  }
  
  const ExpandButton = ({ onClick, open }: ExpandButtonProps) => {
    return (
      <ExpandButtonStyled onClick={onClick} open={open}>
        <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4L0 0H6L3 4Z" fill="#B4C1D2"/>
        </svg>
      </ExpandButtonStyled>
    )
  }

interface AccordionStyledProps {
    open: boolean;
}

const AccordionStyled = styled.div<AccordionStyledProps>`
    width: 100%;
    .accordion-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
    .accordion-content {
        padding-top: .5rem;
        overflow: hidden;
        animation: ${props => props.open ? 'show .3s ease forwards' : 'hide .3s ease .1s forwards'};
        & > div {
            height: 100%;
            transition: transform .3s ease;
            transform-origin: top;
            transform: ${props => props.open ? '' : 'translateY(-150%)'};
        }
    }

    @keyframes hide {
        from {
            height: auto;
        }
        to {
            height: 0;
        }
    }
    
    @keyframes show {
        from {
            height: 0;
        }
        to {
            height: auto;
        }
    }
`;

interface AccordionProps {
    AccordionButton: any;
    children?: any;
    hideOpenIcon?: boolean;
    locked?: boolean;
    openInitialState?: boolean;
}

const Accordion = ({AccordionButton, children, hideOpenIcon, locked, openInitialState = true}: AccordionProps) => {
    const [isAccordionExpanded, setIsAccordionExpanded] = useState<boolean>(openInitialState);

  return (
    <AccordionStyled className="" open={isAccordionExpanded}>
        <div 
            className={`accordion-btn px-2 py-2 text-secondary-light ${locked ? '' : 'pointer'}`}
            onClick={locked ? () => {} : () => setIsAccordionExpanded(prevState => !prevState)}
        >
            <AccordionButton />

            {!hideOpenIcon && (
              <ExpandButton 
                onClick={(ev: any) => {
                  ev.stopPropagation();
                  if (locked) return;
                  setIsAccordionExpanded(prevState => !prevState)
                }} 
                open={isAccordionExpanded} 
              />
            )}
        </div>

        <div className="accordion-content">
            <div>
                {children}
            </div>
        </div>
    </AccordionStyled>
  )
}

export default Accordion;