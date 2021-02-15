const cars = [
  {
    title: 'Car',
    subNav: [
      {
        title: 'HONDA',
        path: 'honda',
        subNav: [
          {
            title: 'DONGFENG',
            path: 'dongfeng',
            subNav: [
              { title: 'NSPIRE', path: 'nspire' },
              { title: 'ENVIX', path: 'envix' },
              { title: 'CIVIC', path: 'civic' },
            ],
          },
          {
            title: 'GUANGQI',
            path: 'guangqi',
            subNav: [
              { title: 'AVANCIER', path: 'avancier' },
              { title: 'ACCORD', path: 'accord' },
            ],
          },
        ],
      },
      {
        title: 'TOYOTA',
        path: 'toyota',
        subNav: [
          { title: 'COROLLA', path: 'corolla' },
          { title: 'CAMRY', path: 'camry' },
          { title: 'PRADO', path: 'prado' },
          { title: 'ALPHARD', path: 'alphard' },
        ],
      },
    ],
    path: 'car',
  },
  {
    title: 'Area',
    path: 'area',
    subNav: [
      {
        title: 'NORTH',
        path: 'north',
        subNav: [
          { title: 'BEIJING', path: 'beijing' },
          { title: 'CHANGCHU', path: 'changchu' },
        ],
      },
      {
        title: 'SOUTH',
        path: 'south',
        subNav: [
          { title: 'SHANGHAI', path: 'shanghai' },
          { title: 'GUANGZHOU', path: 'guangzhou' },
        ],
      },
    ],
  },
  {
    title: 'Country',
    path: 'country',
    subNav: [
      {
        title: 'CHINA',
        path: 'china',
        subNav: [
          { title: 'MAINLAND', path: 'mainland' },
          { title: 'TAIWAN', path: 'taiwan' },
        ],
      },
      { title: 'American', path: 'american' },
    ],
  },
];

function findCar(source, target) {
  let firstEle = source.slice(0, 1)[0];
  let restEles = source.slice(1, source.length);

  if (firstEle.title === target) {
    return firstEle;
  }

  if (firstEle.subNav) {
    let newSource = firstEle.subNav;
    const result = findCar(newSource, target);
    if (result) {
      return result;
    }
  }

  if (restEles.length > 0) {
    const result = findCar(restEles, target);
    if (result) {
      return result;
    }
  }

  return null;
}

const result = findCar(cars, 'TAIWAN');
console.log(result);
