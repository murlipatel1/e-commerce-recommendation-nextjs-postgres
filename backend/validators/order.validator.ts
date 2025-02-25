import Joi from "joi";

const orderSchema = Joi.object({
  user_id: Joi.string().required(),
  total_price: Joi.number().positive().required(),
  status: Joi.string().valid('pending', 'shipped', 'delivered', 'cancelled').default('pending')
});

export { orderSchema };
