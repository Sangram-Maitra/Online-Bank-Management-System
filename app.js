const express = require("express");
const bodyparser = require("body-parser");
const { urlencoded } = require("body-parser");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const session = require("express-session");
var flash = require('connect-flash');

var listCountry = ["India","Pakistan","Bangladesh","China"];
var date=[];
var month=["Januray","February","March","April","May","June","July","August","September","October","November","December"];
var year=[];
var currentYear=1969;


var GlobalPrefix="";
var UserFirstName="";
var UserLastName="";
var TotalCost = 0;
var number = "";
var UserAddress = "";
var GlobalAddress="";
var GlobalStreet="";
var GlobalStreet2="";
var GlobalCity="";
var GlobalState="";
var GlobalBranchName="";
var Globalcode = "";
var GlobalId = "";
var GlobalNName="";
var GlobalANumber="";
var GlobalBType = "";


for(i=1;i<=31;i++){
    date.push(i);
}

while(currentYear<=2025){
    year.push(currentYear);
    currentYear+=1;
}

// console.log(year);


const app = express();

//For Connection the Database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bankdb",
  });

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,maxAge: 60000 }
})) 
app.use(flash());


//connect the Database
db.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("My Sql connected");
    }
  });


//get started
app.get("/",(req,res)=>{
  res.render("adminOrCustomer2",{title:"adminOrCustomer",serverError: req.flash('server-error')});
})


app.get("/custSignup",(req,res)=>{
  res.render("custSignup",{ title: "signup", serverError: req.flash('server-error'),PageDate:date,PageMonth:month,PageYear:year,
  sAddress:GlobalStreet,sAddress2:GlobalStreet2,pageCity:GlobalCity,pageState:GlobalState,pageCode:Globalcode,pageId:GlobalId,
  pagePrefix:GlobalPrefix,F_Name: UserFirstName,L_Name: UserLastName,Phone_numb:number,AddressPlace:GlobalAddress,country_name: listCountry});
});

app.get("/customerhome", function (req, res) {
  res.render("customerhome", { title: "User Home Page", SearchFailure: req.flash('server-error') });
});

app.get("/signIn", function (req, res) {
    res.render("signin", { title: "Sign In", serverError: req.flash('server-error') });
});

app.get("/profile",(req,res)=>{

  let sql = `select * from users where AccountNumber = '${GlobalANumber}'`;
  var data1;
  db.query(sql, function (err, result1, fields) 
    {
      if (err) throw err;
      data1 = JSON.parse(JSON.stringify(result1));
      console.log("here");
      // // comment out console.log(data1);
      // GlobalPrefix = data1[0].NamePrefix;
      GlobalANumber = data1[0].AccountNumber;
      // UserFirstName = data1[0].FName;
      // UserLastName = data1[0].LName;
      // number = data1[0].PhoneNumber;
      // UserAddress = data1[0].Address;
      // GlobalCity=data1[0].city;
      // GlobalState=data1[0].State;
      // GlobalNName=data1[0].NName;
      // Globalcode=data1[0].PinCode;
      // GlobalId=data1[0].idCard;
      // GlobalBranchName=data1[0].BranchName;
      // GlobalBType = data1[0].AccType;
      
      // res.render("home", { title: "Home Page"});
      // let sql2 = `select * from invoice where IdCard = '${GlobalId}'`;
      // db.query(sql2, function (err, result2, fields){
        //   var length = Object.keys(result2).length;
        //   var data2= JSON.parse(JSON.stringify(result2));
        
        // res.render("profile", { title: "Profile",Details:data1,Name:UserFirstName, Lname: UserLastName, Addr: UserAddress,PhoneNum:number,pagePrefix:GlobalPrefix,
        // pageCode:Globalcode,pageId:GlobalId,pageBranchName:GlobalBranchName,pageANumber:GlobalANumber,pageNName:GlobalNName});
        res.render("profile",{title:"ProfilePage",Details:data1});
    });
    // });
})


