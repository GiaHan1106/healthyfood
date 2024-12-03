import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Col, Row, Table } from "react-bootstrap";
import UseFetch from "~/feature/UseFetch";

const DayMenu = () => {
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
        enableReinitialize: true,
        initialValues: {
            id: data.id,
            idCate: selectCate.id || data.idCate,
            day: data.day,
            catename: selectCate.title || data.catename,
        },
        validationSchema: Yup.object({
            day: Yup.string().required("Day is required"),
        }),
        onSubmit: async (values) => {
            const newObj = {
                daymenu_idCate: parseInt(values.idCate),
                daymenu_day: values.day,
                cateName: values.catename,
            };

            try {
                let res;
                if (update) {
                    res = await axios.put(`http://localhost:8081/daymenu/` + values.id, newObj);
                    const updatedList = newCateMenu.map((item) => (item.daymenu_id === values.id ? { ...item, ...newObj } : item));
                    setNewCateMenu(updatedList);
                } else {
                    res = await axios.post(`http://localhost:8081/daymenu`, newObj);
                    setNewCateMenu([...newCateMenu, res.data]);
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
        const findId = newCateMenu.find((item) => item.daymenu_id === id);
        if (findId) {
            setSelectCate({
                id: findId.daymenu_idCate,
                title: findId.catename?.catemenu_title || "",
            });
            formik.setFieldValue("id", findId.daymenu_id);
            formik.setFieldValue("idCate", findId.daymenu_idCate);
            formik.setFieldValue("day", findId.daymenu_day);
            formik.setFieldValue("catename", findId.catename?.catemenu_title || "");
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8081/daymenu/` + id);
            alert("Data deleted successfully!");
            setNewCateMenu(newCateMenu.filter((item) => item.daymenu_id !== id));
        } catch (error) {
            alert("There was an error deleting the menu item:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listDataRes = await axios.get("http://localhost:8081/daymenu");
                const cateMenuRes = await axios.get("http://localhost:8081/catemenu");

                if (cateMenuRes.data.length > 0 && !selectCate.id) {
                    setSelectCate({
                        id: cateMenuRes.data[0].catemenu_id,
                        title: cateMenuRes.data[0].catemenu_title,
                    });
                }

                const newListDay = listDataRes.data.map((list) => {
                    list.catename = cateMenuRes.data.find((food) => list.daymenu_idCate === food.catemenu_id);
                    return list;
                });

                // Sắp xếp theo idCate
                const sortedList = newListDay.sort((a, b) => a.daymenu_idCate - b.daymenu_idCate); // Sắp xếp theo idCate

                setNewCateMenu(sortedList);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [cateMenu, selectCate]);

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
                                        <option value={item.catemenu_id} key={item.catemenu_id}>
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
                        {update ? (
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
