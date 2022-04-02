/* eslint-disable import/extensions */
import './scss/custom.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { Application } from '@hotwired/stimulus';
import { definitionsFromContext } from '@hotwired/stimulus-webpack-helpers';

window.Stimulus = Application.start();
const context = require.context("./controllers", true, /\.js$/);
Stimulus.load(definitionsFromContext(context));
