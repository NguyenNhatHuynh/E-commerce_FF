const mongoose = require("mongoose")

module.exports.connect = () => {
    mongoose.connect('mongodb+srv://phisuka0122386:saolon0123@dataffn.ea8szgk.mongodb.net/DataFFN')
  .then(() => console.log('Connected!'));
}

