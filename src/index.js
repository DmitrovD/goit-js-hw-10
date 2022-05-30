import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function cleanMarkup() {
    refs.countryList.innerHTML = "";
    refs.countryInfo.innerHTML = "";
};

function renderCountries(names) {
    if(names.length > 1 && names.length <= 10) {
        cleanMarkup();

        const markupCountryList = names.map(({ name, flags }) => {
            return `<li class="country-list_item" style="list-style: none; display: flex; align-items: center">
            <img src="${flags.svg}" alt="${name.common}" width="40" height="40" style="margin-right: 10px"/>
            <p class="country-list_name"><b>${name.common}</b></p>
            </li>`
        })
        .join("");

        refs.countryList.insertAdjacentHTML('afterbegin', markupCountryList);
    }

    else if(names.length === 1) {
        cleanMarkup();
        const markupCountryInfo = names.map(({ name, flags, capital, population, languages }) => {
            return `<div class="country-info_card">
            <div style="display: flex; align-items: center">
            <img src="${flags.svg}" alt="${name.official}" width="40" height="40" style="margin-right: 10px"/>
            <h1>${name.common}</h1></div>
            <p><b>Capital:</b> ${capital}</p>
            <p><b>Population:</b> ${population}</p>
            <p><b>Languages:</b> ${Object.values(languages).join(", ")}</p></div>`
        }).join("");

        refs.countryList.insertAdjacentHTML('afterbegin', markupCountryInfo);
    };
};

function onSearch(e) {
    cleanMarkup();
    
    const input = e.target.value.trim();
    
    if (input.length === 0) {
        return;
    }
    
    if (input.length === 1) {
        Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`);
        return;
    }
    
    fetchCountries(input)
        .then(names => {
            renderCountries(names);
        })
        .catch(() => Notiflix.Notify.failure(`Oops, there is no country with that name.`));
};