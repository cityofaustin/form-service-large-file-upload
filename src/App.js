import React, { Component } from 'react';
import ReactQueryParams from 'react-query-params';

import logo from './logo.svg';
import './App.css';


import FileUploader from './Components/FileUploader/FileUploader';

class App extends ReactQueryParams {

  defaultQueryParams = {
      case: 'n/a'
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <FileUploader caseNumber={this.queryParams.case} />
        </header>
      </div>
    );
  }
}

export default App;
