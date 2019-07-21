import React, { Component } from 'react';

import Flag from 'react-flagkit';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/pro-solid-svg-icons';

import { Link, Redirect } from "react-router-dom";

import default_users from './users-default';

import './Users.css';

library.add(faArrowLeft, faPencil, faPlus);

class Header extends Component {
  constructor() {
    super();
    this.state = {
      redir: -1
    }
  }

  render() {
    var parent = this;

    function nplayer(e) {
      e.preventDefault();
      var players = JSON.parse(localStorage.getItem("users"));
      players.push({
        "name": "New Player",
        "last": "Player",
        "image": "player-gray.png",
        "country": {
            "code": "US",
            "name": "United States"
        }
      });
      localStorage.setItem("users", JSON.stringify(players));
      var id = players.length - 1;

      parent.setState({
        redir: id
      })
    }

    if(this.state.redir !== -1) {
      return (<Redirect to={"/users/" + this.state.redir} />);
    }

    return (
      <Navbar variant="dark" bg="dark" fixed="top">
        <Nav>
          <Link to="/" className="nav-link">
            <FontAwesomeIcon icon="arrow-left" size="lg" />
          </Link>
        </Nav>
        <Navbar.Text>Player Profiles</Navbar.Text>
        <Nav className="ml-auto">
          <a href="#" className="nav-link" onClick={nplayer}>
            <FontAwesomeIcon icon="plus" size="lg" />
          </a>
        </Nav>
      </Navbar>
    );    
  }
}

class Profile extends Component {
  render() {
    var data = this.props.data;

    return (
      <Card className="player-card">
        <div className="player-img" style={{backgroundImage: "url(\"" + data.image + "\")"}} />
        <div className="player-name">
          <Card.Title>{data.name}</Card.Title>
          <p className="country text-secondary"><Flag country={data.country.code} size="20" className="flag" /> {data.country.name}</p>
        </div>
        <Link to={"/users/" + this.props.id} className="edit"><FontAwesomeIcon icon="pencil" /></Link>
      </Card>
    );
  }
}

class Users extends Component {
  render() {
    if(localStorage.getItem("users") === null || localStorage.getItem("users") === "[]") {
      localStorage.setItem("users", JSON.stringify(default_users));
    }

    var players = JSON.parse(localStorage.getItem("users"));
    var profiles = [];

    players.forEach((e, i) => {
      profiles.push(<Profile data={e} id={i} key={i} />);
    });

    return (
      <>
        <Header />
        <Container style={{padding: "15px 30px"}}>
          <div style={{height: '72px'}} />
          {profiles}
        </Container>
      </>
    );
  }
}

export default Users;