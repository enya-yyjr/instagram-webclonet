const Joi = require("joi");
const jwt = require("jsonwebtoken");

exports.userValidate = (data) => {
  const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    userId: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return userSchema.validate(data);
};

exports.editValidate = (data) => {
  const editSchema = Joi.object({
    email: Joi.string().required().email(),
    userId: Joi.string().required(),
  });
  return editSchema.validate(data);
};

exports.passwordValidate = (data) => {
  const passwordSchema = Joi.object({
    newPwd: Joi.string().min(6).required(),
    newPwdCheck: Joi.string().min(6).required(),
  });
  return passwordSchema.validate(data);
};

exports.isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer") {
    return res.status(401).json({ message: "Not authenticated" });
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.statusCode = 498;
      error.message = "Token expired";
      throw error;
    }
    error.statusCode = 401;
    error.message = "Not authenticated";
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
