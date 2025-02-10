const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/products", require("./routes/product.routes"));
app.use("/api/v1/orders", require("./routes/order.routes"));
app.use("/api/v1/reviews", require("./routes/review.routes"));
app.use("/api/v1/recommendations", require("./routes/recommendation.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
