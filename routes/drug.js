var express = require('express');
const con = require('../db');
var router = express.Router();
var dbCon = require('../db');
var timestamp = 1607110465663
var date = new Date(timestamp);

router.get('/in',function(req,res){
    if (req.session.loggedin) {
        
        dbCon.query('SELECT DISTINCT drugid FROM slot where slot_action=1 ORDER BY drugid ', (error, result) => {
            if (error) 
            {
                req.flash('error', error);
                res.render('drugin',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,data:"",datac:"",datan:"",datasum:""});
            }
            else {
                dbCon.query("SELECT cupid FROM cupboard WHERE status=1 order by cupid", (error, resultc) => {
                    if (error) {
                        req.flash('error', error);
                        res.render('drugin',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,data:"",datac:"",datan:"",datasum:""});
                    }else {
                            if(resultc.length>0){
                                let dataN=[];
                                for(let i=0;i<resultc.length;i++){
                                    let mysqlnumIn=`select drugid,sum(drugIn) as drugin from slot where cupid ='${resultc[i].cupid}' and slot_action=1 GROUP BY drugid`;
                                    //console.log(mysqlnumIn)
                                    dbCon.query(mysqlnumIn, (error, resultn) => {
                                                if (error) {
                                                    req.flash('error', error);
                                                    res.render('drugin',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,data:"",datac:"",datan:"",datasum:""});
                                            
                                                }else{
                                                        //console.log(resultn)
                                                        for(let j=0;j<resultn.length;j++){
                                                            dataN.push({cupid:resultc[i].cupid,drugid:resultn[j].drugid,drugIn:resultn[j].drugin})
                                                        }   
                                                        // dataN.push(resultc[i].cupid,{resultn})
                                                        if((i+1)==(resultc.length)){
                                                            dbCon.query('SELECT drugid,sum(drugIn) as drugsum FROM slot WHERE slot_action=1 GROUP BY drugid ', (error, resultsum) => {
                                                                if (error) 
                                                                {
                                                                    req.flash('error', error);
                                                                    res.render('drugin',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,data:"",datac:"",datan:"",datasum:""});
                                            
                                                                }
                                                                else {

                                                                    res.render('drugin',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,data:result,datac:resultc,datan:dataN,datasum:resultsum});
                                                
                                                                }
                                                            });
                                                            
                                                        }
            
                                                    }
                                    });
                                
                                }
                            }else{
                                res.render('drugin',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,data:"",datac:"",datan:"",datasum:""});
                            }
                        //res.render('drugin',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,data:result,datac:resultc,datan:"",datasum:""});
                    }  
                });
                //res.render('drugin',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,data:result,datac:"",datan:"",datasum:""});
                                      
              
            }
        });
      
    }else{
        res.redirect('/');
    }
});

module.exports = router;