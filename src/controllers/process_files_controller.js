/* eslint-disable import/extensions */
import { Controller } from '@hotwired/stimulus';
import uniqueId from 'lodash.uniqueid';
import remove from 'lodash.remove';
import ImageBlobReduce from 'image-blob-reduce';

const reduce = new ImageBlobReduce();
const resizedFiles = [];
const MAX_RESOLUTION = 1280;
const PREVIEW_RESOLUTION = 150;
const API_ENDPOINT = '';

const resize = (file) => reduce.toBlob(file, { max: MAX_RESOLUTION });

const generatePreview = (file) => reduce.toBlob(file, {
  max: PREVIEW_RESOLUTION,
  unsharpAmount: 80,
  unsharpRadius: 0.6,
  unsharpThreshold: 2,
});

export default class extends Controller {
  static targets = ['recipientId',
    'studentName',
    'group',
    'fileContainer',
    'previewContainer',
    'spinner',
    'submitButton',
    'headerSuccess',
    'headerError',
  ];

  resizeFile(e) {
    const newItem = { id: e.target.id, promise: resize(e.target.files[0]) };
    remove(resizedFiles, (item) => item.id === newItem.id);
    resizedFiles.push(newItem);
  }

  addPreview(e) {
    const imgPreview = document.createElement('img');
    imgPreview.setAttribute('height', '150');
    imgPreview.classList.add('ms-2', 'border', 'p-1');
    generatePreview(e.target.files[0])
      .then((blob) => {
        imgPreview.setAttribute('src', URL.createObjectURL(blob));
      });
    this.previewContainerTarget.append(imgPreview);
  }

  addInput(e) {
    e.preventDefault();
    const newFileInput = document.createElement('input');
    const id = uniqueId('file_');
    newFileInput.setAttribute('type', 'file');
    newFileInput.setAttribute('name', 'file[]');
    newFileInput.setAttribute('id', id);
    newFileInput.setAttribute('accept', 'image/jpg,image/jpeg');
    newFileInput.setAttribute('data-action', 'change->process-files#resizeFile change->process-files#addPreview');
    newFileInput.classList.add('form-control', 'files', 'my-3');
    this.fileContainerTarget.append(newFileInput);
  }

  submit(e) {
    e.preventDefault();
    this.submitButtonTarget.setAttribute('disabled', 'true');
    this.spinnerTarget.classList.remove('d-none');
    const promises = resizedFiles.map((item) => item.promise);
    const recipientId = this.recipientIdTarget.value;
    const studentName = this.studentNameTarget.value;
    const group = this.groupTarget.value;
    Promise.all(promises)
      .then(async (data) => {
        const formToSend = new FormData();
        formToSend.append('recipientId', recipientId);
        formToSend.append('studentName', studentName);
        formToSend.append('group', group);

        const filename = [group, studentName.trim().replace(/s+/g, '_')].join('_');
        data.forEach((file) => formToSend.append('file[]', file, uniqueId(`${filename}_`)));

        // const date = new Date().toJSON().slice(0, 10);
        // Email.send({
        //   SecureToken: '',
        //   To: `test${recipientId}@irlc.msu.ru`,
        //   From: 'dolgov.is@irlc.msu.ru',
        //   Subject: `${date}: ${studentName}`,
        //   Body: '',
        //   Attachments: [
        //     {
        //       name: 'smtp.png',
        //       path: 'https://…/smtp.png',
        //     }],
        // }).then(function (response) {
        //   console.log(response);
        //   this.headerSuccessTarget.classList.remove('d-none');
        // }, function (err) {
        //   console.error(err);
        //   this.headerErrorTarget.classList.remove('d-none');
        // });
      });
  }

  toggleSubmit() {
    if (this.recipientIdTarget.value !== ''
        && this.studentNameTarget.value !== ''
        && this.groupTarget.value !== ''
        && resizedFiles.length !== 0) {
      this.submitButtonTarget.removeAttribute('disabled');
    } else {
      this.submitButtonTarget.setAttribute('disabled', 'true');
    }
  }
}
