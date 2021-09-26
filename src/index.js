import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import { debounce } from 'lodash';

//make life easier
const qs = selector => document.querySelector(selector);
const qsa = selector => document.querySelectorAll(selector);
const log = something => console.log(something);
const cre = element => document.createElement(element);

//all needed html elements
const input = qs('#search-box');
const countryInfo = qs('.country-info');
const countryList = qs('.country-list');

//idk why, but they want it on variable soo there it is
const DEBOUNCE_DELAY = 300;
//function for better population formatting
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
//small fuction for reseting list of countries, just to make code
//easier to read
const resetCountries = () => {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
  };
  
//if success - render countries, if failure - notification and delete
//previously searched countries
const inputValueProcessing = () => {
  fetchCountries(input.value.trim())
    .then(countries => {
      //log(countries);
      renderCountries(countries);
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      resetCountries();
    });
};

// function that renders countries of course. with two different
//methods just to check out which one is better, prettier and
//easier. leaving both of them, for future.
const renderCountries = countries => {
  if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    resetCountries();
  } else if (countries.length <= 10 && countries.length >= 2) {
    resetCountries();

    countries.map(({ flags, name }) => {
      const item = cre('li');
      item.classList.add('country-list_item');
      countryList.append(item);

      const miniFlag = cre('img');
      miniFlag.src = flags[0];
      miniFlag.classList.add('mini-img');
      item.append(miniFlag);

      const countryName = cre('p');
      countryName.textContent = name;
      countryName.classList.add('country-list_name');
      item.append(countryName);
    });
  } else if ((countries.length = 1)) {
    resetCountries();

    const markup = countries.map(({ flags, name, capital, population, languages }) => {
      return `<h2 class="country-info_name"><img src="${flags[0]}" width="80" class="big-img"/>${name}</h2>
        <p class="country-info_item"><span>Capital:</span> ${capital} </p>
        <p class="country-info_item"><span>Population:</span> ${formatNumber(population)} </p>
        <p class="country-info_item"><span>Languages:</span> ${languages[0].name}</p>
        `;
    });

    countryInfo.innerHTML = markup;
  }
};

//Event on input
input.addEventListener('input', debounce(inputValueProcessing, DEBOUNCE_DELAY));
