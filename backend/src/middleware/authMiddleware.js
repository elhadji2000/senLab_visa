const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  // 1. Vérification du header Authorization
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      message: 'Authorization token manquant' 
    });
  }

  // 2. Extraction du token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Vérification du token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // 4. Ajout des infos utilisateur à la requête
    req.user = { 
      id: decoded.userId, 
      role: decoded.role 
    };
    
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    
    // Messages d'erreur spécifiques
    let message = 'Token invalide';
    if (error.name === 'TokenExpiredError') {
      message = 'Token expiré';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Token malformé';
    }

    return res.status(401).json({ 
      success: false,
      message 
    });
  }
};

module.exports = authenticate;