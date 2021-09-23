/* eslint-disable import/extensions */
import './scss/custom.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

const API_ENDPOINT = '';

const axios = require('axios').default;
const reduce = require('image-blob-reduce')();

const resizedFiles = [];

const resizeFile = (file) => reduce.toBlob(file, {
  max: 1280,
  unsharpAmount: 80,
  unsharpRadius: 0.6,
  unsharpThreshold: 2,
});

const onchangeCallback = async (e) => {
  const result = await resizeFile(e.target.files[0]);
  resizedFiles.push({
    name: e.target.files[0].name,
    blob: result,
  });
};

const inputFile = document.getElementById('file');
inputFile.addEventListener('change', onchangeCallback);

const addFileButton = document.getElementById('add-button');
addFileButton.addEventListener('click', (e) => {
  e.preventDefault();
  const newFileInput = document.createElement('input');
  newFileInput.setAttribute('type', 'file');
  newFileInput.setAttribute('name', 'file');
  newFileInput.setAttribute('accept', 'image/jpg,image/jpeg');
  newFileInput.classList.add('form-control', 'files', 'my-3');
  newFileInput.addEventListener('change', onchangeCallback);
  e.target.parentNode.querySelector('div').append(newFileInput);
});

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const recipient = formData.get('recipient');
  const sender = formData.get('name');
  const group = formData.get('group');
  const files = formData.getAll('file');
  const filenames = files.map((file) => file.name);
  const filteredResizedFiles = resizedFiles.filter((file) => filenames.includes(file.name));
  const formToSend = new FormData();
  formToSend.append('recipient', `test${recipient}`);
  formToSend.append('sender', sender);
  formToSend.append('group', group);
  filteredResizedFiles.map((file) => formToSend.append('file[]', file.blob, file.name));
  // axios({
  //   method: 'post',
  //   url: API_ENDPOINT,
  //   data: formToSend,
  //   headers: { 'Content-Type': 'multipart/form-data' },
  // })
  //   .then()
  //   // eslint-disable-next-line no-console
  //   .catch((err) => console.error(err));
});