/////initating signup and signin page

// app.get("/", function (req, res) {
//     res.render("signup", { title: "signup", serverError: req.flash('server-error'),PageDate:date,PageMonth:month,PageYear:year,
//      sAddress:GlobalStreet,sAddress2:GlobalStreet2,pageCity:GlobalCity,pageState:GlobalState,pageCode:Globalcode,pageId:GlobalId,
//      pagePrefix:GlobalPrefix,F_Name: UserFirstName,L_Name: UserLastName,Phone_numb:number,AddressPlace:GlobalAddress,country_name: listCountry});
// });

/////correct one

// app.get("/",(req,res)=>{
//   res.render("adminOrCustomer",{title:"adminOrCustomer",serverError: req.flash('server-error')});
// })

////correct one

app.get("/adminSignin",(req,res)=>{
  res.render("adminSignin",{title:"Admin Page", serverError: req.flash('server-error') });
})

app.get("/aCheckCustomer",(req,res)=>{
  let sql = `select * from users`;
  var data1;
  db.query(sql, function (err, result1, fields){
    if(err) throw err;
    var data1= JSON.parse(JSON.stringify(result1));
    // // comment out console.log(data1);
    res.render("adminCheckCust",{title:"Admin Page", serverError: req.flash('server-error'),details:data1 });
  });
})

app.get("/aCheckbranch",(req,res)=>{
  let sql = `select * from branch`;
  var data1;
  db.query(sql, function (err, result1, fields){
    if(err) throw err;
    var data1= JSON.parse(JSON.stringify(result1));
    // // comment out console.log(data1);
    res.render("adminBranchDetails",{title:"AdminBranch Check", serverError: req.flash('server-error'),details:data1 });
  });
})

app.get("/userSignin",(req,res)=>{
  res.render("customersignin",{title:"User Signin", serverError: req.flash('server-error') })

})

app.get("/custPopup",(req,res)=>{
  db.query(`SELECT * FROM users where IdCard=${GlobalId}`, function (err, result, fields) 
    {
      if (err) throw err;
      var data= JSON.parse(JSON.stringify(result));
      console.log(data);
      GlobalANumber=data[0].AccountNumber;
      res.render("customerPopupPage",{title:"Success page",pageAccountNumber:GlobalANumber})
    });
})

app.get("/custdip",(req,res)=>{
  res.render("custDiposit",{title:"User Diposit page", serverError: req.flash('server-error') })
})

app.get("/custWithdraw",(req,res)=>{
  res.render("custWithdraw",{title:"User Diposit page", serverError: req.flash('server-error') })
});

app.get("/",(req,res)=>{
  res.render("signup",{title:"Admin Page", serverError: req.flash('server-error') })
})

app.get("/custFundTran",(req,res)=>{
  res.render("custFundtran",{title:"Fund Transfer", serverError: req.flash('server-error') })
})

app.get("/addressChange",(req,res)=>{
  res.render("custAddressChange",{title:"Address Change", serverError: req.flash('server-error') })
})

app.get("/checkChange",(req,res)=>{
  res.render("checqueChange",{title:"Address Change", serverError: req.flash('server-error') });
});

app.get("/transactionAdmin",(req,res)=>{

  db.query(`SELECT * FROM transaction`, function (err, result, fields) 
  {
    if (err) throw err;
    var data= JSON.parse(JSON.stringify(result));
    res.render("adminTran",{title:"Address Change", SearchFailure: req.flash('server-error'),details:data});
    
  });

});

app.get("/custAddchange",(req,res)=>{
  res.render("custAddReq",{title:"Address Change", serverError: req.flash('server-error')});
});

