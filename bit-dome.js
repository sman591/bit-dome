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

  Session.setDefault('credits', 4370);
  Session.setDefault('charity', 3219);

  Template.userInfo.helpers({
    credits: function() {
      return Session.get('credits');
    },
    charity: function() {
      return Session.get('charity');
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
        cardIds: [],
        bet: 0
      });

      BlackjackGames.findOne({_id: gameId}).restart();

      Iron.controller().redirect('/play/blackjack/' + gameId);

    }
  });

  Template.Playblackjack.helpers({
  });

  Template.Playblackjack.events({
    'click .deal': function() {
      this.game().deal();
    },
    'click .hit': function() {
      this.game().hit();
    },
    'click .stand': function() {
      this.game().stand();
    },
    'click .restart': function() {
      this.game().restart();
    },
    'click .quit': function() {
      this.game().cleanUp();
      BlackjackGames.remove({ _id: this.game()._id });
      Iron.controller().redirect('/play/blackjack');
    },
    'click .bet': function() {
      this.game().increaseBet(5);
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Accounts.onCreateUser(function(options, user) {
    user.credits = 0;
    return user;
  });
}
