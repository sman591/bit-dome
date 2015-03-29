if (Meteor.isClient) {

  Router.configure({
    layoutTemplate: 'ApplicationLayout'
  });

  Router.plugin('ensureSignedIn', {
      except: ['home', 'about', 'atSignIn', 'atSignUp', 'atForgotPassword']
  });

  Router.route('/', function () {
    this.render('Home');
  }, {
    name: 'home'
  });

  Router.route('/about', function () {
    this.render('About');
  }, {
    name: 'about'
  });

  Router.route('/play', function () {
    this.render('Play');
  }, {
    name: 'play'
  });

  Router.route('/play/:gameName', function () {
    this.render('List' + this.params.gameName);
  }, {
    name: 'playGame'
  });

  Router.route('/play/:gameName/:_id', function () {
    var id = this.params._id
    this.render('Play' + this.params.gameName, {
      data: {
        game: function () {
          var game = BlackjackGames.findOne({_id: id});
          return game;
        }
      }
    });
  }, {
    name: 'playGame.show'
  });

  Template.navItems.helpers({
    // http://robertdickert.com/blog/2014/05/09/set-up-navigation-with-iron-router-and-bootstrap/
    activeIfTemplateIs: function (template) {
      var currentRoute = Router.current();
      return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
    }
  });

  Template.Listblackjack.helpers({
    games: function() {
      return BlackjackGames.find({});
    }
  });

  Template.Listblackjack.events({
    'click button': function() {

      var gameName = prompt("Please name your game:");

      if (gameName == null) {
        return;
      }

      var gameId = BlackjackGames.insert({
        name: gameName,
        createdAt: new Date(),
        owner: Meteor.userId(),
        dealerCardIds: []
      });

      Players.insert({
        accountId: Meteor.userId(),
        gameId: gameId,
        cardIds: []
      });

      var cardIds = [];
      for (var s = 1; s <= 4; s++) {
        for (var v  = 1; v <= 13; v++) {
          cardIds.push(Cards.insert({
            suit: s,
            value: v,
            faceUp: 0
          }));
        }
      }
      var deckId = Decks.insert({
        gameId: gameId,
        cardIds: cardIds
      });
      Decks.findOne({_id: deckId}).shuffle();

    }
  });

  Template.Playblackjack.helpers({
  });

  Template.Playblackjack.events({
    'click .shuffle': function() {
      this.game().deck().shuffle();
    },
    'click .deal': function() {
      this.game().deal();
    },
    'click .hit': function() {
      this.game().hit();
    },
    'click .stand': function() {
      this.game().stand();
    }
  })

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