app.get("/addChangeReq",(req,res)=>{
  var accNum = req.body.acc;
  var sAddress = req.body.Sadd;
  var sAddress2 = req.body.Sadd2;
  var city = req.body.City;
  var State = req.body.State;
  var country = req.body.Country;
  var Address = req.body.add+" Street: "+sAddress+" "+sAddress2+" City: "+city+" State: "+State;
  var code = req.body.Zip_code;
  var password = req.body.passWord;
  var bcode = req.body.branchCode;
  var bname = req.body.branchName;

  let data = {
    accNum:req.body.accNum,
    newAddress:Address,
    newBranch:bname,
    newBranchCode:bcode
  };
  
  console.log(accNum);

  let sql = "Insert into reqcustomer set ?";
  let query = db.query(sql, data, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.render("success",{title:"Success Page"});
      
    }
  });
})

//// post Requests
app.post("/custSigningUp",function(req,res){
    var flag=0;
    var prefix = req.body.prefix;
    var Fname = req.body.First_Name;
    var Lname = req.body.Last_Name;
    var accType = req.body.Account_Type;
    var idCard = req.body.ID_Card;
    var EmailId = req.body.Email;
    var balance = req.body.Deposit;
    var PhoneNumber = req.body.Phone;
    var gender = req.body.Gender;
    var dateOFBirth = req.body.date+"/"+req.body.month+"/"+req.body.Year;
    var Marital_Status = req.body.MariStatus;
    var sAddress = req.body.Sadd;
    var sAddress2 = req.body.Sadd2;
    var city = req.body.City;
    var State = req.body.State;
    var Address = req.body.add+" Street: "+sAddress+" "+sAddress2+" City: "+city+" State: "+State;
    var branchName = req.body.BName;
    var code = req.body.Zip_code;
    var NName = req.body.nominee_name;
    var password = req.body.passWord;

    UserFirstName= Fname;
    UserLastName = Lname;
    GlobalAddress = req.body.add;
    UserAddress = Address;
    number=PhoneNumber;
    GlobalStreet=sAddress;
    GlobalStreet2=sAddress2;
    GlobalCity=city;
    GlobalState=State;
    GlobalNName=NName;
    Globalcode=code;
    GlobalId=idCard;
    GlobalBranchName = branchName;

    var isNum = /^[0-9]+$/.test(PhoneNumber);
    if(isNum==true && PhoneNumber.length>=9 && PhoneNumber.length<11)
    {
        flag=1;
    }
    if(flag==0)
    {
        req.flash('server-error',"something not properly inputted");
     
        console.log("Number is not proper inputted");
        res.redirect("/custSignup");
    }
    else{
    let data = {
      NamePrefix:prefix,
      FName: Fname,
      LName: Lname,
      AccType:accType,
      IdCard:idCard,
      Email:EmailId,
      Balance:balance,
      PHONENUMBER: PhoneNumber,
      Gender:gender,
      DOB:dateOFBirth,
      MaritalStatus:Marital_Status,
      ADDRESS: Address,
      PinCode:code,
      BranchName: branchName,
      NomineeName: NName,
      PassWord:password
    };
    
    let sql = "Insert into users set ?";
    let query = db.query(sql, data, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("data inserted");
        // req.flash('server-success',"User added sucessfully");
        res.redirect("/custPopup");
      }
  });
}
})

app.post("/custosigningIn",(req,res)=>{
    accNumber = req.body.accountNumber;
    GlobalANumber = accNumber;
    accPass = req.body.password;
    db.query(`SELECT * FROM users where AccountNumber=${accNumber}`, function (err, result, fields) 
    {
      if (err) throw err;
      var data= JSON.parse(JSON.stringify(result));
      if(accPass==data[0].PassWord)
      {
        // console.log(data[0]);
        // GlobalPrefix = data[0].NamePrefix;
        UserFirstName = data[0].FName;
        UserLastName = data[0].LName;
        res.redirect("/customerhome");
      }
      else{
        req.flash('server-error',"Check The Inputs Again");
     
        // console.log("Number is not proper inputted");
        res.redirect("/userSignin");
      }
      // console.log(data[0].PassWord);
      // res.render("home", { title: "Home Page"});
    });
})

