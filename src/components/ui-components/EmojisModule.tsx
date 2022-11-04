import React from 'react';
import emojisArray from "../../assets/emojisArray"

import './EmojisModule.css'

interface EmojisModulePropTypes {
    onAddEmoji: (emoji: string) => void;
}

const EmojisModule = (props: EmojisModulePropTypes) => {
  return (
    <div className="emojis-menu_wrapper">
        <ul className="emojis-menu">
            {emojisArray.map((emoji: string) => (
                <li onClick={() => props.onAddEmoji(emoji)}>{emoji}</li>
            ))}
        </ul>
    </div>
  )
}

export default EmojisModule