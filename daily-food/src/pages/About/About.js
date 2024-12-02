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
                                    <span> CÂU CHUYỆN CỦA</span> NHÀ SÁNG LẬP
                                </h2>

                                <p>
                                    Chúng tôi là những người đam mê trà sữa, được truyền cảm hứng từ câu chuyện về Shaman ,chúng tôi kết hợp thảo mộc cổ truyền và trà sữa hiện đại để mang đến những
                                    hương vị độc đáo và bổ dưỡng.
                                </p>
                            </div>
                        </Col>
                        <Col xs={7}>
                            <div className="about-img">
                                <img src="https://i.pinimg.com/564x/d7/4c/5a/d74c5afa5fbeb4dc6d5635b48ca76a05.jpg" alt="" />
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="about-story">
                    <Row>
                        <Col xs={7}>
                            <div className="about-img">
                                <img src="https://i.pinimg.com/564x/7a/5d/c6/7a5dc673338021e7dc27e7b00df79879.jpg" alt="" />
                            </div>
                        </Col>
                        <Col xs={5}>
                            <div className="about-story_text">
                                <h2>
                                    <span> BẮT ĐẦU TỪ NIỀM ĐAM MÊ </span>TRÀ ĐẬM ĐÀ & VỊ TINH TẾ
                                </h2>
                                <p>
                                    Mỗi ly trà sữa đều chứa đựng tâm huyết và sự sáng tạo của chúng tôi, đảm bảo không chỉ ngon miệng mà còn tốt cho sức khỏe. Sự hài lòng của khách hàng luôn là ưu
                                    tiên hàng đầu của chúng tôi.
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
                                    <span> CHÚNG TÔI </span> LẤY KHÁCH HÀNG LÀM TRỌNG TÂM
                                </h2>
                                <p>
                                    Chúng tôi luôn đặt khách hàng lên hàng đầu trong mọi hoạt động của mình. Tại Shaman Tea, sự hài lòng của khách hàng là ưu tiên hàng đầu. Chúng tôi không ngừng lắng
                                    nghe ý kiến, phản hồi để cải thiện và nâng cao chất lượng dịch vụ.
                                </p>
                            </div>
                        </Col>
                        <Col xs={7}>
                            <div className="about-img">
                                <img src="https://i.pinimg.com/564x/5b/96/e2/5b96e2fe05725f6f6c764904bf1a2222.jpg" alt="" />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default About;
