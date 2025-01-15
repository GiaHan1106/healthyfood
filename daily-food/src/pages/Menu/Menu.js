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
    const [nowDay, setNowDay] = useState({
        day: "", // ngày trong tuần (0 - Chủ nhật, 6 - Thứ Bảy)
        hour: "", // giờ hiện tại
    });

    const [tab, setTab] = useState(0); // Chỉ số tab hiện tại

    // Mảng ngày trong tuần
    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Lấy ngày hiện tại và cập nhật trạng thái
    const checkDay = () => {
        const now = new Date();
        const day = now.getDay();
        setNowDay({ day, hour: now.getHours() });
    };

    // Cập nhật tab khi ngày thay đổi
    useEffect(() => {
        checkDay();
    }, []);

    // Chọn tab tương ứng với ngày hiện tại
    useEffect(() => {
        if (dataMenuDay && dataMenuDay.length > 0) {
            const currentDayName = weekDays[nowDay.day]; // Ví dụ: "FRI"
            const currentDayIndex = dataMenuDay.findIndex((item) => item.daymenu_day.toUpperCase() === currentDayName);

            if (currentDayIndex !== -1) {
                setTab(currentDayIndex); // Chọn tab tương ứng với ngày hiện tại
            }
        }
    }, [nowDay, dataMenuDay]);

    // Cập nhật danh sách thực phẩm cho menu mỗi khi data thay đổi
    useEffect(() => {
        dataMenuDay.forEach((day) => {
            day.listfood = dataMenuFood.filter((food) => food.foodmenu_idDay === day.daymenu_id && food.foodmenu_idCate === day.daymenu_idCate);
        });
    }, [dataMenuDay, dataMenuFood]);

    const calculateTotalPrice = (listfood) => {
        if (listfood) {
            return listfood.slice(0, 3).reduce((total, foodItem) => total + (foodItem.price || 0), 0);
        } else {
            return 0;
        }
    };

    return (
        <div className="menu">
            <div className="menu-imageMenu">
                <img src={bannerMenu} alt="" />
                <div className="menu-textBanner">
                    <h2>WEEKLY MEAL PLAN</h2>
                    {dataMenu && dataMenu.map((item) => <h3 key={item.catemenu_id}>{item.catemenu_title}</h3>)}
                </div>
            </div>

            <Container>
                <ul className="menu-listmenu">
                    {dataMenuDay &&
                        dataMenuDay.map((item, index) => (
                            <li key={item.daymenu_id} className={`${tab === index && "active"}`} onClick={() => setTab(index)}>
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
                                            />
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
                                                $ {calculateTotalPrice(item.listfood)}
                                            </span>
                                            <span style={{ color: "black", marginLeft: "20px" }}>${Math.floor(calculateTotalPrice(item.listfood) * 0.9)}</span>
                                        </h5>
                                    )}
                                    <button
                                        className="menu-button_button-1"
                                        onClick={() =>
                                            addCart(
                                                {
                                                    ...item,
                                                    price: (calculateTotalPrice(item.listfood) * 0.9).toFixed(2),
                                                },
                                                slug[slug.length - 1],
                                                dataMenu[0]?.catemenu_title || ""
                                            )
                                        }
                                    >
                                        Order for {item.daymenu_day}
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </Container>
        </div>
    );
};

export default Menu;
