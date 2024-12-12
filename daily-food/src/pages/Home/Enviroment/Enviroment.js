import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import HeadLine from "~/component/HeadLine/HeadLine";
import icon1 from "~/assets/enviroment/icon1.png";
import icon2 from "~/assets/enviroment/icon2.png";
import icon3 from "~/assets/enviroment/icon3.png";

const Enviroment = () => {
    return (
        <div className="enviroment">
            <Container>
                <HeadLine headline={"Enviroment Friendly"}></HeadLine>
                <Row>
                    <Col md={4}>
                        <div className="enviroment-content">
                            <img src={icon1} alt="" />
                            <p>The only supplier in the market using bio-degradable bags</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="enviroment-content">
                            <img src={icon2} alt="" />
                            <p>Clean & return the black containers to get a refund of 5,000 VND per 10 clean boxes</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="enviroment-content">
                            <img src={icon3} alt="" />
                            <p>We provide only one set of cutlery per day to minimize the environmental footprint</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Enviroment;
