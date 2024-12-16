import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import HeadLine from "~/component/HeadLine/HeadLine";
import AOS from "aos";
import "aos/dist/aos.css";
const ChooseUs = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000, // Thời gian hiệu ứng (ms)
        });
    }, []);
    return (
        <div className="work">
            <Container>
                <HeadLine headline={"Why Choosing Us"}></HeadLine>
                <Row>
                    <Col md={3}>
                        <div data-aos="fade-down-right" data-aos-delay="200">
                            <h3>
                                <span>0</span>1
                            </h3>
                            <div className="work-ideal">
                                <h4>Only fresh products</h4>
                                <p>When preparing dishes, we use only natural and fresh products</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div data-aos="fade-down-right">
                            <h3>
                                <span>0</span>2
                            </h3>
                            <div className="work-ideal">
                                <h4>Variety of dishes</h4>
                                <p>Thanks to a large selection of dishes, everyone will find something to their liking</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div data-aos="fade-down-left">
                            <h3>
                                <span>0</span>3
                            </h3>
                            <div className="work-ideal">
                                <h4>Convenient packaging</h4>
                                <p>We package meals in such a way that they are convenient to eat anywhere and anytime</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div data-aos="fade-down-left" data-aos-delay="200">
                            <h3>
                                <span>0</span>4
                            </h3>
                            <div className="work-ideal">
                                <h4>Without frying</h4>
                                <p>Instead of traditional frying, we prefer to cook our dishes in the oven or steam</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ChooseUs;
