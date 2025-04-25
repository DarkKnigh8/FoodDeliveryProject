const Driver = require('../models/Driver');

exports.registerDriver = async (req, res) => {
  const { name, lat, lng } = req.body;
  const driver = new Driver({ name, currentLocation: { lat, lng } });
  await driver.save();
  res.status(201).json(driver);
};

exports.updateDriverLocation = async (req, res) => {
  const { driverId } = req.params;
  const { lat, lng } = req.body;
  const driver = await Driver.findByIdAndUpdate(driverId, { currentLocation: { lat, lng } }, { new: true });
  res.json(driver);
};
