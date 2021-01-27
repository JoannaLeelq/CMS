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

export const deepSearchRecordFactory = (key, value, predicateFn) => {
  return function search(data, record = []) {
    const headNode = data.slice(0, 1)[0];
    const restNodes = data.slice(1);

    record.push(-restNodes.length - 1); // 节点位置入栈

    if (predicateFn(headNode, value)) {
      return record;
    }

    if (headNode[key]) {
      const res = search(headNode[key], record);

      if (res) {
        return record;
      } else {
        record.pop(); // 节点出栈
      }
    }

    if (restNodes.length) {
      record.pop(); // 节点出栈

      const res = search(restNodes, record);

      if (res) {
        return record;
      }
    }

    return null;
  };
};
