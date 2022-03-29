import React from "react";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NavbarComp = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigation = useNavigate();

  return (
    <Navbar style={{backgroundColor:'#11142a'}} variant="dark" expand="lg" sticky="top" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="https://cdn.discordapp.com/attachments/692996198663192616/918431241303367700/auction.png"
            style={{ width: "35px", marginRight: "0.4rem" }}
          />
          <strong style={{fontSize:'1.3 rem'}}>OrionBid</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto my-2 my-lg-0">
          </Nav>
          <Nav activeKey={location.pathname}>
            {!currentUser && <Nav.Link eventKey={"/Signin"} as={Link} to="/Signin">Sign in</Nav.Link>}
            {!currentUser && <Nav.Link eventKey={"/Signup"} as={Link} to="/Signup">Register</Nav.Link>}
            {currentUser &&<Nav.Link eventKey={"/Profile"} as={Link} to="/Profile">Profile</Nav.Link>}
            {currentUser &&<Nav.Link
              onClick={async (e) => {
                e.preventDefault();
                alert("logout user");
                logout();
                navigation('/')
              }}
            >
              Logout
            </Nav.Link>}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComp;
