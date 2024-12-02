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
            allday: data.allday || 0,
            price: data.price || 0,
            diseases: data.diseases || "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            image: Yup.string().required("Image is required"),
            des: Yup.string().required("Description is required"),
            calories: Yup.number().required("Calories is required"),
            protein: Yup.number().required("Protein is required"),
            fat: Yup.number().required("Fat is required"),
            allday: Yup.number().oneOf([0, 1], "Invalid value for All Day").required("All Day is required"),
            price: Yup.number().required("Price is required").min(0, "Price must be at least 0"),
            diseases: Yup.string().required("Diseases is required"),
        }),
        onSubmit: async (values) => {
            const newObj = {
                idCate: parseInt(selectCate.id),
                idDay: selectDays.id,
                name: values.name,
                image: values.image,
                des: values.des,
                calories: values.calories,
                protein: values.protein,
                fat: values.fat,
                allday: values.allday,
                price: values.price,
                diseases: values.diseases,
            };
            console.log(newObj);

            try {
                let res;
                if (update) {
                    // Cập nhật
                    res = await axios.put(`http://localhost:8081/foodmenu/` + values.id, newObj);
                    const updatedList = newCateMenu.map((item) => (item.foodmenu_id === values.id ? { ...item, ...newObj } : item));
                    setNewCateMenu(updatedList);
                } else {
                    // Thêm mới
                    res = await axios.post(`http://localhost:8081/foodmenu`, newObj);
                    setNewCateMenu([...newCateMenu, res.data]); // Adds new data to the state
                }
                alert("Data saved successfully!");
                formik.resetForm();
                setSelectCate({});
            } catch (error) {
                console.error("Error:", error);
                alert("Failed to save data.");
            }
        },
    });

    const handleEdit = (id) => {
        setUpdate(id);
        const findId = newCateMenu.find((item) => item.id === id);
        setData({
            id: findId.id,
            idCate: findId.idCate,
            idDay: findId.idDay,
            name: findId.name,
            image: findId.image,
            des: findId.des,
            calories: findId.calories,
            protein: findId.protein,
            fat: findId.fat,
            allday: findId.allday,
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
            // Lọc các ngày liên quan đến danh mục đầu tiên
            const filterDay = daymenu.filter((item) => item.daymenu_idCate === catemenu[0].catemenu_id);

            // Chuyển đổi dữ liệu sang định dạng cần thiết
            const getFirstListDay = filterDay.map((item) => ({
                id: item.daymenu_id, // Sử dụng `id` chính xác
                day: item.daymenu_day,
            }));

            // Cập nhật danh sách mới (xóa danh sách cũ trước khi thêm)
            setDaysByCate(getFirstListDay);

            // Chọn ngày đầu tiên làm mặc định (nếu cần)
            setSelectDays(getFirstListDay.length > 0 ? getFirstListDay[0] : []);
        } else {
            console.log("Data is not ready yet.");
            setDaysByCate([]); // Làm rỗng danh sách khi không có danh mục
            setSelectDays([]); // Làm rỗng ngày được chọn
        }
    }, [catemenu, daymenu]); // Đảm bảo `daymenu` là một dependency

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
                            <th>ID</th>
                            <th>Title</th>
                            <th>Day</th>
                            <th>Name</th>
                            <th>Time</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Sell</th>
                            <th>Calories</th>
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
                                    <td>{item.price}</td>
                                    <td>{item.foodmenu_des}</td>
                                    <td>{item.foodmenu_calories}</td>
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
