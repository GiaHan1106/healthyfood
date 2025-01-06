import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import UseFetch from "~/feature/UseFetch";

const Revenue = () => {
    const listOrder = UseFetch("http://localhost:8081/orders");
    const [orderStats, setOrderStats] = useState({
        pendingConfirmation: 0,
        pendingPreparing: 0,
        delivering: 0,
        cancelled: 0,
        totalOrders: 0,
        totalCancelled: 0,
    });

    useEffect(() => {
        const calculateOrderStats = () => {
            const stats = {
                pendingConfirmation: 0,
                pendingPreparing: 0,
                delivering: 0,
                cancelled: 0,
                totalOrders: 0,
                totalCancelled: 0,
            };

            listOrder.forEach((order) => {
                if (order.status === "Waiting Confirmation") {
                    stats.pendingConfirmation += 1;
                } else if (order.status === "Preparing") {
                    stats.pendingPreparing += 1;
                } else if (order.status === "Delivered") {
                    stats.delivering += 1;
                } else if (order.status === "Cancelled") {
                    stats.cancelled += 1;
                    stats.totalCancelled += 1; // Tính tổng đơn hủy
                }
                if (order.status !== "Cancelled") {
                    stats.totalOrders += 1;
                }
            });

            setOrderStats(stats);
        };

        if (listOrder.length > 0) {
            calculateOrderStats();
        }
    }, [listOrder]);

    return (
        <div className="c-revenue">
            <Row>
                <Col md={3}>
                    <div className="c-revenue_card">
                        <h2>{orderStats.pendingConfirmation}</h2>
                        <h5>Orders Pending Confirmation</h5>
                        <div className="icon">
                            <i className="fa-solid fa-list-check"></i>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="c-revenue_card">
                        <h2>{orderStats.pendingPreparing}</h2>
                        <h5>Orders Pending Preparing</h5>
                        <div className="icon">
                            <i className="fa-solid fa-fire pending"></i>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="c-revenue_card">
                        <h2>{orderStats.delivering}</h2>
                        <h5>Orders for Delivering</h5>
                        <div className="icon">
                            <i className="fa-solid fa-truck"></i>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="c-revenue_card">
                        <h2>{orderStats.totalOrders}</h2>
                        <h5>Total Orders Delivered Successfully</h5>
                        <div className="icon">
                            <i className="fa-solid fa-chart-simple"></i>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="c-revenue_card">
                        <h2>{orderStats.totalCancelled}</h2>
                        <h5>Total Orders Cancelled</h5>
                        <div className="icon">
                            <i className="fa-solid fa-ban"></i>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Revenue;
