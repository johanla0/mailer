/* eslint-disable no-undef */
import './scss/custom.scss';
import 'bootstrap/dist/js/bootstrap';
import { Application } from '@hotwired/stimulus';
import { definitionsFromContext } from '@hotwired/stimulus-webpack-helpers';

window.Stimulus = Application.start();
const context = require.context('./controllers', true, /\.js$/);
Stimulus.load(definitionsFromContext(context));
