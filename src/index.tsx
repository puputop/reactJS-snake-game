import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Game from "./lib/SnakeGame/Game";
import {BOARD} from "./lib/SnakeGame/config";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const styleApp = {
    display : 'flex',
    width : '100%',
    justifyContent : 'center'
}
root.render(
  <React.StrictMode>
      <div style={styleApp}>
          <Game name="SNAKE 1.0" cols={BOARD.COLS} rows={BOARD.ROWS} />
      </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
