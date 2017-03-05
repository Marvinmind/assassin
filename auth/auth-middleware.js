/**
 * Created by Martin on 05.03.2017.
 */
module.exports = function(){
    return function (req, res, next) {
        console.log('in middleware')
        if (req.isAuthenticated()) {
            console.log('call next')
            return next()
        }
        //res.redirect('/')
        res.send('You are not authenticated')
}}

