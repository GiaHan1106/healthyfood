import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import HeadLine from "~/component/HeadLine/HeadLine";
import AOS from "aos";
import "aos/dist/aos.css";
const Work = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000, // Thời gian hiệu ứng (ms)
        });
    }, []);
    return (
        <div className="work">
            <Container>
                <HeadLine headline={"How it Work"}></HeadLine>
                <Row>
                    <Col md={3}>
                        <div data-aos="fade-down-right" data-aos-delay="200">
                            <h3>
                                <span>0</span>1
                            </h3>
                            <div className="work-ideal">
                                <h4>Pick Your Plan</h4>
                                <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore, modi. Recusandae, autem fuga! Perspiciatis, accusantium mollitia deleniti facilis velit sed ex
                                    nulla eum hic. Minus cupiditate fugit reprehenderit cum numquam!
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div data-aos="fade-down-right">
                            <h3>
                                <span>0</span>2
                            </h3>
                            <div className="work-ideal">
                                <h4>Order</h4>
                                <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore, modi. Recusandae, autem fuga! Perspiciatis, accusantium mollitia deleniti facilis velit sed ex
                                    nulla eum hic. Minus cupiditate fugit reprehenderit cum numquam!
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div data-aos="fade-down-left">
                            <h3>
                                <span>0</span>3
                            </h3>
                            <div className="work-ideal">
                                <h4>Delivery</h4>
                                <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore, modi. Recusandae, autem fuga! Perspiciatis, accusantium mollitia deleniti facilis velit sed ex
                                    nulla eum hic. Minus cupiditate fugit reprehenderit cum numquam!
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div data-aos="fade-down-left" data-aos-delay="200">
                            <h3>
                                <span>0</span>4
                            </h3>
                            <div className="work-ideal">
                                <h4>Heat & Enjoy</h4>
                                <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore, modi. Recusandae, autem fuga! Perspiciatis, accusantium mollitia deleniti facilis velit sed ex
                                    nulla eum hic. Minus cupiditate fugit reprehenderit cum numquam!
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Work;
