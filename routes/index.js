var express = require('express');
var router = express.Router();
var db = require('../db');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/auth', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
      db.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
          if (results.length > 0) {
              request.session.loggedin = true;
              request.session.username = username;
              request.session.sname=results[0].sname;
              request.session.lname =results[0].lname; 
              response.redirect('/home');
          } else {
            request.flash('error','error');
              response.redirect('/');
          }            
          response.end();
      });
  } else {
      response.send('Please enter Username and Password!');
      response.end();
  }
});
router.get('/drug', function(request, response) {
    if (request.session.loggedin) {
        response.render('drug',{username:request.session.username,sname:request.session.sname,lname:request.session.lname});
    } else {
        response.render('index');
    }
    response.end();
});



router.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.render('home',{username:request.session.username,sname:request.session.sname,lname:request.session.lname});
    } else {
        response.render('index');

    }
    response.end();
});



router.get('/logout',(req,res)=>{
    //session destroy
    req.session.loggedin = null;
    req.session.username = null;
    req.session.password = null;
    res.session = null;
    res.redirect('/');
});


module.exports = router;

