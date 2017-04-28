var builder = require('botbuilder');
var helper = require('./../foodhelper.js')
module.exports = function() {
    return [
        function(session, data, next){
            if(session.userData.foodChosen) {
                session.userData.foodlist = null;
                session.userData.food = null;
            }
            if(session.userData.food || session.userData.foodlist || session.userData.greetings || data) {
                if(data) {
                    if(data.entities) {
                        session.userData.entities = data.entities;
                    }
                }
                next();
            }
        },
        function(session, data, next) {
            // console.log(session)
            if(!data.response && !session.userData.food && !session.userData.foodlist && !session.userData.entities && !session.userData.greetings) {
                session.endDialog('Thank you for using the food choice bot.');
            }
            else if(session.userData.foodlist || session.userData.entities) {
                next();
            } else {
                   var choices = ['Beef', 'Pork', 'Chicken', 'Vegetarian', 'Cancel']
                builder.Prompts.choice(session, 'What type of food would you like?', choices)
            }
        },
        function(session, data) {
            data.response = session.userData.entities ? session.userData.entities[0]['entity'] : data.response;
            // console.log(data.response['entity'])
            if(data.response['entity'] == 'Cancel'){
                session.endDialog('Thank you for using the food choice bot.')
            } else {
                helper.LUIScall(data.response)
                .then(function(res) {
                    let json = JSON.parse(res);
                    // console.log(json)
                    let protein = json.entities[0]['type'];
                    // console.log(json)
                    data.response = session.userData.foodlist ? session.userData.foodlist : protein;
                    if(data.response == 'Beef'){
                        session.userData.foodlist = helper.foods.Beef;
                    } else if(data.response == 'Pork'){
                        session.userData.foodlist = helper.foods.Pork;
                    } else if(data.response == 'Chicken'){
                        session.userData.foodlist = helper.foods.Chicken;
                    } else if(data.response == 'Vegetarian'){
                        session.userData.foodlist = helper.foods.Vegetarian;
                    } else if(data.response == 'Cancel') {
                        sesison.endDialog('Thank you for using the food choice bot.')
                    }
                    if(session.userData.foodlist) {
                        session.userData.food = session.userData.foodlist[Math.floor((Math.random() * session.userData.foodlist.length))];
                        builder.Prompts.confirm(session, 'How do you feel about ' + session.userData.food + ' ?');
                    }
                })
                .catch(function(err) {
                    helper.nomore(session);
                })
            }
        },
        function(session, data) {
            // console.log(data)
            switch(data.response) {
                case 'cancel' :
                    session.endDialog('Thank you for using the food choice bot.')
                    break;
                case true :
                    if(session.userData.food) {
                        session.endDialog('Bon Appetit! Enjoy your ' + session.userData.food)
                    }
                    session.userData.foodChosen = true;
                    session.userData.entities = null;
                    break;
                case false :
                    session.userData.foodlist = helper.remove(session.userData.foodlist, session.userData.food)
                    session.beginDialog('/selector');
                    break;
                default :
                    let res = data.response;
                    session.userData.foodlist = data.response;
                    session.beginDialog('/', res);
                    break;
            }
        }
    ]
}