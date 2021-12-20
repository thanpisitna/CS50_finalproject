var express = require('express');
var router = express.Router();

var dbCon = require('../db');
var timestamp = 1607110465663
var date = new Date(timestamp);

console.log("Date: "+date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear()+
          " "+date.getHours()+
          ":"+date.getMinutes()+
          ":"+date.getSeconds());

// homepage route
router.get('/', function(req, res, next) {
  if (req.session.loggedin) {}
  else{
        res.redirect('/')
      }
});
router.get('/(:cupid)', function(req, res, next) {
        let cupid = req.params.cupid;
        if (req.session.loggedin) {
            dbCon.query('SELECT * FROM cupboard WHERE cupid = "'+cupid+'" ', (error, result) => {
              if (error) 
              {
                req.flash('error', error);
                res.render('cupboard', { data: '' });
              }
              else {
                dbCon.query('SELECT * FROM slot WHERE cupid = "'+cupid+'"  and slot_action = "1"', (error, results) => {
                    if (error) 
                    {
                      req.flash('error', error);
                      res.render('cupboard', { dataS: '' });
                    }
                    else {
                        
                        res.render('slot',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,data: result,dataS: results});
                        // connect device cupboard
                        //console.log(results);
                    }
                });
                  
              }
            });
          }else{
             res.redirect('/');
          }       

});
router.post('/addNumD', function(req, res, next) {
     
  for(let i=0;i<req.body.drugIn.length;i++){
        let mysqlIn="UPDATE slot SET drugIn=";
        mysqlIn=mysqlIn+req.body.drugIn[i]+` WHERE cupid='${req.body.cupid}' and slotno ='${req.body.slotnumber[i]}' `;
        dbCon.query(mysqlIn, (error, result) => {
            if (error) {
              req.flash('error', error);
              res.render('cupboard', { data: '' });
            } 
        });
  }
  res.redirect('/slot/'+req.body.cupid);
 
});
router.get('/deleteSlot/(:cupid)/(:slotno)', function(req, res, next) {
  if (req.session.loggedin) {
        let MysqlDeS = "UPDATE slot SET  slot_action = 0 WHERE cupid='"+req.params.cupid+"' and slotno="+req.params.slotno;
        let MysqlDeC = `UPDATE cupboard SET  numslot = (numslot-1)  WHERE cupid='${req.params.cupid}'`;
        console.log(MysqlDeC)
        //console.log(MysqlDeS)
        dbCon.query(MysqlDeS, (error, result) => {
          if (error) {
            req.flash('error', error);
            res.render('slot', { data: '' });
          }else{
            dbCon.query(MysqlDeC, (error, result) => {
              if (error) {
                req.flash('error', error);
                res.render('slot', { data: '' });
              }else{
                let sdata=new Date().toISOString().substring(0,10);
                let stime=new Date().toISOString().substring(11,19);
                let mysqlAddH=`INSERT INTO historyslot VALUES (null,'${req.params.cupid}','${req.params.slotno}','${req.session.username}','${sdata}','${stime}','0');` 
                dbCon.query(mysqlAddH, (error, result) => {
                  if (error) {
                    req.flash('error', error);
                    res.render('slot', { data: '' });
                  }else{
                    res.redirect('/slot/'+req.params.cupid);
                  }
                });
                
              }
            });   
          }
        });
  }else{
    res.redirect('/');
  }
});
router.post('/editSlot', function(req, res, next) {
  if (req.session.loggedin) {
      let sdata=new Date().toISOString().substring(0,10);
      let stime=new Date().toISOString().substring(11,19);
      // console.log(mysqlAddH);
 
      let mysqlSD=`UPDATE slot SET drugid='${req.body.editDrugId}' WHERE cupid='${req.body.eCupid}' AND slotno='${req.body.eSlotno}' `;
      dbCon.query(mysqlSD, (error, result) => {
        if (error) {
          req.flash('error', error);
          res.render('slot', { data: '' });
        }else{
          let mysqlAddH=`INSERT INTO historyslot VALUES (null,'${req.body.eCupid}','${req.body.eSlotno}','${req.session.username}','${sdata}','${stime}','2');` 
          dbCon.query(mysqlAddH, (error, result) => {
            if (error) {
              req.flash('error', error);
              res.render('slot', { data: '' });
            }else{
              res.redirect('/slot/'+req.body.eCupid);
            }
          });
          
        }
      });
  }else{
    res.redirect('/')
  }
});
router.post('/addSlotD', function(req, res, next) {
  if (req.session.loggedin) {
      let slotl=parseInt(req.body.slotl)+1;

      //console.log(MysqlAeC)
        
      //console.log(req.body)
      //SELECT*from slot WHERE slot_action=0
      dbCon.query(`SELECT slotno from slot WHERE slot_action=0 and cupid='${req.body.cupid}'`, (error, result) => {
        if (error) {
          req.flash('error', error);
          res.render('slot', { data: '' });
        }else{
          //console.log(result)
          //มีสล็อตเก่าอยู่เเล้ว
          if(result.length>0){
              let MysqlAddS=`UPDATE slot SET  drugid='${req.body.drugid}',slot_action=1 WHERE cupid='${req.body.cupid}' AND slotno=${result[0].slotno}`
              //console.log(MysqlAddS)
              dbCon.query(MysqlAddS, (error, results) => {
                if (error) {
                  req.flash('error', error);
                  res.render('slot', { data: '' });
                }else{
                  let MysqlAeC = `UPDATE cupboard SET  numslot = (numslot+1)  WHERE cupid='${req.body.cupid}'`;
                  dbCon.query(MysqlAeC, (error, results) => {
                    if (error) {
                      req.flash('error', error);
                      res.render('slot', { data: '' });
                    }else{
                        ///เพิ่มประวัติ
                        let sdata=new Date().toISOString().substring(0,10);
                        let stime=new Date().toISOString().substring(11,19);
                        let sqlAddH=`INSERT INTO historyslot VALUES (null,'${req.body.cupid}','${result[0].slotno}','${req.session.username}','${sdata}','${stime}','1');` 
                        dbCon.query(sqlAddH, (error, result) => {
                          if (error) {
                            req.flash('error', error);
                            res.render('slot', { data: '' });
                          }else{
                            res.redirect('/slot/'+req.body.cupid);
                          }
                        });
                     // res.redirect('/slot/'+req.body.cupid);
                    }
                  }); 
                }
              }); 
              //ยังไม่มีสล็อตเก่า 
          }else{
            let MysqlAddSlot=`INSERT INTO slot VALUES ('${req.body.cupid}', '${slotl}', '${req.body.drugid}', '0', '0', NULL,1)`;
          
            //console.log(MysqlAddSlot);
            dbCon.query(MysqlAddSlot, (error, result) => {
              if (error) {
                req.flash('error', error);
                res.render('slot', { data: '' });
              }else{
                  let MysqlAeC = `UPDATE cupboard SET  numslot = (numslot+1)  WHERE cupid='${req.body.cupid}'`;
                  dbCon.query(MysqlAeC, (error, result) => {
                    if (error) {
                      req.flash('error', error);
                      res.render('slot', { data: '' });
                    }else{
                      dbCon.query(`SELECT slotno from slot WHERE cupid='${req.body.cupid}'`, (error, result) => {
                        if (error) {
                          req.flash('error', error);
                          res.render('slot', { data: '' });
                        }else{
                          ///เพิ่มประวัติ
                          let sdata=new Date().toISOString().substring(0,10);
                          let stime=new Date().toISOString().substring(11,19);
                          let sqlAddH=`INSERT INTO historyslot VALUES (null,'${req.body.cupid}','${result[(result.length-1)].slotno}','${req.session.username}','${sdata}','${stime}','1');` 
                          dbCon.query(sqlAddH, (error, result) => {
                            if (error) {
                              req.flash('error', error);
                              res.render('slot', { data: '' });
                            }else{
                              res.redirect('/slot/'+req.body.cupid);
                            }
                          });
                          //res.redirect('/slot/'+req.body.cupid);
                        }
                      });
                      
        
                    }
                  });  
              }
            });
          }
          //res.redirect('/slot/'+req.body.eCupid);
        }
      });
    }else{
      res.redirect('/')
    }
});
module.exports = router;