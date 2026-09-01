const returnService = require("../services/returnService");

const getReturns = (req, res) => {
  const returns = req.app.locals.returns || [];

  const filtered = returnService.filterReturns(
    returns,
    req.query
  );

  const result = returnService.paginateReturns(
    filtered,
    req.query.page,
    req.query.limit
  );

  res.json({
    success: true,
    returns: result.data,
    summary: returnService.getSummary(filtered),
    pagination: result.pagination
  });
};

const getReturn = (req, res) => {
  const returns = req.app.locals.returns || [];

  const item = returnService.getReturnById(
    returns,
    req.params.id
  );

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Return not found"
    });
  }

  res.json({
    success: true,
    return: item
  });
};

const updateReturn = (req, res) => {
  const returns = req.app.locals.returns || [];

  try {
    const item = returnService.updateReturn(
      returns,
      req.params.id,
      req.body.action,
      req.body
    );

    res.json({
      success: true,
      return: item
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Unable to update return"
    });
  }
};

module.exports = {
  getReturns,
  getReturn,
  updateReturn
};