import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

function SidePanel() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true)

    useEffect(() => {
    }, [show]);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Toggle static offcanvas
            </Button>

            <Offcanvas show={show} onHide={handleClose} backdrop="static">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <a>test</a>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default SidePanel;