import React, { Component } from 'react';

export class Dashboard extends Component {
  render() {
    return (
      <div className="card ml mr">
        <div className="columns ml">
          <div className="column is-narrow">
            <div>
              <span className="title mr">64</span>
              <span>Selkirk Osborne</span>
            </div>
          </div>
          <div className="column is-narrow">
            <span className="ml mr">OK</span>
            <span>6:15</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
