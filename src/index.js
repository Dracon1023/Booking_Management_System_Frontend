import React from 'react';
import './css/index.css';
import { createRoot } from 'react-dom/client'
import './css/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
registerServiceWorker();
