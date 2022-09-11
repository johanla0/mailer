/* eslint-disable no-underscore-dangle */
import { Controller } from '@hotwired/stimulus';
import i18next from 'i18next';
import en from '../locales/en.yml';
import ru from '../locales/ru.yml';
import zh from '../locales/zh.yml';

export default class extends Controller {
  static targets = [
    'placeholder',
    'text',
    'toggle',
  ];

  initialize() {
    i18next.init({
      lng: 'en',
      // debug: true,
      resources: {
        en,
        ru,
        zh,
      },
    }).then((t) => {
      this.toggleTarget.innerHTML = i18next.t('language');
    });
  }

  switchLanguage(e) {
    e.preventDefault();
    const language = e.target.dataset.lng;
    i18next
      .changeLanguage(language)
      .then((t) => {
        this._updateTranslations();
        this.toggleTarget.innerHTML = i18next.t('language');
      });
  }

  _updateTranslations() {
    const labels = this.textTargets;
    labels.forEach((label) => {
      label.innerHTML = i18next.t(label.dataset.key);
    });

    const placeholders = this.placeholderTargets;
    placeholders.forEach((placeholder) => {
      placeholder.setAttribute('placeholder', i18next.t(placeholder.dataset.key));
    });
  }
}
