const crypto = require("crypto");
const store = require("../lib/store");
const BASE = process.env.SOCURE_BASE_URL || "https://riskos.sandbox.socure.com";

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const b = req.body || {};
  try {
    const r = await fetch(`${BASE}/api/evaluation`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SOCURE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: `docv-${crypto.randomUUID()}`,
        timestamp: new Date().toISOString(),
        workflow: process.env.SOCURE_WORKFLOW_NAME,
        data: {
          individual: {
            given_name: b.givenName,
            family_name: b.familyName,
            date_of_birth: b.dateOfBirth || undefined,
            phone_number: b.phoneNumber,
            email: b.email || undefined,
            address: {
              line_1: b.addressLine1 || undefined,
              locality: b.locality || undefined,
              major_admin_division: b.majorAdminDivision || undefined,
              postal_code: b.postalCode || undefined,
              country: b.country || "US",
            },
          },
        },
      }),
    });
    const json = await r.json();
    const evalId = json.eval_id;
    const docvTransactionToken = json?.data_enrichments?.find(
      (e) => e?.response?.data?.docvTransactionToken
    )?.response?.data?.docvTransactionToken;

    if (docvTransactionToken) {
      await store.set(evalId, "PENDING");
      return res.json({ evalId, docvTransactionToken });
    }
    if (json.decision === "ACCEPT" || json.decision === "REJECT") {
      await store.set(evalId, json.decision);
      return res.json({ evalId, decision: json.decision });
    }
    console.error("Unexpected Socure response:", JSON.stringify(json));
    res.status(502).json({ error: "Socure did not start verification. Check your workflow name and keys." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not reach Socure." });
  }
};
