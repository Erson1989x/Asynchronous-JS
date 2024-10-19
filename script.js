'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

/* Old way
    const getCountryData = function (country) {
        
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v2/name/${country}`); // `https://restcountries.com/v2/name/${country}`
    request.send();


request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    const html = `
  <article class="country">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });

};

getCountryData('portugal');
getCountryData('usa');
getCountryData('germany');
getCountryData('france');


const getCountryAndNeighbour = function (country) {
  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    // Render country 1
    renderCountry(data);

    // Get neighbour country (2)
    const [neighbour] = data.borders;

    if (!neighbour) return;

    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2);

      renderCountry(data2, 'neighbour');
    });
  });
};

// getCountryAndNeighbour('portugal');
getCountryAndNeighbour('usa');

setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 second passed');
    setTimeout(() => {
      console.log('3 second passed');
      setTimeout(() => {
        console.log('4 second passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);



const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderCountry(data[0]);
    });
};


const getCountryData = function (country) {
  // Country 1
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => {
       console.log(response);

      if (!response.ok) throw new Error(`Country not found (${response.status})`);

       return response.json()
})
    .then(data => {
      renderCountry(data[0]);
      //const neighbour = data[0].borders[0];
      const neighbour = 'dsadsadasd'


      if (!neighbour) return;

      // Country 2
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(response => {

       if (!response.ok) throw new Error(`Country not found (${response.status})`);

      return response.json()
})
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error('Something went wrong');
      renderError(`Something went wrong, ${err.message}. Try again!`); 
})
    .finally(() => {
      countriesContainer.style.opacity = 1;    
    });

};

btn.addEventListener('click',() => {
  getCountryData('portugal');
});



const getCountryData = function (country) {
  // Country 1
  getJSON(
    `https://restcountries.com/v2/name/${country}`,
    'Country not found'
  )
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];

      if (!neighbour) throw new Error('No neighbour found!');

      // Country 2
      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })

    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥 ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryData('portugal');
});

// getCountryData('australia');

*

const whereAmI = (lat, lng) => {
  fetch(`https://geocode.xyz/${lat},${lng}?json=1`)
  .then (response => {
    if(!response.ok) throw new Error(`Problem with geocoding ${response.status}`)
    return response.json()
  })
  .then(data => {
    console.log(data);
    console.log(`You are in ${data.city}, ${data.country}`);
    return fetch(`https://restcountries.com/v2/name/${data.country}`)
  })
  .then ( response => {
    if(!response.ok) throw new Error(`Country not found ${response.status}`)
    return response.json()
  })
  .then(data => renderCountry(data[0]))
  .catch(error => console.error(`${error.message}`))

}

whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);


const lotteryPromise = new Promise((resolve, reject) => {
   
  console.log('Lottery draw is happening...');
     setTimeout(() => {
      if (Math.random() >= 0.5) {
        resolve('You win');
      } else {
        reject(new Error('You lost your money'));
      }       
     }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err))

// Promisifying setTimeout
const wait = (seconds) => {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  })
}

wait(1).then(() => {
  console.log('1 seconds passed');
  return wait(1);
}).then(() => {
  console.log('2 second passed');
  return wait(1);
}).then(() => {
  console.log('3 second passed');
  return wait(1);
}).then(() => {
  console.log('4 second passed');
})


Promise.resolve('abc').then(x => console.log(x))
Promise.reject(new Error('Problem')).catch(x => console.log(x))


//getPosition()
//  .then(pos => console.log(pos))

  const whereAmI = (lat, lng) => {

    getPosition()
    .then(pos => {
      console.log(pos);
      const {latitude: lat, longitude: lng} = pos.coords;
      return fetch(`https://geocode.xyz/${lat},${lng}?json=1`)
    })


    .then (response => {
      if(!response.ok) throw new Error(`Problem with geocoding ${response.status}`)
      return response.json()
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);
      return fetch(`https://restcountries.com/v2/name/${data.country}`)
    })
    .then ( response => {
      if(!response.ok) throw new Error(`Country not found ${response.status}`)
      return response.json()
    })
    .then(data => renderCountry(data[0]))
    .catch(error => console.error(`${error.message}`))
  
  }

  btn.addEventListener('click', whereAmI)


const imgContainer = document.querySelector('.images');

const createImage = (imgPath) => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', () => {
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener('error', () => {
      reject(new Error('Image not found'));
    });
  });
}

const wait = (seconds) => {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  })
}

let currentImg;

createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image 1 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image 2 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-3.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image 3 loaded');
    return wait(2);
  })
  .catch(err => console.error(err));


const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })

}

const whereAmI = async () => {
try {
  const pos = await getPosition();

  const { latitude: lat, longitude: lng } = pos.coords;

  const res = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);

  if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
  const data2 = await res.json();
  console.log(data2);

 const response = await fetch(`https://restcountries.com/v2/name/${data2.country}`)
 if(!response.ok) throw new Error(`Country not found ${response.status}`)

 const data = await response.json();
 renderCountry(data[0])

 return `You are in ${data2.city}, ${data2.country}`;
} catch (err) {
  console.error(`${err}`);
  renderError(`Something went wrong ${err.message}`)

  // Reject promise returned from async function
  throw err;
}

}
console.log('1: Will get location');
//const city = whereAmI()
//console.log(city);
//whereAmI().then(city => console.log(`2: ${city}`)).catch(err => console.error(`2: ${err.message}`)).finally(() => console.log('3: Finished getting location'));
console.log('2: Done getting location');

(async function () {
  try {
    const city = await whereAmI();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err.message}`);
  }
  console.log('3: Finished getting location');
})();



const get3Countries = async (c1, c2, c3) => {
  try {
 // const [data1] =  await getJSON(`https://restcountries.com/v2/name/${c1}`);
 // const [data2] =  await getJSON(`https://restcountries.com/v2/name/${c2}`);
 // const [data3] = await getJSON(`https://restcountries.com/v2/name/${c3}`);
 //   console.log(data1.capital, data2.capital, data3.capital);

 const data = await Promise.all([getJSON(`https://restcountries.com/v2/name/${c1}`), getJSON(`https://restcountries.com/v2/name/${c2}`), getJSON(`https://restcountries.com/v2/name/${c3}`)])

 console.log(data.map(d => d[0].capital));

  } catch (error) {
    console.error(error);
  }
}

get3Countries('portugal', 'canada', 'tanzania')

*/

// Promise.race

(async () => {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v2/name/italy`),
    getJSON(`https://restcountries.com/v2/name/egypt`),
    getJSON(`https://restcountries.com/v2/name/mexico`),
  ]);
  console.log(res[0]);
})();

const timeout = (seconds) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request took too long!'));
    }, seconds * 1000);
  });
}

Promise.race([
  getJSON(`https://restcountries.com/v2/name/tanzania`),
  timeout(1),
])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err))

// Promise.allSettled

Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
]).then(res => console.log(res))

Promise.all([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
]).then(res => console.log(res))
.catch(err => console.error(err))

// Promise.any

Promise.any([
  Promise.resolve('Fullfilled'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
]).then(res => console.log(res))
.catch(err => console.error(err))

