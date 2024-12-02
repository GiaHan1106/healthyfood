import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Col, Row } from "react-bootstrap";
import imageFood1 from "~/assets/banner/food1.png";
import imageFood2 from "~/assets/banner/food2.png";
import imageFood3 from "~/assets/banner/food3.png";
import vectorImge1 from "~/assets/banner/Vector1.png";
import vectorImge2 from "~/assets/banner/Vector2.png";
import vectorImge3 from "~/assets/banner/vector3.png";
import fork from "~/assets/banner/fork.png";
import spoon from "~/assets/banner/spoon.png";
import green from "~/assets/banner/green.png";
import pic1 from "~/assets/banner/pic1.png";
import pic2 from "~/assets/banner/pic2.png";
import pic3 from "~/assets/banner/pic3.png";
import Button from "~/component/Button/Button";

const Slide = () => {
    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    dots: false,
                    arrows: true,
                },
            },
        ],
    };
    const slide = [
        {
            id: 1,
            image: imageFood1,
            title: "Enjoy Delicious Food",
            decs: "In your healthy",
        },
        {
            id: 2,
            image: imageFood2,
            title: "Fresh Food",
            decs: "For your good health",
        },
        {
            id: 1,
            image: imageFood3,
            title: "Healthy And Taste Food",
            decs: "With natural ingredients",
        },
    ];
    return (
        <div className="slider">
            <Slider {...settings}>
                {slide.map((item) => (
                    <div key={item.id} className="slider-item">
                        <img src={vectorImge1} alt="" className="slider-vector_1" />
                        <div className="slider-content">
                            <Row>
                                <Col md={4}>
                                    <div className="slider-content_image">
                                        <img src={item.image} alt="" className="slider-content_image_title" />
                                        <div className="slider-content_image_spoon">
                                            <img src={spoon} alt="" />
                                        </div>
                                        <div className="slider-content_image_fork">
                                            <img src={fork} alt="" />
                                        </div>
                                        <div className="slider-content_image_green">
                                            <img src={green} alt="" />
                                        </div>
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <div className="slider-infor">
                                        <h2>{item.title}</h2>
                                        <h3>{item.decs}</h3>
                                        <Button className="button" text="ORDER NOW" link=""></Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="slider-images">
                            <img src={vectorImge3} alt="" className="slider-vector_3" />
                            <img src={vectorImge2} alt="" className="slider-vector_2" />
                            <div className="slider-pic">
                                <img src={pic1} alt="" className="slider-pic_1" />
                                <img src={pic2} alt="" className="slider-pic_2" />
                                <img src={pic3} alt="" className="slider-pic_3" />
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Slide;
