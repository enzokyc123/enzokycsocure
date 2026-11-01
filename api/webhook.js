const crypto = require("crypto");
const store = require("../lib/store");

function isAuthorized(header) {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = async (req, res) => {
  if (!isAuthorized(req.headers.authorization)) {
    return res.status(401).send("Unauthorized");
  }
  const event = req.body || {};
  if (event.event_type !== "evaluation_completed") return res.status(200).send("Ignored");
  const { eval_id, decision } = event.data || {};
  if (eval_id) await store.set(eval_id, decision);
  console.log("Webhook:", eval_id, decision);
  res.status(200).send("OK");
};
