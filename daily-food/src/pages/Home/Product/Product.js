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
                <HeadLine headline={"Our Product"}></HeadLine>
                <Row>
                    <Col md={4}>
                        <div data-aos="fade-down" data-aos-delay="200">
                            <a className="product-image" href="">
                                <img src={product1} alt="" />
                            </a>
                            <h3>DAILY FOOD</h3>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div data-aos="fade-down">
                            <a className="product-image" href="">
                                <img src={product2} alt="" />
                            </a>
                            <h3>DAILY DRINKS</h3>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div data-aos="fade-down" data-aos-delay="200">
                            <a className="product-image" href="">
                                <img src={product3} alt="" />
                            </a>
                            <h3>DAILY SNACKS</h3>
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
