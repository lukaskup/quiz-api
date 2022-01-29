import { isRequired, minMax, checkEmail } from "./rules.js";

const messagesQuiz = {
  nameRequired: "please provide correct name",
  nameMinMax: "name should have length between 3 and 20",
  descriptionRequired: "please provide correct description",
};

export const validateQuiz = (values) => {
  const errors = [];

  if (!isRequired(values.name)) {
    errors.push(messagesQuiz.nameRequired);
  }
  if (!minMax(values.name, 3, 20)) {
    errors.push(messagesQuiz.nameMinMax);
  }

  //description
  if (!isRequired(values.description)) {
    errors.push(messagesQuiz.descriptionRequired);
  }

  return errors;
};

const messagesUser = {
  firstnameRequired: "please provide correct first name",
  firstnameMinMax: "firstname should have length between 3 and 20",
  lastnameRequired: "please provide correct lastname",
  emailRequired: "please provide correct email",
  passwordRequired: "please provide correct password",
  passwordMinMax: "password should have length between 8 and 60",
};

export const validateUser = (values) => {
  const errors = [];

  if (!isRequired(values.firstname)) {
    errors.push(messagesUser.firstnameRequired);
  }
  if (!minMax(values.firstname, 3, 20)) {
    errors.push(messagesUser.firstnameMinMax);
  }

  //lastname
  if (!isRequired(values.lastname)) {
    errors.push(messagesUser.lastnameRequired);
  }

  //email
  if (!isRequired(values.email)) {
    errors.push(messagesUser.emailRequired);
  }
  if (!checkEmail(values.email)) {
    errors.push(messagesUser.emailRequired);
  }

  //password
  if (!isRequired(values.password)) {
    errors.push(messagesUser.passwordRequired);
  }
  if (!minMax(values.password, 8, 60)) {
    errors.push(messagesUser.passwordMinMax);
  }

  return errors;
};

const messagesUserQuiz = {
  submittedAtRequired: "please provide submitted at",
  userRequired: "pleasae select user",
  quizRequired: "please select quiz",
  scoreRequired: "score should be between 1 and 10",
  ratingRequired: "rating should be between 1 and 10",
};

export const validateUserQuiz = (values) => {
  const errors = [];

  if (values.rating && !(values.rating >= 1 && values.rating <= 10)) {
    errors.push(messagesUserQuiz.ratingRequired);
  }
  if (!(values.score >= 1 && values.score <= 10)) {
    errors.push(messagesUserQuiz.scoreRequired);
  }
  //quiz
  if (!!!values.quiz?._id) {
    errors.push(messagesUserQuiz.quizRequired);
  }
  //user
  if (!!!values.user?._id) {
    errors.push(messagesUserQuiz.userRequired);
  }

  return errors;
};
