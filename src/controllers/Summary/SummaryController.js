module.exports = {
  SummaryPost: (req, res) => {
    // const {} = req.body;
    console.log(req.body);
    return res.status(200).json({
      message: "Ok",
    });
  },
};
