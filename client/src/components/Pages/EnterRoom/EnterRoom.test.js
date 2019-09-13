import React from "react";
import { shallow } from "enzyme";
import EnterRoom from "./EnterRoom";

describe("<EnterRoom />", () => {
  test("renders", () => {
    const wrapper = shallow(<EnterRoom />);
    expect(wrapper).toMatchSnapshot();
  });
});
