const Joi = require("joi");

const signupValidate = (data) => {
  const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    userId: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });

  return signupSchema.validate(data);
};

module.exports.signupValidate = signupValidate;
