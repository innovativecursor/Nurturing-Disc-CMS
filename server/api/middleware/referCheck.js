const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://admin.thepropshopworldwide.com",
];

const refererCheck = (req, res, next) => {
  const referer = req.headers.referer;
  const origin = req.headers.origin;

  if (referer || origin) {
    const refererOrigin = referer ? new URL(referer).origin : null;
    const requestOrigin = origin || refererOrigin;

    if (allowedOrigins.includes(requestOrigin)) {
      return next();
    }
  }

  return res.status(403).json({ message: "Forbidden" });
};

module.exports = refererCheck;
