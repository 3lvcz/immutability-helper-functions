import update from "immutability-helper";
import ioc from "../src/ioc";
import { toUpdateQuery } from "../src/query";

let updateInstance = update;
let toUpdateQueryInstance = toUpdateQuery;

ioc.restoreToUpdateQuery = () => (toUpdateQueryInstance = toUpdateQuery);
ioc.stubToUpdateQuery = stub => (toUpdateQueryInstance = stub);
ioc.restoreUpdate = () => (updateInstance = update);
ioc.stubUpdate = stub => (updateInstance = stub);

ioc.update = (...args) => updateInstance(...args);
ioc.toUpdateQuery = (...args) => toUpdateQueryInstance(...args);

export default ioc;
