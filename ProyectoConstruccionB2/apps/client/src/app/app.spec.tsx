import { render } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the carbon footprint form heading', () => {
    const { getAllByText } = render(<App />);
    expect(
      getAllByText(new RegExp('Estimador de Huella de Carbono Personal', 'gi'))
        .length > 0,
    ).toBeTruthy();
  });
});
