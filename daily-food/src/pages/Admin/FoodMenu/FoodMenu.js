import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { Col, Row, Table } from "react-bootstrap";
import UseFetch from "~/feature/UseFetch";

const FoodMenu = () => {
    const listData = UseFetch(`http://localhost:8081/foodmenu`);
    const catemenu = UseFetch(`http://localhost:8081/catemenu`);
    const daymenu = UseFetch(`http://localhost:8081/daymenu`);

    const [newCateMenu, setNewCateMenu] = useState([]);
    const [update, setUpdate] = useState("");

    const [selectCate, setSelectCate] = useState({ id: "", title: "" });
    const [selectDays, setSelectDays] = useState([]);
    const [daysByCate, setDaysByCate] = useState([]);

    const [data, setData] = useState({
        id: "",
        idCate: "",
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
        const selectDay = daymenu.filter((item) => item.daymenu_idCate.toString() === selectedId.toString());
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
                    // Ensure to send the correct `id` in the PUT request URL
                    res = await axios.put(`http://localhost:8081/foodmenu/${values.id}`, newObj);

                    // Update the list after the update
                    const updatedList = newCateMenu.map((item) => (item.foodmenu_id === values.id ? { ...item, ...newObj } : item));
                    setNewCateMenu(updatedList);
                } else {
                    res = await axios.post(`http://localhost:8081/foodmenu`, newObj);
                    const newItem = {
                        ...newObj,
                        catename: catemenu.find((food) => food.catemenu_id === newObj.foodmenu_idCate),
                        daymenu: daymenu.find((day) => day.daymenu_id === newObj.foodmenu_idDay),
                    };
                    setNewCateMenu([...newCateMenu, newItem]);
                }
                alert("Data saved successfully!");
                formik.resetForm();
            } catch (error) {
                console.error("Error:", error);
                alert("Failed to save data.");
            }
        },
    });

    const handleEdit = (id) => {
        setUpdate(id);
        const findId = newCateMenu.find((item) => item.foodmenu_id === id);
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
        setSelectCate({
            id: findId.catename.id,
            title: findId.catename.title,
        });
        setSelectDays({
            id: findId.idDay,
            day: getDayName(findId.idDay),
        });
    };

    const handleDelete = async (id) => {
        const findId = newCateMenu.find((item) => item.foodmenu_id === id);
        if (!findId) {
            alert("Menu item not found");
            return;
        }
        try {
            const res = await axios.delete(`http://localhost:8081/foodmenu/` + findId.foodmenu_id);
            alert("Delete was successful");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting menu item:", error); // Log full error details
            alert("There was an error deleting the menu item: " + error.message);
        }
    };

    // Hàm ánh xạ số thành tên ngày
    const getDayName = (dayNumber) => {
        const days = {
            1: "MON",
            2: "TUE",
            3: "WED",
            4: "THU",
            5: "FRI",
            6: "SAT",
            7: "SUN",
            8: "MON",
            9: "TUE",
            10: "WED",
            11: "THUR",
            12: "FRI",
            13: "SAT",
            14: "SUN",
            15: "MON",
            16: "TUE",
            17: "WED",
            18: "THUR",
            19: "FRI",
            26: "SAT",
            27: "SUN",
            28: "MON",
            29: "TUE",
            31: "WED",
            32: "THUR",
            33: "FRI",
            34: "SAT",
            35: "SUN",
        };

        return days[dayNumber] || "Unknown"; // Nếu không phải 1-5, trả về 'Unknown'
    };

    useEffect(() => {
        setNewCateMenu(listData);
    }, [listData]);

    const newListDay = useMemo(() => {
        return listData.map((list) => {
            list.catename = catemenu.find((food) => list.idCate === food.id);
            list.daymenu = daymenu.find((day) => list.idDay === day.id);
            return list;
        });
    }, [listData, catemenu, daymenu]);

    useEffect(() => {
        setNewCateMenu(newListDay);
    }, [newListDay]);

    useEffect(() => {
        if (catemenu.length > 0 && daymenu.length > 0) {
            handleDaysByCate(catemenu[0].catemenu_id, catemenu[0].catemenu_title);
            const firstCategoryDays = daymenu.filter((item) => item.daymenu_idCate === catemenu[0].catemenu_id);
            setSelectDays(
                firstCategoryDays.length > 0
                    ? {
                          id: firstCategoryDays[0].daymenu_id,
                          day: firstCategoryDays[0].daymenu_day,
                      }
                    : null
            );
            setSelectCate({
                id: catemenu[0].catemenu_id,
                title: catemenu[0].catemenu_title,
            });
        }
        // if (catemenu.length > 0 && daymenu.length > 0) {
        //   const firstCategoryDays = daymenu.filter(
        //     (item) => item.daymenu_idCate === catemenu[0].catemenu_id
        //   );
        //   setSelectDays(
        //     firstCategoryDays.length > 0
        //       ? {
        //           id: firstCategoryDays[0].daymenu_id,
        //           day: firstCategoryDays[0].daymenu_day,
        //         }
        //       : null
        //   );
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [catemenu, daymenu]);

    return (
        <div className="foodmenuManage">
            <form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col md={4}>
                        <div className="foodmenuManage-input">
                            <h5>Title</h5>
                            <select name="idCate" onChange={handleSelectCate} value={selectCate.title}>
                                {catemenu &&
                                    catemenu.map((item) => (
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
                        {update && update ? (
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
                        {newCateMenu &&
                            newCateMenu.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.catename && item.catename.catemenu_title}</td>
                                    <td>{getDayName(item.foodmenu_idDay)}</td>
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
                                    <td>{item.allday === 1 ? "All Day" : "Combo"}</td>
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
