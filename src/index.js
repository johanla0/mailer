/* eslint-disable import/extensions */
import './scss/custom.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

const API_ENDPOINT = '';

const axios = require('axios').default;
const reduce = require('image-blob-reduce')();
const uniqueId = require('lodash.uniqueid');

const resizedFiles = [];

const resizeFile = (file) => reduce.toBlob(file, {
  max: 1280,
});

const generatePreview = (file) => reduce.toBlob(file, {
  max: 150,
  unsharpAmount: 80,
  unsharpRadius: 0.6,
  unsharpThreshold: 2,
});

const onchangeCallback = (e) => {
  const newItem = { id: e.target.id, promise: resizeFile(e.target.files[0]) };
  const index = resizedFiles.findIndex((item) => item.id === newItem.id);
  if (index === -1) {
    resizedFiles.push(newItem);
  } else {
    resizedFiles[index] = newItem;
  }

  generatePreview(e.target.files[0])
    .then((blob) => {
      document.getElementById(`preview-${e.target.id}`).src = URL.createObjectURL(blob);
    });
};

const inputFile = document.getElementById('file');
inputFile.addEventListener('change', onchangeCallback);

const addFileButton = document.getElementById('add-button');
addFileButton.addEventListener('click', (e) => {
  e.preventDefault();
  const newFileInput = document.createElement('input');
  const id = uniqueId('file_');
  newFileInput.setAttribute('type', 'file');
  newFileInput.setAttribute('name', 'file[]');
  newFileInput.setAttribute('id', id);
  newFileInput.setAttribute('accept', 'image/jpg,image/jpeg');
  newFileInput.classList.add('form-control', 'files', 'my-3');
  newFileInput.addEventListener('change', onchangeCallback);
  e.target.parentNode.querySelector('div').append(newFileInput);

  const imgPreview = document.createElement('img');
  imgPreview.setAttribute('id', `preview-${id}`);
  imgPreview.setAttribute('height', '150');
  imgPreview.classList.add('ms-2', 'border', 'p-1');
  const filePreviewContainer = document.getElementById('file-preview-container');
  filePreviewContainer.append(imgPreview);
});

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const promises = resizedFiles.map((item) => item.promise);
  Promise.all(promises)
    .then(async (data) => {
      const formData = new FormData(form);
      const recipient = formData.get('recipient');
      const sender = formData.get('name');
      const group = formData.get('group');
      const filename = [group, sender.trim().replace(/s+/g, '_')].join('_');
      const formToSend = new FormData();
      formToSend.append('recipient', `test${recipient}`);
      formToSend.append('sender', sender);
      formToSend.append('group', group);
      data.map((file) => formToSend.append('file[]', file, uniqueId(`${filename}_`)));
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
