import React from "react";
import image404 from "../../assets/404.png";
import { Link } from "react-router-dom";
const Page404 = () => {
    return (
        <div className="errorPage">
            <img src={image404} alt="" />
            <Link to="/">
                <p>Go to HomePage</p>
            </Link>
        </div>
    );
};

export default Page404;
