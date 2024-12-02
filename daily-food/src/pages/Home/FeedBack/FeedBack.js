import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Slider from "react-slick";
import HeadLine from "~/component/HeadLine/HeadLine";
import avatar from "~/assets/avatar.png";

const FeedBack = () => {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };
    return (
        <div className="feedback">
            <Container>
                <HeadLine headline={"Daily Story"}></HeadLine>
                <div className="slider-container">
                    <Slider {...settings}>
                        <div className="feedback-child">
                            <img src={avatar} alt="" />
                            <h3>Savannah Nguyen</h3>
                            <p>
                                “Loren ipsun dolor sit anet, consectetur adipisci elit, sed eiusnod tenpor incidunt ut labore et dolore nagna aliqua Loren ipsun dolor sit anet, consectetur adipisci
                                elit
                            </p>
                        </div>
                        <div className="feedback-child">
                            <img src={avatar} alt="" />
                            <h3>Savannah Nguyen</h3>
                            <p>
                                “Loren ipsun dolor sit anet, consectetur adipisci elit, sed eiusnod tenpor incidunt ut labore et dolore nagna aliqua Loren ipsun dolor sit anet, consectetur adipisci
                                elit
                            </p>
                        </div>
                        <div className="feedback-child">
                            <img src={avatar} alt="" />
                            <h3>Savannah Nguyen</h3>
                            <p>
                                “Loren ipsun dolor sit anet, consectetur adipisci elit, sed eiusnod tenpor incidunt ut labore et dolore nagna aliqua Loren ipsun dolor sit anet, consectetur adipisci
                                elit
                            </p>
                        </div>
                    </Slider>
                </div>
            </Container>
        </div>
    );
};

export default FeedBack;
