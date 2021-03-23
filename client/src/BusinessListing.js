import React, { Component, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Container, Row, Col } from 'reactstrap';
import BusinessCard from './BusinessCard';
import './App.css';
import { render } from 'react-dom';

function BusinessListing(props) {

  function renderBusinesses() {
    if(props.businessesFound < 0) {
      return <span>Press Search</span>
    } 
    if(props.businessesFound === 0) {
      return <span>Nothing...</span>
    } 
    const bizEle = props.businesses.map((biz) => 
      <li key={biz.id}>{biz.name}</li>
    );
    const businessCardEle = props.businesses.map((biz) => 
      <BusinessCard business={biz}/>
    );
    return <ol>{businessCardEle}</ol>
  }

  return (
    <Container className="listing">
      <Row>
        <Col>
          <h4>____ Restaurants near ____</h4>
          <p>Results displayed: {props.businessesFound}</p>
        </Col>
      </Row>
      <Container className="bizList">
          {renderBusinesses()}
      </Container>
    </Container>
  );
}

export default BusinessListing;