import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import feature1 from "~/assets/feature/feature1.webp";
import feature2 from "~/assets/feature/feature2.webp";
import feature3 from "~/assets/feature/feature3.webp";
import feature4 from "~/assets/feature/feature4.webp";

import HeadLine from "~/component/HeadLine/HeadLine";
import Whychoose from "~/assets/whychoose.jpg";

const Cravings = () => {
    return (
        <div className="Cravings">
            <Container>
                <HeadLine headline={"From Cravings to Plate"}></HeadLine>
                <Row>
                    <Col xs={6} md={3}>
                        <div>
                            <img className="Cravings_imageFeature" src={feature1} alt="" />
                            <h3>Choose Your Meal</h3>
                            <p>Choose the meal package that suits your needs and fill in the delivery information</p>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div>
                            <img className="Cravings_imageFeature" src={feature2} alt="" />
                            <h3>Cooking In Progress</h3>
                            <p>We select the best ingredients and cook in modern industrial kitchens</p>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div>
                            <img className="Cravings_imageFeature" src={feature3} alt="" />
                            <h3>Delivery</h3>
                            <p>DailyFood's delivery team will deliver your meals to your doorstep every day.</p>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div>
                            <img className="Cravings_imageFeature" src={feature4} alt="" />
                            <h3>Enjoy Your Meal</h3>
                            <p>No thinking, shopping or greasy cooking, just heat and enjoy!</p>
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="Cravings-imageChoose">
                <img src={Whychoose} alt="" />
            </div>
        </div>
    );
};

export default Cravings;
