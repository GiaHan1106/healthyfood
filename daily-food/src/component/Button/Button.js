import React from "react";

const Button = (props) => {
    return (
        <a href={props.link} className={`button-1 ${props.secondary ? "secondary" : ""}`}>
            {props.text}
        </a>
    );
};

export default Button;
