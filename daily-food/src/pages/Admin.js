import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import SideBar from "~/component/Admin/SideBar";
import { useUser } from "~/context/UserContext";
import { useNavigate } from "react-router-dom";

const Admin = ({ children }) => {
    const { user, handleLogOut } = useUser();
    const navigate = useNavigate();
    console.log(user);
    useEffect(() => {
        if (!user.permissions) {
            navigate("/login");
        } else if (user.permissions !== 1) {
            navigate("/");
        }
    }, [user]);
    return (
        <div className="c-bodyAdmin">
            <Row>
                <Col md={3}>
                    <SideBar></SideBar>
                </Col>
                <Col md={9}>
                    <div className="c-rightAdmin">
                        <div className="c-nameAd">
                            <div className="c-nameAd_left">
                                <h3>Hello ! {user.username}</h3>
                                <p>
                                    Healthy Food is very good for your health<i className="fa-solid fa-hand-holding-heart"></i>
                                </p>
                            </div>
                            <div className="c-nameAd_right">
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
    );
};

export default Admin;
