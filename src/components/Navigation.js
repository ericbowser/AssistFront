import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import baal from "../images/cool_bak.jpg";

const Navigation = () => {
    return (
        <Navbar className="container-sm flex flex-col text-center m-48">
            <img src={baal} alt={'baal'} width={'50'}/>
            <Nav>
                <Navbar.Brand href={"/"} style={{color: "purple", fontWeight: 'bold', paddingLeft: '15px'}}>
                    <h3>Assist Management</h3>
                </Navbar.Brand>
                <Nav.Link href={"/askAssist"} style={{color: "lightcoral", fontWeight: 'bold'}}>
                    <h5>Ask Assist</h5>
                </Nav.Link>
                <Nav.Link href={"/birdeye"} style={{color: "lightcoral", fontWeight: 'bold'}}>
                    <h5>Birdeye</h5>
                </Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default Navigation;