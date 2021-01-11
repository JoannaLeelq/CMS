export const deepSearchFactory = () => {
  return function deepSearch(data, path) {
    const headNode = data.slice(0, 1)[0];
    console.log(headNode);
    console.log(path);
    const restNode = data.slice(1);

    if (headNode.label === path) {
      return headNode;
    }

    if (headNode.subNav) {
      const res = deepSearch(headNode.subNav, path);
      if (res) {
        return res;
      }
    }

    if (restNode.length) {
      const res = deepSearch(restNode, path);
      if (res) {
        return res;
      }
    }

    return null;
  };
};
