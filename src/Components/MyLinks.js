import React, {useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {get, post} from "../Api/httpApi";
import {AgGridReact} from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import Navigation from "./Navigation"; // Optional Theme applied to the grid

function MyLinks() {
    const [category, setCategory] = useState(null);
    const [myLink, setMyLink] = useState(null);
    const [myLinks, setMyLinks] = useState([{}]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [linkSaved, setLinkSaved] = useState(false);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState([
        {field: "myLinkId"},
        {field: "uri"},
        {field: "uriModifiedOn"},
        {field: "uriCategory"}
    ]);

    async function getMyLinks() {
        const response = await get("https://localhost:7169/api/getLinks");
        console.log(response);
        if (response) {
            setMyLinks(response);
            setIsLoaded(true);
        }

        return response;
    }

    useEffect(() => {
    }, [myLinks, isLoaded, myLinks, myLink, linkSaved]);

    async function handleSubmit(event) {
        event.preventDefault();
        const body = {
            uri: myLink,
            uriCategory: category,
            uriModifiedOn: null
        };
        console.log(body);
        const response = await post("https://localhost:7169/api/saveLink", body);
        console.log(response)
        /*  .then(res => {
              if (res) {
                  console.log(res);
                  setLinkSaved(true);
              }
          }).catch(err => {
                  console.log(err);
                  setIsLoaded(true);
              }
          );*/

        return response;
    }

    return (
        <>
            <Navigation/>
            <Form type="submit">
                <Form.Group className="mb-3">
                    <Form.Label id="category">Uri Category:
                        <Form.Control id="category" type="text" name="MyLinks" placeholder="Category" onChange={event => {
                            setCategory(event.target.value);
                        }}/>
                    </Form.Label>
                    <Form.Label id="uri">Link:
                        <Form.Control id="uri"  type="text" name="MyLinks" placeholder="Link" onChange={event => {
                            setMyLink(event.target.value);
                        }}/>
                    </Form.Label>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form.Group>
            </Form>
            <Button onClick={() => getMyLinks()}></Button>
            {/*     {category && myLink && (
                <Alert variant={"success"}>{`Saved link ${category} - ${myLink}`}</Alert>
            )}*/}

            <div className="ag-theme-quartz">
                <AgGridReact
                    rowData={myLinks}
                    columnDefs={colDefs}
                    domLayout='autoHeight'
                />
            </div>
        </>
    )
}

export default MyLinks;