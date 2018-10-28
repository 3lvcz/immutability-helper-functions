export function tail(arr, offset = 0) {
  if (!arr || !arr.length) {
    return undefined;
  }
  if (offset < 0) {
    return arr[arr.length - 1];
  }
  return arr[Math.max(0, arr.length - offset - 1)];
}

export function resolvePathKeys(path) {
  if (!path) {
    return [];
  }
  return (Array.isArray(path) ? path : path.split(".")).map(seg =>
    seg.toString()
  );
}

export function createTreeList(pathKeys) {
  let target = {};
  const treeList = [target];
  for (let i = 0; i < pathKeys.length; i++) {
    const key = pathKeys[i];
    target[key] = {};
    target = target[key];
    treeList.push(target);
  }
  return treeList;
}

export function toUpdateQuery(cmd, path, payload) {
  const pathKeys = resolvePathKeys(path);
  const treeList = createTreeList(pathKeys);
  switch (cmd) {
    case "$push":
    case "$unshift":
    case "$add":
    case "$remove":
      tail(treeList)[cmd] = Array.isArray(payload) ? payload : [payload];
      break;
    case "$splice":
      tail(treeList)[cmd] = Array.isArray(payload[0]) ? payload : [payload];
      break;
    case "$set":
    case "$merge":
    case "$apply":
      tail(treeList)[cmd] = payload;
      break;
    case "$toggle":
    case "$unset":
      if (!pathKeys.length) {
        return {};
      }
      if (payload) {
        tail(treeList)[cmd] = Array.isArray(payload) ? payload : [payload];
      } else {
        const target = tail(treeList, 1);
        const key = tail(pathKeys);
        delete target[key];
        target[cmd] = [key];
      }
      break;
  }
  return treeList[0];
}
