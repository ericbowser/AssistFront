import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import VoiceTranscript from "./VoiceTranscript";
/*
import SidePanel from "./OffCanvas";
*/

const Navigation = () => {
    return (
        <>
            <Navbar className="flex flex-column" style={{paddingBottom: '10px'}}>
                <Nav>
                    <Navbar.Brand href={"/"} style={{color: "purple", fontWeight: 'bold'}}>
                        <h3>Assist Management</h3>
                    </Navbar.Brand>
                    <Nav.Link href={"/askAssist"} style={{color: "lightcoral", fontWeight: 'bold'}}>
                        <h5>Ask Assist</h5>
                    </Nav.Link>
                    <Nav.Link href={"/birdeye"} style={{color: "lightcoral", fontWeight: 'bold'}}>
                        <h5>Birdeye</h5>
                    </Nav.Link>
                  {/*  <Nav.Link href={"/myLinks"} style={{color: "lightcoral", fontWeight: 'bold'}}>
                        <h5>My Links</h5>
                    </Nav.Link>*/}
                </Nav>
            </Navbar>
        </>
    );
}

export default Navigation;