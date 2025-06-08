import React from 'react';
import { Container, Row, Col, Navbar, Nav, NavDropdown, Card } from 'react-bootstrap';

const Home = () => {
  return (
    <div>

      {/* Main Content */}
      <Container fluid>
        <Row>
      
          {/* Main Content */}
          <Col sm={9} md={10} className="p-0">
            <Container fluid>
              <Row>
                <Col>
                  <Card className="m-2">
                    <Card.Body>
                      <Card.Title>Content Area</Card.Title>
                      <Card.Text>
                        This is the main content area of the dashboard.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
