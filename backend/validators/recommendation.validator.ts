import Joi from "joi";

const recommendationSchema = Joi.object({
  user_id: Joi.string().required(),
  product_id: Joi.string().required(),
  category: Joi.string().required(),
  visit_count: Joi.number().integer().min(1).default(1)
});

export { recommendationSchema };
