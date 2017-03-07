module.exports = function(req, res, next) {
  var UserSystem = Parse.Object.extend("UsersSystem");
  var query = new Parse.Query(UserSystem);
  query.equalTo("username", req.cookies.usr_fid);
  var promise = query.first({
    success: function(usuario) {
      //console.log("Se encontro al usuario: " + usuario.id);
      req.currentUser = usuario;
      next();
    },
    error: function(error) {
      console.log(error.message);
      req.currentUser = null;
      next();
    }
  });
}