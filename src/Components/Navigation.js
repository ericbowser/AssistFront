import {Container, Nav, Navbar} from "react-bootstrap";
import styled from 'styled-components';
import React from "react";

const TopContainer = styled.div`
    font-size: 10pt;
		margin: 2%;
`;

const Navigation = () => {
	return (
		<TopContainer>
			<Navbar>
				<Container>
					<Navbar.Brand href={"/"}>Assist Management</Navbar.Brand>
					<Nav>
						<Nav.Link href={"/askAssist"}>
							Ask Assist
						</Nav.Link>
					</Nav>
				</Container>
			</Navbar>
		</TopContainer>
	);
}

export default Navigation;