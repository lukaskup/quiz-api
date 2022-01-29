export const isRequired = (value) => {
  return !!value.trim();
};

export const minMax = (value, min, max) => {
  return value.length >= min && value.length <= max;
};

export const checkEmail = (value) => {
  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(value);
};
