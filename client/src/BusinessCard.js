import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Container, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import './App.css';
import './Business.css';

class BusinessCard extends Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <li key={this.props.business.id} class="BusinessCard">
              <Container className="businessInfoContainer">
                <Row>
                  <Col xs={2} className="businessPic">
                    <p>pic</p>
                  </Col>
                  <Col xs={10} className="bizInfoCol">
                    <Row className="searchBizHdr">
                      <h4>{this.props.business.name}</h4>
                      <span className="bizDistance">0.00 mi</span>
                    </Row>
                    <Row className="bizCardInfo">
                      <Col className="bizCardInfo">
                        <Row className="bizRating">
                          <span className="ratingStars">⭐️⭐️⭐️⭐️⭐️</span>
                          <span className="ratingReviewCount">100 reviews</span>
                        </Row>
                        <Row className="bizCategoryList">
                          <span>arabic, spanish</span>
                        </Row>
                        <Row className="bizAddress">
                          <span>1334 E St SE, Washington, DC, DC 20003</span>
                        </Row>
                        <Row className="bizPhone">
                          <span>(202) 555-5555</span>
                        </Row>
                        <Row className="bizReviewSnippet">
                          <span>I LOVED this place!</span>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </li>
        );
    }

}

export default BusinessCard;