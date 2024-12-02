import React from "react";

const CartFood = (props) => {
    return (
        <div className="cartfood">
            <div className="cartfood-image">
                <img src={props.image} alt="" />
            </div>
            <div className="cartfood-price">
                <h2>{props.title}</h2>
                <h3>{props.price}</h3>
            </div>
        </div>
    );
};

export default CartFood;