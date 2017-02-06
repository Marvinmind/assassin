/**
 * Created by martin on 13.01.17.
 */

var express = require('express');
var router = express.Router();
const db = require('monk')('localhost/murder')
const circles = db.get('circles')
const users = db.get('users')

router.get('/$', function (req,res) {
        circles.find({}, {fields: {name:1, players:1, _id:0}}).then(docs =>{
        console.log(docs)
        res.send(JSON.stringify(docs)+'\n')
    })

})

router.get('/:circle([a-zA-Z]+)$', function(req, res, next){
    circles.findOne({name: req.params.circle}).then(function(docs){
        res.send(JSON.stringify(docs))
    })
});

router.post('/$', function(req, res, next) {
    const circleName = req.body.name
    circles.find({name:circleName}).then((circleDocs) => {
        if (!circleDocs) {
            circles.update({name: circle}, {name: circle, active: false}, {upsert: true});
            res.send('circle added \n');
        } else {
            res.status(303).send('circle already exists\n')
        }
    });
});

router.post('/:circle([a-zA-Z]+)/players$', function(req, res, next){
    const userName = req.body.name
    users.findOne({name:userName}).then((docs) =>{
        if (!docs.active) {
            circles.update({name: req.params.circle}, {$push: {players: docs._id}});
        }
    });
    res.send('user added to circle \n');
});

router.post('/:circle([a-zA-Z]+)/activate$', function(req, res, next){
    const circle = req.params.circle
    console.log('activate')
    circles.findOne({name: circle}).then((docs) =>{
        var players = docs.players;
        if (players.length >= 3 && !docs.active){
            console.log(players)
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
        var j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

module.exports = router