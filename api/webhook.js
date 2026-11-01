const store = require("../lib/store");

module.exports = async (req, res) => {
  const event = req.body || {};
  if (event.event_type !== "evaluation_completed") return res.status(200).send("Ignored");
  const { eval_id, decision } = event.data || {};
  if (eval_id) await store.set(eval_id, decision);
  console.log("Webhook:", eval_id, decision);
  res.status(200).send("OK");
};
