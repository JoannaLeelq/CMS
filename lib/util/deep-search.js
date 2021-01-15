/**
 * @param {*} key : subNav
 * @param {*} value : search target
 * @param {headNode,value} predicateFn: boolean
 */
export const deepSearchFactory = (key, value, predicateFn) => {
  return function deepSearch(data) {
    const headNode = data.slice(0, 1)[0];

    const restNode = data.slice(1);

    if (predicateFn(headNode, value)) {
      return headNode;
    }

    if (headNode[key]) {
      const res = deepSearch(headNode[key], value);
      if (res) {
        return res;
      }
    }

    if (restNode.length) {
      const res = deepSearch(restNode, value);
      if (res) {
        return res;
      }
    }

    return null;
  };
};
