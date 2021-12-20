var express = require('express');
var router = express.Router();
var dbCon = require('../db');
var timestamp = 1607110465663
var date = new Date(timestamp);
router.get('/', function(req, res) {
    if (req.session.loggedin) {
        dbCon.query('SELECT * FROM historycupboard ', (error, result) => {
            if (error) 
            {
                req.flash('error', error);
                res.render('history', { data: '' });
            }
            else {
                res.render('history',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,data: result});
                // connect device cupboard
                //console.log(results)
            }
        });
    }else{
         res.redirect('/');
    }    
});
router.get('/slot', function(req, res) {
    if (req.session.loggedin) {
        dbCon.query('SELECT * FROM historyslot ', (error, resultS) => {
            if (error) 
            {
                req.flash('error', error);
                res.render('history', { data: '' });
            }
            else {
                res.render('history_slot',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,dataS: resultS});
                // connect device cupboard
                //console.log(results)
            }
        });
    }else{
         res.redirect('/');
    }    
});

module.exports = router;