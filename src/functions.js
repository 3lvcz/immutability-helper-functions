import update from "immutability-helper";
import ioc from "./ioc";

function resolveFirstOptional(args, count, defaultValue) {
  return args.length < count ? [defaultValue, ...args] : args;
}

function createCommandFunction(cmd, destIsOptional) {
  return (src, ...args) => {
    const [dest, payload] = destIsOptional
      ? resolveFirstOptional(args, 2, "")
      : args;
    const query = ioc.toUpdateQuery(cmd, dest, payload);
    return ioc.update(src, query);
  };
}

export const $update = update;
export const $push = createCommandFunction("$push", true);
export const $unshift = createCommandFunction("$unshift", true);
export const $splice = createCommandFunction("$splice", true);
export const $set = createCommandFunction("$set", false);
export const $toggle = createCommandFunction("$toggle", false);
export const $unset = createCommandFunction("$unset", false);
export const $merge = createCommandFunction("$merge", true);
export const $apply = createCommandFunction("$apply", true);
export const $add = createCommandFunction("$add", true);
export const $remove = createCommandFunction("$remove", true);
