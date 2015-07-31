var models = require('../models/models.js');

// GET /quizes/question
exports.show = function(req, res) {
    models.Quiz.findById(req.params.quizId).then(function(quiz) {
	res.render('quizes/show', { quiz: quiz})
    })
};

// GET /quizes
exports.index= function(req, res) {
  if(req.query.search) {
    var search = (req.query.search || '').replace(" ", "%");
    models.Quiz.findAll({where:["pregunta like ?", '%'+search+'%'],order:'pregunta ASC'}).then(function(quizes) {
      res.render('quizes/index', {quizes: quizes});
    }).catch(function(error){next(error);});
  }
  else
  {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index', {quizes: quizes});
  }).catch(function(error) { next(error);});
  }
};

// GET /quizes/answer
exports.answer = function(req, res) {
    models.Quiz.findById(req.params.quizId).then(function(quiz) {
      if (req.query.respuesta === quiz.respuesta)
      {
        res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
      }
      else
      {
        res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto'});
      }
    })
};
