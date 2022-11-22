import React, { useState } from 'react';
import styled from 'styled-components';

interface ClampLinesStyledProps {};

const ClampLinesStyled = styled.div<ClampLinesStyledProps>`
    .clamp-lines_content {
        margin-right: 1rem;
    }
    .clamp-lines_button {
        background: transparent;
        border: none;
        outline: none;
        box-shadow: none;
        color: var(--primary);
    }
`;

interface ClampLinesProps {
    buttons?: boolean;
    children?: string | string[];
    className?: string;
    id?: string;
    length?: number;
    showLessText?: string;
    showMoreText?: string;
    style?: object;
};

const ClampLines = ({ buttons = true, children, className, id, length = 100, showLessText = 'Read less', showMoreText = 'Read more', style }: ClampLinesProps) => {
    const [isAllContentShown, setIsAllcontentShown] = useState<boolean>(false);

    children = Array.isArray(children) ? children.join(' ') : children;

    if (!children || children.trim().length === 0) return null;

  return (
    <ClampLinesStyled className={className} id={id} style={style}>
        <p className="clamp-lines_paragraph">
            <span className="clamp-lines_content">
                {isAllContentShown || children?.length <= length ? children : `${children?.substring(0, length)}...`}
            </span>

            {buttons && children?.length > length && <button 
                className="clamp-lines_button" 
                onClick={(ev) => {
                    ev.stopPropagation();
                    setIsAllcontentShown(bool => !bool)
                }}
            >
                {isAllContentShown ? showLessText : showMoreText}
            </button>}
        </p>
    </ClampLinesStyled>
  )
}

export default ClampLines