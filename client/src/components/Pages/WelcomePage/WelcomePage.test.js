import React from 'react';
import { shallow } from 'enzyme';
import WelcomePage from './WelcomePage';

describe('<WelcomePage />', () => {
  test('renders', () => {
    const wrapper = shallow(<WelcomePage />);
    expect(wrapper).toMatchSnapshot();
  });
});
