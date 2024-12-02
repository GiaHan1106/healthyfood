import React from "react";
import { Col, Row } from "react-bootstrap";

const Revenue = () => {
    return (
        <div className="c-revenue">
            <Row>
                <Col md={3}>
                    <div className="c-revenue_card">
                        <h2>480</h2>
                        <h5>Totals Order</h5>
                        <div className="icon">
                            <i className="fa-solid fa-fire"></i>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="c-revenue_card">
                        <h2>480</h2>
                        <h5>Total Revenue</h5>
                        <div className="icon">
                            <i className="fa-solid fa-chart-simple"></i>{" "}
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="c-revenue_card">
                        <h2>480</h2>
                        <h5>Total Order in day</h5>
                        <div className="icon">
                            <i className="fa-regular fa-calendar-days"></i>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="c-revenue_card">
                        <h2>480</h2>
                        <h5>Total revenue in day</h5>
                        <div className="icon">
                            <i className="fa-solid fa-carrot"></i>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Revenue;
