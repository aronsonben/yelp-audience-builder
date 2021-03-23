import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Container, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import './App.css';

class SearchForm extends Component {
    constructor(props) {
      super(props);
    }

    render() {
        let { searchCategory, categories, address, yab, areaChange, categoryChange, fullSearch, searchBusinesses, clearAllLists } = this.props;

        return (
					<Form className="yelpSearchForm">
						<Row form>
							<Col sm={5}>
								<FormGroup>
									<Label for="categorySearch">Find</Label>
                  <Input type="select" name="categorySearch" id="categorySearch" placeholder="Afghan, Hawaiian, Spanish..."
                    value={searchCategory} onChange={categoryChange}>
											{categories.map((category) => {
													// let title = Object.keys(category)[0];
													return (<option key={category} value={category}>{category}</option>);
											})}
									</Input>
								</FormGroup>
							</Col>
							<Col sm={5}>
								<FormGroup>
									<Label for="addressSearch">Near</Label>
									<Input type="text" name="addressSearch" id="addressSearch" placeholder="1334 E St SE, Washington, D.C. 20003" 
											value={address} onChange={areaChange}></Input>
								</FormGroup>
							</Col>
							<Col sm={2}>
								<Button id="bizSearchBtn" className="yab_btn" onClick={searchBusinesses}>Search</Button>				
							</Col>
						</Row>
						<Button id="searchBtn" className="yab_btn" onClick={fullSearch} style={{"display": !yab ? "none" : ""}}>Search (users & business)</Button>
						<Button id="bizSearchBtn" className="yab_btn" onClick={searchBusinesses} style={{"display": !yab ? "none" : ""}}>Find Businesses</Button>
						<Button id="clearListsBtn" className="yab_btn" onClick={() => clearAllLists()}>Clear All</Button>
					</Form>
        );
    }

}

export default SearchForm;