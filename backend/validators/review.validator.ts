import Joi from "joi";

const reviewSchema = Joi.object({
  product_id: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().required()
});

export { reviewSchema };
