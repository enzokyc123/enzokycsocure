const store = require("../lib/store");

module.exports = async (req, res) => {
  const id = req.query.id;
  res.json({ decision: id ? await store.get(id) : "PENDING" });
};
