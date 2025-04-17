const mongoose = require("mongoose");

// Add this line to suppress the warning
mongoose.set("strictQuery", false); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => console.log("MongoDB connected successfully"));
mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

module.exports = mongoose;
