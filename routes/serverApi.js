var express = require('express');
const con = require('../db');
var router = express.Router();
var dbCon = require('../db');
var timestamp = 1607110465663
// var date = new Date(timestamp);
// var connection = mysql.createConnection({multipleStatements: true});
router.get('/(:cupid)',function(req,res){
    dbCon.query(`set @row_num = 0; SELECT  @row_num := @row_num + 1 as id,slotno,drugid,drugnum,drugIn from slot where cupid='${req.params.cupid}'and slot_action=1 `, (error, result) => {
    console.log()
        if (error) 
        {
            req.flash('error', error);
            res.render('history', {  result: '' });
        }
        else {
            return res.send(result[1])
        
        }
    });
});
router.post('/getDrugNum',function(req,res){

    let cupid=req.body.cupid;
    let slotno=req.body.slotno;
    let mySqlAdd=`UPDATE slot SET drugnum=(drugnum+1),drugIn=(drugIn-1) WHERE cupid='${cupid}' and slotno='${slotno}' and slot_action=1`;
    //return res.send(mySqlAdd)
    dbCon.query(mySqlAdd, (error, result) => {
        if (error) 
        {
            req.flash('error', error);
            res.render('history', {  result: '' });
            return res.send(result)
        }
        else {
            return res.send(result)
        
        }
    });
});

router.post('/checkLpIn',function(req,res){
    let cupid=req.body.cupid;
    let slotno=req.body.slotno;
    //console.log(cupid)
    //console.log(slotno)

     let sqlLen=`SELECT COUNT(cupid) as legth FROM cell_slot_cup WHERE p_out='' and cupid='${cupid}' and slotno=${slotno}`;
    
    dbCon.query(sqlLen, (error, result) => {
        if (error) 
        {
            result="error";
            return res.send(result)
        }
        else {
            return res.send(result)
        
        }
    });
 
});
router.post('/addpIn',function(req,res){
    let cupid=req.body.cupid;
    let slotno=req.body.slotno;
    let p_in=req.body.p_in;


    let sqlsp=`SELECT * FROM cell_slot_cup WHERE p_in='' and cupid='${cupid}' and slotno=${slotno}`;
    
    
    dbCon.query(sqlsp, (error, result) => {
        if (error) 
        {
            result="error";
            return res.send(result)
        }else {
            //console.log(result)
            if(result.length>0){
                //console.log(result)
                let sqlad=`UPDATE cell_slot_cup SET p_in='${p_in}' WHERE cupid='${cupid}' and slotno=${slotno} and cell_slot=${result[0].cell_slot}`
                //console.log(sqlad)
                //return res.send(result)
                dbCon.query(sqlad, (error, results) => {
                    if (error) 
                    {
                        results="error";
                        return res.send(results)
                    }else{
                        return res.send(results)
                    }
                });
            }else{
                result="noLoop"
                return res.send(result)
            }
        }
    });
 
});
router.post('/addpInnotN',function(req,res){
    let cupid=req.body.cupid;
    let slotno=req.body.slotno;
    let p_in=req.body.p_in;
    let sqlsp=`SELECT * FROM cell_slot_cup WHERE p_out=!'' and cupid='${cupid}' and slotno=${slotno}`;
    //console.log(sqlsp)
    
    dbCon.query(sqlsp, (error, result) => {
        if (error) 
        {
            result="error";
            return res.send(result)
        }else {
            //return res.send(result)
            if(result.length>0){
                let sqlad=`UPDATE cell_slot_cup SET p_in='${p_in}' ,p_out=null WHERE cupid='${cupid}' and slotno=${slotno} and cell_slot=${result[0].cell_slot}`
                //console.log(sqlad)
                //return res.send(result)
                dbCon.query(sqlad, (error, results) => {
                    if (error) 
                    {
                        results="error";
                        return res.send(results)
                    }else{
                        return res.send(results)
                    }
                });
            }else{
                result="noLoop"
                return res.send(result)
            }
        }
    });
 
});
router.post('/passcode',function(req,res){
    //return res.send("555")
    var pass_code = req.body.pass_code;
    var localtion = req.body.localtion;
    //console.log(pass_code)
    //console.log(password)

    let sqlp=`select localtion from passuser where pass_code='${pass_code}'`;
    //console.log(sqlp)
    dbCon.query(sqlp, (error, result) => {
        if (error) 
        {
            result="error";
            //console.log(result)
            return res.send(result)
        }else {
            if(result[0] &&localtion==result[0].localtion){
                result=true;
                return res.send(result) 
            }else{
                result=false;
                return res.send(result) 
            }
        }
    });
 
});
router.post('/listD',function(req,res){
    let location =req.body.localtion
    let sqlL=`SELECT DISTINCT list_id FROM list_out_drug WHERE location="${location}"`;
    console.log(sqlL)
    dbCon.query(sqlL, (error, result) => {
        if (error) 
        {
            result="error";
            return res.send(result)
        }else {
            return res.send(result)
        }
    });  
});
router.post('/listout',function(req,res){
    let list_id=req.body.list_id
    let sqlList=`set @row_num = 0; SELECT  @row_num := @row_num + 1 as id,drugid,drugnum FROM list_out_drug WHERE list_id='${list_id}'`;
    dbCon.query(sqlList, (error, result) => {
        if (error) 
        {
            result="error";
            return res.send(result[1])
        }else {
            console.log(result[1])
            return res.send(result[1])
        }
    });  

    
});
router.post('/deleteL',function(req,res){
    let list_id=req.body.list_id;
    let sqlD=`DELETE FROM list_out_drug WHERE list_id='${list_id}'`;
    dbCon.query(sqlD, (error, result) => {
        if (error) 
        {
            result="error";
            return res.send(result)
        }else {
            //console.log(result)
            return res.send(result)
        }
    }); 
    
});

