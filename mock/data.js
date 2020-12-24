const oriData = [
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

/**
 *
 * 递归的方法来深度搜索： 更小的子问题，终结条件，中间步骤（找到目标）
 * 终结条件：找到的时候停止，或是找不到
 * 更小的问题：subNav.slice
 * 中间步骤：套用自己
 *
 */
function deepSearch(path, subNav) {
  const target = subNav.slice(0, 1)[0];
  const rest = subNav.slice(1);

  if (target.path === path) {
    return target;
  }
  if (target.subNav) {
    const targetResult = deepSearch(path, target.subNav);
    if (targetResult) {
      return targetResult;
    }
  }
  if (rest.length) {
    const targetResult = deepSearch(path, rest);
    if (targetResult) {
      return targetResult;
    }
  }
  return null;
}

const result = deepSearch('china', oriData);
console.log(result);
