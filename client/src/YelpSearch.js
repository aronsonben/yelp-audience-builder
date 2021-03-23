import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Container, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import './App.css';
import axios from 'axios';
import PlacesAutocomplete from 'react-places-autocomplete';
import LocationSearchInput from './LocationSearchInput';
import BusinessListing from './BusinessListing';
import UsersListing from './UserListing';
import BusinessCard from './BusinessCard';
import SearchForm from './SearchForm';




class YelpSearch extends Component {
  constructor(props) {
      super(props);
      this.state = {
          searchCategory: null,
          categories: [],
          aliases: [],
          categoryObjects: [],
          address: '',
          businesses: [],
          businessesFound: -1,
          users: [],
          usersFound: -1,
          yab: false,         // true if searching for users
      };
      this.categoryChange = this.categoryChange.bind(this);
      this.areaChange = this.areaChange.bind(this);
      this.toggleYab = this.toggleYab.bind(this);
      this.renderBusinesses = this.renderBusinesses.bind(this);
  }

  componentDidMount() {
    axios.get('/categories/f')
      .then(response => {
        console.log(response);
        let categoryMap = response.data["categoryMap"][0];
        this.setState({
            categories: response.data["categories"],
            aliases: response.data["aliases"],
            categoryObjects: categoryMap
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  categoryChange(evt) {
    console.log("changing category");
    console.log(evt.target.value);
    this.setState({searchCategory: evt.target.value});
  }  
  
	areaChange(evt) {
    this.setState({address: evt.target.value});
  }
	
	renderBusinesses() {
    console.log("hey1")
    if(this.state.businessesFound < 0) {
      console.log("press search")
      return <span>Press Search</span>
    } 
    if(this.state.businessesFound === 0) {
      console.log("nothing...")
      return <span>Nothing...</span>
    } 
    console.log(this.state.businesses);
    const bizEle = this.state.businesses.map((biz) => 
      <li key={biz.id}>{biz.name}</li>
    );
    const businessCardEle = this.state.businesses.map((biz) => 
      <BusinessCard business={biz}/>
    );
    console.log("returning..")
    console.log(bizEle);
    return <ul>{bizEle}</ul>
  }
    
  renderUsers() {
    if(this.state.usersFound < 0) {
      return <span>Press Search</span>
		} 
    if(this.state.usersFound === 0) {
			return <span>Nothing...</span>
		} 
		const userEle = this.state.users.map((usr) => 
			<li key={usr.id}>{usr.name} -- <span role="img" aria-label="star-rating">⭐️</span>{usr.rating} ({usr.business})</li>
		);
		return <ul>{userEle}</ul>
  }

  clearAllList() {
      this.setState({
          businesses: [],
          businessesFound: -1,
          users: [],
          usersFound: -1
      });    
  }

  searchBusinesses() {
    let category = this.state.searchCategory;
    // let category = document.getElementById("categorySearch").value;
    let alias = this.state.categoryObjects[category];
    let addr = this.state.address;
    console.log("attempting a search for: " + alias + " at address: " + addr);
    axios.get('/search/business', { 
        params: {
            'category': alias,
            'address': addr
        }
      })
      .then(response => {
        console.log("/search is responding");
        console.log(response);
        console.log(response.data.businesses)
        this.setState({
          businesses: response.data.businesses,
          businessesFound: response.data.businesses.length
        });
      })
      .catch(error => {
          console.log(error);
      }
    );
  }

  fullSearch() {
      let category = document.getElementById("categorySearch").value;
      let alias = this.state.categoryObjects[category];
      let addr = this.state.address;
      console.log("attempting a search for: " + alias + " at address: " + addr);
      axios.get('/search/users', 
          { 
              params: {
                  'category': alias,
                  'address': addr
              }
          }).then(response => {
              console.log("/search is responding");
              console.log(response);
      this.setState({
        businesses: response.data.businesses,
                  businessesFound: response.data.businesses.length,
                  users: response.data.users,
                  usersFound: response.data.users.length
      });
          })
          .catch(error => {
              console.log(error);
          });
  }

  toggleYab() {
      this.setState({yab: !this.state.yab});
  }

  render() {
      return (
          <Container className="yelpSearchContainer">
              <SearchForm 
                searchCategory = {this.state.searchCategory}
                categories = {this.state.categories}
                address = {this.state.address}
                yab = {this.state.yab}
                areaChange = {() => this.areaChange()}
                categoryChange = {() => this.categoryChange()}
                fullSearch = {() => this.fullSearch()}
                searchBusinesses = {() => this.searchBusinesses()}
                clearAll = {() => this.clearAllLists()}
              />
              <Button outline color="secondary" id="catListBtn" className="adminBtn" onClick={() => console.log(this.state.categoryObjects)}>Category List</Button>
              <Button outline color="secondary" id="yabSwitch" className="adminBtn" onClick={() => this.toggleYab()}>Toggle yab</Button>
              <hr></hr>
              <BusinessListing 
                businesses={this.state.businesses}
                businessesFound={this.state.businessesFound}
              />
              <UsersListing
                yab={this.state.yab}
                usersFound={this.state.usersFound}
                renderUsers={() => this.renderUsers()}
              />
          </Container>
      );
  }

}

export default YelpSearch;