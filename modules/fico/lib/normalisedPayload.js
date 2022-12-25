/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */

export const normalisedPayload = (payload = {}, willRemoveKey = []) => {
  for (const item of Object.keys(payload)) {
    payload[item] = payload[item] || '';

    if (willRemoveKey.includes(item)) {
      delete payload[item];
    }
  }
  return payload;
};
