import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import {TopContainer} from "../styles";
import SidePanel from "./OffCanvas";

const Navigation = () => {
    return (
        <>
            <SidePanel/>
                <Navbar className="flex-column" style={{paddingBottom: '50px'}}>
                    <Navbar.Brand href={"/"} style={{color: "lightblue", fontWeight: 'bold'}}>
                        <h2>Assist Management</h2>
                    </Navbar.Brand>
                    <Nav>
                        <Nav.Link href={"/myLinks"} style={{color: "purple", fontWeight: 'bold'}}>
                            <h3>Common Links</h3>
                        </Nav.Link>
                        <Nav.Link href={"/askAssist"} style={{color: "lightblue", fontWeight: 'bold'}}>
                            <h3>Ask Assist</h3>
                        </Nav.Link>
                        <Nav.Link href={"/birdeye"} style={{color: "lightblue", fontWeight: 'bold'}}>
                            <h3>Birdeye</h3>
                        </Nav.Link>
                    </Nav>
                </Navbar>
        </>
    );
}

export default Navigation;