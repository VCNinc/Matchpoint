import React, { Component } from 'react';

import Flag from 'react-flagkit';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faCheck, faPlayCircle, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/pro-solid-svg-icons';

import { Link, Redirect } from "react-router-dom";

import default_users from './users-default';

import './New.css';

import grass from './grass.jpg';
import carpet from './carpet.jpg';
import clay from './clay.jpg';
import concrete from './concrete.jpg';

import empty from './matches/blank';

library.add(faArrowLeft, faPencil, faCheck, faPlayCircle, faFileUpload);

class Header extends Component {
  render() {
    return (
      <Navbar variant="dark" bg="dark">
        <Nav>
          <Link to="/" className="nav-link">
            <FontAwesomeIcon icon="arrow-left" size="lg" />
          </Link>
        </Nav>
        <Navbar.Text>New Match</Navbar.Text>
      </Navbar>
    );    
  }
}

class Profile extends Component {
  render() {
    var data = this.props.data;

    return (
      <Card className="player-card" style={{height: "90px", marginBottom: "8px"}}>
        <div className="player-img" style={{backgroundImage: "url(\"" + data.image + "\")", width: "60px", height: "60px"}} />
        <div className="player-name" style={{left: "100px"}}>
          <Card.Title>{data.name}</Card.Title>
          <p className="country text-secondary"><Flag country={data.country.code} size="20" className="flag" /> {data.country.name}</p>
        </div>
      </Card>
    );
  }
}

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      surface: "Grass",
      sets: 3,
      firstServe: 1,
      p1: 0,
      p2: 0,
      modal: 0,
      val: "Default v. Default " + (new Date().getMonth() + 1) + "/" + (new Date().getDate()),
      redir: -1
    };
  }

  render() {
    var parent = this;

    var surfaces = [];
    var sets = [];
    var serves = [];

    var players = JSON.parse(localStorage.getItem("users"));
    var p1 = players[this.state.p1];
    var p2 = players[this.state.p2];

    function nmatch(e) {
      e.preventDefault();
      var matches = JSON.parse(localStorage.getItem("matches"));

      var new_match = empty;
      new_match.players = [p1, p2];
      new_match.players[0].sets = 0;
      new_match.players[1].sets = 0;
      new_match.title = parent.state.val;
      new_match.server = parent.state.firstServe;

      matches.push(new_match);
      localStorage.setItem("matches", JSON.stringify(matches));
      var id = matches.length - 1;

      parent.setState({
        redir: id
      })
    }

    if(this.state.redir !== -1) {
      return (<Redirect to={"/edit/" + this.state.redir} />);
    }

    function setSurfaceHard() {
      parent.setState({surface: "Hard"});
    }

    function setSurfaceGrass() {
      parent.setState({surface: "Grass"});
    }

    function setSurfaceClay() {
      parent.setState({surface: "Clay"});
    }

    function setSurfaceCarpet() {
      parent.setState({surface: "Carpet"});
    }

    function setSets1() {
      parent.setState({sets: 1});
    }

    function setSets3() {
      parent.setState({sets: 3});
    }

    function setSets5() {
      parent.setState({sets: 5});
    }

    function setP1() {
      parent.setState({firstServe: 1});
    }

    function setP2() {
      parent.setState({firstServe: 2});
    }

    function hideModal(e) {
      e.preventDefault();
      parent.setState({
        modal: 0
      });
    }

    function showModal1(e) {
      e.preventDefault();
      parent.setState({
        modal: 1
      });
    }

    function showModal2(e) {
      e.preventDefault();
      parent.setState({
        modal: 2
      });
    }

    function nothing(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    var players = JSON.parse(localStorage.getItem("users"));
    var profiles = [];

    function setPlayer(num) {
      return (e) => {
        e.preventDefault();

        var p1 = players[parent.state.p1].last;
        var p2 = players[parent.state.p2].last;

        if(parent.state.modal == 1) {
          parent.setState({
            modal: 0,
            p1: num
          });
          p1 = players[num].last;
        } else if(parent.state.modal == 2) {
          parent.setState({
            modal: 0,
            p2: num
          });
          p2 = players[num].last;
        }

        var nn = p1 + " v. " + p2 + " " + (new Date().getMonth() + 1) + "/" + (new Date().getDate());
        parent.setState({
          val: nn
        });
      }
    }

    if(this.state.firstServe == 1) {
      serves.push(
        <div className="c-option bg active" name="P1">
          <span>P1</span>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
      var serveText = p1.last;
    } else {
      serves.push(
        <div onClick={setP1} className="c-option bg" name="P1">
          <span>P1</span>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    }

    if(this.state.firstServe == 2) {
      serves.push(
        <div className="c-option bg active" name="P2">
          <span>P2</span>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
      var serveText = p2.last;
    } else {
      serves.push(
        <div onClick={setP2} className="c-option bg" name="P2">
          <span>P2</span>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    }

    if(this.state.sets == 1) {
      sets.push(
        <div className="c-option bg active" name="1">
          <span>1</span>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
      var setText = "1 Set";
    } else {
      sets.push(
        <div onClick={setSets1} className="c-option bg" name="1">
          <span>1</span>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    }

    if(this.state.sets == 3) {
      sets.push(
        <div className="c-option bg active" name="3">
          <span>3</span>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
      var setText = "3 Sets";
    } else {
      sets.push(
        <div onClick={setSets3} className="c-option bg" name="3">
          <span>3</span>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    }

    if(this.state.sets == 5) {
      sets.push(
        <div className="c-option bg active" name="5">
          <span>5</span>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
      var setText = "5 Sets";
    } else {
      sets.push(
        <div onClick={setSets5} className="c-option bg" name="5">
          <span>5</span>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    }

    if(this.state.surface == "Hard") {
      surfaces.push(
        <div className="c-option active" name="Hard" style={{backgroundImage: `url(${concrete})`, "background-size": "100%"}}>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    } else {
      surfaces.push(
        <div onClick={setSurfaceHard} className="c-option" name="Hard" style={{backgroundImage: `url(${concrete})`, "background-size": "100%"}}>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    }

    if(this.state.surface == "Clay") {
      surfaces.push(
        <div className="c-option active" name="Clay" style={{backgroundImage: `url(${clay})`, "background-size": "1000%"}}>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    } else {
      surfaces.push(
        <div onClick={setSurfaceClay} className="c-option" name="Clay" style={{backgroundImage: `url(${clay})`, "background-size": "1000%"}}>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    }

    if(this.state.surface == "Carpet") {
      surfaces.push(
        <div className="c-option active" name="Carpet" style={{backgroundImage: `url(${carpet})`, "background-size": "1200%"}}>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    } else {
      surfaces.push(
        <div onClick={setSurfaceCarpet} className="c-option" name="Carpet" style={{backgroundImage: `url(${carpet})`, "background-size": "1200%"}}>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    }

    if(this.state.surface == "Grass") {
      surfaces.push(
        <div className="c-option active" name="Grass" style={{backgroundImage: `url(${grass})`, "background-size": "800%"}}>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    } else {
      surfaces.push(
        <div onClick={setSurfaceGrass} className="c-option" name="Grass" style={{backgroundImage: `url(${grass})`, "background-size": "800%"}}>
          <div class="selected"><FontAwesomeIcon icon="check" /></div>
        </div>);
    }

    var modal_class;
    if(this.state.modal > 0) {
      modal_class = "simple-modal in";
    } else {
      modal_class = "simple-modal";
    }

    if(localStorage.getItem("users") === null) {
      localStorage.setItem("users", JSON.stringify(default_users));
    }

    players.forEach((e, i) => {
      profiles.push(<div onClick={setPlayer(i)} key={i}><Profile data={e} id={i} /></div>);
    });

    function namechx(e) {
      parent.setState({
        val: e.target.value
      });
    }

    return (
      <>
        <div class={modal_class} onClick={hideModal}>
          <div class="simple-modal-dialog" onClick={nothing}>
            <h4 style={{marginTop: "-4px", marginBottom: "16px"}}>Choose a player</h4>
            {profiles}
            <div style={{marginTop: "-8px"}} />
          </div>
        </div>
        <Jumbotron>
          <div className="player p1">
            <div className="profile" style={{backgroundImage: "url(\"" + p1.image + "\")"}}>
              <div className="winner edit" onClick={showModal1}><FontAwesomeIcon icon="pencil" /></div>
            </div>
            <p className="name">{p1.name}</p>
            <p className="country text-secondary"><Flag country={p1.country.code} size="20" className="flag" /> {p1.country.name}</p>
          </div>
          <div className="vs">
            <div className="vs-text">vs</div>
            <div className="vs-line"></div>
          </div>
          <div className="player p2">
            <div className="profile" style={{backgroundImage: "url(\"" + p2.image + "\")"}}>
              <div className="winner edit" onClick={showModal2}><FontAwesomeIcon icon="pencil" /></div>
            </div>
            <p className="name">{p2.name}</p>
            <p className="country text-secondary"><Flag country={p2.country.code} size="20" className="flag" /> {p2.country.name}</p>
          </div>
        </Jumbotron>
        <Container>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={4}>
                <span className="text-secondary">Match Title</span>
              </Form.Label>
              <Col sm={8} className="text-right">
                <Form.Control type="text" placeholder="eg. 2008 Wimbledon Finals" value={this.state.val} onChange={namechx} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column xs={3}>
                <span className="text-secondary">Surface</span><br />
                {this.state.surface}
              </Form.Label>
              <Col xs={9} className="text-right">
                {surfaces}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column xs={4}>
                <span className="text-secondary">First Serve</span><br />
                {serveText}
              </Form.Label>
              <Col xs={8} className="text-right">
                {serves}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column xs={3}>
                <span className="text-secondary">Sets</span><br />
                {setText}
              </Form.Label>
              <Col xs={9} className="text-right">
                {sets}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={4}>
                <span className="text-secondary">Data Source</span>
              </Form.Label>
              <Col sm={8} className="text-right">
                <Button variant="primary" block={true} onClick={nmatch}>
                  <FontAwesomeIcon icon="play-circle" /> &nbsp;Start Playing
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Container>
      </>
    );
  }
}

class New extends Component {
  render() {
    return (
      <>
        <Header />
        <Settings />
      </>
    );
  }
}

export default New;