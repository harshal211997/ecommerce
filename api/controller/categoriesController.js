const AppError = require("../utils/appError");
const Categories = require("../module/categoriesModule.js");

exports.getCategories = async (req, res, next) => {
  try {
    let user = req.user;
    //Pagination Logic:
    //taking page and limit value from query string:
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 1;
    //defining skip logic for pagination
    //page=1&limit=6 => from 1-6 on page 1
    //page=2&limit=6 => from 7-12 on page 2
    //skip = (page -1) * limit => (2-1) * 6 => 6 i.e. first 6 records skiped for page 2.
    let skip = (page - 1) * limit;
    const categories = await Categories.find().skip(skip).limit(limit);
    let count = categories.length;
    res.status(200).json({
      status: "Sucess",
      message: "Listed All Categories",
      count,
      data: categories,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
