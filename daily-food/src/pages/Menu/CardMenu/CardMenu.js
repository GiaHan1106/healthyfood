import React from "react";
import { Col, Row } from "react-bootstrap";

const CardMenu = (props) => {
    return (
        <div className={`cardMenu ${props.order ? "order" : ""}`}>
            <Row style={{ alignItems: "center" }}>
                <Col xs={6} md={4}>
                    <div className="cardMenu-imgMenu">
                        <img src={props.image} alt="" />
                    </div>
                </Col>
                <Col xs={6} md={8}>
                    <div className="cardMenu-textMenu">
                        <h3>{props.name}</h3>
                        <h5>
                            <i className="fa-regular fa-sun"></i>
                            {props.time}
                        </h5>
                        <p>{props.des}</p>
                        <ul>
                            <li>
                                Calories: <span>{props.calories}</span>
                            </li>
                            <li>
                                Carbohydrates: <span>{props.carbohydrates}</span>
                            </li>
                            <li>
                                Protein: <span>{props.protein}</span>
                            </li>
                            {/* <li>
                                Suitable for:
                                <span className="lastchild">
                                    {props.deseases &&
                                        JSON.parse(props.deseases).map((item, index) => (
                                            <React.Fragment key={index}>
                                                {index > 0 && " "}
                                                <span>#</span>
                                                {item}
                                            </React.Fragment>
                                        ))}
                                </span>
                            </li> */}
                        </ul>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default CardMenu;
