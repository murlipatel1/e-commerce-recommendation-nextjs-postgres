import Joi from "joi";

const productSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().required()
});

export { productSchema };
