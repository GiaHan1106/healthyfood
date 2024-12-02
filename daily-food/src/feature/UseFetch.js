import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UseFetch = (url) => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const fetchApi = async () => {
        try {
            const res = await axios.get(url);
            if (!res.data) {
                throw new Error("No data returned from API");
            }
            setData(res.data);
        } catch (error) {
            // navigate("/");
        }
    };
    useEffect(() => {
        fetchApi();
    }, [url]);
    return data;
};

export default UseFetch;
