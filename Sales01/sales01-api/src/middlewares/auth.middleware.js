export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // CASO A: Hay un token
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
      } catch (error) {
        return res.status(403).json({ error: "Token inválido" });
      }
    }

    // CASO B: No hay token, pero estamos en DEV (Viene de api.http)
    if (process.env.NODE_ENV === "development") {
      const id = req.headers["x-user-id"];
      if (id) {
        const user = await UserModel.findById(id);
        if (user) {
          req.user = {
            id: user.id,
            username: user.username,
            role: user.role,
            preferences: user.preferences || {},
          };
          return next();
        }
      }
    }
  } catch (error) {
    console.log("Error en verifyToken:", error);
    res.status(403).json({ error: "Invalid token...." });
  }
};

/*export const verifyToken2 = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(403)
      .json({ error: "No se proporcionó un token (Sesión no encontrada)" });
  }

  try {
    const decoded = jwt.verify(token, "TU_CLAVE_SECRETA_SUPER_SEGURA");
    const userId = decoded.id;
    let userData = await redis.get(`user:session:${decoded.id}`);

    if (userData) {
      req.user = JSON.parse(userData);
      return next();
    }

    console.log("Redis vacío, consultando PostgreSQL...");
    const user = await UserModel.findById(userId);
    if (!user || !user.is_active) {
      res.clearCookie("token");
      return res
        .status(401)
        .json({ error: "Sesión inválida o usuario desactivado" });
    }

    req.user = await saveUserSession(user);

    next();
  } catch (error) {
    const expiredData = jwt.decode(token);

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    if (error.name === "TokenExpiredError") {
      console.log("Token expirado");

      if (expiredData && expiredData.id) {
        deleteUserSession(expiredData.id);
        console.log(
          `Caché en Redis limpia para usuario ${expiredData.id} por token expirado`,
        );
      }

      return res.status(401).json({
        error: "TOKEN_EXPIRED",
        message: "Tu sesión ha expirado",
      });
    }
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
};
*/

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    const hasPermission = roles
      .map((r) => r.toLowerCase())
      .includes(req.user.role);

    if (!hasPermission) {
      console.warn(
        `Bloqueado: Usuario ${req.user.id} con rol [${req.user.role}] intentó acceder.`,
      );
      return res.status(403).json({
        error: "Acceso denegado.",
      });
    }

    next();
  };
};
