import jwt from 'jsonwebtoken';

export function signToken(payload, options = {}){
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.sign(payload, secret, { expiresIn: '7d', ...options });
}

export function authMiddleware(req, res, next){
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if(!token){
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  }catch(err){
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

export function optionalAuthMiddleware(req, res, next){
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if(!token){
    return next();
  }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
  }catch{
    // ignore token errors for optional auth
  }
  next();
}


