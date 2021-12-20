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
        if (req.session.loggedin) {
            dbCon.query('SELECT * FROM cupboard WHERE STATUS = 1', (error, results) => {
              if (error) 
              {
                req.flash('error', error);
                res.render('cupboard', { data: '' });
              }
              else {
                dbCon.query('SELECT * FROM slot ', (error, result) => {
                  if (error) 
                  {
                    req.flash('error', error);
                    res.render('cupboard', { data: '' });
                  }
                  else {
                    
                      //SELECT * FROM slot WHERE (drugnum+drugIn)<3
                      res.render('cupboard',{username:req.session.username,sname:req.session.sname,lname:req.session.lname,data: results,dataSlot:result});
                      // connect device cupboard
                      //console.log(results)
                  }
                });  
                  // connect device cupboard
                  //console.log(results)
              }
            });
          }else{
             res.render('index');
          }       

});


router.post('/add', (req, res, next) => {

  var cupid = req.body.cupid;
  var cupName = req.body.cupName;
  var cuplocation = req.body.cuplocation;
  var status = 1;
  var username = req.session.username;
  var action= 1;
  var numslot=req.body.numslot;
  var actiondate;
  var actiontime;
  var errors = false;
      if(cupid.length === 0 || cupName.length === 0 || cuplocation.length === 0 ) {
          errors = true;
          // set flash message
          req.flash('error, please input id and location');
          res.redirect('/cupboard/add')
        }

          // if no error
          if (!errors)
          {
              var form_data = 
              {
                  cupid: cupid,
                  cupName: cupName,
                  cuplocation:cuplocation,
                  status: status,
                  numslot:numslot
              }   
              var form_data_his = 
              {
                  cupid: cupid,
                  username:username,
                  action: action,
                  actiondate:new Date().toISOString().substring(0,10),
                  actiontime:new Date().toISOString().substring(11,19)
                  
              }  
          // if no erro
          }
        // insert query
        dbCon.query('INSERT INTO cupboard SET ?', form_data, (err, result) => {
          if (err) {
              return res.status(500).send(err);
              req.flash('error', error);

          } else {
            dbCon.query('INSERT INTO historycupboard SET ?', form_data_his, (err, result) => {
              if (err) {
                  return res.status(500).send(err);
                  req.flash('error', error);
        
              } else {
                  req.flash('success', 'cupboard successfully added');
                  //res.redirect('/slot/'+cupid);
                
              }
            })
          }
        })


   
});
router.get('/delete/(:cupid)/(:slotLast)', (req, res, next) => {
    //console.log(req.params.slotLast)
  let slotLast=parseInt(req.params.slotLast);
  let cupid = req.params.cupid;
  let username = req.session.username;
  let sql = "UPDATE cupboard SET  status = 0 WHERE cupid='"+cupid+"'";
  

  var form_data_HisUpdate = 
  {
        cupid: cupid,
        username:username,
        action: 0,
        actiondate:new Date().toISOString().substring(0,10),
        actiontime:new Date().toISOString().substring(11,19)
  }   
    dbCon.query(sql,(err,result)=>{
      if(err){
        throw err;
      }else{
        dbCon.query('INSERT INTO historycupboard SET ?', form_data_HisUpdate, (err, result) => {
          if (err) {
              return res.status(500).send(err);
              req.flash('error', error);
    
          } else {
            for(let j=0;j<slotLast;j++){
                let sqlS = `UPDATE slot SET  slot_action = 0 WHERE cupid='${cupid}' AND slotno = `;
                sqlS=sqlS+(j+1);
                //console.log(sqlS)

                dbCon.query(sqlS, (error, result) => {
                    if (error) {
                      req.flash('error', error);
                      res.render('cupboard', { data: '' });
                    } 
                }); 
            }
             res.redirect('/cupboard')
          } 
        });
      }
    })

});
 
router.post('/addSlot', (req, res, next) => {
    //console.log(req.body);
    //INSERT INTO slot VALUES ('asd', '1', 'asd', '3', '5', NULL), ('sd', '2', 'asd', '3', '7', NULL);
    let mySlotSql="INSERT INTO slot  VALUES ";
    let mySlotSqlC="INSERT INTO cell_slot_cup  VALUES"
    for(let i=0;i<req.body.sNumSlot;i++){
      mySlotSql = mySlotSql +`('${req.body.sCupid}','${i+1}' , '${req.body.drugid[i]}', 0, '${req.body.drugIn[i]}',NULL,1)`;
        if((i+1)<req.body.sNumSlot){
          mySlotSql=mySlotSql+",";
        }
        for(let j=0;j<9;j++){
          
          if((i+1)==req.body.sNumSlot && (j+1)==9){
            mySlotSqlC = mySlotSqlC +`('${req.body.sCupid}','${i+1}' , '${req.body.drugid[i]}',${j+1},NULL,NULL)`;
          }else{
            mySlotSqlC = mySlotSqlC +`('${req.body.sCupid}','${i+1}' , '${req.body.drugid[i]}',${j+1},NULL,NULL),`;
          }

        } 
       
        

    }
    
    //console.log(mySlotSql);
    //console.log(mySlotSqlC);
    dbCon.query(mySlotSql, (error, results) => {
      if (error) 
      {
        req.flash('error', error);
        res.render('cupboard', { data: '' });
      }
      else {
        dbCon.query(mySlotSqlC, (error, results) => {
          if (error) 
          {
            req.flash('error', error);
            res.render('cupboard', { data: '' });
          }
          else {
              res.redirect('/slot/'+req.body.sCupid);
              // connect device cupboard
              //console.log(results)
          }
        });
      }
    });
    
  });

// router.get('/delete/(:id)', (req, res, next) => {
//   let id = req.params.id
//   let sql = "DELETE FROM cupboard WHERE cupboard.id = "+id
//   dbCon.query(sql,(err,result)=>{
//     if(err){
//       throw err;
//     }else{
//       res.redirect('/cupboard')
//     }
//   })
// });

module.exports = router;

