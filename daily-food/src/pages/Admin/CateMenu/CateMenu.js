import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Col, Row, Table } from "react-bootstrap";
import UseFetch from "~/feature/UseFetch";

const CateMenu = () => {
    const listData = UseFetch(`http://localhost:8081/catemenu`);
    const [newCateMenu, setNewCateMenu] = useState([]);
    const [update, setUpdate] = useState("");
    const [data, setData] = useState({
        id: "",
        title: "",
        calo: "",
        images: "",
        describe: "",
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: data?.id || "",
            title: data?.title || "",
            calo: data?.calo || "",
            images: data?.images || "",
            describe: data?.describe || "",
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            calo: Yup.string().required("Calories are required"),
            images: Yup.string().required("Image URL is required"),
            describe: Yup.string().required("Description is required"),
        }),
        onSubmit: async (values) => {
            const newObj = {
                catemenu_title: values.title,
                catemenu_calo: values.calo,
                catemenu_image: values.images,
                catemenu_describe: values.describe,
            };

            console.log("Payload gửi lên:", JSON.stringify(newObj));

            try {
                const url = update ? `http://localhost:8081/catemenu/${values.id}` : `http://localhost:8081/catemenu`;

                const res = update
                    ? await axios.put(url, newObj, { headers: { "Content-Type": "application/json" } })
                    : await axios.post(url, newObj, { headers: { "Content-Type": "application/json" } });

                console.log("Response từ server:", res.data);

                // Fetch updated data
                const updatedData = await axios.get(`http://localhost:8081/catemenu`);
                setNewCateMenu(updatedData.data);

                // Reset form và trạng thái update
                formik.resetForm();
                setData({
                    id: "",
                    title: "",
                    calo: "",
                    images: "",
                    describe: "",
                });
                setUpdate("");
                alert("Data saved successfully!");
            } catch (error) {
                console.error("Error details:", error.response ? error.response.data : error.message);
                alert(`Failed to save data. Error: ${error.message}`);
            }
        },
    });

    const handleEdit = (id) => {
        const findId = newCateMenu.find((item) => item.catemenu_id === id);
        if (findId) {
            setUpdate(id);
            setData({
                id: findId.catemenu_id,
                title: findId.catemenu_title,
                calo: findId.catemenu_calo,
                images: findId.catemenu_image,
                describe: findId.catemenu_describe,
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/catemenu/${id}`);
            alert("Delete was successful");

            // Fetch the updated data
            const updatedData = await axios.get(`http://localhost:8081/catemenu`);
            setNewCateMenu(updatedData.data);
        } catch (error) {
            console.error("Error deleting data:", error);
            alert("Failed to delete data.");
        }
    };

    useEffect(() => {
        if (listData) setNewCateMenu(listData);
    }, [listData]);

    return (
        <div className="catemenuManage">
            <form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col md={4}>
                        <div className="catemenuManage-input">
                            <h5>Title</h5>
                            <input type="text" name="title" onChange={formik.handleChange} value={formik.values.title} />
                            {formik.touched.title && formik.errors.title && <div className="error">{formik.errors.title}</div>}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="catemenuManage-input">
                            <h5>Image</h5>
                            <input type="text" name="images" onChange={formik.handleChange} value={formik.values.images} />
                            {formik.touched.images && formik.errors.images && <div className="error">{formik.errors.images}</div>}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="catemenuManage-input">
                            <h5>Calories</h5>
                            <input type="number" name="calo" onChange={formik.handleChange} value={formik.values.calo} />
                            {formik.touched.calo && formik.errors.calo && <div className="error">{formik.errors.calo}</div>}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="catemenuManage-input">
                            <h5>Describe</h5>
                            <input type="text" name="describe" onChange={formik.handleChange} value={formik.values.describe} />
                            {formik.touched.describe && formik.errors.describe && <div className="error">{formik.errors.describe}</div>}
                        </div>
                    </Col>
                    <Col md={4}>
                        <button className="catemenuManage-button_login" type="submit">
                            {update ? "Update" : "Add"}
                        </button>
                    </Col>
                </Row>
            </form>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Image</th>
                        <th>Calories</th>
                        <th>Description</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {newCateMenu.map((item) => (
                        <tr key={item.catemenu_id}>
                            <td>{item.catemenu_title}</td>
                            <td>
                                <img src={item.catemenu_image} alt={item.catemenu_title} />
                            </td>
                            <td>{item.catemenu_calo}</td>
                            <td>{item.catemenu_describe}</td>
                            <td>
                                <button onClick={() => handleEdit(item.catemenu_id)}>Edit</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(item.catemenu_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CateMenu;
