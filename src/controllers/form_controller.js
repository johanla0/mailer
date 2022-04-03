/* eslint-disable import/extensions */
import { Controller } from '@hotwired/stimulus';
import uniqueId from 'lodash.uniqueid';
import ImageBlobReduce from 'image-blob-reduce';

const reduce = new ImageBlobReduce();
const MAX_RESOLUTION = 1280;
const PREVIEW_RESOLUTION = 150;

const blobToBase64 = (blob) => new Promise((resolve, _) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result);
  reader.readAsDataURL(blob);
});

const resizeFile = (file) => reduce
  .toBlob(file, { max: MAX_RESOLUTION })
  .then((blob) => blobToBase64(blob));

const generatePreview = (file) => reduce.toBlob(file, {
  max: PREVIEW_RESOLUTION,
  unsharpAmount: 80,
  unsharpRadius: 0.6,
  unsharpThreshold: 2,
});

export default class extends Controller {
  static targets = [
    'recipientId',
    'studentName',
    'group',
    'fileContainer',
    'file',
    'previewContainer',
    'spinner',
    'submitButton',
    'headerSuccess',
    'headerError',
  ];

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
    newFileInput.setAttribute('data-form-target', 'file');
    newFileInput.setAttribute('data-action', 'change->form#addPreview');
    newFileInput.classList.add('form-control', 'files', 'my-3');
    this.fileContainerTarget.append(newFileInput);
  }

  toggleSubmit() {
    const hasRecipient = this.recipientIdTarget.value !== '';
    const hasName = this.studentNameTarget.value !== '';
    const hasGroup = this.groupTarget.value !== '';
    const hasFiles = this.fileTargets
      .map((input) => input.files.length)
      .filter((length) => length !== 0)
      .length > 0;

    if (hasRecipient && hasName && hasGroup && hasFiles) {
      this.submitButtonTarget.removeAttribute('disabled');
    } else {
      this.submitButtonTarget.setAttribute('disabled', 'true');
    }
  }

  submit(e) {
    e.preventDefault();
    this.submitButtonTarget.setAttribute('disabled', 'true');
    const spinner = this.spinnerTarget;
    spinner.classList.remove('d-none');

    const recipientId = this.recipientIdTarget.value;
    const studentName = this.studentNameTarget.value;
    const group = this.groupTarget.value;
    const filename = [group, studentName.trim().replace(/ /g, '_')].join('_');

    const date = new Date().toJSON().slice(0, 10);
    const headerSuccess = this.headerSuccessTarget;
    const headerError = this.headerErrorTarget;

    Promise
      .all(this.fileTargets.map((el) => resizeFile(el.files[0])))
      .then((data) => {
        const attachments = data.map((file) => ({
          name: uniqueId(`${filename}_`),
          data: file,
        }));
        // eslint-disable-next-line no-undef
        Email.send({
          SecureToken: '9391d7b5-e3c4-4a0d-92dc-2f28dfbf30dc',
          // To: `test${recipientId}@irlc.msu.ru`,
          To: 'dolgov.is@irlc.msu.ru',
          From: 'dolgov.is@irlc.msu.ru',
          Subject: `${date}: ${studentName}`,
          Body: `Ответ студента ${studentName}, группа: ${group}. Кол-во файлов: ${data.length}`,
          Attachments: attachments,
        }).then((response) => {
          console.log(response);
          headerSuccess.classList.remove('d-none');
          spinner.classList.add('d-none');
        }, (err) => {
          console.error(err);
          headerError.classList.remove('d-none');
        }).catch((err) => {
          console.error(err);
        });
      });
  }
}
