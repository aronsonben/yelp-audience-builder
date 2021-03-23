import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Container, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import './App.css';

function UserListing(props) {

  return (
    <Container className="listing" style={{"display": !props.yab ? "none" : ""}}>
      <Row>
        <Col>
          <h4>Users Listing</h4>
        </Col>
        <Col>
          <p>Results displayed: {props.usersFound}</p>
        </Col>
      </Row>
      <Container className="bizList">
          {props.renderUsers}
      </Container>
    </Container>
  );
}

export default UserListing;