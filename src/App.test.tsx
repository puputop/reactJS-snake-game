import React from 'react';
import { render, screen } from '@testing-library/react';
import Game from "./lib/arcade/Game";
import {BOARD} from "./lib/arcade/config";

test('renders Game', () => {
  render(<Game name="SNAKE 1.0" cols={BOARD.COLS} rows={BOARD.ROWS} />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
