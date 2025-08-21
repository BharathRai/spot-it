const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.accessToken) {
      return next();
    } else {
      res.status(401).json({ error: 'Unauthorized: You must be logged in.' });
    }
  };
  
  module.exports = { isAuthenticated };