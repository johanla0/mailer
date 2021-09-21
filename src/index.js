/* eslint-disable import/extensions */
import './scss/custom.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

const API_ENDPOINT = '';

const axios = require('axios').default;
// const pica = require('pica')();
const reduce = require('image-blob-reduce')();

const addFileButton = document.getElementById('add-button');

addFileButton.addEventListener('click', (e) => {
  e.preventDefault();
  const newFileInput = document.createElement('input');
  newFileInput.setAttribute('type', 'file');
  newFileInput.setAttribute('name', 'file');
  newFileInput.setAttribute('accept', 'image/jpg,image/jpeg');
  newFileInput.classList.add('form-control', 'files', 'mb-3');
  e.target
    .closest('div')
    .prepend(newFileInput);
});

const form = document.getElementById('send-paperwork-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const recipient = formData.get('recipient');
  const files = formData.getAll('file');
  const filesToSend = [];
  // files.map((from) => {
  //   pica
  //     .resize(from, to)
  //     .then((result) => pica.toBlob(result, 'image/jpeg', 0.9))
  //     .then((blob) => filesToSend.push(blob));
  // });
  // console.log(filesToSend.length);
  const formToSend = new FormData();
  formToSend.append('recipient', `test${recipient}`);
  filesToSend.map((file) => {
    formToSend.append(file.name, file);
  });
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
