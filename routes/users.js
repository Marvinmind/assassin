var express = require('express');
var router = express.Router();
const db = require('monk')('martin:knuthansen@localhost/murder')
const users = db.get('users')
const circles = db.get('circles')


/* GET users listing. */
router.get('/:user([a-zA-Z]+)$', function(req, res, next) {
  var user = {};
  user.name = req.params.user;
  users.findOne({name:user.name}).then((userDoc) => {
      circles.find({players: {$elemMatch:{$eq:userDoc._id}}}).then((circlesDoc) => {
        var promises = circlesDoc.map((obj) => {
            return get_user_target(obj, userDoc);
        });
        Promise.all(promises).then((result) => {
            console.log(result)
            user.circles = result.map((obj) => {return {circleName:obj.circle, nextTarget: obj.next_target_name}});
            res.send(JSON.stringify(user, null, 4)+'\n');

        })
    });
  });
});
router.post('/$', function(req, res, next) {
    const userName = req.body.name;
    users.find({name:userName}).then((userDoc) => {
        if (!userDoc) {
            users.update({name: user}, {name: user}, {upsert: true})
            console.log('inserted')
            res.send('user added\n')
        }else{
            res.status(303).send('user already exists\n')
        }
    })

});

router.post('/:user([a-zA-Z]+)/:circle([a-zA-Z]+)/killTarget', function(req, res, next) {
   const user_name = req.params.user;
   const circle_name = req.params.circle
   users.findOne({name:user_name}).then((user_docs) => {
       if(user_docs) {
           circles.findOne({name: circle_name}).then((circle_docs) => {
               if (circle_docs) {
                   if (circle_docs.active) {
                       get_user_target(circle_docs, user_docs).then((result) => {
                           if (result) {
                               circles.update({name: circle_name}, {$pull: {kill_list: result.next_target_id}});
                               circles.findOne({name: circle_name}).then((result) => {
                                   if (result.kill_list.length == 1) {
                                       circles.update({name: circle_name}, {$set: {active: false}})
                                       res.send('Congratulations, you won!\n')
                                   }
                                   else {
                                       res.send('Target killed\n')
                                   }
                               })
                           }
                       })
                   } else {
                       res.status(404).send('circle inactive\n')
                   }
               } else {
                   res.status(404).send('circle not found\n')
               }
           })
       }else{
           res.status(404).send('user not found\n')
       }
   })
});

function get_user_target(circle, user){
    if (circle.active) {
        const index = circle.kill_list.findIndex((el) => {return user._id.equals(el)});
        if(index>=0) {
            const vicId = circle.kill_list[(index + 1) % circle.kill_list.length];
            return users.findOne({_id: vicId}).then((res) => {
                return {circle: circle.name, next_target_id: res._id, next_target_name: res.name}
            });
        }
        else{
            return Promise.resolve(undefined)
        }
    }
    else{
        return Promise.resolve(undefined)
    }
}

module.exports = router;
