const jwt = require('jsonwebtoken');

/**
 * Middleware pour authentifier les utilisateurs via JWT.
 * Il extrait et vérifie le token, puis injecte les infos utilisateur dans req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Vérifier que le header commence bien par "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Token d\'authentification manquant ou mal formé'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token non fourni'
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Injecter les données utilisateur dans req.user
    req.user = {
      _id: decoded.userId || decoded.id, // adapte selon ce que tu codes dans ton token
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);

    let message = 'Token invalide';
    if (error.name === 'TokenExpiredError') {
      message = 'Token expiré';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Token mal formé';
    }

    return res.status(401).json({ 
      success: false,
      message 
    });
  }
};

module.exports = authenticate;
