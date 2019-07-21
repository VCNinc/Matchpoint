import React, { Component } from 'react';

import Flag from 'react-flagkit';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';

import SwipeableViews from 'react-swipeable-views';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faTrophy, faChevronRight, faChevronLeft, faCheck, faCaretDown, faEdit } from '@fortawesome/free-solid-svg-icons';

import { Link } from "react-router-dom";

import './Match.css';

library.add(faArrowLeft, faTrophy, faChevronRight, faChevronLeft, faCheck, faCaretDown, faEdit);

class Header extends Component {
  render() {
    return (
      <Navbar variant="dark" bg="dark">
        <Nav>
          <Link to="/" className="nav-link">
            <FontAwesomeIcon icon="arrow-left" size="lg" />
          </Link>
        </Nav>
        <Navbar.Text>{this.props.title}</Navbar.Text>
        <Nav className="ml-auto">
          <Link to={"/edit/" + this.props.id} className="nav-link">
            <FontAwesomeIcon icon="edit" size="lg" />
          </Link>
        </Nav>
      </Navbar>
    );    
  }
}

class Overview extends Component {
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
      <Jumbotron>
        <div className={p1c}>
          <div className="profile" style={{backgroundImage: "url(\"" + p1.image + "\")"}}>
            {p1w}
            <p className="score">{p1.sets}</p>
          </div>
          <p className="name">{p1.name}</p>
          <p className="country text-secondary"><Flag country={p1.country.code} size="20" className="flag" /> {p1.country.name}</p>
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
          <p className="country text-secondary"><Flag country={p2.country.code} size="20" className="flag" /> {p2.country.name}</p>
        </div>
      </Jumbotron>
    );
  }
}

