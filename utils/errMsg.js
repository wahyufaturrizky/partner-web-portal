export const errorMinValue = (value, message) => ({ value, message: message ?? `* minimal value is ${value}` });
export const errorMaxValue = (value, message) => ({ value, message: message ?? `* maximal value is ${value}` });
export const errorMaxLength = (value) => ({ value, message: `* maximal character is ${value}` });
export const errorRequired = () => '* required';
