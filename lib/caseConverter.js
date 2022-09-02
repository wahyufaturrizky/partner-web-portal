import camelCase from "lodash.camelcase";
import snakeCase from "lodash.snakecase";

/**
 * deeply converts keys of an object from one case to another
 * @param {object} object to convert
 * @param {function} function to convert key.
 * @return converted object
 */
const convertCase = (oldObject, converterFunction) => {
  let newObject;

  if (!oldObject || typeof oldObject !== "object" || !Object.keys(oldObject).length) {
    return oldObject;
  }

  if (Array.isArray(oldObject)) {
    newObject = oldObject?.map((element) => convertCase(element, converterFunction));
  } else {
    newObject = {};
    Object.keys(oldObject).forEach((oldKey) => {
      if (oldKey !== "locale_properties") {
        const newKey = converterFunction(oldKey);
        newObject[newKey] = convertCase(oldObject[oldKey], converterFunction);
      } else {
        const newKey = converterFunction(oldKey);
        newObject[newKey] = oldObject[oldKey];
      }
    });
  }

  return newObject;
};

export const toCamelCase = (obj) => convertCase(obj, camelCase);
export const toSnakeCase = (obj) => convertCase(obj, snakeCase);
