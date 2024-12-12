import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import HeadLine from "~/component/HeadLine/HeadLine";
import imagePrograms from "~/assets/program.png";
const Feature = () => {
    return (
        <div className="feature">
            <Container>
                <Row>
                    <Col lg={6} md={12} className="mb-4">
                        <HeadLine headline={"What We Serve Our Best Programs"}></HeadLine>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, dignissimos ullam necessitatibus laudantium omnis distinctio quae culpa quisquam ratione unde cumque
                            sapiente quibusdam alias quasi numquam tempora odio repudiandae animi.
                        </p>
                        <ul>
                            <li>
                                <i className="fa-solid fa-star"></i>All menu recipe made by specialists
                            </li>
                            <li>
                                <i className="fa-solid fa-star"></i>Fresh and locally grown products
                            </li>
                            <li>
                                <i className="fa-solid fa-star"></i>Fast delivery and easy returns
                            </li>
                        </ul>
                    </Col>

                    <Col lg={6} md={12}>
                        <div className="feature-imagePrograms">
                            <div className="feature-image">
                                <img src={imagePrograms} alt="" />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Feature;
