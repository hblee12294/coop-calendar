// --- Initialization ---
const express   = require('express'),
    bodyParser = require('body-parser'),
    path      = require('path'),
    app       = express(),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    env = require('./config/env.json'),
    PORT     = env.SERVER_PORT,
    passport = require('./config/passport-setup'),
    crypto = require('crypto'),
    session = require('express-session'),
    LocalStrategy = require("passport-local"),
    deasync = require('deasync'),
    MongoStore = require('connect-mongo')(session),
    xssFilters = require('xss-filters');

app.use(express.static(path.resolve(__dirname, './build')));
app.use(bodyParser.json({ extended: true, type: '*/*' }) );
app.use(cookieParser());


// --- db connection ---
mongoose.connect(env.mongoAddress);
const User = require('./models/user');
const Event = require('./models/event');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('mongodb connected successfully!');
});

// --- passport configuration ---
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//reading session and take the code from session that's encode and uncode it
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- session config ---

app.use(session({
    secret: env.sessionSecret,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: false,  
    resave: false,  
    cookie: {
        maxAge: 1800 * 1000, //half an hour
        secure: false,
    }
}));


// --- CORS set ---
app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'OPTION,GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
});


// --- service ---
const {isLoggedIn,checkUserEvent} = require('./middleware');

// ---      encryption function   ---
function cryptPwd(password) {
    const salt = env.salt;
    const saltPassword = password + ':' + salt;
    const md5 = crypto.createHash(env.hash);
    return md5.update(saltPassword).digest(env.digest);
}



// --- Listener ---
app.listen( process.env.PORT || PORT, () => {
    console.log(`Server listening at http://${ env.SERVER_HOST }:${ process.env.PORT || PORT }`);
});

// --- Login ---
app.post('/login', (req, res ) =>  {

	const userInfo = req.body;
    console.log(userInfo.username+" is login");

    //add xss attack filter
    const user = xssFilters.inHTMLData(userInfo.username);
    const pass = xssFilters.inHTMLData(userInfo.password);
    if (user === 'null' || pass === 'null') {
        res.status(400).send({msg:'Input cannot be null', isLogin:false});
    }else{
        //add salt
        const currPass = cryptPwd(pass);
        const currUser =  {
            username: user.toLowerCase(),
            password: currPass
        };
        User.findOne({
            username:currUser.username,
            password:currUser.password
        }, function (err, data) {
            if(err){
                console.log(err);   
                res.status(400).send({isLogin:false, msg: "Unknown reason"});           
            }else{
                if (data) {

                    //set session and cookie
                    req.session.loginUser = {
                        username: data.username,
                        id: data._id
                    };
                    res.cookie('user', JSON.stringify({
                    	username: data.username,
                    	id: data._id,
                    }));

                    //if we could find the user
                    res.status(200).send({userId: data._id, username: data.username, isLogin:true, msg: "Login success" + data._id + data.username});    
                }
                else {
                    //if we cannot find the user
                	res.status(200).send({isLogin:false, msg: "Username and password does not match"});
                }   
            }                        
        });
    }
});

// --- register ---
app.post('/register', (req, res ) =>  {
    const userInfo = req.body;
    //add xss attack filter
    const user = xssFilters.inHTMLData(userInfo.username.toLowerCase());
    const pass1 = xssFilters.inHTMLData(userInfo.password);
    const pass2 = xssFilters.inHTMLData(userInfo.vpassword);

    if (user === 'null' || pass1 === 'null' || pass2 === 'null') {
        res.status(400).send({msg:'Input is not valid', isRegister:false});
    }else{
        if (pass1 === pass2) {
            const currPass = cryptPwd(pass1);
            const currUser =  {
                username: user,
                password: currPass
            };
            User.findOne({
                username:currUser.username
            }, function (err, data) {
                if(err) {
                    console.log(err);
                }
                if (data) {
                    // if the user has existed
                    res.status(200).send({msg:'Username has existed',isRegister:false});
                }else{
                    console.log("create user sucess");
                    User.create(currUser, (err) => {
                        if(err) return console.log(err);
                        res.status(200).send({msg:'Register success', isRegister:true});
                    });
                }
            });
        }
        else{
            res.status(200).send({msg:'Input passwords are not equal',isRegister:false});
        }
    }

});


// --- LogOut --- 
app.get('/logout',(req, res) => {
    req.session.loginUser = null;
    res.clearCookie('user');//clear cookie
    if (req.session.loginUser) {
        res.status(400).send({isLogout:false,msg:'Login out failed'});
    }else{
        console.log('success');
        res.status(200).send({isLogout:true, msg: "Login out Successfully" });
    }
});


// ---      oAuth with google         ---//


app.get('/auth/google', passport.authenticate('google',{
    scope:['Profile']
}));

app.get('/auth/google/redirect',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        req.session.loginUser = {
                        username: req.user.username,
                        id: req.user._id,
                    };
        res.cookie('user', JSON.stringify({
                        username: req.user.username,
                        id: req.user._id,
        }));
        res.redirect('http://localhost:3000');//redirect website
    }
);


