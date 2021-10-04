//function for fetching countries from restcountries.com 
export function fetchCountries(name) {
    return fetch(
      `https://restcountries.com/v2/name/${name}?fields=name,capital,population,languages,flag`,
    ).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }
