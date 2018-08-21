import React, { Component, createRef } from 'react';
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
    <p>Home page</p>
  </div>
)

const About = () => (
  <div>
    <p>About page</p>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h2>{match.params.topicId}</h2>
    <p>Topic page for {match.params.topicId}</p>
  </div>
)

const Topics = ({ match }) => {
  return (
    <div>
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

// Just for more consistent access to the routing information and easier editing,
// we're going save the list of pages and their titles in an object.
// This is not really necessary, but for our example, it saves a switch/case.
const PAGES = {
  home: {
    title: "Home",
    route: "/",
    component: Home
  },
  about: {
    title: "About",
    route: "/about",
    component: About
  },
  topics: {
    title: "Topics",
    route: "/topics",
    component: Topics
  }
};

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

  // Default react-router properties we get through withRouter
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  

  state = {
    // Used to set a message and page changes
    a11yMessage: '',
    // Current page title set in the h1
    pageTitle: 'My Website'
  };

  constructor(props) {
    super(props)

    // Create and element reference to change focus to the h1 element on page change
    this.pageChangeFocusElement = createRef();
    this.pages = PAGES;
  }

  componentDidUpdate(prevProps) {
    // When the path changed, we want to set re-set the focus of the page
    // similar on how it's done with server-side routing.
    if (this.props.location.pathname !== prevProps.location.pathname) {
      // This is just a very raw snipped to change page titles. You probably know
      // many better ways to manage page titles.

      // Get information about the page
      // As mentioned, this is not necessary required and you'll need to add
      // the find() polyfill for IE11.
      const selectedPageKey = Object.keys(this.pages).find(key => {
        const page = this.pages[key];
        return page.route === this.props.location.pathname
      });

      if (selectedPageKey) {
        // Change page title and aria-live message
        const selectedPage = this.pages[selectedPageKey];
        this.setState({
          pageTitle: selectedPage.title,
          a11yMessage: `Page changed to ${selectedPage.title}`
        })
      }

      // Change focus to the page title
      this.pageChangeFocusElement.current.focus()
    }
  }

  render() {
    return (
      <div>
        {/* LiveMessage will notify the user about the route change */}
        <LiveMessage message={this.state.a11yMessage} aria-live="polite" />
        <h1 ref={this.pageChangeFocusElement}>
          {this.state.pageTitle}
        </h1>
        <ul>
          <li><Link to={this.pages.home.route}>{this.pages.home.title}</Link></li>
          <li><Link to={this.pages.about.route}>{this.pages.about.title}</Link></li>
          <li><Link to={this.pages.topics.route}>{this.pages.topics.title}</Link></li>
        </ul>

        <hr />


        <Route exact path={this.pages.home.route} component={this.pages.home.component} />
        <Route path={this.pages.about.route} component={this.pages.about.component} />
        <Route path={this.pages.topics.route} component={this.pages.topics.component} />
      </div>
    )
  }
};

// Create an instance withRouter to be able to access all routing informations
// inside the component.
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
        {/* LiveAnnouncer is the aria live wrapper needed */}
        <Router>
          <MainViewWithRouter />
        </Router>
      </LiveAnnouncer>
    );
  }
}

/* Export with Router to get access to history API */
export default App;