// --- Get a user's events by year/month*/ ---
app.get('/user/:id/:year/:month',(req, res) => {
    const id = req.params.id;
    const year = parseInt(req.params.year);
    const thisMonth = parseInt(req.params.month);
    const nextMonth = parseInt(req.params.month)+1;
    let sendEvents = [];
    Event.find(
        {$or: [{'visibility':'public'},
            {$and: [
                {'visibility':'private'},
                {'creator.id': id},
                {
                    $or: [
                        {'startDate': {$gte:new Date(year,thisMonth),$lte: new Date(year,nextMonth)}},
                        {'endDate': {$gte:new Date(year,thisMonth),$lte: new Date(year,nextMonth)}},]
                }]
            }
    ]},(err,events)=>{
        let count = 0, length = events.length;
        if (err){
            console.log(err);
            res.status(400).send({'msg':'find-event-failed'});
        }else{
            events.forEach(event => {
                sendEvents.push(event);
                count++;
            });
        }
        deasync.loopWhile(() => count < length);
        console.log(' event: '+ count);
        console.log('==================');
        console.log('total: '+ sendEvents.length);
        res.status(200).send(
            JSON.stringify({
                sendEvents
            })
        );
    });
});

/* a logged user create event*/
app.post('/user/event',isLoggedIn,function (req,res) {
    const event = xssFilters.inHTMLData(req.body.event);
    const title = xssFilters.inHTMLData(req.body.event.title);
    console.log(event.title);
    if ( event === null || title === null || event.endDate < event.startDate){
        res.status(400).send({isCreated :false,'msg':'create-event-is-not-valid'});
    }else{
        User.findById(req.session.loginUser.id,function (err,user) {
            if (err){
                console.log(err);
                res.status(400).send({isCreated :false,'msg':'find-user-id-failed'});
            }else{
                Event.create(req.body.event,function (err, event) {
                    if (err){
                        console.log(err);
                        res.status(400).send({isCreated :false,'msg':'create-event-failed'});
                    }else{
                        //create event and add user
                        event.creator.id = req.session.loginUser.id;
                        event.creator.username = req.session.loginUser.username;
                        //save event to db
                        event.save();
                        //add this event to user
                        user.events.push(event);
                        console.log(JSON.stringify(event));
                        user.save();
                        console.log('success,Created a new event!');
                        res.status(200).send({
                            eventId: event._id,
                            isCreated :true
                        });
                    }
                });
            }
        });
    }  
});


/* a logged user edit event*/
app.put('/user/event/:id',isLoggedIn,function (req,res) {
    const event = xssFilters.inHTMLData(req.body.event);
    const title = xssFilters.inHTMLData(req.body.event.title);
    console.log(event);
    if(event === null || title === null || event.endDate < event.startDate){
        res.status(400).send({isUpdated :false,'msg':'update-event-is-not-valid'});
    }else{
        Event.findById(req.params.id,function (err,event) {
           if (err){
               console.log(err);
               res.status(400).send({isUpdated :false,'msg':'find-event-failed'});
           }else{
               Event.findByIdAndUpdate(req.params.id, req.body.event, function (err, event) {
                   if (err){
                       console.log(err);
                       res.status(400).send({isUpdated :false,'msg':'update-event-failed'});
                   }else{
                       //event creator remains the same
                       event.creator.id = req.session.loginUser.id;
                       event.creator.username = req.session.loginUser.username;
                       console.log(req.sessionID);
                       //save event to db
                       event.save();
                       console.log('Update event successfully!');
                       res.status(200).send({
                           isUpdated :true
                       });
                   }
               });
               console.log("error,user don't have permission to do that!");
               res.status(200).send({
                   isUpdated :false
               });
           }
        });
    }
    
});



/* a logged user delete event*/
app.delete('/user/event/:id',checkUserEvent, function (req,res) {
    Event.findById(req.params.id,function (err,event) {
        if (err){
            console.log(err);
            res.status(400).send({isDeleted :false,'msg':'find-event-failed'});
        }else{
            if (event.creator.username === req.session.loginUser.username || event.visibility === 'private'){
                User.findById(event.creator.id,function (err,user) {
                    if (err){
                        console.log(err);
                    }else{
                        for (let eventId of user.events){
                            const index = user.events.indexOf(eventId);
                            user.events.splice(index,1);
                            user.save();
                        }
                    }
                });
                Event.findByIdAndRemove(req.params.id,function (err) {
                    if (err){
                        console.log(err);
                        res.status(400).send({isDeleted :false,'msg':'delete-event-failed'});
                    }else{
                        console.log('delete a event successfully!');
                        res.status(200).send({
                            isDeleted :true
                        });
                    }
                });
            }else{
                console.log("error,user don't have permission to do that!");
                res.status(200).send({
                    isDeleted :false
                });
            }
        }
    });
});

