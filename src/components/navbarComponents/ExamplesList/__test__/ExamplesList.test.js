import React from 'react';
import ReactDOM from 'react-dom';
import ExamplesList from '../ExamplesList';
import { BrowserRouter as Router} from 'react-router-dom';

it("renders without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
        <Router><ExamplesList /></Router>, div);
});