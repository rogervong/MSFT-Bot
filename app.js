var builder = require('botbuilder');
var config = require('./config.js');
var Food = require('./dialogs/food.js')();
var Selector = require('./dialogs/selector.js').Selector;

// Create bot and bind to console
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://' + config.LUIS_URL + config.LUIS_KEYS;
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

dialog.matches('Greetings', function(session, data){
    session.beginDialog('/Greetings', data)
});

dialog.matches('FoodChoice', function(session, data) {
    session.beginDialog('/FoodChoice', data)
});
bot.dialog('/Greetings', [function(session, data) {
    builder.Prompts.confirm(session, 'Hi, do you need help choosing what to cook?');
},
function(session, data) {
    if(data.response) {
        session.userData.greetings = true;
        session.beginDialog('/FoodChoice')
    }
}]);
bot.dialog('/FoodChoice', Food);
bot.dialog('/selector', Selector);

dialog.onDefault(builder.DialogAction.send('I dont understand what you are trying to do. I can only help you pick a food dish.'))