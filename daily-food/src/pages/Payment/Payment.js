import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Payment = () => {
    return (
        <div class="s-payment">
            <Container>
                <h2>
                    Billing details <span class="s-payment-left_error"></span>
                </h2>
                <Row>
                    <Col lg={7}>
                        <form className="s-payment-left">
                            <div class="s_input">
                                <h5>
                                    Fullname <span>*</span>
                                </h5>
                                <input required type="text" name="fullname" />
                            </div>
                            <div class="s_input">
                                <h5>
                                    Email <span>*</span>
                                </h5>
                                <input required type="email" name="email" />
                            </div>
                            <div class="s_input">
                                <h5>
                                    Phone <span>*</span>
                                </h5>
                                <input required type="text" name="phone" />
                            </div>
                            <div class="s_input">
                                <h5>
                                    Address <span>*</span>
                                </h5>
                                <input required type="text" name="address" />
                            </div>
                            <div class="s_input">
                                <h5>Order notes (optional)</h5>
                                <textarea name="note" cols="30" rows="10"></textarea>
                            </div>
                            <button type="submit" class="s_button_1">
                                PLACE ORDER
                            </button>
                        </form>
                    </Col>
                    <Col lg={5}>
                        <div className="s-payment-right">
                            <h3>Your order</h3>
                            <div class="s-payment_order">
                                <p class="s_orderText">PRODUCT</p>
                                <p class="s_orderPrice">SUBTOTAL</p>
                            </div>
                            <div class="s-payment_priceTotal"></div>
                            <div class="s-payment_order">
                                <p class="s-payment_orderText">Subtotal</p>
                                <p class="s-payment_orderPrice">
                                    $ <span></span>
                                </p>
                            </div>
                            <div class="s-payment_order">
                                <p class="s-payment_orderText">Shipping</p>
                                <p class="s-payment_orderPrice">Free Shipping</p>
                            </div>
                            <div class="s-payment_order">
                                <p class="s-payment_orderText">Total</p>
                                <p class="s-payment_orderPrice">
                                    $ <span></span>
                                </p>
                            </div>
                        </div>
                        <h6>Empty cart</h6>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Payment;
