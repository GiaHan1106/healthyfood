import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Col, Row, Table } from "react-bootstrap";
import UseFetch from "~/feature/UseFetch";

const FoodMenu = () => {
    const listData = UseFetch(`http://localhost:8081/foodmenu`);
    const catemenu = UseFetch(`http://localhost:8081/catemenu`);
    const daymenu = UseFetch(`http://localhost:8081/daymenu`);

    const [newCateMenu, setNewCateMenu] = useState([]);
    const [update, setUpdate] = useState("");

    const [selectCate, setSelectCate] = useState(catemenu.length > 0 ? { id: catemenu[0].catemenu_id, title: catemenu[0].catemenu_title } : { id: "", title: "" });
    const [selectDays, setSelectDays] = useState([]);
    const [daysByCate, setDaysByCate] = useState([]);

    const [data, setData] = useState({
        id: "",
        idCate: "",
        name: "",
        image: "",
        des: "",
        calories: "",
        protein: "",
        fat: "",
        catename: "",
        cateDay: "",
    });

    // Hàm chon cate
    const handleSelectCate = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const selectedId = selectedOption.getAttribute("data-id");
        const selectedTitle = selectedOption.value;
        // Kiểm tra giá trị của selectedId
        const selectDay = daymenu.filter((item) => item.daymenu_idCate.toString() === selectedId);
        setSelectCate({
            id: selectedId,
            title: selectedTitle,
        });
        // lấy daymenu_day trong mảng đã log ra được
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
        // Cập nhật lại selectDays
        setSelectDays({
            id: selectedId,
            day: selectedTitle,
        });
        console.log(selectDays);
    };

    //submit
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: data.id,
            idCate: data.idCate,
            name: data.name,
            image: data.image,
            des: data.des,
            calories: data.calories,
            protein: data.protein,
            fat: data.fat,
            catename: data.catename,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("name is Required"),
            image: Yup.string().required("image is Required"),
            des: Yup.string().required("des is Required"),
            calories: Yup.string().required("calofries is Required"),
            protein: Yup.string().required("protein is Required"),
            fat: Yup.string().required("fat is Required"),
        }),
        onSubmit: async (values) => {
            const newObj = {
                idCate: selectCate.id,
                idDay: selectDays.id,
                name: values.name,
                image: values.image,
                des: values.des,
                calories: values.calories,
                protein: values.protein,
                fat: values.fat,
            };

            // console.log("form value:", newObj);

            if (update) {
                try {
                    const res = await axios.put(`http://localhost:8081/foodmenu/` + values.id, newObj);
                    console.log("Response:", res.data);
                    alert("Data updated successfully!");
                    window.location.reload();
                } catch (error) {
                    console.error("There was an error updating the data!", error);
                    alert("Failed to update data.");
                }
            } else {
                try {
                    const res = await axios.post(`http://localhost:8081/foodmenu/`, newObj);
                    console.log("Response:", res.data);
                    alert("Data ADD successfully!");
                    window.location.reload();
                } catch (error) {
                    console.error("There was an error ADD the data!", error);
                    alert("Failed to ADD data.");
                }
            }
        },
    });

    const handleEdit = (id) => {
        setUpdate(id);
        const findId = newCateMenu.find((item) => item.id === id);
        setData({
            id: findId.id,
            idCate: findId.idCate,
            idDay: findId.idDay, // Ensure this field is mapped
            name: findId.name,
            image: findId.image,
            des: findId.des,
            calories: findId.calories,
            protein: findId.protein,
            fat: findId.fat,
            catename: findId.catename.title,
        });
        setSelectCate({
            id: findId.catename.id,
            title: findId.catename.title,
        });
        setSelectDays({
            id: findId.idDay, // Correct this value if necessary
            day: getDayName(findId.idDay),
        });
    };

    const handleDelete = async (id) => {
        const findId = newCateMenu.find((item) => item.id === id);
        try {
            const res = await axios.delete(`http://localhost:8081/daymenu/` + findId.id);
            console.log("Delete successful:", res.data);
            alert("delete was succesfully");
            window.location.reload();
        } catch (error) {
            alert("There was an error deleting the menu item:", error);
        }
    };

    // Hàm ánh xạ số thành tên ngày
    const getDayName = (dayNumber) => {
        const days = {
            1: "MON",
            2: "TUE",
            3: "WED",
            4: "THUR",
            5: "FRI",
            6: "SAT",
            7: "SUN",
        };

        return days[dayNumber] || "Unknown"; // Nếu không phải 1-5, trả về 'Unknown'
    };
    //useEffect dau tien load ra duoc title va day dau tien
    useEffect(() => {
        // Kiểm tra xem cateMenu và dayMenu có dữ liệu không
        if (catemenu.length > 0 && daymenu.length > 0) {
            // Lấy phần tử đầu tiên của cateMenu
            const firstCate = catemenu[0];
            setSelectCate({
                id: firstCate.catemenu_id,
                title: firstCate.catemenu_title,
            });

            // Lọc ngày tương ứng với category đầu tiên
            const selectDay = daymenu.filter((item) => item.daymenu_idCate.toString() === firstCate.catemenu_id.toString());

            if (selectDay.length > 0) {
                setDaysByCate(selectDay.map((item) => item.daymenu_day));
                setSelectDays({
                    id: selectDay[0].daymenu_id,
                    day: selectDay[0].daymenu_day,
                });
            }
        }
    }, [catemenu, daymenu]);

    useEffect(() => {
        const newListDay = listData.map((list) => {
            list.catename = catemenu.find((food) => list.idCate === food.id);
            list.daymenu = catemenu.find((food) => list.idDay === food.id);
            return list;
        });
        setNewCateMenu(newListDay);
    }, [catemenu, listData]);
    useEffect(() => {
        // console.log(selectCate);
        // console.log(selectDays);
    }, [selectCate, selectDays]);

    useEffect(() => {
        if (catemenu && catemenu.length > 0) {
            const filterDay = daymenu.filter((item) => item.daymenu_idCate === catemenu[0].catemenu_id);
            const getfirstlistday = filterDay.map((item) => ({
                id: catemenu[0].catemenu_id,
                day: item.daymenu_day,
            }));
            setDaysByCate(getfirstlistday);
            setSelectDays(getfirstlistday);
        } else {
            console.log("Data is not ready yet.");
        }
    }, [catemenu]);
    console.log(daysByCate);

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
                            <h5>Image</h5>
                            <input type="text" onChange={formik.handleChange} name="image" value={formik.values.image} />
                            {formik.touched.image && formik.errors.image ? <div className="error">{formik.errors.image}</div> : null}
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
                            <th>ID</th>
                            <th>Title</th>
                            <th>Day</th>
                            <th>Name</th>
                            <th>Time</th>
                            <th>Image</th>
                            <th>Description</th>
                            <th>Calories</th>
                            <th>ProTein</th>
                            <th>Fat</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newCateMenu &&
                            newCateMenu.map((item) => (
                                <tr key={item.foodmenu_id}>
                                    <td>{item.foodmenu_id}</td>
                                    <td>{item.catename && item.catename.catemenu_title}</td>
                                    <td>{getDayName(item.foodmenu_idDay)}</td>
                                    <td>{item.foodmenu_name}</td>
                                    <td>{item.foodmenu_time}</td>
                                    <td>
                                        <img src={item.foodmenu_image} alt="" />
                                    </td>
                                    <td>{item.foodmenu_des}</td>
                                    <td>{item.foodmenu_calories}</td>
                                    <td>{item.foodmenu_protein}</td>
                                    <td>{item.foodmenu_fat}</td>
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
