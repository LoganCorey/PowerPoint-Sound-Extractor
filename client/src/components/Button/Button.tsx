import React from 'react';
import classes from './Button.module.css';

interface IButton {
    text: string;
}

const Button = (props: IButton) => {
    return (
        <button className={classes.button}><strong>{props.text}</strong></button>
    );
};

export default Button;