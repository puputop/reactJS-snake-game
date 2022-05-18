# SNAKE 1.0 is a simple game on the ReactJS
Go test [here](https://react-js-snake-game.vercel.app)


### Controls
 - just download build and open index.html in any browser
 - control snake with use arrows or<br>
&nbsp; &nbsp; &nbsp; &nbsp;`w`<br>
`a` `s` `d`
 - pause/continue press `space`
 - force game over press `esc`

### Build with your setting
1) edit `/lib/config.ts` - game general settings
2) edit `/lib/controlKeys.ts` - game control settings
3) `npm start`
4) Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
5) For build `npm run build`

### Structure
 1) `/src/Game.tsx` - provide user events
 2) `/src/lib/Interface/` - elements UI
 3) `/src/lib/common/` - logic
 4) `/src/styles/` - css files
