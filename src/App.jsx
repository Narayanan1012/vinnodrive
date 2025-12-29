import React from 'react';
import { FileUpload } from './frontend/basic_Components';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>VinnoDrive</h1>
        <p>Your Intelligent File Storage</p>
      </header>
      <main>
        <FileUpload />
      </main>
    </div>
  );
}

export default App;
