import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Match from './Match';
import Home from './Home';
import New from './New';
import Users from './Users';
import User from './User';
import Edit from './Edit';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Router>
	<Route path="/" exact component={Home} />
	<Route path="/match/:id" exact component={Match} />
	<Route path="/new" exact component={New} />
	<Route path="/users" exact component={Users} />
	<Route path="/users/:id" exact component={User} />
	<Route path="/edit/:id" exact component={Edit} />
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();