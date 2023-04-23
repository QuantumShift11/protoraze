const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.homePage = async function(req, res) {
    if (req.session.user) {
        console.log('homePage - Session after login-- : '+req.session.user)
        // Get the user.
        let user = await User.findById(req.session.user);
        console.log('What is this value Y??? '+user+' What is this value X? '+req.session.user)
        // Render the home page
        res.render("pages/dashboard", {
            name: user.first_name + ' ' + user.last_name,
            isLoggedIn: true
        });
    } else {
        // Redirect to the login page
        res.redirect("/login");
    }
}

exports.loginPage = function(req,res){
     // check whether we have a session
     console.log('loginPage Session before login : '+req.session.user)
     //undefined
     if(req.session.user){
        // Redirect to log out.
        res.redirect("/logout");
    }else{
        // Render the login page.
        res.render("pages/login",{
            "error":"",
            "isLoggedIn": false
        });
    }
}

exports.processLogin = async function(req,res){
    // get the data.
    let email = req.body.email;
    let password = req.body.password;
    // check if we have data.
    if(email && password){
        // check if the user exists.
        let existingUser = await User.findOne({email:email}).select('password');
        if(existingUser){
            // compare the password.
            let match = await bcrypt.compare(password,existingUser.password);
            if(match){
                // set the session.
                req.session.user = existingUser._id;
                //console.log(' session_id ' + existingUser._id)
                //console.log(' req.session.user ' + req.session.user)
                // Redirect to the home page.
                console.log('processLogin Session before login : '+req.session.user)
                res.redirect("/dashboard");
            }else{
                // return an error.
                res.render("pages/login",{
                    "error":"Invalid password",
                    isLoggedIn: false
                });
            }
        }else{
            // return an error.
            res.render("pages/login",{
                "error":"User with that email does not exist.",
                isLoggedIn:false
            });
        }
    }else{
        res.status(400);
        res.render("pages/login",{
            "error":"Please fill in all the fields.",
            isLoggedIn:false
        });
    }
}

exports.signupPage = function(req,res){
    // Check whether we have a session
    if(req.session.user){
        // Redirect to log out.
        res.redirect("/logout");
    } else {
        // Render the signup page.
        res.render("pages/signup",{
            "error":"",
            isLoggedIn:false
        });
    }
}

exports.processSignup = async function(req,res){
    // Get the data.
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    // Check the data.
    if(first_name && last_name && email && password){
        // Check if there is an existing user with that email.
        let existingUser = await User.findOne({email:email});
        if(!existingUser){
            // hash the password.
            let hashedPassword = bcrypt.hashSync(password,10);
            // create the user.
            let newUser = new User({
                first_name:first_name,
                last_name:last_name,
                email:email,
                password:hashedPassword
            });
            // save the user.
            newUser.save(function(err){
                if(err){
                    // return an error.
                    res.render("pages/signup",{
                        "error":"Something went wrong when creating account.",
                        isLoggedIn:false
                    });
                }else{
                    // set the session.
                    console.log('Before session set value '+req.session.user)
                    req.session.user = newUser._id;
                    console.log('After session set value '+req.session.user)
                    console.log('newUser '+newUser._id)
                    console.log('req.session.user '+req.session.user)
                    // Redirect to the home page.
                    res.redirect("/dashboard");
                }
            });
        }else{
            // return an error.
            res.render("pages/signup",{
                "error":"User with that email already exists.",
                isLoggedIn:false
            });
        }
    }else{
        // Redirect to the signup page.
        res.render("pages/signup",{
            "error":"Please fill in all the fields.",
            isLoggedIn:false
        });
    }
}

exports.logoutPage = function(req,res){
    // clear the session.
    console.log('logoutPage Session before destroy : '+req.session.user)
    req.session.destroy();
    //console.log('logoutPage Session after destroy : '+req.session.user)
    // Redirect to the login page.
    res.redirect("/login");    
}


exports.razor = async function(req,res){

    if (req.session.user) {
        let user = await User.findById(req.session.user);
        console.log(user.first_name + ' ' + user.last_name)
        res.render("pages/razor",{
            //"error":"Please fill in all the fields.",
            error: false,
            isLoggedIn:true,
            query:false,
            name: user.first_name + ' ' + user.last_name,
        });

    }
    else {
        res.redirect("/login");
    }
}

// bring input on same page only but render only that with if condition if it has a 
//value

exports.processRazor = async function(req,res){
    // get the data.
    let name_in = req.query.name; // for GET 
    //let name_in = req.body.name; // FOR POST body
    // check if we have data.
    console.log('input entered is OUT '+ name_in)

    if (req.session.user) {
        let user = await User.findById(req.session.user);
        console.log(user.first_name + ' ' + user.last_name)

        if(name_in){
        res.render("pages/razor_ref",{
            //"error":"Please fill in all the fields.",
            error: false,
            isLoggedIn:true,
            query:false,
            name: user.first_name + ' ' + user.last_name,
            name_in:name_in
        });
    }

    }
    else {
        res.redirect("/login");
    }
    
    }

