import React from "react";
import {Nav} from "react-bootstrap";
import '../output.css';

const Navigation = () => {
    return (
        <nav className="justify-center items-center text-center navbar-gradient flex flex-col">
            <div className={'flex'}>
                <Nav.Link to={"/"}>
                    <h3 className={'text-2xl text-white font-extrabold'}>Assist Management</h3>
                </Nav.Link>
                <Nav.Link href={"/askAssist"}>
                    <h3 className={'text-2xl text-white font-extrabold pl-4'}>Ask Assist</h3>
                </Nav.Link>
            </div>
        </nav>
    );
}

export default Navigation;