// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
  if (req.session.user) {
      next();
  }else{
      res.redirect('/login');
  }
};

// GET /login -- Formulario de login
exports.new = function(req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

// POST / login   --Crear la session
exports.create = function(req, res){

	var login    = req.body.login;
	var password = req.body.password;

	var userController = require ('./user_controller');
	userController.autenticar(login, password, function(error, user){

		if (error){
			req.session.errors = [{"message": "Se ha producido un error: "+error}];
			res.redirect("/login");
			return;
		}
		// Crear req.session.user y guardar campos id y username
		// La sesión se define por la existencia de: req.session.user
		req.session.user = {id:user.id, username:user.username};
    var fecha = new Date();
    var fecha = new Date(fecha.getTime()+120000);
    var minInicio = fecha.getMinutes() - 2;
    req.session.user.tiempoLim =  fecha;
    req.session.cookie.expires =  fecha;
    
    console.log("\nInicio de sesión: " + fecha.getHours() + ":" + minInicio + ":" + fecha.getSeconds());
    console.log("\nCaducidad de la sesión por inactividad: "+ fecha.getHours() + ":" +fecha.getMinutes() + ":" + fecha.getSeconds() + "\n");

		res.redirect(req.session.redir.toString()); // Redicciona al path anterior al login
	});
};

// DELETE /logout -- Destruir la sesión
exports.destroy = function(req, res) {
  delete req.session.user;
  //res.redirect(req.session.redir.toString());
  res.redirect(req.session.redir.toString());
};
