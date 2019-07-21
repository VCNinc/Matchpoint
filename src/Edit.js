import React, { Component } from 'react';

import Flag from 'react-flagkit';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faRacquet } from '@fortawesome/pro-solid-svg-icons';

import { Link, Redirect } from "react-router-dom";

import './Edit.css';

library.add(faArrowLeft, faRacquet);

class Header extends Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      redir: -1
    }
  }

  render() {
    var parent = this;

    function rmodal(e) {
      e.preventDefault();
    }

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

    function rmatch(e) {
      e.preventDefault();
      var matches = JSON.parse(localStorage.getItem("matches"));
      matches.splice(parent.props.id, 1);
      localStorage.setItem("matches", JSON.stringify(matches));

      parent.setState({
        redir: 1
      })
    }

    if(this.state.redir !== -1) {
      return (<Redirect to="/" />);
    }

    return (
      <>
        <div class={modal_class} onClick={hideModal}>
          <div class="simple-modal-dialog" onClick={nothing}>
            <h4 style={{marginTop: "-4px", marginBottom: "16px"}}>Are you sure?</h4>
            <p>If you click "confirm," this match, and all of its data, will be permanently deleted.</p>
            <Row>
              <Col xs="6">
                <Button variant="primary" onClick={rmatch} size="lg" block>Delete</Button>
              </Col>
              <Col xs="6">
                <Button variant="secondary" onClick={hideModal} size="lg" block>Cancel</Button>
              </Col>
            </Row>
          </div>
        </div>
        <Navbar variant="dark" bg="dark">
          <Nav>
            <Link to={"/match/" + this.props.id} className="nav-link">
              <FontAwesomeIcon icon="arrow-left" size="lg" />
            </Link>
          </Nav>
          <Navbar.Text>{this.props.title}</Navbar.Text>
          <Nav className="ml-auto">
            <a href="#" className="nav-link" onClick={rmatch}>
              <FontAwesomeIcon icon="trash" size="lg" />
            </a>
          </Nav>
        </Navbar>
      </>
    );    
  }
}

