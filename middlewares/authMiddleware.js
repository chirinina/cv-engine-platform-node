const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Sin token, autorización denegada" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET || "supersecret",
    );
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Debes Iniciar Sesión" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Acceso denegado, solo para administradores" });
  }
};

module.exports = { authMiddleware, adminMiddleware };
