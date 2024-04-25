import React, {useEffect, useMemo, useState} from "react";
import Button from "react-bootstrap/Button";
import {get} from '../Api/httpApi';
import {AgGridReact} from "ag-grid-react";
import Navigation from "./Navigation";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import _ from 'lodash';
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import {Col, Row} from "react-bootstrap";

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
        {field: "address"},
        {field: "liquidity"},
        {field: "mc"},
        {field: "name"},
        {field: "symbol"},
        {field: "v24hUSD"},
        {field: "v24hChangePercent"}
    ]);

    useMemo(() => {
    }, [token])

    useEffect(() => {
    }, [rowData, isLoaded, loadChart]);

    const GetPrice = () => {
        const params = {
            headers: {'X-API-KEY': 'c871ef44be2647b88441255cbc8b3c7f'}
        };

        const priceData = get('https://public-api.birdeye.so/defi/tokenlist', params)
            .then(priceData => {
                console.log(priceData);
                const wantTokens = [];
                const tokens = _.map(priceData.data.tokens, (token, index) => {
                    console.log(token);
                    if (token.liquidity > 1000 && token.mc > 15000) {
                        wantTokens.push(token);
                    }
                })
                setRowData(wantTokens);
                setIsLoaded(true);
            })
            .catch(error => {
                setIsLoaded(false);
                console.log(error);
            });
    }

    const onPasteStart = (event) => {
        console.log('Paste started', event);
    };

    const onPasteEnd = (event) => {
        console.log('Paste ended', event);
    };

    const processCellForClipboard = (params) => {
        return params.value;
    };

    const settoken = (event) => {
        if (token) {
            setLoadChart(true);
        }
    }

    return (
        <div>
            <span style={{textAlign: 'center'}}>
                <Navigation/>
            </span>
            <div>
                <FormGroup as={Row} className="mb-3" controlId={"formTokenInput"}>
                    <Form.Label column sm="1" style={{color: "blue", fontWeight: "bolder"}}>Token</Form.Label>
                    <Col sm="2">
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
                    </Col>
                </FormGroup>
            </div>
            <Button onClick={GetPrice} style={{marginTop: "25px"}}>Get price</Button>
            {loadChart && (
                <iframe
                    src={`${birdeyeBaseUrl}${token}${birdeyeChain}${params.chartType}${params.chartInterval}${params.showLeftToolbar}`}
                    height={"500px"}
                    width={"1600px"}
                    style={{paddingBottom: '25px'}}>
                </iframe>
            )
            }
            {rowData && rowData.length > 0 &&
                <div className="ag-theme-quartz">
                    <div style={{width: '1800px', height: '100%'}}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                            domLayout='autoHeight'
                            pagination={true}
                            enableClipboard={true}
                            processCellForClipboard={processCellForClipboard}
                            onPasteStart={onPasteStart}
                            onPasteEnd={onPasteEnd}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default Birdeye;