app.post("/AdminsigningIn",(req,res)=>{
  var Aid = req.body.id;
  var pass = req.body.password;
  var data1,data2;
  db.query(`SELECT * FROM admin where id=${Aid}`, function (err, result, fields) 
    {
      if (err) throw err;
      if(result[0]!=undefined)
      {

        
        var data= JSON.parse(JSON.stringify(result));
        if(pass==data[0].Password)
        {
          // db.query(`select * from users`,function(err,result2){
            //   if(err) throw err;
            //   var data2 = JSON.parse(JSON.stringify(result2));
            res.render("adminHome", { title: "Admin HomePage", SearchFailure: req.flash('server-error'),userDetails:data2 });
            // })
          }
          else{
            req.flash('server-error',"Check The Inputs Again");
            res.redirect("/adminSignin");
          }
        }
        else{
          req.flash('server-error',"Check The Inputs Again");
          res.redirect("/adminSignin");
        }
    });
})

app.post("/signIn",function(req,res){
    res.redirect("/userSignin");
})

app.post("/moneyDiposit",(req,res)=>{
  var pass = req.body.password;
  let data = {
    accNum:req.body.accNum,
    FName: req.body.First_Name,
    LName: req.body.Last_Name,
    Diposit_Withdraw:req.body.Deposit,
    diporwith:"Diposit"
  };
  // console.log(data);
  db.query(`SELECT * FROM users where AccountNumber=${data.accNum}`, function (err, result2, fields) 
    {
      if (err) throw err;
      // console.log(result2[0]);

      if(result2[0]!=undefined)
      {

        var data2= JSON.parse(JSON.stringify(result2));
        var amount= parseInt(data2[0].Balance) + parseInt(data.Diposit_Withdraw);
        // // comment out console.log(amount);
        if(pass==data2[0].Password)
        {
          let sql = "Insert into transaction set ?";
          let query = db.query(sql, data, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              
              db.query(`UPDATE users SET Balance = ${amount} WHERE AccountNumber=${data.accNum}`, function (err2, result3){
                console.log("transaction Completed");
                res.render("success",{title:"Success Page"});
              })
            }
          });
        }
        else{
          req.flash('server-error',"Check The Inputs Again");
          res.redirect("/custdip");
        }
      }
      else{
        req.flash('server-error',"Check The Inputs Again");
        res.redirect("/custdip");
      }
    });

});

app.post("/moneyWithdraw",(req,res)=>{
  var pass = req.body.password;
  let data = {
    accNum:req.body.accNum,
    FName: req.body.First_Name,
    LName: req.body.Last_Name,
    Diposit_Withdraw:req.body.Deposit,
    diporwith:"Withdraw"
  };
  // console.log(data);
  db.query(`SELECT * FROM users where AccountNumber=${data.accNum}`, function (err, result2, fields) 
    {
      if (err) throw err;
      // console.log(result2[0]);

      if(result2[0]!=undefined)
      {

        var data2= JSON.parse(JSON.stringify(result2));
        var amount= parseInt(data2[0].Balance) - parseInt(data.Diposit_Withdraw);
        // // comment out console.log(amount);
        if(pass==data2[0].Password)
        {
          let sql = "Insert into transaction set ?";
          let query = db.query(sql, data, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              
              db.query(`UPDATE users SET Balance = ${amount} WHERE AccountNumber=${data.accNum}`, function (err2, result3){
                console.log("transaction Completed");
                res.render("success",{title:"Success Page"});
              })
            }
          });
        }
        else{
          req.flash('server-error',"Check The Inputs Again");
          res.redirect("/custWith");
        }
      }
      else{
        req.flash('server-error',"Check The Inputs Again");
        res.redirect("/custWith");
      }
    });

})


