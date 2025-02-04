import React from "react";
import { Col, Row } from "react-bootstrap";
import Button from "~/component/Button/Button";

const MenuDetail = (props) => {
    console.log(props);
    return (
        <div className="menudetail">
            <Row>
                <Col lg={6}>
                    <div className="menudetail-image">
                        <img src={props.image} alt="" />
                    </div>
                </Col>
                <Col lg={6}>
                    <div className="menudetail-detail">
                        <h3>{props.title}</h3>
                        <h5>{props.calo} kcal</h5>
                        <p>
                            <i className="fa-solid fa-caret-right"></i>
                            {props.des}
                        </p>
                        <div className="menudetail_button">
                            <Button link={`/menu/${props.id}`} text={"VIEW MENU"}></Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default MenuDetail;
