import jwt from "jsonwebtoken";

export const authMiddlewere = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "unauthorised request! No token found",
      });
    }

    const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "unauthorised request",
      });
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