class MatchTable extends Component {
  render() {
    var selectors = [];
    var data = this.props.data;
    var p1 = this.props.p1;
    var p2 = this.props.p2;

    for(var i = 0; i < data.length + 2; i++) {
      selectors.push(<th></th>);
    }

    var p1d = [];
    var p2d = [];

    data.forEach((e, i) => {
      var p1score = e.score[0];
      var p2score = e.score[1];

      if(p1score > p2score) {
        p1d.push(<td key={i}><b>{p1score}</b></td>);
        p2d.push(<td key={i}>{p2score}</td>);
      } else if (p2score > p1score) {
        p1d.push(<td key={i}>{p1score}</td>);
        p2d.push(<td key={i}><b>{p2score}</b></td>);
      } else {
        p1d.push(<td key={i}>{p1score}</td>);
        p2d.push(<td key={i}>{p2score}</td>);
      }
    });

    var s1 = this.props.s1;
    if(s1 == 41) {
      s1 = "A";
    }
    var s2 = this.props.s2;
    if(s2 == 41) {
      s2 = "A";
    }

    return (
      <div className="match-table" style={{padding: "0px"}}>
        <Table className="set-table" bordered style={{tableLayout: "fixed"}}>
          <tbody>
            <tr>
              {selectors}
              <th key={i} className="selector active"><FontAwesomeIcon icon="caret-down" /><div className="select"></div></th>
            </tr>
            <tr>
              <td className="b0" colSpan="2">{p1}</td>
              {p1d}
              <td>{s1}</td>
            </tr>
            <tr>
              <td className="b0" colSpan="2">{p2}</td>
              {p2d}
              <td>{s2}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

class Edit extends Component {
  constructor() {
    super();
    this.state = {
      match: null,
      p1d: false,
      p2d: false
    }
  }

  render() {
    var parent = this;

    function save(match) {
      parent.setState({
        match: match,
        p1d: false,
        p2d: false
      });
      var matches = JSON.parse(localStorage.getItem("matches"));
      matches[id] = match;
      localStorage.setItem("matches", JSON.stringify(matches));
    }
    
    var id = this.props.match.params.id;

    if(this.state.match == null) {
      var matches = JSON.parse(localStorage.getItem("matches"));
      var match = matches[id];
      save(match);
    } else {
      var match = this.state.match;
    }

    var players = JSON.parse(localStorage.getItem("users"));
    var title = match.title;
    var p1 = match.players[0];
    var p2 = match.players[1];

    /* SCORING */

    var current_match = match;
    var current_set = current_match.sets.slice(-1)[0];
    var current_game = current_set.games.slice(-1)[0];
    var current_score = current_game.score;

    function pointp1(action, by) {
      var score1 = current_score[0];
      var score2 = current_score[1];

      if(score1 == 0) {
        score1 = 15;
      } else if (score1 == 15) {
        score1 = 30;
      } else if (score1 == 30) {
        score1 = 40;
      } else if (score1 == 40) {
        if(score2 == 41) {
          score2 = 40;
        } else if (score2 == 40) {
          score1 = 41;
        } else {
          score1 = 42;
        }
      } else if (score1 == 41) {
        score1 = 42;
      }

      match.sets[match.sets.length - 1].games[match.sets[match.sets.length - 1].games.length - 1].score = [score1, score2];
      match.sets[match.sets.length - 1].games[match.sets[match.sets.length - 1].games.length - 1].actions.push({
        "time": new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
        "type": action,
        "by": by,
        "score": [score1, score2]
      });

      if(score1 == 42) {
        toggleServer();
        match.sets[match.sets.length - 1].score[0]++;

        if(match.sets[match.sets.length - 1].score[0] >= 6 && (match.sets[match.sets.length - 1].score[0] - match.sets[match.sets.length - 1].score[1]) >= 2) {
          match.players[0].sets++;
          match.sets.push({
            "score": [0, 0],
            "games": [
                {
                    "score": [0, 0],
                    "actions": []
                }
            ]
          })
        } else {
          match.sets[match.sets.length - 1].games.push({
            "score": [0, 0],
            "actions": []
          });
        }
      }

      save(match);
    }

    function pointp2(action, by) {
      var score1 = current_score[0];
      var score2 = current_score[1];

      if(score2 == 0) {
        score2 = 15;
      } else if (score2 == 15) {
        score2 = 30;
      } else if (score2 == 30) {
        score2 = 40;
      } else if (score2 == 40) {
        if(score1 == 41) {
          score1 = 40;
        } else if (score1 == 40) {
          score2 = 41;
        } else {
          score2 = 42;
        }
      } else if (score2 == 41) {
        score2 = 42;
      }

      match.sets[match.sets.length - 1].games[match.sets[match.sets.length - 1].games.length - 1].score = [score1, score2];
      match.sets[match.sets.length - 1].games[match.sets[match.sets.length - 1].games.length - 1].actions.push({
        "time": new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
        "type": action,
        "by": by,
        "score": [score1, score2]
      });

      if(score2 == 42) {
        toggleServer();
        match.sets[match.sets.length - 1].score[1]++;

        if(match.sets[match.sets.length - 1].score[1] >= 6 && (match.sets[match.sets.length - 1].score[1] - match.sets[match.sets.length - 1].score[0]) >= 2) {
          match.players[1].sets++;
          match.sets.push({
            "score": [0, 0],
            "games": [
                {
                    "score": [0, 0],
                    "actions": []
                }
            ]
          })
        } else {
          match.sets[match.sets.length - 1].games.push({
            "score": [0, 0],
            "actions": []
          });
        }
      }

      save(match);
    }

    function p1score(e) {
      e.preventDefault();
      pointp1("score", "p1");
    }

    function p2score(e) {
      e.preventDefault();
      pointp2("score", "p2");
    }

    function p1ace(e) {
      e.preventDefault();
      pointp1("ace", "p1");
    }

    function p2ace(e) {
      e.preventDefault();
      pointp2("ace", "p2");
    }

    function p1out(e) {
      e.preventDefault();
      pointp2("out", "p1");
    }

    function p2out(e) {
      e.preventDefault();
      pointp1("out", "p2");
    }

    function p1let(e) {
      e.preventDefault();
      var score1 = current_score[0];
      var score2 = current_score[1];
      match.sets[match.sets.length - 1].games[match.sets[match.sets.length - 1].games.length - 1].actions.push({
        "time": new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
        "type": "let",
        "by": "p1",
        "score": [score1, score2]
      });
      save(match);
    }

    function p2let(e) {
      e.preventDefault();
      var score1 = current_score[0];
      var score2 = current_score[1];
      match.sets[match.sets.length - 1].games[match.sets[match.sets.length - 1].games.length - 1].actions.push({
        "time": new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
        "type": "let",
        "by": "p2",
        "score": [score1, score2]
      });
      save(match);
    }

    function p1fault(e) {
      e.preventDefault();
      var score1 = current_score[0];
      var score2 = current_score[1];
      match.sets[match.sets.length - 1].games[match.sets[match.sets.length - 1].games.length - 1].actions.push({
        "time": new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
        "type": "fault",
        "by": "p1",
        "score": [score1, score2]
      });
      save(match);
      parent.setState({
        p1d: true
      });
    }

    function p2fault(e) {
      e.preventDefault();
      var score1 = current_score[0];
      var score2 = current_score[1];
      match.sets[match.sets.length - 1].games[match.sets[match.sets.length - 1].games.length - 1].actions.push({
        "time": new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
        "type": "fault",
        "by": "p2",
        "score": [score1, score2]
      });
      save(match);
      parent.setState({
        p2d: true
      });
    }

    function p1dfault(e) {
      e.preventDefault();
      pointp2("fault", "p1");
    }

    function p2dfault(e) {
      e.preventDefault();
      pointp1("fault", "p2");
    }

    var p1f;
    if(this.state.p1d) {
      p1f = <Button variant="danger" block onClick={p1dfault}>Double Fault</Button>;
    } else {
      p1f = <Button variant="warning" block onClick={p1fault}>Fault</Button>;
    }

    var p2f;
    if(this.state.p2d) {
      p2f = <Button variant="danger" block onClick={p2dfault}>Double Fault</Button>;
    } else {
      p2f = <Button variant="warning" block onClick={p2fault}>Fault</Button>;
    }

    var p1b;
    var p2b;
    var sc;

    if(match.server == 1) {
      p1b = (<>
        <Button variant="success" size="lg" block onClick={p1score}>Score</Button>
        <Button variant="danger" size="lg" block onClick={p1out}>Out</Button>
        <div style={{height: "32px"}} />
        <Button variant="primary" block onClick={p1ace}>Ace</Button>
        <Button variant="info" block onClick={p1let}>Let</Button>
        {p1f}
      </>);
      p2b = (<>
        <Button variant="success" size="lg" block onClick={p2score}>Score</Button>
        <Button variant="danger" size="lg" block onClick={p2out}>Out</Button>
        <div style={{height: "32px"}} />
        <Button variant="light" block disabled>Ace</Button>
        <Button variant="light" block disabled>Let</Button>
        <Button variant="light" block disabled>Fault</Button>
      </>);
      sc = "server-toggle p1";
    } else {
      p1b = (<>
        <Button variant="success" size="lg" block onClick={p1score}>Score</Button>
        <Button variant="danger" size="lg" block onClick={p1out}>Out</Button>
        <div style={{height: "32px"}} />
        <Button variant="light" block disabled>Ace</Button>
        <Button variant="light" block disabled>Let</Button>
        <Button variant="light" block disabled>Fault</Button>
      </>);
      p2b = (<>
        <Button variant="success" size="lg" block onClick={p2score}>Score</Button>
        <Button variant="danger" size="lg" block onClick={p2out}>Out</Button>
        <div style={{height: "32px"}} />
        <Button variant="primary" block onClick={p2ace}>Ace</Button>
        <Button variant="info" block onClick={p2let}>Let</Button>
        {p2f}
      </>);
      sc = "server-toggle p2";
    }

    function toggleServer() {
      if(match.server == 1) {
        match.server = 2;
      } else {
        match.server = 1;
      }
      parent.setState({
        match: match
      });
      var matches = JSON.parse(localStorage.getItem("matches"));
      matches[id] = match;
      localStorage.setItem("matches", JSON.stringify(matches));
    }

    function switchServe(e) {
      e.preventDefault();
      toggleServer();
    }

    return (
      <>
        <Header title={title} id={id} />
        <div style={{height: "32px"}} />
        <Container style={{padding: "0 30px"}}>
          <Row className="has-server">
            <div className={sc} onClick={switchServe}>
              <div class="ball"><FontAwesomeIcon icon="racquet" size="lg" /></div>
            </div>
            <Col xs="6">
              <div className="player p1">
                <div className="profile" style={{backgroundImage: "url(\"" + p1.image + "\")"}}></div>
                <p className="name">{p1.name}</p>
                <p className="country text-secondary"><Flag country={p1.country.code} size="20" className="flag" /> {p1.country.name}</p>
              </div>
              <div style={{height: "32px"}} />
              <div class="actions">{p1b}</div>
            </Col>
            <Col xs="6">
              <div className="player p2">
                <div className="profile" style={{backgroundImage: "url(\"" + p2.image + "\")"}}></div>
                <p className="name">{p2.name}</p>
                <p className="country text-secondary"><Flag country={p2.country.code} size="20" className="flag" /> {p2.country.name}</p>
              </div>
              <div style={{height: "32px"}} />
              <div class="actions">{p2b}</div>
            </Col>
          </Row>
          <div style={{height: "32px"}} />
          <MatchTable data={match.sets} slide={4} p1={p1.last} p2={p2.last} s1={current_score[0]} s2={current_score[1]} />
        </Container>
      </>
    );
  }
}

export default Edit;