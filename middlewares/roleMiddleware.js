const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ 
        message: `Acceso prohibido: Se requiere rol de [${allowedRoles.join(' o ')}]` 
      });
    }
    next();
  };
};

module.exports = requireRole; 