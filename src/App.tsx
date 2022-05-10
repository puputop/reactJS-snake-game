import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {Game} from "./lib/arcade/Game";

function App() {
    const styleApp = {
        display : 'flex',
        width : '100%',
        justifyContent : 'center'
    }
    return (
        <div style={styleApp} className="App">
            <Game name="SNAKE 1.0" cols={25} rows={20} />
        </div>
    );
}

export default App;
