/* eslint-disable import/extensions */
import { Controller } from '@hotwired/stimulus';
import uniqueId from 'lodash.uniqueid';
import remove from 'lodash.remove';
import ImageBlobReduce from 'image-blob-reduce';
// import { axios } from 'axios';

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
  static targets = [ 'recipientId', 'studentName', 'group', 'fileContainer', 'previewContainer', 'spinner', 'submitButton' ];

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
    this.spinnerTarget.classList.remove('d-none');
    const promises = resizedFiles.map((item) => item.promise);
    Promise.all(promises)
      .then(async (data) => {
        const formToSend = new FormData();
        formToSend.append('recipientId', this.recipientIdTarget.value);
        formToSend.append('studentName', this.studentNameTarget.value);
        formToSend.append('group', this.groupTarget.value);

        const filename = [group, this.studentNameTarget.value.trim().replace(/s+/g, '_')].join('_');
        data.forEach((file) => formToSend.append('file[]', file, uniqueId(`${filename}_`)));
        // TODO: Send formToSend
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
    // });
  }

  toggleSubmit() {
    if (this.recipientIdTarget.value !== '' &&
        this.studentNameTarget.value !== '' &&
        this.groupTarget.value !== '' &&
        resizedFiles.length !== 0) {
      this.submitButtonTarget.removeAttribute('disabled');
    } else {
      this.submitButtonTarget.setAttribute('disabled', 'true');
    }
  }
}
