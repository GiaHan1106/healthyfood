import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import product1 from "~/assets/product/product1.png";
import product2 from "~/assets/product/product2.png";
import product3 from "~/assets/product/product3.png";
import HeadLine from "~/component/HeadLine/HeadLine";
import Whychoose from "~/assets/whychoose.jpg";

const Product = () => {
    return (
        <div className="product">
            <Container>
                <HeadLine headline={"From Cravings to Plate"}></HeadLine>
                <Row>
                    <Col xs={6} md={3}>
                        <div data-aos="fade-down" data-aos-delay="200">
                            <i className="fa-solid fa-mobile-screen"></i>
                            <h3>Choose Your Meal</h3>
                            <p>Choose the meal package that suits your needs and fill in the delivery information</p>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div data-aos="fade-down">
                            <i className="fa-solid fa-kitchen-set"></i>
                            <h3>Cooking In Progress</h3>
                            <p>We select the best ingredients and cook in modern industrial kitchens</p>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div data-aos="fade-down" data-aos-delay="200">
                            <i className="fa-solid fa-truck-fast"></i>
                            <h3>Delivery</h3>
                            <p>DailyFood's delivery team will deliver your meals to your doorstep every day.</p>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div data-aos="fade-down" data-aos-delay="200">
                            <i className="fa-solid fa-utensils"></i>
                            <h3>Enjoy Your Meal</h3>
                            <p>No thinking, shopping or greasy cooking, just heat and enjoy!</p>
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="product-imageChoose">
                <img src={Whychoose} alt="" />
            </div>
        </div>
    );
};

export default Product;
