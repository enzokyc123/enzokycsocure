module.exports = (req, res) => res.json({ sdkKey: process.env.SOCURE_SDK_KEY || "" });
