import React, { Component } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Link } from "react-router-dom";

import './Home.css';
import logo from './logo.png';

import wimbledon_2008 from './matches/2008_wimbledon_final_nadal_vs_federer';

library.add(faUsers, faPlus);

class Header extends Component {
  render() {
    return (
      <Navbar variant="dark" bg="dark" fixed="top">
        <Nav>
          <Link to="/users" className="nav-link">
            <FontAwesomeIcon icon="users" size="lg" />
          </Link>
        </Nav>
        <Navbar.Brand>
          <img
            src={logo}
            height="30"
            className="d-inline-block align-top"
            alt="Matchpoint" />
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Link to="/new" className="nav-link">
            <FontAwesomeIcon icon="plus" size="lg" />
          </Link>
        </Nav>
      </Navbar>
    );
  }
}

class Players extends Component {
  render() {
    var p1 = this.props.players[0];
    var p2 = this.props.players[1];

    var p1w;
    if(p1.winner) {
      p1w = <div className="winner"><FontAwesomeIcon icon="trophy" size="lg" /></div>;
    } else {
      p1w = [];
    }

    var p2w;
    if(p2.winner) {
      p2w = <div className="winner"><FontAwesomeIcon icon="trophy" size="lg" /></div>;
    } else {
      p2w = [];
    }

    var p1c;
    if(p1.loser) {
      p1c = "player p1 loser";
    } else {
      p1c = "player p1";
    }

    var p2c;
    if(p2.loser) {
      p2c = "player p2 loser";
    } else {
      p2c = "player p2";
    }

    return (
      <Jumbotron className="mod">
        <div className={p1c}>
          <div className="profile" style={{backgroundImage: "url(\"" + p1.image + "\")"}}>
            {p1w}
            <p className="score">{p1.sets}</p>
          </div>
          <p className="name">{p1.name}</p>
        </div>
        <div className="vs">
          <div className="vs-text">vs</div>
          <div className="vs-line"></div>
        </div>
        <div className={p2c}>
          <div className="profile" style={{backgroundImage: "url(\"" + p2.image + "\")"}}>
            {p2w}
            <p className="score">{p2.sets}</p>
          </div>
          <p className="name">{p2.name}</p>
        </div>
      </Jumbotron>
    );
  }
}

class Match extends Component {
  render() {
    var data = this.props.data;

    return (
      <Card className="match-card">
        <Card.Body>
          <Card.Title>{data.title}</Card.Title>
          <Players players={data.players} />
        </Card.Body>
      </Card>
    );
  }
}

class Matches extends Component {
  render() {
    var matches = [];

    this.props.data.forEach((e, i) => {
      matches.push(<Link to={"/match/" + i}>
        <Match key={i} data={e} />
      </Link>);
    });

    return (
      <Container style={{padding: "15px 30px"}}>
        <h4>Recent Matches</h4>
        {matches}
      </Container>
    );
  }
}

class Home extends Component {
  render() {
    var dflt = [wimbledon_2008];


    if(localStorage.getItem("matches") === null || localStorage.getItem("matches") === "[]") {
      localStorage.setItem("matches", JSON.stringify(dflt));
    }

    var matches = JSON.parse(localStorage.getItem("matches"));
    return (
      <div className="home">
        <Header />
        <div style={{height: '72px'}} />
        <Matches data={matches} />
      </div>
    );
  }
}

export default Home;