exports.change_pass = async function(req,res){
    if (req.session.user) {
        let user = await User.findById(req.session.user);
        console.log(user.first_name + ' ' + user.last_name)

        res.render("pages/change_pass",{
            //"error":"Please fill in all the fields.",
            isLoggedIn:true,
            pass_incorrect:'main',
            name: user.first_name + ' ' + user.last_name
        });
    }
}


exports.processChange_pass = async function(req,res){
    // get the data.
    let pass1 = req.body.password;
    let pass2 = req.body.password1;
    // check if we have data.
    console.log('input entered is '+ pass1)
    console.log('input entered is '+ pass2)

    if (pass1==pass2) {
        console.log(' Password Matches ')
        if (req.session.user) {
            console.log('homePage - Session after login-- : '+req.session.user)
            // Get the user.
            user_id = req.session.user
            let user = await User.findById(req.session.user);
            console.log('What is this value X ??? '+user)

            let hashedPassword = bcrypt.hashSync(pass2,10);
            console.log(' hashedPassword '+hashedPassword)
            // Render the home page

            // callback don't pass -> query already exists 
            let updatedPassword = await User.findByIdAndUpdate(user_id, { password: hashedPassword });

            res.render("pages/change_pass", {
                isLoggedIn:true,
                pass_incorrect:'changed',
                msg: "Password changed successfully !!!",
                name: user.first_name + ' ' + user.last_name    
            });

        } else {

            console.log(' Session no exists for _id and redis_session ')

            res.redirect("/login");
            
        }
    
    }
    else {
        // Redirect to the password change page again if password doesn't match
        res.render("pages/change_pass", {
            isLoggedIn:true, 
            pass_incorrect:'incorrect',
            //msg: "Incorrect password entered !!!"     
        });
    }
}

exports.my_account = async function(req,res){

    if (req.session.user) {
        let user = await User.findById(req.session.user);
        console.log(user.first_name + ' ' + user.last_name)
        res.render("pages/my_account",{
            //"error":"Please fill in all the fields.",
            //name_in: user.first_name + ' ' + user.last_name,
            isLoggedIn:true,
            name: user.first_name + ' ' + user.last_name
        });

    }
    else {
        res.redirect("/login");
    }
    }

exports.deleteAccount = async function(req,res){

        if (req.session.user) {
            console.log('homePage - Session after login-- : '+req.session.user)
            // Get the user.
            user_id = req.session.user
    
            let delete_user = await User.findOneAndRemove({ _id: user_id });
    
            console.log('delete_user' + delete_user)
            
            res.redirect("/login");
            /*
            res.render("pages/login",{
                "error":"",
                "isLoggedIn": false
            });
            */
            // render and redirect 

        } else {

            // render and redirect 
    
            console.log(' Session no exists for _id and redis_session ')
    
            res.redirect("/login");
            
        }
        }
    

exports.search = async function(req,res){

            if (req.session.user) {
                let user = await User.findById(req.session.user);
                console.log(user.first_name + ' ' + user.last_name)
                res.render("pages/search",{
                    //"error":"Please fill in all the fields.",
                    error: false,
                    isLoggedIn:true,
                    //query:false,
                    name: user.first_name + ' ' + user.last_name,
                });
        
            }
            else {
                res.redirect("/login");
            }
        }

exports.searchf = async function(req,res){

    let name_in = req.query.name; // for GET 
    //let name_in = req.body.name; // FOR POST body
    // check if we have data.
    console.log('input entered is OUT '+ name_in)

    if (req.session.user) {
        let user = await User.findById(req.session.user);
        console.log(user.first_name + ' ' + user.last_name)

        if(name_in){
        res.render("pages/searchf",{
            //"error":"Please fill in all the fields.",
            error: false,
            isLoggedIn:true,
            //query:false,
            name: user.first_name + ' ' + user.last_name,
            name_in:name_in
        });
    }

    }
    else {
        res.redirect("/login");
    }
        }





















    /*
exports.redress = function(req,res){
        res.render("pages/ui_redressing",{
            //"error":"Please fill in all the fields.",
            isLoggedIn:true
        });
    }
*/

//        <h1>Hello <%= msg %></h1>

//async-await for high processing task  
//login-logout
//req.session.user is mongo_id
//res.render(req,res,{});
//where redis - mongo_id - session_id - cookie_id is used and related ?

//Axe -  

//res.sendFile('changepassword.html',  root: __dirname }); - how to pass variable in post