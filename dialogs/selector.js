var builder = require('botbuilder');
var helper = require('./../foodhelper.js')

module.exports.Selector = [
    function(session, data) {
        // console.log(data)
        session.userData.foodlist = data ? data.foodlist : session.userData.foodlist;
        session.userData.food = session.userData.foodlist[Math.floor((Math.random() * session.userData.foodlist.length))];
        session.userData.foodlist = helper.remove(session.userData.foodlist, session.userData.food);
        builder.Prompts.confirm(session, 'How do you feel about ' + session.userData.food + ' ?');
    },
    function(session, data) {
        // console.log(data)
        if(data.response) {
            session.endDialog('Bon Appetit! Enjoy your ' + session.userData.food)
            session.userData.foodChosen = true;
            session.userData.entities = null;
        } else if(session.userData.foodlist.length < 1) {
            builder.Prompts.confirm(session, 'You ran out of options, do you want to pick a different protein?')
        } else {
            session.userData.food = session.userData.foodlist[Math.floor((Math.random() * session.userData.foodlist.length))];
            builder.Prompts.text(session, 'How do you feel about ' + session.userData.food + ' ?');
        }
    },
    function(session, data) {
        console.log(data);
        // console.log(data.response)
        if(data.response == 'cancel') {
            session.userData.foodlist = null;
            session.userData.food = null;
            session.userData.entities = null;
            session.endDialog('Thank you for using the food choice bot');
        } else if(data.response == 'yes') {
            session.endDialog('Bon Appetit! Enjoy your ' + session.userData.food);
            session.userData.foodChosen = true;
            session.userData.entities = null;
        } else if(data.response == 'no' || !data.response) {
            session.userData.foodlist = helper.remove(session.userData.foodlist, session.userData.food);
            session.beginDialog('/selector', session.userData);
        } else if(data.response && session.userData.foodlist.length < 1) {
            session.userData.foodlist = null;
            session.userData.entities = null;
            session.replaceDialog('/FoodChoice');
        } else {
            builder.Prompts.confirm(session, 'You ran out of options, do you want to pick a different protein?')
        }
    }
]