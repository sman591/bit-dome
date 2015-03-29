if (Meteor.isClient) {

  Router.configure({
    layoutTemplate: 'ApplicationLayout'
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

  Router.route('/play/:_id', function () {
    this.render('Play' + this.params._id);
  }, {
    name: 'playGame'
  });

  Template.navItems.helpers({
    // http://robertdickert.com/blog/2014/05/09/set-up-navigation-with-iron-router-and-bootstrap/
    activeIfTemplateIs: function (template) {
      var currentRoute = Router.current();
      return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
    }
  });

  Template.Play.helpers({
    games: function () {
      return Games.find({});
    }
  });

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
