import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import CartFood from "~/component/CartFood/CartFood";
import HeadLine from "~/component/HeadLine/HeadLine";
import cartFood from "~/assets/imgCart.png";

const Feature = () => {
    const cart = [
        {
            id: 1,
            image: cartFood,
            title: "Chrysanthemum",
            price: "50.000",
        },
        {
            id: 2,
            image: cartFood,
            title: "Chrysanthemum",
            price: "50.000",
        },
        {
            id: 3,
            image: cartFood,
            title: "Chrysanthemum",
            price: "20.000",
        },
        {
            id: 4,
            image: cartFood,
            title: "Chrysanthemum",
            price: "40.000",
        },
        {
            id: 5,
            image: cartFood,
            title: "Chrysanthemum",
            price: "30.000",
        },
        {
            id: 6,
            image: cartFood,
            title: "Chrysanthemum",
            price: "20.000",
        },
    ];

    return (
        <div>
            <Container>
                <HeadLine headline={"Feature Product"}></HeadLine>
                <Row>
                    {cart.map((item) => (
                        <Col xs={6} md={2} key={item.id}>
                            <CartFood image={item.image} title={item.title} price={item.price}></CartFood>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default Feature;