app.post("/custFundtrans",(req,res)=>{
  var accOwn = req.body.accNum;
  var accTrans = req.body.accNum2;
  var ammount = req.body.Fund;
  var data1,data2,total1,total2;
  db.query(`SELECT * FROM users where AccountNumber=${accOwn}`, function (err, result, fields){
    if(result[0]!=undefined)
    {
      console.log("if");
      db.query(`SELECT * FROM users where AccountNumber=${accTrans}`, function (err, result2, fields){
        if(result[0]!=undefined)
        {
          data1 = JSON.parse(JSON.stringify(result));
          data2 = JSON.parse(JSON.stringify(result2));
          console.log("The Balance is: "+(data1[0].Balance-parseInt(ammount)));
          console.log("The Balance is: "+(data2[0].Balance+parseInt(ammount)));
          var value = data1[0].Balance-parseInt(ammount);
          var value2 = data2[0].Balance+parseInt(ammount);

          db.query(`UPDATE users SET Balance = ${value} WHERE AccountNumber=${accOwn}`, function (err2, result3){
            console.log("transaction Completed");
            db.query(`UPDATE users SET Balance = ${value2} WHERE AccountNumber=${accTrans}`, function (err2, result3){
              console.log("transaction Completed");
              res.render("success",{title:"Success Page"});
            })
            // res.render("success",{title:"Success Page"});
          })

        }
        else{
          req.flash('server-error',"Account Is Not Present");
          // console.log("elseelse");
          res.redirect("/custFundTran");
        }
      });

    }
    else{
      req.flash('server-error',"Account Is Not Present");
      // console.log("else");
      res.redirect("/custFundTran");
    }
  });
})

app.post("/addChange",(req,res)=>{
  var accNum = req.body.acc;
  var sAddress = req.body.Sadd;
  var sAddress2 = req.body.Sadd2;
  var city = req.body.City;
  var State = req.body.State;
  var country = req.body.Country;
  var Address = req.body.add+" Street: "+sAddress+" "+sAddress2+" City: "+city+" State: "+State;
  var code = req.body.Zip_code;
  var password = req.body.passWord;

  console.log(accNum);
  // db.query(`UPDATE users SET Address = ${sAddress} WHERE AccountNumber=${accNum}`, function (err2, result3){
  //   console.log("Address Change Completed");
  // })

  db.query(`UPDATE users SET Address = '${Address}' WHERE AccountNumber=${parseInt(accNum)}`, function (err2, result3){
    console.log("Address Change Completed");
    res.render("success",{title:"Success Page"});
  })
})

app.post("/chequeChange",(req,res)=>{
  var chequePermission = req.body.cheque;
  var accNum = req.body.acc;
  db.query(`UPDATE users SET chequePer = '${chequePermission}' WHERE AccountNumber=${parseInt(accNum)}`, function (err2, result3){
    console.log("Cheque Permission Changeing Completed");
    res.render("successAdmin",{title:"Success Page"});
  })
})

app.post("/adminhome",(req,res)=>{
  res.render("adminHome", { title: "Admin HomePage", SearchFailure: req.flash('server-error')});
})

app.post("/addChangeReq",(req,res)=>{
  var accN = req.body.acc;
  var sAddress = req.body.Sadd;
  var sAddress2 = req.body.Sadd2;
  var city = req.body.City;
  var State = req.body.State;
  var country = req.body.Country;
  var Address = req.body.add+" Street: "+sAddress+" "+sAddress2+" City: "+city+" State: "+State;
  var code = req.body.Zip_code;
  var password = req.body.passWord;
  var nbranch = req.body.branchName;
  var nbranchCode= req.body.branchCode;

  let data={
    accNum:accN,
    newAddress:Address,
    newBranch:nbranch,
    newBranchCode:nbranchCode
  };

  let sql = "Insert into reqcustomer set ?";
  let query = db.query(sql, data, function (err, result) {
    if (err) {
      console.log(err);
    }
  });
  res.render("success",{title:"Success Page"});

})

app.listen("5000",()=>{
    console.log("Server Started At port 5000...");
});