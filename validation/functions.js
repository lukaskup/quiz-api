import { isRequired, minMax, checkEmail } from "./rules.js";

const messagesQuiz = {
  nameRequired: "validationMessages.nameRequired",
  nameMinMax: "validationMessages.nameMinMax",
  descriptionRequired: "validationMessages.descriptionRequired",
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
  firstnameRequired: "validationMessages.firstnameRequired",
  firstnameMinMax: "validationMessages.firstnameMinMax",
  lastnameRequired: "validationMessages.lastnameRequired",
  emailRequired: "validationMessages.emailRequired",
  passwordRequired: "validationMessages.passwordRequired",
  passwordMinMax: "validationMessages.passwordMinMax",
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
  submittedAtRequired: "validationMessages.submittedAtRequired",
  userRequired: "validationMessages.userRequired",
  quizRequired: "validationMessages.quizRequired",
  scoreRequired: "validationMessages.scoreRequired",
  ratingRequired: "validationMessages.ratingRequired",
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
  if (!!!values.quiz) {
    errors.push(messagesUserQuiz.quizRequired);
  }
  //user
  if (!!!values.user) {
    errors.push(messagesUserQuiz.userRequired);
  }

  return errors;
};
