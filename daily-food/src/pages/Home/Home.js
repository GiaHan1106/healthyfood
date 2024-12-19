import React from "react";
import Slide from "../Home/Slide/Slide";
import ChooseUs from "./ChooseUs/ChooseUs";
import Cravings from "./Cravings/Cravings";
import TabMenu from "./TabMenu/TabMenu";
import ServeOur from "./ServeOur/ServeOur";
import Enviroment from "./Enviroment/Enviroment";
import Map from "./Map/Map";
import FeedBack from "./FeedBack/FeedBack";
const Home = () => {
    return (
        <>
            <Slide></Slide>
            <ChooseUs></ChooseUs>
            <Cravings></Cravings>
            <TabMenu></TabMenu>
            <Enviroment></Enviroment>
            <ServeOur></ServeOur>
            <Map></Map>
            <FeedBack></FeedBack>
        </>
    );
};

export default Home;
