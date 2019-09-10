import React from 'react';
import { shallow } from 'enzyme';
import WelcomePage from './Main';

describe('<WelcomePage />', () => {
  test('renders', () => {
    const wrapper = shallow(<WelcomePage />);
    expect(wrapper).toMatchSnapshot();
  });
});
