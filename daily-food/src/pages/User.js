import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import SideBar from "~/component/User/SideBar";
import { useUser } from "~/context/UserContext";
import { useNavigate } from "react-router-dom";
import Header from "~/component/Header/Header";

const User = ({ children }) => {
    const { user, handleLogOut } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && typeof user.permissions !== "undefined") {
            if (user.permissions === 0) {
                navigate("/user/dashboard");
            } else {
                navigate("/");
            }
        } else {
            navigate("/login");
        }
    }, [user]);

    return (
        <div>
            <Header></Header>
            <div className="c-bodyUser">
                <Row>
                    <Col md={3}>
                        <SideBar></SideBar>
                    </Col>
                    <Col md={9}>
                        <div className="c-rightUser">
                            <div className="c-nameUser">
                                <div className="c-nameUser_left">
                                    <h3>Hello ! {user.username}</h3>
                                    <p>
                                        Healthy Food is very good for your health<i className="fa-solid fa-hand-holding-heart"></i>
                                    </p>
                                </div>
                                <div className="c-nameUser_right">
                                    <i className="fa-regular fa-circle-user"></i>
                                    <button onClick={handleLogOut} className="button2">
                                        Log Out
                                    </button>
                                </div>
                            </div>
                            <div>{children}</div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default User;
