import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import YelpSearch from './YelpSearch';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarToggler,
  NavItem,
  NavLink,
  Collapse
} from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleNavbar() {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    return (
      <div className="App">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">Yelp DiscoCat</NavbarBrand>
          <NavItem><i>Discover new cuisines!</i></NavItem>
          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <NavItem>
              <NavLink href="/">Category List</NavLink>
            </NavItem>
          </Collapse>
        </Navbar>
        <YelpSearch/>
      </div>
    );
  }
}

export default App;