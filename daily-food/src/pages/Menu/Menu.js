import React, { useEffect, useState } from "react";
import Button from "~/component/Button/Button";
import bannerMenu from "~/assets/banner/imageMenu.png";
import { Container } from "react-bootstrap";
import CardMenu from "./CardMenu/CardMenu";
import { useParams } from "react-router-dom";
import UseFetch from "~/feature/UseFetch";
import { useCart } from "~/context/CartContext";
const Menu = () => {
    const { addCart } = useCart();
    const { slug } = useParams();
    const dataMenu = UseFetch(`http://localhost:8081/catemenu/${slug[slug.length - 1]}`);
    const dataMenuDay = UseFetch(`http://localhost:8081/daymenu?idCate=${slug[slug.length - 1]}`);
    const dataMenuFood = UseFetch(`http://localhost:8081/foodmenu?idCate=${slug[slug.length - 1]}`);
    const [nowDay, setNowDay] = useState({
        day: "",
        hour: "",
    });
    const [tab, setTab] = useState();

    const checkDay = () => {
        const now = new Date();
        setNowDay({ day: now.getDay(), hour: now.getHours() });
    };
    const handleNowDay = (index) => {
        return (nowDay.day < 6 && index + 1 < nowDay.day) || (nowDay.hour > 8 && nowDay.day >= index + 1);
    };

    useEffect(() => {
        checkDay();
        handleNowDay();
    }, []);

    useEffect(() => {
        setTab(nowDay.day - 1);
    }, [nowDay]);

    useEffect(() => {
        dataMenuDay.forEach((day) => {
            day.listfood = dataMenuFood.filter((food) => food.foodmenu_idDay === day.daymenu_id);
        });
    }, [dataMenuDay, dataMenuFood]);

    const calculateTotalPrice = (dataMenuDay) => {
        return dataMenuDay
            .filter((item) => item.listfood && item.listfood.length > 0)
            .map((item) => item.listfood)
            .flat()
            .slice(0, 3)
            .reduce((total, foodItem) => total + (foodItem.price || 0), 0);
    };
    console.log(dataMenuDay);

    return (
        <div className="menu">
            <div className="menu-imageMenu">
                <img src={bannerMenu} alt="" />
                <div className="menu-textBanner">
                    <h2>WEEKLY MEAL PLAN</h2>
                    <h3>{dataMenu && dataMenu.catemenu_title}</h3>
                    <Button secondary="true" text="ORDER NOW" link=""></Button>
                </div>
            </div>

            <Container>
                <ul className="menu-listmenu">
                    {dataMenuDay &&
                        dataMenuDay.map((item, index) => (
                            <li
                                key={item.daymenu_id}
                                className={`${tab === index && "active"} ${handleNowDay(index) ? "disable" : ""} ${nowDay.day === index + 1 ? "now" : ""}`}
                                onClick={() => setTab(index)}
                            >
                                {handleNowDay(index) ? <span className="menu-listmenu_available">Not available</span> : ""}
                                <span className="menu-listmenu_day">{item.daymenu_day}</span>
                            </li>
                        ))}
                </ul>
                <div className="menu-detailMenu">
                    {dataMenuDay &&
                        dataMenuDay.map((item, index) => (
                            <div key={item.daymenu_id} className={`menu-content ${tab === index && "active"}`}>
                                {item.listfood &&
                                    item.listfood
                                        .filter((food) => food.allday === 1)
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
                                            ></CardMenu>
                                        ))}

                                <div className="menu-button">
                                    {dataMenuDay && dataMenuDay.length > 0 && (
                                        <h5>
                                            Total Price:
                                            <span
                                                style={{
                                                    textDecoration: "line-through",
                                                    color: "gray",
                                                    marginLeft: "20px",
                                                    fontSize: "24px",
                                                }}
                                            >
                                                $ {calculateTotalPrice(dataMenuDay)}
                                            </span>
                                            <span style={{ color: "black", marginLeft: "20px" }}>${Math.floor(calculateTotalPrice(dataMenuDay) * 0.9)}</span>
                                        </h5>
                                    )}

                                    {handleNowDay(index) ? (
                                        <p>You should order a food today before 8:00 am</p>
                                    ) : (
                                        <button
                                            className="menu-button_button-1"
                                            onClick={() =>
                                                addCart(
                                                    {
                                                        ...item,
                                                        price: (calculateTotalPrice(dataMenuDay) * 0.9).toFixed(2),
                                                    },
                                                    slug[slug.length - 1],
                                                    dataMenu[0]?.catemenu_title || ""
                                                )
                                            }
                                        >
                                            Order for {item.daymenu_day}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </Container>
        </div>
    );
};

export default Menu;
