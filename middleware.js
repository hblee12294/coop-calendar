const Event = require("./models/event");

module.exports  = {
    isLoggedIn: (req, res, next) => {
        // console.log(req.session);
        // console.log('middleware');
        if (req.session.loginUser) {
          console.log('user is login' + req.session.loginUser.username);
          return next();
        }else{
          res.status(400).send(
                JSON.stringify({'msg':'user-is-not-logging'})
          );
        }
    },
    checkUserEvent : (req, res, next) => {
        if (req.session.loginUser){
            Event.findById(req.body.event._id, function (err, event) {
               if (event.creator.id.equals(req.session.loginUser.id)){
                   next();
               }else{
                   console.log("error", "You don't have permission to do that!");
                   res.status(400).send(
                       JSON.stringify({'msg':'find-user-event-failed'})
                   );
               }

            });
        }else{
            // req.flash("error", "You must be signed in to do that!");
            res.status(400).send(
                JSON.stringify({'msg':'user-is-not-logging'})
            );
        }
    }
};

// module.exports = middleware;