router.post('/listout',function(req,res){
    let list_id=req.body.list_id
    let sqlList=`set @row_num = 0; SELECT  @row_num := @row_num + 1 as id,drugid,drugnum FROM list_out_drug WHERE list_id='${list_id}'`;
    dbCon.query(sqlList, (error, result) => {
        if (error) 
        {
            result="error";
            return res.send(result[1])
        }else {
            console.log(result[1])
            return res.send(result[1])
        }
    });  

    
});
router.post('/egm',function(req,res){
    let cupid=req.body.cupid;
    let sql=`SELECT DISTINCT drugid FROM slot WHERE cupid='${cupid}' order by drugid ASC`;
    dbCon.query(sql, (error, result) => {
        if (error) 
        {
            result="error";
            return res.send(result)
        }else {
            //console.log(result)
            return res.send(result)
        }
    }); 
    
});
router.post('/deletedrugid',function(req,res){
    let drugid=req.body.drugid;
    let pass_code = req.body.pass_code;
    let localtion = req.body.localtion;
    let cupid = req.body.cupid;
    //console.log(pass_code)
    //console.log(password)

    let sqlp=`select localtion from passuser where pass_code='${pass_code}'`;
    //console.log(sqlp)
    dbCon.query(sqlp, (error, result) => {
        if (error) 
        {
            result="error";
            //console.log(result)
            return res.send(result)
        }else {
            if(result[0] &&localtion==result[0].localtion){
                
                // result=true;
                // return res.send(result) 
                let sqlselect=`select cupid,slotno,drugnum from slot where drugnum != 0 and cupid='${cupid}' and drugid='${drugid}'  LIMIT 1`;
                dbCon.query(sqlselect, (error, resultselect) => {
                    if (error) 
                    {
                        result="error";
                        return res.send(result)
                    }else {
                        console.log(resultselect[0]);
                        if(resultselect[0]&& resultselect[0].drugnum > 0){
     let sqlupdate=`UPDATE slot SET drugnum=(drugnum-1) WHERE cupid='${resultselect[0].cupid}' and slotno='${resultselect[0].slotno}'`;
     dbCon.query(sqlupdate, (error, resultupdate) => {
        if (error) 
        {
            result=false;
            return res.send(result)
        }else {
            let selectcell_slot_cup = `select * from cell_slot_cup where cupid='${cupid}' and drugid='${drugid}' and p_out=' ' limit 1`
            dbCon.query(selectcell_slot_cup, (error, resultselectcell_slot_cup) => {
                if (error) 
                {
                    result=false;
                    return res.send(result)
                }else {
console.log(resultselectcell_slot_cup);
if(resultselectcell_slot_cup[0]){
    let updatecellslot = `UPDATE cell_slot_cup SET p_out = '${pass_code}' WHERE cupid = '${cupid}' AND slotno = ${resultselectcell_slot_cup[0].slotno} AND drugid = '${drugid}' AND cell_slot = ${resultselectcell_slot_cup[0].cell_slot};`
    console.log(updatecellslot);
    dbCon.query(updatecellslot, (error, resultupdatecellslot) => {
        if (error) 
        {
            result=false;
            return res.send(result)
        }else {
            result=true;
            return res.send(result)
        }
    })
}else{
    result=false;
    return res.send(result) 
}
                }
            })
            
            // result=true;
            // return res.send(result)
            
        }
    });

                        }else{
                            // result=false;
                            // return res.send(result)
                        }
                        // return res.send(resultselect)
                    }
                }); 
            }else{
                // result=false;
                // return res.send(result) 
            }
        }
    });
    
   
   
    
});