class MatchTable extends Component {
  render() {
    var selectors = [];
    var data = this.props.data;
    var p1 = this.props.p1;
    var p2 = this.props.p2;

    for(var i = 0; i < data.length; i++) {
      if(i === this.props.slide) {
        selectors.push(<th key={i} className="selector active"><FontAwesomeIcon icon="caret-down" /><div className="select"></div></th>);
      } else {
        selectors.push(<th key={i} className="selector"><FontAwesomeIcon icon="caret-down" /><div className="select"></div></th>);
      }
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

    return (
      <div className="match-table">
        <Table className="set-table" bordered>
          <tbody>
            <tr>
              <th></th>
              {selectors}
            </tr>
            <tr>
              <td className="b0">{p1}</td>
              {p1d}
            </tr>
            <tr>
              <td className="b0">{p2}</td>
              {p2d}
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

class SetTable extends Component {
  render() {
    var data = this.props.data;

    var headers = [];
    var p1rows = [];
    var p2rows = [];

    data.forEach((e, i) => {
      headers.push(<th key={i}>{i + 1}</th>);
      if(e.score[0] === 42) {
        p1rows.push(<td key={i}><FontAwesomeIcon icon="check" size="sm" /></td>);
      } else {
        p1rows.push(<td key={i}>{e.score[0]}</td>);
      }

      if(e.score[1] === 42) {
        p2rows.push(<td key={i}><FontAwesomeIcon icon="check" size="sm" /></td>);
      } else {
        p2rows.push(<td key={i}>{e.score[1]}</td>);
      }
    });

    return (
      <Table className="set-table" bordered>
        <thead>
          <tr>
            <th></th>
            {headers}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{this.props.p1}</td>
            {p1rows}
          </tr>
          <tr>
            <td>{this.props.p2}</td>
            {p2rows}
          </tr>
        </tbody>
      </Table>
    );
  }
}

class Game extends Component {
  render() {
    var data = this.props.data;
    var actions = [];

    data.actions.forEach((e, i) => {
      var player;
      if(e.by === "p1") {
        player = this.props.p1;
      } else if (e.by === "p2") {
        player = this.props.p2;
      } else {
        player = "";
      }

      var variant;
      if(e.type === "score") {
        variant = "success";
      } else if (e.type === "out") {
        variant = "danger";
      } else if (e.type === "let") {
        variant = "info";
      } else if (e.type === "fault") {
        variant = "warning";
      } else if (e.type === "ace") {
        variant = "primary";
      } else {
        variant = "secondary";
      }

      var score1;
      if(e.score[0] === 42) {
        score1 = (<FontAwesomeIcon icon="check" size="sm" />);
      } else if (e.score[0] === 41) {
        score1 = "A";
      } else {
        score1 = e.score[0];
      }

      var score2;
      if(e.score[1] === 42) {
        score2 = (<FontAwesomeIcon icon="check" size="sm" />);
      } else if (e.score[1] === 41) {
        score2 = "A";
      } else {
        score2 = e.score[1];
      }

      actions.push(
        <div className="card-text" key={i}>
          {e.time} &nbsp;&ndash;&nbsp; <Badge variant={variant}>{e.type}</Badge> {player}
          <Table className="set-table game-table" bordered>
            <tbody>
              <tr>
                <th>{score1}</th>
                <th>{score2}</th>
              </tr>
            </tbody>
          </Table>
        </div>
      );
    });

    return (
      <>
        <small><b><i>Game {this.props.number + 1}</i></b></small>
        <Table className="set-table game-table" bordered>
          <tbody>
            <tr>
              <td>{this.props.p1}</td>
              <th>{this.props.scores[0]}</th>
            </tr>
            <tr>
              <td>{this.props.p2}</td>
              <th>{this.props.scores[1]}</th>
            </tr>
          </tbody>
        </Table>
        {actions}
      </>
    );
  }
}

class Set extends Component {
  render() {
    var data = this.props.data;
    var games = [];

    var scores = [0, 0];

    data.games.forEach((e, i) => {
      if(e.score[0] > e.score[1]) {
        scores[0]++;
      }

      if(e.score[0] < e.score[1]) {
        scores[1]++;
      }

      games.push(<Game key={i * 2} data={e} number={i} scores={[scores[0], scores[1]]} p1={this.props.p1} p2={this.props.p2} />);
      
      if(i !== (data.games.length - 1)) {
        games.push(<div key={i * 2 + 1} style={{height: "32px"}}></div>);
      }
    });

    return (
      <Card className="set-card">
        <Card.Body>
          <Card.Title>Set {this.props.number + 1}</Card.Title>
          <SetTable data={data.games} p1={this.props.p1} p2={this.props.p2} />

          <div className="scrollable">
            {games}
          </div>
        </Card.Body>
      </Card>
    );
  }
}

class Sets extends Component {
  constructor() {
    super();
    this.state = {slide: 0};
  }

  render() {
    var parent = this;
    var slides = this.props.values.length;
    var data = this.props.values;

    function nothing(e) {
      e.preventDefault();
    }

    function update(index) {
      parent.setState({slide: index});
    }

    function prev(e) {
      e.preventDefault();
      parent.setState({slide: parent.state.slide - 1});
    }

    function next(e) {
      e.preventDefault();
      parent.setState({slide: parent.state.slide + 1});
    }

    var nextIcon;
    if(this.state.slide === slides - 1) {
      nextIcon = <a href="#" className="next-icon disabled" onClick={nothing}><FontAwesomeIcon icon="chevron-right" size="lg" /></a>;
    } else {
      nextIcon = <a href="#" className="next-icon" onClick={next}><FontAwesomeIcon icon="chevron-right" size="lg" /></a>;
    }

    var prevIcon;
    if(this.state.slide === 0) {
      prevIcon = <a href="#" className="prev-icon disabled" onClick={nothing}><FontAwesomeIcon icon="chevron-left" size="lg" /></a>;
    } else {
      prevIcon = <a href="#" className="prev-icon" onClick={prev}><FontAwesomeIcon icon="chevron-left" size="lg" /></a>;
    }

    var sets = [];

    data.forEach((e, i) => {
      sets.push(<Set key={i} data={e} number={i} p1={this.props.p1} p2={this.props.p2} />);
    });

    return (
      <Container>
        <MatchTable data={data} slide={this.state.slide} p1={this.props.p1} p2={this.props.p2} />

        <div className="slides">
          {nextIcon}
          {prevIcon}
          <SwipeableViews resistance onChangeIndex={update} className="flex-h" index={this.state.slide}>
            {sets}
          </SwipeableViews>
        </div>
      </Container>
    );
  }
}

class MatchData extends Component {
  render() {
    var data = this.props.source;

    return (
      <>
        <Header title={data.title} id={this.props.id} />
        <Overview players={data.players} />
        <Sets values={data.sets} p1={data.players[0].last} p2={data.players[1].last} />
      </>
    );
  }
}

class Match extends Component {
  render() {
    var matches = JSON.parse(localStorage.getItem("matches"));
    var id = this.props.match.params.id;
    var match = matches[id];

    return (
      <MatchData source={match} id={id} />
    );
  }
}

export default Match;