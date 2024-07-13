import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import '../output.css';
import {Link} from "react-router-dom";

const Navigation = () => {
    return (
        <Navbar className="container-sm mb-xxl-5 text-3xl bolder justify-between text-center bg-custom-image shadow-pink-800 shadow-2xl">
            <Nav>
                <Link to={"/"} className={'text-center m-2 pr-20'}>
                    <h3 className={'pl-96 text-2xl text-white font-extrabold text-center '}>Assist Management</h3>
                </Link>
                <Nav.Link href={"/askAssist"}>
                    <h3 className={'text-2xl text-white font-extrabold text-center'}>Ask Assist</h3>
                </Nav.Link>
{/*
                <Nav.Link href={"/birdeye"} style={{color: "lightcoral", fontWeight: 'bold'}}>
                    <h5>Birdeye</h5>
                </Nav.Link>
*/}
            </Nav>
        </Navbar>
    );
}

export default Navigation;