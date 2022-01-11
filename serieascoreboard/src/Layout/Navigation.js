import {Link} from 'react-router-dom';
import './Navigation.css';
import { Navbar, Container, Nav} from 'react-bootstrap'

function Navigation () {

    return (
        <Navbar>
            <Container>
                <Navbar.Brand>
                    <img
                        alt=""
                        src="/seriea-logo.png"
                        width="50"
                        height="60"
                        className="d-inline-block align-top"
                    />{' '}
                </Navbar.Brand>
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link as={Link} to='/'>Fixtures</Nav.Link>
                        <Nav.Link as={Link} to='/table'>Table</Nav.Link>
                        <Nav.Link as={Link} to='/leaders'>Leaders</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    
    )
}

export default Navigation;