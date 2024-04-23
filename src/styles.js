import styled from "styled-components";

const GridWrapper = styled.span`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 100%;
    word-wrap: break-word;
    @media only screen and (max-width: 650px) {
        display: inline-block;
    }
`;

const GridCol1Row1 = styled.div`
    grid-row: 1;
    grid-column-start: 1;
    grid-column-end: 2;
`;

const GridCol2Row1 = styled.div`
    grid-row: 1;
    grid-column-start: 2;
    grid-column-end: -1;
`;

export const Footer = styled.div`
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #333; /* Replace with your desired color */
    color: white;
    text-align: center;
    z-index: 1000; /* Ensures the footer stays above other content */
`;

export {
    GridCol1Row1,
    GridCol2Row1,
    GridWrapper
};