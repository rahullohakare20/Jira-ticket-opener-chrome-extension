import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './home/Home';
import Settings from './settings/settings';

import './App.css';

function App() {
  return (
    <React.Fragment>
      <div className="App">
        <header className="App-header">
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/settings' component={Settings} />
            <Route path='/index.html' component={Home} />
          </Switch>
        </header>
      </div>
    </React.Fragment>
  );
}

export default App;
