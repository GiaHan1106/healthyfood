import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Col, Row, Table } from "react-bootstrap";
import UseFetch from "~/feature/UseFetch";

const FoodMenu = () => {
    const listData = UseFetch(`https://healthy-food.techtheworld.id.vn/foodmenu`);
    const catemenu = UseFetch(`https://healthy-food.techtheworld.id.vn/catemenu`);
    const daymenu = UseFetch(`https://healthy-food.techtheworld.id.vn/daymenu`);

    const [newCateMenu, setNewCateMenu] = useState([]);
    const [cateMenuData, setCateMenu] = useState([]);
    const [dayMenuData, setDayMenu] = useState([]);

    const [update, setUpdate] = useState("");

    const [selectCate, setSelectCate] = useState({ id: "", title: "" });
    const [selectDays, setSelectDays] = useState([]);
    const [daysByCate, setDaysByCate] = useState([]);

    const [data, setData] = useState({
        id: "",
        idCate: "",
        idDay: "",
        name: "",
        time: "",
        image: "",
        des: "",
        calories: "",
        carbohydrates: "",
        protein: "",
        fat: "",
        price: "",
        allday: "",
        diseases: "",
    });

    // Hàm chon cate
    const handleSelectCate = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const selectedId = selectedOption.getAttribute("data-id");
        const selectedTitle = selectedOption.value;

        handleDaysByCate(selectedId, selectedTitle);
    };

    const handleDaysByCate = (selectedId, selectedTitle) => {
        const selectDay = dayMenuData.filter((item) => item.daymenu_idCate.toString() === selectedId.toString());
        setSelectCate({
            id: selectedId,
            title: selectedTitle,
        });

        const daymenuDays = selectDay.map((item) => ({
            id: item.daymenu_id,
            day: item.daymenu_day,
        }));
        setDaysByCate(daymenuDays);
    };

    // Hàm chon day
    const handleSelectDay = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const selectedId = selectedOption.getAttribute("data-day");
        const selectedTitle = selectedOption.value;
        setSelectDays({
            id: selectedId,
            day: selectedTitle,
        });
    };

    //submit
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: data.id,
            idCate: data.idCate,
            idDay: data.idDay,
            name: data.name,
            time: data.time,
            image: data.image,
            des: data.des,
            carbohydrates: data.carbohydrates,
            calories: data.calories,
            protein: data.protein,
            fat: data.fat,
            allday: data.allday || 0,
            price: data.price || 0,
            diseases: data.diseases || "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            image: Yup.string().required("Image is required"),
            time: Yup.string().required("time is required"),
            des: Yup.string().required("Description is required"),
            calories: Yup.number().required("Calories is required"),
            carbohydrates: Yup.number().required("carbohydrates is required"),
            protein: Yup.number().required("Protein is required"),
            fat: Yup.number().required("Fat is required"),
            allday: Yup.number().oneOf([0, 1], "Invalid value for All Day").required("All Day is required"),
            price: Yup.number().required("Price is required").min(0, "Price must be at least 0"),
            diseases: Yup.string().required("Diseases is required"),
        }),
        onSubmit: async (values) => {
            const newObj = {
                foodmenu_idCate: parseInt(selectCate.id),
                foodmenu_idDay: selectDays.id,
                foodmenu_name: values.name,
                foodmenu_time: values.time,
                foodmenu_image: values.image,
                foodmenu_des: values.des,
                foodmenu_calories: values.calories,
                foodmenu_protein: values.protein,
                foodmenu_carbohydrates: values.carbohydrates,
                foodmenu_fat: values.fat,
                allday: values.allday,
                price: values.price,
                diseases: values.diseases,
            };
            try {
                let res;
                if (update) {
                    res = await axios.put(`https://healthy-food.techtheworld.id.vn/foodmenu/${values.id}`, newObj);
                    const updatedList = newCateMenu.map((item) => (item.foodmenu_id === values.id ? { ...item, ...newObj } : item));

                    setNewCateMenu(updatedList);
                } else {
                    res = await axios.post(`https://healthy-food.techtheworld.id.vn/foodmenu`, newObj);
                    setNewCateMenu([...newCateMenu, newObj]);
                }
                alert("Data saved successfully!");
                formik.resetForm(); // Reset form values

                // Reset other states (selectCate, selectDays, data, etc.)
                setSelectCate({ id: "", title: "" });
                setSelectDays({ id: "", day: "" });
                setData({
                    id: "",
                    idCate: "",
                    idDay: "",
                    name: "",
                    time: "",
                    image: "",
                    des: "",
                    calories: "",
                    carbohydrates: "",
                    protein: "",
                    fat: "",
                    price: "",
                    allday: "",
                    diseases: "",
                });

                setUpdate("");
            } catch (error) {
                console.error("Error:", error);
                alert("Failed to save data.");
            }
        },
    });

    const handleGetCate = (idCate) => {
        const cate = cateMenuData?.find((cate) => cate?.catemenu_id?.toString() === idCate?.toString());

        return cate
            ? {
                  id: cate.catemenu_id,
                  title: cate.catemenu_title,
              }
            : { id: null, title: "Unknown" };
    };

    const handleGetDay = (idDay) => {
        const dayMenu = dayMenuData?.find((day) => day?.daymenu_id?.toString() === idDay?.toString());

        return dayMenu
            ? {
                  id: dayMenu.daymenu_idCate,
                  day: dayMenu.daymenu_day,
              }
            : { id: null, day: "Unknown" };
    };

    const handleEdit = (id) => {
        const findId = newCateMenu.find((item) => item.foodmenu_id.toString() === id.toString());
        setSelectCate(handleGetCate(findId.foodmenu_idCate));
        setSelectDays(handleGetDay(findId.foodmenu_idDay));
        setData({
            id: findId.foodmenu_id,
            idCate: findId.foodmenu_idCate,
            idDay: findId.foodmenu_idDay,
            name: findId.foodmenu_name,
            time: findId.foodmenu_time,
            image: findId.foodmenu_image,
            des: findId.foodmenu_des,
            calories: findId.foodmenu_calories,
            carbohydrates: findId.foodmenu_carbohydrates,
            protein: findId.foodmenu_protein,
            fat: findId.foodmenu_fat,
            price: findId.price,
            allday: findId.allday,
            diseases: findId.diseases,
        });

        setUpdate(id);
    };

    const handleDelete = async (id) => {
        if (!id) {
            alert("Invalid ID");
            return;
        }

        const findId = newCateMenu.find((item) => item?.foodmenu_id?.toString() === id?.toString());

        if (!findId) {
            alert("Menu item not found");
            return;
        }

        try {
            const res = await axios.delete(`https://healthy-food.techtheworld.id.vn/foodmenu/` + findId.foodmenu_id);
            alert("Delete was successful");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting menu item:", error);
            alert("There was an error deleting the menu item: " + error.message);
        }
    };
    const sortedMenu = newCateMenu.sort((a, b) => {
        // First, compare by foodmenu_idCate (ascending order)
        if (a.foodmenu_idCate < b.foodmenu_idCate) return -1;
        if (a.foodmenu_idCate > b.foodmenu_idCate) return 1;

        // If foodmenu_idCate is the same, compare by foodmenu_idDay (ascending order)
        return a.foodmenu_idDay - b.foodmenu_idDay;
    });

    console.log(sortedMenu);

    useEffect(() => {
        setNewCateMenu(listData);
    }, [listData]);

    useEffect(() => {
        setCateMenu(catemenu);
    }, [catemenu]);

    useEffect(() => {
        setDayMenu(daymenu);
    }, [daymenu]);

    useEffect(() => {
        if (cateMenuData.length > 0 && dayMenuData.length > 0) {
            handleDaysByCate(cateMenuData[0].catemenu_id, cateMenuData[0].catemenu_title);
            const firstCategoryDays = dayMenuData.filter((item) => item.daymenu_idCate === cateMenuData[0].catemenu_id);
            setSelectDays(
                firstCategoryDays.length > 0
                    ? {
                          id: firstCategoryDays[0].daymenu_id,
                          day: firstCategoryDays[0].daymenu_day,
                      }
                    : null
            );
            setSelectCate({
                id: cateMenuData[0].catemenu_id,
                title: cateMenuData[0].catemenu_title,
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cateMenuData, dayMenuData]);

    return (
        <div className="foodmenuManage">
            <form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Title</h5>
                            <select name="idCate" onChange={handleSelectCate} value={selectCate.title}>
                                {cateMenuData &&
                                    cateMenuData.map((item) => (
                                        <option value={item.catemenu_title} data-id={item.catemenu_id} key={item.catemenu_title}>
                                            {item.catemenu_title}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Day</h5>
                            <select name="idDay" onChange={handleSelectDay} value={selectDays.day}>
                                {daysByCate && daysByCate.length > 0 ? (
                                    daysByCate.map((item) => (
                                        <option value={item.day} data-day={item.id} key={item.id}>
                                            {item.day}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No days available</option> // Nếu không có ngày, hiển thị thông báo
                                )}
                            </select>
                        </div>
                    </Col>

                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Name</h5>
                            <input type="text" onChange={formik.handleChange} name="name" value={formik.values.name} />
                            {formik.touched.name && formik.errors.name ? <div className="error">{formik.errors.name}</div> : null}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Time</h5>
                            <input type="text" onChange={formik.handleChange} name="time" value={formik.values.time} />
                            {formik.touched.time && formik.errors.time ? <div className="error">{formik.errors.time}</div> : null}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Image</h5>
                            <input type="text" onChange={formik.handleChange} name="image" value={formik.values.image} />
                            {formik.touched.image && formik.errors.image ? <div className="error">{formik.errors.image}</div> : null}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Price</h5>
                            <input type="number" onChange={formik.handleChange} name="price" value={formik.values.price} />
                            {formik.touched.price && formik.errors.price ? <div className="error">{formik.errors.price}</div> : null}
                        </div>
                    </Col>

                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Description</h5>
                            <input type="text" onChange={formik.handleChange} name="des" value={formik.values.des} />
                            {formik.touched.des && formik.errors.des ? <div className="error">{formik.errors.des}</div> : null}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Calories</h5>
                            <input type="number" onChange={formik.handleChange} name="calories" value={formik.values.calories} />
                            {formik.touched.calories && formik.errors.calories ? <div className="error">{formik.errors.calories}</div> : null}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>carbohydrates</h5>
                            <input type="number" onChange={formik.handleChange} name="carbohydrates" value={formik.values.carbohydrates} />
                            {formik.touched.carbohydrates && formik.errors.carbohydrates ? <div className="error">{formik.errors.carbohydrates}</div> : null}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Protein</h5>
                            <input type="number" onChange={formik.handleChange} name="protein" value={formik.values.protein} />
                            {formik.touched.protein && formik.errors.protein ? <div className="error">{formik.errors.protein}</div> : null}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Fat</h5>
                            <input type="number" onChange={formik.handleChange} name="fat" value={formik.values.fat} />
                            {formik.touched.fat && formik.errors.fat ? <div className="error">{formik.errors.fat}</div> : null}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Diseases</h5>
                            <input type="text" onChange={formik.handleChange} name="diseases" value={formik.values.diseases} />
                            {formik.touched.diseases && formik.errors.diseases ? <div className="error">{formik.errors.diseases}</div> : null}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Sell</h5>
                            <select name="allday" onChange={formik.handleChange} value={formik.values.allday}>
                                <option value={1}>All Day</option>
                                <option value={0}>Combo</option>
                            </select>
                            {formik.touched.allday && formik.errors.allday ? <div className="error">{formik.errors.allday}</div> : null}
                        </div>
                    </Col>

                    <Col md={4}>
                        {update && update.length !== 0 ? (
                            <div className="foodmenuManage-button">
                                <button className="foodmenuManage-button_login" type="submit">
                                    UPDATE
                                </button>
                            </div>
                        ) : (
                            <div className="foodmenuManage-button">
                                <button className="foodmenuManage-button_login" type="submit">
                                    ADD
                                </button>
                            </div>
                        )}
                    </Col>
                </Row>
            </form>
            {/* <div className="foodmenuManage-filter">
                <div className="foodmenuManage-filter_box">
                    <label>Filter by Category:</label>
                    <select
                        onChange={(e) => {
                            handleSelectCate(e);
                            handleFilter();
                        }}
                        value={selectCate.id}
                    >
                        <option value="">All Categories</option>
                        {cateMenuData.map((cate) => (
                            <option key={cate.catemenu_id} data-id={cate.catemenu_id} value={cate.catemenu_title}>
                                {cate.catemenu_title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="foodmenuManage-filter_box">
                    <label>Filter by Day:</label>
                    <select
                        onChange={(e) => {
                            handleDaysByCate(e);
                            handleFilter();
                        }}
                        value={selectDays.id}
                    >
                        <option value="">All Days</option>
                        {daysByCate.map((day) => (
                            <option key={day.id} data-day={day.id} value={day.day}>
                                {day.day}
                            </option>
                        ))}
                    </select>
                </div>
            </div> */}

            <div className="foodmenuManage-table">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Day</th>
                            <th>Name</th>
                            <th>Time</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Calories</th>
                            <th>carbohydrates</th>
                            <th>ProTein</th>
                            <th>Fat</th>
                            <th>Diseases</th>
                            <th>Sell</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMenu &&
                            sortedMenu
                                .sort((a, b) => {
                                    const categoryOrder = ["SLIMMING", "VEGETARIAN", "GYMER", "HEALTHY"];
                                    const categoryA = handleGetCate(a.foodmenu_idCate).title;
                                    const categoryB = handleGetCate(b.foodmenu_idCate).title;
                                    if (categoryA !== categoryB) {
                                        return categoryOrder.indexOf(categoryA) - categoryOrder.indexOf(categoryB);
                                    }
                                    const dayOrder = ["MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"];
                                    const dayA = handleGetDay(a.foodmenu_idDay).day;
                                    const dayB = handleGetDay(b.foodmenu_idDay).day;
                                    if (dayA !== dayB) {
                                        return dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB);
                                    }

                                    const timeOrder = ["Breakfast", "Lunch", "Dinner"];
                                    return timeOrder.indexOf(a.foodmenu_time) - timeOrder.indexOf(b.foodmenu_time);
                                })
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td>{handleGetCate(item.foodmenu_idCate).title}</td>
                                        <td>{handleGetDay(item.foodmenu_idDay).day}</td>
                                        <td>{item.foodmenu_name}</td>
                                        <td>{item.foodmenu_time}</td>
                                        <td>
                                            <img src={item.foodmenu_image} alt="" />
                                        </td>
                                        <td>{item.price}</td>
                                        <td>{item.foodmenu_des}</td>
                                        <td>{item.foodmenu_calories}</td>
                                        <td>{item.foodmenu_carbohydrates}</td>
                                        <td>{item.foodmenu_protein}</td>
                                        <td>{item.foodmenu_fat}</td>
                                        <td>{item.diseases}</td>
                                        <td>{item.allday.toString() === "1" ? "All Day" : "Combo"}</td>
                                        <td>
                                            <button onClick={() => handleEdit(item.foodmenu_id)}>Edit</button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(item.foodmenu_id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default FoodMenu;
