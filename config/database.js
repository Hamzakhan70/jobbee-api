const mongoose = require("mongoose");

// const connectDatabase = () => {
//   mongoose
//     .connect("mongodb://localhost:27017", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     })
//     .then((con) => {
//       console.log(
//         `MongoDB Database connected with host: ${con.connection.host}`
//       );
//     });
// };

const connectDatabase = () => {
  mongoose.connect("mongodb://localhost:27017").then((con) => {
    console.log(`MongoDB Database connected with host: ${con.connection.host}`);
  });
};

module.exports = connectDatabase;
