// pages/api/protectedData.js
export default function handler(req, res) {
  res.status(200).json({ data: "This is protected data" });
}
