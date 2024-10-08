﻿import React, {useEffect, useMemo, useState} from "react";
import Button from "react-bootstrap/Button";
import {get} from '../api/httpApi';
import {AgGridReact} from "ag-grid-react";
import Navigation from "./Navigation";
/*
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
*/
import _ from 'lodash';
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import {Col, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";

const birdeyeChain = "?chain=solana";
const birdeyeBaseUrl = "https://birdeye.so/tv-widget/";
const params = {
    chartType: "&chartType=candle",
    chartInterval: "&chartInterval=3",
    showLeftToolbar: "&chartLeftToolbar=show"
};

function Birdeye() {
    const [rowData, setRowData] = useState([{}]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [token, setToken] = useState(null);
    const [loadChart, setLoadChart] = useState(false);

    const LinkCellRenderer = (params) => {
        // Assuming the URI is in the `uri` field of the row data
        const uri = params.value;
        return <a href={uri} target="_blank" rel="noopener noreferrer">{uri}</a>;
    };
    const [colDefs] = useState([
        {field: "address", editable: true},
        {field: "liquidity", editable: true},
        {field: "mc", editable: true},
        {field: "name", editable: true},
        {field: "symbol", editable: true},
        {field: "v24hUSD", editable: true},
        {field: "v24hChangePercent", editable: true}
    ]);

    useEffect(() => {
    }, [rowData, isLoaded, loadChart, token]);

    const GetPrice = () => {
        const params = {
            headers: {'X-API-KEY': process.env.BIRDEYE_API_KEY}
        };

        get(process.env.BIRDEYE_BASE_URI, params)
            .then(priceData => {
                setRowData(priceData.data.data.tokens);
                setIsLoaded(true);
            })
            .catch(error => {
                setIsLoaded(false);
                console.log(error);
            });
    }

    const processCellForClipboard = (params) => {
        return params.value;
    };

    const settoken = (event) => {
        if (token) {
            setLoadChart(true);
        }
    }

    return (
        <Container>
            <div>
            <span style={{textAlign: 'center'}}>
                <Navigation/>
            </span>
                <div>
                    <FormGroup className="mb-3" controlId={"formTokenInput"}>
                        <Form.Label style={{color: "blue", fontWeight: "bolder"}}>Token</Form.Label>
                        <Form.Control
                            value={token}
                            className="mb-3"
                            as="input"
                            rows={20}
                            onChange={event => {
                                setToken(event.target.value)
                            }}
                        />
                        <Button onClick={settoken}>Set Token</Button>
                    </FormGroup>
                </div>
                <Button onClick={GetPrice} style={{marginTop: "25px"}}>Get price</Button>
                {loadChart &&
                    (<iframe
                        src={`${birdeyeBaseUrl}${token}${birdeyeChain}${params.chartType}${params.chartInterval}${params.showLeftToolbar}`}
                        height={"500px"}
                        width={"1200px"}
                        style={{paddingBottom: '25px'}}>
                    </iframe>)
                }
                {rowData && rowData.length > 0 &&
                    <div className="ag-theme-quartz ag-theme-acmecorp">
                        <div style={{width: '100%', height: '100%', marginBottom: '5%'}}>
                            <AgGridReact
                                rowData={rowData}
                                columnDefs={colDefs}
                                domLayout='autoHeight'
                                pagination={true}
                                processCellForClipboard={processCellForClipboard}
                                copyHeadersToClipboard={true}
                            />
                        </div>
                    </div>
                }
            </div>
        </Container>
    )
}

export default Birdeye;