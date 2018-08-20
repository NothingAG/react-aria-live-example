import React, { Component } from 'react';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

const Topics = ({ match }) => {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>
            Rendering with React
          </Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>
            Components
          </Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            Props v. State
          </Link>
        </li>
      </ul>

      <Route path={`${match.path}/:topicId`} component={Topic} />
      <Route exact path={match.path} render={() => (
        <h3>Please select a topic.</h3>
      )} />
    </div>
  )
}

/**
 * MainView
 * 
 * Here we define our routes without <Router> to exposes them `withRouter` to
 * the main app component.
 * 
 * This way, we have access to the location and can react with different aria-live messages
 * to the route change.
 */
class MainView extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }
  
  state = {
    a11yMessage: '',
  };

  render() {
    console.log(this.props.location);

    return (
      <div>
        <LiveMessage message={this.props.location.pathname} aria-live="polite" />
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/topics">Topics</Link></li>
        </ul>

        <hr />


        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </div>
    )
  }
};

const MainViewWithRouter = withRouter(MainView);

/**
 * Main App component
 * 
 * Main app component contains the <Router> with references the MainViews with the actual routes.
 */
export class App extends Component {
  render() {
    return (
      <LiveAnnouncer>
        <Router>
          <MainViewWithRouter />
        </Router>
      </LiveAnnouncer>
    );
  }
}

/* Export with Router to get access to history API */
export default App;