router.post('/deletSlot',function(req,res){
    let list_id=req.body.list_id;
    let cupid=req.body.cupid;
    
    let sqlSe=`SELECT drugnum,drugid FROM list_out_drug WHERE list_id='${list_id}'`
    dbCon.query(sqlSe, (error, result) => {
        if (error) 
        {
            result="error";
            return res.send(result)
        }else {
            // console.log(result);
             if(result){
            let slotS=0;
            let countdrugnum = 0;
            let setnewdataslot = [];
            let getdatamultirow = [];
           
            // let sqlU=`UPDATE slot SET drugnum=(drugnum-${resultdrugnum[0].drugnum}) WHERE cupid='${cupid}' and slotno=${setslotno}`;
            // let sqlcheckdrugnum=`SELECT  drugnum,slotno FROM slot WHERE drugid="${x.drugid}" and cupid='${cupid}' and slot_action=1 GROUP BY slotno; SELECT * FROM slot WHERE cupid='${cupid}' AND  drugid="${x.drugid}" AND drugnum>=${x.drugnum} and slot_action=1  LIMIT 1;`

            result.forEach((x,index)=> {
                let sqlcheckdrugnum1=`SELECT  drugnum,slotno FROM slot WHERE cupid='${cupid}' and drugid="${x.drugid}"  and slot_action=1 GROUP BY slotno; SELECT * FROM slot WHERE cupid='${cupid}' AND  drugid="${x.drugid}" AND drugnum>=${x.drugnum} and slot_action=1  LIMIT 1;`
            
                dbCon.query(sqlcheckdrugnum1, (error, resultdrugnums) => {
                    
                    if (error) 
                    {
                        // resultdrugnum="error";
                        // return res.send(resultdrugnums)
                    }else{
                        //  console.log(resultdrugnums);
                        if(resultdrugnums[1][0]){
                            if(resultdrugnums[1][0].drugnum >= x.drugnum){
                                slotS+=1;
                                setnewdataslot.push({data:resultdrugnums[1][0],drugnum:x.drugnum});
                            }
                        }else{
                            
                           console.log(resultdrugnums[0]);
                            
                            if(resultdrugnums[0]){
                                for(i=0;i<resultdrugnums[0].length;i++){
                                    countdrugnum+=resultdrugnums[0][i].drugnum;
                                    getdatamultirow.push({data:resultdrugnums[0][i],drugnum:x.drugnum,index:index});
                                    if(countdrugnum >= x.drugnum){
                                        slotS+=1;
                                         break;
                                    }
                                  
                                    
                                }
                                // console.log(getdatamultirow);
                                // resultdrugnums[0].forEach(gg=>{
                                //     console.log(gg);
                                // })
                            }
                            // console.log(getdatamultirow);
                            // return res.send("อัพเดตข้อมูลไม่ได้55");
                        }
                            
                       
                        
                        if(index == result.length-1){
                        if(slotS == result.length){
                            console.log(setnewdataslot);
                             setnewdataslot.forEach((tableslot,index)=>{
                                console.log(tableslot);
                                let sqlUslottable=`UPDATE slot SET drugnum=(drugnum-${tableslot.drugnum}) WHERE cupid='${cupid}' and slotno=${tableslot.data.slotno}`;
                               
                                dbCon.query(sqlUslottable, (error, resultslottableupdate) => {
                    
                                    if (error) 
                                    {
                                        // resultdrugnum="error";
                                        // return res.send(resultdrugnums)
                                    }else{
                                        // console.log(resultslottableupdate);
                                    }
                                });

                            })
                            if(getdatamultirow && getdatamultirow[0]){
                                let datasumdrugnum =  getdatamultirow[0].drugnum;
                                console.log(getdatamultirow);
                                getdatamultirow.forEach((tableslotmultidata,index)=>{
                                    let sqlUslottable= '';
                                    if(index == getdatamultirow.length-1){
                                         sqlUslottable=`UPDATE slot SET drugnum=(drugnum-${datasumdrugnum}) WHERE cupid='${cupid}' and slotno=${tableslotmultidata.data.slotno}`;
                                    }else{
                                         sqlUslottable=`UPDATE slot SET drugnum=0 WHERE cupid='${cupid}' and slotno=${tableslotmultidata.data.slotno}`;
                                    }
                                    datasumdrugnum -= tableslotmultidata.data.drugnum;
                                    dbCon.query(sqlUslottable, (error, resultslottableupdate) => {
                        
                                        if (error) 
                                        {
                                            // resultdrugnum="error";
                                            // return res.send(resultdrugnums)
                                        }else{
                                            console.log(resultslottableupdate);
                                        }
                                    });
    
                                })
                            }
                            
                 

//                             dbCon.query(sqlUslottable, (error,resultslottable) => {
//                                 if (error) 
//                     {
//                         // resultdrugnum="error";
//                         // return res.send(resultdrugnums)
//                     }else{
// console.log(resultslottable);

//                     }

//                             });
                        }else{
                            return res.send("อัพเดตข้อมูลไม่ได้11");
                        }
                    }
                    }
                    });
            
             
                

            });
           
             }
            
               
        }
    }); 

   
    
    
});

module.exports = router;