const countriesBase = `https://restcountries.com/v3.1/name/`;
const countriesFields = `fields=name,capital,population,flags,languages`;

export function fetchCountries(name) {
  return fetch(`${countriesBase}${name}?${countriesFields}`)
    .then(response => response.json())
    .catch(error => console.log(error));
}
