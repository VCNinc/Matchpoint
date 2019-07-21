import React, { Component } from 'react';

import ReactFlagsSelect from 'react-flags-select';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faCheck, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

import { Link, Redirect } from "react-router-dom";

import './User.css';
import 'react-flags-select/css/react-flags-select.css';

import {getCountryName} from './cc.js';

library.add(faArrowLeft, faCheck, faTrash, faEdit);

class Header extends Component {
  constructor() {
    super();
    this.state = {
      redir: -1
    }
  }

  render() {
    var parent = this;

    function rplayer(e) {
      e.preventDefault();
      var players = JSON.parse(localStorage.getItem("users"));
      players.splice(parent.props.id, 1);
      localStorage.setItem("users", JSON.stringify(players));

      parent.setState({
        redir: 1
      })
    }

    if(this.state.redir !== -1) {
      return (<Redirect to="/users" />);
    }

    return (
      <Navbar variant="dark" bg="dark">
        <Nav>
          <Link to="/users" className="nav-link">
            <FontAwesomeIcon icon="arrow-left" size="lg" />
          </Link>
        </Nav>
        <Navbar.Text>Edit Player</Navbar.Text>
        <Nav className="ml-auto">
          <a href="#" className="nav-link" onClick={rplayer}>
            <FontAwesomeIcon icon="trash" size="lg" />
          </a>
        </Nav>
      </Navbar>
    );    
  }
}

class User extends Component {
  constructor() {
    super();

    this.state = {
      "image": null,
      "name": null,
      "country": null,
      "cc": null,
      "modal": false,
      "last": null
    };
  }
  render() {
    var players = JSON.parse(localStorage.getItem("users"));
    var id = this.props.match.params.id;
    var player = players[id];
    var parent = this;

    if(this.state.name === null) {
      this.setState({
        image: player.image,
        name: player.name,
        country: player.country.name,
        cc: player.country.code,
        last: player.last
      });
    }

    var urls = [
      "player-red.png",
      "player-pink.png",
      "player-purple.png",
      "player-deep-purple.png",
      "player-indigo.png",
      "player-blue.png",
      "player-light-blue.png",
      "player-cyan.png",
      "player-teal.png",
      "player-green.png",
      "player-light-green.png",
      "player-lime.png",
      "player-yellow.png",
      "player-amber.png",
      "player-orange.png",
      "player-deep-orange.png",
      "player-brown.png",
      "player-gray.png",
      "player-blue-gray.png",

      "racket-light.png",
      "rackets-light.png",
      "standing-light.png",
      "ready-light.png",
      "forehand-light.png",
      "player-light.png",
      "happy-light.png",
      "team-light.png",
      "winner-light.png",
      "server-light.png",
      "backhand-light.png",
      "twohand-light.png",
      "accident-light.png",
      "hurt-light.png",
      "angry-light.png",

      "racket-dark.png",
      "rackets-dark.png",
      "standing-dark.png",
      "ready-dark.png",
      "forehand-dark.png",
      "player-dark.png",
      "happy-dark.png",
      "team-dark.png",
      "winner-dark.png",
      "server-dark.png",
      "backhand-dark.png",
      "twohand-dark.png",
      "accident-dark.png",
      "hurt-dark.png",
      "angry-dark.png",

      "federer.jpg",
      "nadal.jpg",
      "djokovic.jpg",
      "osaka.jpg",
      "williams.jpg"
    ];

    var images = [];

    images.push(<div className="player-img active" style={{backgroundImage: "url(\"" + this.state.image + "\")"}}><div class="check"><FontAwesomeIcon icon="check" size="sm" /></div></div>);

    function updateProfile(to) {
      return () => {
        var players = JSON.parse(localStorage.getItem("users"));
        players[id].image = to;
        localStorage.setItem("users", JSON.stringify(players));
        parent.setState({image: to, modal: false});
      }
    }

    function updateName(e) {
      if(e.target.value !== null) {
        var players = JSON.parse(localStorage.getItem("users"));
        players[id].name = e.target.value;
        players[id].last = e.target.value.split(" ").splice(-1).join(" "); 
        localStorage.setItem("users", JSON.stringify(players));
        parent.setState({
          name: players[id].name,
          last: players[id].last
        })
      }
    }

    function updateLast(e) {
      if(e.target.value !== null) {
        var players = JSON.parse(localStorage.getItem("users"));
        players[id].last = e.target.value; 
        localStorage.setItem("users", JSON.stringify(players));
        parent.setState({
          last: e.target.value
        });
      }
    }

    function updateCountry(cc) {
      var players = JSON.parse(localStorage.getItem("users"));
      players[id].country.code = cc;
      players[id].country.name = getCountryName(cc);
      localStorage.setItem("users", JSON.stringify(players));
    }

    urls.forEach((e, i) => {
      if(e !== this.state.image) {
        images.push(<div className="player-img" style={{backgroundImage: "url(\"" + e + "\")"}} onClick={updateProfile(e)} />);
      }
    });

    var modal_class;
    if(this.state.modal) {
      modal_class = "simple-modal in";
    } else {
      modal_class = "simple-modal";
    }

    function hideModal(e) {
      e.preventDefault();
      parent.setState({
        modal: false
      });
    }

    function showModal(e) {
      e.preventDefault();
      parent.setState({
        modal: true
      });
    }

    function nothing(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    return (
      <>
        <div class={modal_class} onClick={hideModal}>
          <div class="simple-modal-dialog" onClick={nothing}>
            <h4 style={{marginTop: "-4px", marginBottom: "16px"}}>Choose an image</h4>
            <div class="img-select">
              {images}
            </div>
          </div>
        </div>
        <Header id={id} />
        <Container>
          <div style={{height: "16px"}} />
          <Form>
            <Form.Group className="img-select" style={{marginBottom: "0px"}} >
              <Form.Label>
                <span className="text-secondary">Image</span>
              </Form.Label>
              <div style={{marginBottom: "12px"}}>
                <div className="player-img" style={{backgroundImage: "url(\"" + this.state.image + "\")", width: "100px"}}></div>
                <div className="img-data">
                  <p>{this.state.image}</p>
                  <Button variant="primary" onClick={showModal}><FontAwesomeIcon icon="edit" /> &nbsp;Change</Button>
                </div>
              </div>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={4}>
                <span className="text-secondary">Full Name</span>
              </Form.Label>
              <Col sm={8} className="text-right">
                <Form.Control type="text" placeholder="eg. Roger Federer" defaultValue={this.state.name} onChange={updateName} id="name" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={4}>
                <span className="text-secondary">Short Name</span>
              </Form.Label>
              <Col sm={8} className="text-right">
                <Form.Control type="text" placeholder="eg. Federer" value={this.state.last} onChange={updateLast} id="last" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={4}>
                <span className="text-secondary">Country</span>
              </Form.Label>
              <Col sm={8} className="text-right">
                <ReactFlagsSelect className="form-control" defaultCountry={player.country.code} searchable={true} onSelect={updateCountry} />
              </Col>
            </Form.Group>
          </Form>
        </Container>
      </>
    );
  }
}

export default User;