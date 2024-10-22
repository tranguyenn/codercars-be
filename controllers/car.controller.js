const mongoose = require("mongoose");
const Car = require("../models/Car");
const { sendResponse } = require("../helpers/utils");
const carController = {};

carController.createCar = async (req, res, next) => {
  try {
    const { make, model, release_date, transmission_type, size, style, price } =
      req.body;
    if (
      (!make || !model ||!release_date || !transmission_type || !size || !style || !price)
    ) {
      throw new AppError(
        400,
        "Bad Request",
        "Create Task Error Lacking Name or Des"
      );
    }
    const info = {
      make: make,
      model: model,
      release_date: release_date,
      transmission_type: transmission_type,
      size: size,
      style: style,
      price: price,
    };
	const created = await Car.create(info);
    sendResponse(
      res,
      200,
      true,
      { car: created },
      null,
      "Create Car Successfully!"
    );
 
  } catch (err) {
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  try {
    let { page } = req.query;
	console.log(page);
	page=page? page: 1;
    let offset = 12 * (page - 1);
    const cars = await Car.find();
    const findid = await Car.findOne({_id:'6717572368db2aae82a82e4f'});
	console.log(findid);

	const totalPage=Math.ceil(cars.length/12);
    const result = cars.slice(offset, offset+12);
    sendResponse(
      res,
      200,
      true,
      { "cars": result, "page": page, "total": totalPage },
      null,
      "Get Car List Successfully!"
    );
  } catch (err) {
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  try {
	const id=req.params;
	console.log("check id",id.id);
	if(!id) throw new AppError(402, "Bad Request", "Missing id Error");
    const { make, model, release_date, transmission_type, size, style, price } =
      req.body;
	const foundCar= await Car.findOne({_id: id.id, isDeleted: false})
	const info = {
		make: make? make: foundCar.make,
		model: model? model: foundCar.model,
		release_date: release_date? release_date: foundCar.release_date,
		transmission_type: transmission_type? transmission_type: foundCar.transmission_type,
		size: size? size : foundCar.size,
		style: style? style: foundCar.style,
		price: price? price: foundCar.price,
	  };
	  console.log(info);
	  const updated = await Car.findByIdAndUpdate(id.id, {$set: info});
	  sendResponse(
		res,
		200,
		true,
		{ car: updated },
		null,
		"update task Success"
	  );
  } catch (err) {
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  try {
    const {id}=req.params;
	const options = { new: true };
    const updated = await Car.findByIdAndUpdate(id, {isDeleted: true});
    sendResponse(res, 200, true, { car: updated }, null, "Delete task success");
  } catch (err) {
    next(err);
  }
};

module.exports = carController;
