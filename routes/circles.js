/**
 * Created by martin on 13.01.17.
 */

var express = require('express');
var router = express.Router();
const db = require('monk')('localhost/murder')
const circles = db.get('circles')
const users = db.get('users')

//get all circles
router.get('/$', function (req,res) {
        circles.find({}, {fields: {name:1, players:1, _id:0}}).then(docs =>{
        res.send(JSON.stringify(docs)+'\n')
    })

})

//get a specific circle
router.get('/:circle([a-zA-Z]+)$', function(req, res, next){
    circles.findOne({name: req.params.circle}).then(function(docs){
        res.send(JSON.stringify(docs))
    })
});

//add a circle
router.post('/$', function(req, res, next) {
    const circleName = req.body.name
    if (circleName.length < 4 || circleName.length > 15){
        res.send('string to long or to short')
        return
    }
    circles.findOne({name:circleName}).then((circleDocs) => {
        if (!circleDocs) {
            circles.update({name: circleName}, {name: circleName, active: false, players:[]}, {upsert: true});
            res.send('circle added \n');
        } else {
            res.status(303).send('circle already exists\n')
        }
    });
});

//add a player to a circle
router.post('/:circle([a-zA-Z]+)/players$', function(req, res, next){
    const userName = req.body.name
    console.log(userName)
    const circleName = req.params.circle
    users.findOne({name:userName}).then((userDocs) =>{
        console.log(userDocs)
        if (userDocs){
            circles.findOne({name: circleName}).then(circleDocs => {
                if (circleDocs && !circleDocs.active){
                    circles.update({name: circleName}, {$push: {players: userDocs._id}});
                    res.send('user added to circle \n');
                    return
                }
                else{
                    res.send("The circle does not exist or is currently active")
                    return
                }
            })
        }
        else{
            res.send("user was not found")
            return
        }
    });

});

router.post('/:circle([a-zA-Z]+)/activate$', function(req, res, next){
    const circle = req.params.circle
    console.log('activate')
    circles.findOne({name: circle}).then((docs) =>{
        var players = docs.players;
        if (players.length >= 3 && !docs.active){
            shuffle(players)
            circles.update({name: circle}, {$set:{kill_list:players, active: true}});
        }
    });
    res.send('circle activated \n');
});
router.post('/:circle([a-zA-Z]+)/restart$', function(req, res, next){
    const circle = req.params.circle
    circles.findOne({name: circle}).then((docs) =>{
        var players = docs.players;
        if (players.length >= 3){
            shuffle(players)
            circles.update({name: circle}, {$set:{kill_list:players, active: true}});
        }
    });
    res.send('circle restarted \n');
});


function shuffle(a) {
    for (var i = a.length; i; i--) {
        const j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

module.exports = router