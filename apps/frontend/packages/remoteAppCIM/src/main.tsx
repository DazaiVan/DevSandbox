// import React, {useState} from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import {ConfigProvider} from "antd";


// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// root.render(
//     <App/>
// );
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
