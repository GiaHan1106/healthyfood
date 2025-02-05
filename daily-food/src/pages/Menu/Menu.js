import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import CardMenu from "./CardMenu/CardMenu";
import bannerMenu from "~/assets/banner/imageMenu.png";
import UseFetch from "~/feature/UseFetch";
import { useCart } from "~/context/CartContext";

const Menu = () => {
    const { addCart } = useCart();
    const { slug } = useParams();
    const dataMenu = UseFetch(`https://healthy-food.techtheworld.id.vn/catemenu/${slug[slug.length - 1]}`);
    const dataMenuDay = UseFetch(`https://healthy-food.techtheworld.id.vn/daymenu?idCate=${slug[slug.length - 1]}`);
    const dataMenuFood = UseFetch(`https://healthy-food.techtheworld.id.vn/foodmenu?idCate=${slug[slug.length - 1]}`);
    const [nowDay, setNowDay] = useState({ day: "", hour: "" });
    const [tab, setTab] = useState(0);
    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    useEffect(() => {
        const now = new Date();
        setNowDay({ day: now.getDay(), hour: now.getHours() });
    }, []);

    useEffect(() => {
        if (dataMenuDay && dataMenuDay.length > 0) {
            const currentDayName = weekDays[nowDay.day];
            const currentDayIndex = dataMenuDay.findIndex((item) => item.daymenu_day.toUpperCase() === currentDayName);
            if (currentDayIndex !== -1) setTab(currentDayIndex);
        }
    }, [nowDay, dataMenuDay]);

    useEffect(() => {
        if (dataMenuDay.length > 0 && dataMenuFood.length > 0) {
            dataMenuDay.forEach((day) => {
                day.listfood = dataMenuFood.filter((food) => food.foodmenu_idDay === day.daymenu_id && food.foodmenu_idCate === day.daymenu_idCate);
            });
        }
    }, [dataMenuDay, dataMenuFood]);

    const calculateTotalPrice = (listfood) => {
        return listfood ? listfood.slice(0, 3).reduce((total, foodItem) => total + (foodItem.price || 0), 0) : 0;
    };

    if (!dataMenu || !dataMenuDay || !dataMenuFood) {
        return <div>Loading...</div>;
    }

    return (
        <div className="menu">
            <div className="menu-imageMenu">
                <img src={bannerMenu} alt="" />
                <div className="menu-textBanner">
                    <h2>WEEKLY MEAL PLAN</h2>
                    {dataMenu.map((item) => (
                        <h3 key={item.catemenu_id}>{item.catemenu_title}</h3>
                    ))}
                </div>
            </div>
            <Container>
                <ul className="menu-listmenu">
                    {dataMenuDay.map((item, index) => (
                        <li key={item.daymenu_id} className={`${tab === index ? "active" : ""}`} onClick={() => setTab(index)}>
                            <span className="menu-listmenu_day">{item.daymenu_day}</span>
                        </li>
                    ))}
                </ul>
                <div className="menu-detailMenu">
                    {dataMenuDay.map((item, index) => (
                        <div key={item.daymenu_id} className={`menu-content ${tab === index ? "active" : ""}`}>
                            {item.listfood && item.listfood.length > 0 ? (
                                item.listfood
                                    .filter((food) => food.allday === 1)
                                    .sort((a, b) => ["Breakfast", "Lunch", "Dinner"].indexOf(a.foodmenu_time) - ["Breakfast", "Lunch", "Dinner"].indexOf(b.foodmenu_time))
                                    .map((food) => (
                                        <CardMenu
                                            key={food.foodmenu_id}
                                            image={food.foodmenu_image}
                                            name={food.foodmenu_name}
                                            time={food.foodmenu_time}
                                            des={food.foodmenu_des}
                                            calories={food.foodmenu_calories}
                                            protein={food.foodmenu_protein}
                                            carbohydrates={food.foodmenu_carbohydrates}
                                        />
                                    ))
                            ) : (
                                <p>Loading...</p>
                            )}
                            {item.listfood && item.listfood.length > 0 && (
                                <div className="menu-button">
                                    <h5>
                                        Tổng giá:
                                        <span style={{ textDecoration: "line-through", color: "gray", marginLeft: "20px", fontSize: "24px" }}>
                                            {Math.floor(calculateTotalPrice(item.listfood) / 1000).toLocaleString("vi-VN") + ".000"} ₫
                                        </span>
                                        <span style={{ color: "black", marginLeft: "20px" }}>{Math.floor((calculateTotalPrice(item.listfood) * 0.9) / 1000).toLocaleString("vi-VN") + ".000"} ₫</span>
                                    </h5>
                                    <button
                                        className="menu-button_button-1"
                                        onClick={() => addCart({ ...item, price: (calculateTotalPrice(item.listfood) * 0.9).toFixed(2) }, slug[slug.length - 1], dataMenu[0]?.catemenu_title || "")}
                                    >
                                        Order for {item.daymenu_day}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default Menu;
