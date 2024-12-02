import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Col, Row, Table } from "react-bootstrap";
import UseFetch from "~/feature/UseFetch";

const DayMenu = () => {
    // const listData = UseFetch(`http://localhost:8081/daymenu`);
    const cateMenu = UseFetch(`http://localhost:8081/catemenu`);
    const [newCateMenu, setNewCateMenu] = useState([]);
    const [update, setUpdate] = useState("");
    const [selectCate, setSelectCate] = useState(cateMenu.length > 0 ? { id: cateMenu[0].catemenu_id, title: cateMenu[0].catemenu_title } : { id: "", title: "" });
    const [data, setData] = useState({
        id: "",
        idCate: "",
        day: "",
        catename: "",
    });

    const handleSelectCate = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const selectedId = selectedOption.value;
        const selectedTitle = selectedOption.innerText;
        setSelectCate({
            id: selectedId,
            title: selectedTitle,
        });
    };

    const formik = useFormik({
        enableReinitialize: true, // Quan trọng để cho phép reinitialize form khi giá trị thay đổi
        initialValues: {
            id: data.id,
            idCate: selectCate.id || data.idCate, // Đồng bộ selectCate vào form
            day: data.day,
            catename: selectCate.title || data.catename, // Đồng bộ title vào form
        },
        validationSchema: Yup.object({
            day: Yup.string().required("Day is required"),
        }),
        onSubmit: async (values) => {
            const newObj = {
                daymenu_idCate: parseInt(values.idCate), // Chuyển idCate thành số
                daymenu_day: values.day, // Lấy từ formik
                cateName: values.catename, // Lấy từ formik
            };

            try {
                let res;
                if (update) {
                    // Cập nhật
                    res = await axios.put(`http://localhost:8081/daymenu/` + values.id, newObj);
                    const updatedList = newCateMenu.map((item) => (item.daymenu_id === values.id ? { ...item, ...newObj } : item));
                    setNewCateMenu(updatedList); // Cập nhật lại dữ liệu trong state
                } else {
                    // Thêm mới
                    res = await axios.post(`http://localhost:8081/daymenu`, newObj);
                    setNewCateMenu([...newCateMenu, res.data]); // Thêm mới vào list
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
        const findId = newCateMenu.find((item) => item.daymenu_id === id); // Sử dụng daymenu_id
        if (findId) {
            setSelectCate({
                id: findId.daymenu_idCate, // Dùng daymenu_idCate thay vì catename.id
                title: findId.catename?.catemenu_title || "",
            });
            formik.setFieldValue("id", findId.daymenu_id); // Cập nhật id vào formik
            formik.setFieldValue("idCate", findId.daymenu_idCate); // Cập nhật idCate vào formik
            formik.setFieldValue("day", findId.daymenu_day); // Cập nhật day vào formik
            formik.setFieldValue("catename", findId.catename?.catemenu_title || ""); // Cập nhật catename vào formik
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8081/daymenu/` + id); // Xóa theo daymenu_id
            alert("Data deleted successfully!");
            // Loại bỏ item đã xóa khỏi state
            setNewCateMenu(newCateMenu.filter((item) => item.daymenu_id !== id)); // Sử dụng daymenu_id thay vì id
        } catch (error) {
            alert("There was an error deleting the menu item:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy dữ liệu daymenu và catemenu
                const listDataRes = await axios.get("http://localhost:8081/daymenu");
                const cateMenuRes = await axios.get("http://localhost:8081/catemenu");

                // Cập nhật selectCate nếu cateMenu có dữ liệu
                if (cateMenuRes.data.length > 0 && !selectCate.id) {
                    setSelectCate({
                        id: cateMenuRes.data[0].catemenu_id,
                        title: cateMenuRes.data[0].catemenu_title,
                    });
                }

                // Cập nhật newCateMenu sau khi tìm catename cho mỗi daymenu
                const newListDay = listDataRes.data.map((list) => {
                    list.catename = cateMenuRes.data.find((food) => list.daymenu_idCate === food.catemenu_id);
                    return list;
                });

                setNewCateMenu(newListDay);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [cateMenu, selectCate]); // Gọi lại khi cateMenu hoặc selectCate thay đổi

    return (
        <div className="daymenuManage">
            <form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col md={4}>
                        <div className="daymenuManage-input">
                            <h5>Title</h5>
                            <select name="idCate" onChange={handleSelectCate} value={selectCate.id}>
                                {cateMenu &&
                                    cateMenu.map((item) => (
                                        <option value={item.catemenu_id} data-id={item.catemenu_id} key={item.catemenu_id}>
                                            {item.catemenu_title}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="daymenuManage-input">
                            <h5>Day</h5>
                            <input type="text" onChange={formik.handleChange} name="day" value={formik.values.day} />
                            {formik.touched.day && formik.errors.day ? <div className="error">{formik.errors.day}</div> : null}
                        </div>
                    </Col>
                    <Col md={4}>
                        {update && update ? (
                            <div className="daymenuManage-button">
                                <button className="daymenuManage-button_login" type="submit">
                                    UPDATE
                                </button>
                            </div>
                        ) : (
                            <div className="daymenuManage-button">
                                <button className="daymenuManage-button_login" type="submit">
                                    ADD
                                </button>
                            </div>
                        )}
                    </Col>
                </Row>
            </form>
            <div className="daymenuManage-table">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Day</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newCateMenu &&
                            newCateMenu.map((item) => (
                                <tr key={item.daymenu_id}>
                                    <td>{item.daymenu_id}</td>
                                    <td>{item.catename ? item.catename.catemenu_title : "N/A"}</td>
                                    <td>{item.daymenu_day}</td>
                                    <td>
                                        <button onClick={() => handleEdit(item.daymenu_id)}>Edit</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(item.daymenu_id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default DayMenu;
