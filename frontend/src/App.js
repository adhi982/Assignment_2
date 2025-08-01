import React from 'react';
import './App.css';
import DataDisplay from './components/DataDisplay';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Data Aggregation & Filtering System</h1>
        <p>Filter and analyze your business data</p>
      </header>
      <main>
        <DataDisplay />
      </main>
    </div>
  );
}

export default App;
