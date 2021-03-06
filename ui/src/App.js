import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import Callback from './Callback';
import auth0Client from './Auth';
import NavBar from './components/elements/NavBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true,
    };
  }

  async componentDidMount() {
    if (this.props.location.pathname === '/callback') return;
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error === 'login_required') return;
      console.log(err.error);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Switch>
            <Route exact path="/callback" component={Callback} />
            <Route exact path="/" component={NavBar} />
          </Switch>
        </header>
      </div>
    );
  }
}

export default withRouter(App);
