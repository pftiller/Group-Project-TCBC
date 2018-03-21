
let isAdminAuthorized = function (req, res, next) {
        if(req.user.role === 3){
        return next();
        } else {
            res.send('User not authorized for action');
        }
  }

  module.exports = isAdminAuthorized;