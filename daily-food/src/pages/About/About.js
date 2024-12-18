import React from "react";
import { Col, Container, Row } from "react-bootstrap";
const About = () => {
    return (
        <div className="about">
            <Container>
                <div className="about-story">
                    <Row>
                        <Col xs={5}>
                            <div className="about-story_text">
                                <h2>
                                    <span>THE STORY OF</span> FOUNDER
                                </h2>

                                <p>
                                    We are healthy food enthusiasts, inspired by the nutritional values ​​of traditional herbs combined with modern dishes. We aim to bring unique flavors and health
                                    benefits.
                                </p>
                            </div>
                        </Col>
                        <Col xs={7}>
                            <div className="about-img">
                                <img src="https://i.ytimg.com/vi/UgA_5V3Jro0/maxresdefault.jpg" alt="" />
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="about-story">
                    <Row>
                        <Col xs={7}>
                            <div className="about-img">
                                <img src="https://www.londonstaffagency.co.uk/wp-content/uploads/2021/07/private-chef--1600x800.jpeg" alt="" />
                            </div>
                        </Col>
                        <Col xs={5}>
                            <div className="about-story_text">
                                <h2>
                                    <span> STARTING WITH PASSION</span>HEALTHY & DELICATE FLAVOR FROM HERBS
                                </h2>
                                <p>
                                    Each dish contains our passion and creativity, ensuring that it is not only delicious but also good for your health. Customer satisfaction is always our top
                                    priority.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="about-story">
                    <Row>
                        <Col xs={5}>
                            <div className="about-story_text">
                                <h2>
                                    <span> WE ALWAY </span> CUSTOMER FOCUS
                                </h2>
                                <p>
                                    We always put customers first in all our activities. At Daily Food, customer satisfaction is our top priority. We constantly listen to opinions and feedback to
                                    improve and enhance the quality of our services.
                                </p>
                            </div>
                        </Col>
                        <Col xs={7}>
                            <div className="about-img">
                                <img src="https://blog.uvahealth.com/wp-content/uploads/2023/02/bowl-cropped.jpg" alt="" />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default About;
