import express, { json } from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

config();
const app = express();

app.use(json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/auth", require("./routes/auth.routes").default);
app.use("/api/v1/products", require("./routes/product.routes").default);
app.use("/api/v1/orders", require("./routes/order.routes").default);
app.use("/api/v1/reviews", require("./routes/review.routes").default);
app.use("/api/v1/recommendations", require("./routes/recommendation.routes").default);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
