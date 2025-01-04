import React from "react";
import {Nav} from "react-bootstrap";
import '../output.css';

function h3(text) {
    return (
        <h3 className={'text-3xl pt-2 font-serif bolder border-amber-950 border-2s text-turquoise mt-5 p-3'}>{text}</h3>
    )
}

const Navigation = () => {
    return (
        <nav className="justify-center items-center text-center flex flex-col">
            <div className={'flex'}>
                <Nav.Link to={"/"}>
                    {h3('Home')}
                </Nav.Link>
                <Nav.Link href={"/askAssist"}>
                    {h3('Ask Assist')}
                </Nav.Link>
                <Nav.Link href={"/getUrlInfo"}>
                    {h3('Get Url info')}
                </Nav.Link>
            </div>
        </nav>
    );
}

export default Navigation;