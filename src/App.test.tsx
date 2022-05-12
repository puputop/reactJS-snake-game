import React from 'react';
import { render, screen } from '@testing-library/react';
import Game from "./lib/SnakeGame/Game";
import {BOARD} from "./lib/SnakeGame/config";

test('renders Game', () => {
  render(<Game name="SNAKE 1.0" board={{cols : BOARD.COLS, rows: BOARD.ROWS}} />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
