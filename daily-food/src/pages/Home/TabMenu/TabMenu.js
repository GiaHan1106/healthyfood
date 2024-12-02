import React, { useState } from "react";
import { Container } from "react-bootstrap";
import HeadLine from "~/component/HeadLine/HeadLine";
import MenuDetail from "~/component/MenuDetail/MenuDetail";
import UseFetch from "~/feature/UseFetch";

const TabMenu = () => {
    const [tab, setTab] = useState(1);

    const dataMenu = UseFetch("http://localhost:8081/catemenu");
    console.log(dataMenu);

    return (
        <div className="tabmenu">
            <Container>
                <HeadLine headline={"Choose Your Plan"}></HeadLine>
                <ul className="tabmenu-listmenu">
                    {dataMenu.map((item, index) => (
                        <li key={item.catemenu_id} className={`${tab === index && "active"}`} onClick={() => setTab(index)}>
                            {item.catemenu_title}
                        </li>
                    ))}
                </ul>
                <div className="tabmenu-detailMenu">
                    {dataMenu.map((item, index) => (
                        <div className={`tabmenu-content ${tab === index && "active"}`} key={item.catemenu_id}>
                            <MenuDetail id={item.catemenu_id} title={item.catemenu_title} image={item.catemenu_image} calo={item.catemenu_calo} des={item.catemenu_describe}></MenuDetail>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default TabMenu;
