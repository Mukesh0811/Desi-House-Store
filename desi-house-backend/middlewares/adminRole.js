module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // allow single role or array of roles
    if (!Array.isArray(allowedRoles)) {
      allowedRoles = [allowedRoles];
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        message: "Access denied. You don't have permission to access this resource.",
      });
    }

    next();
  };
};
