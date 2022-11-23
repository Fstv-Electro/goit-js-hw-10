import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './js/fetchCountries';

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  infoEl: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.inputEl.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput() {
  const name = refs.inputEl.value.trim();

  if (name === '') {
    return emptyHTML();
  }

  fetchCountries(name)
    .then(country => {
      emptyHTML();

      if (country.length === 1) {
        refs.infoEl.insertAdjacentHTML('beforeend', markupInfo(country));
      } else if (country.length >= 10) {
        tooManyCountries();
      } else {
        refs.listEl.insertAdjacentHTML('beforeend', markupList(country));
      }
    })
    .catch(wrongNameCountry);
}

function emptyHTML() {
  refs.listEl.innerHTML = '';
  refs.infoEl.innerHTML = '';
}

function tooManyCountries() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function wrongNameCountry() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

// Розмітка і інфа, якщо багато співпадінь

function markupList(country) {
  const layoutList = country
    .map(({ name, flags }) => {
      const layout = `<li class="country-list__item">
                <img class="country-list__item--flag" src="${flags.svg}" alt="flag of ${name.official}">
                <h2 class="country-list__item--name">${name.official}</h2>
            </li>`;
      return layout;
    })
    .join('');
  return layoutList;
}

// comments for gh-pages/ sometimes he doesn't load before add a new changes
// Розмітка і інфа, якщо 1 співпадіння

function markupInfo(country) {
  const layoutInfo = country
    .map(({ name, flags, capital, population, languages }) => {
      const layout = `
        <ul class="country-info__list">
            <li class="country-info__item">
                <img class="country-info__item--flag"src="${
                  flags.svg
                }" alt="flag of ${name.official}">
                <h2 class="country-info__item--name">${name.official}</h2>
            </li>
            <li class="country-info__item"><span class="country-info__item--categories">Capital: </span>${capital}</li>
            <li class="country-info__item"><span class="country-info__item--categories">Population: </span>${population}</li>
            <li class="country-info__item"><span class="country-info__item--categories">Languages: </span>${Object.values(
              languages
            ).join(', ')}</li>
        </ul>`;
      return layout;
    })
    .join('');
  return layoutInfo;
}
