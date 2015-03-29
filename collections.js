BlackjackGames = new Mongo.Collection("blackjackGames");
Decks = new Mongo.Collection("decks");
Cards = new Mongo.Collection("cards");
Players = new Mongo.Collection("players");

Players.helpers({
  cards: function() {
    var cards = [];
    this.cardIds.forEach(function(id) {
      cards.push(Cards.findOne({ _id: id }));
    });
    return cards;
  },
  value: function() {
    totalValue = 0;
    this.cards().forEach(function(card) {
      if (card.faceUp == 1) {
        totalValue += card.getBlackjackValue();
      }
    });
    return totalValue;
  },
  busted: function() {
    return this.value() > 21;
  },
  blackjack: function() {
    return this.value() == 21;
  },
  getStatus: function() {
    if (this.busted()){
      return "Busted";
    }
    if (this.blackjack()) {
      return "Blackjack"
    }
    return "";
  }
});

BlackjackGames.helpers({
  deck: function() {
    return Decks.findOne({ gameId: this._id });
  },
  increaseBet: function(amount) {
    Session.set('credits', Session.get('credits') - amount);
    var playerId = Players.findOne({ gameId: this._id })._id;
    Players.update({_id: playerId}, {$inc: {bet: amount}});
  },
  players: function() {
    return Players.find({ gameId: this._id });
  },
  canDeal: function() {
    return this.deck().cardIds.length == 52;
  },
  deal: function() {
    for (var i = 0; i < 2; i++) {
      this.dealPlayers();
      var newCardId = this.deck().drawCard();
      BlackjackGames.update({_id: this._id}, {$push: {dealerCardIds: newCardId}});
      if (i == 0) {
        Cards.findOne({_id: newCardId}).turnOver();
      }
    }
    this.processWins();
  },
  dealPlayers: function() {
    var self = this;
    this.players().forEach(function(player) {
      var newCardId = self.deck().drawCard();
      Players.update({_id: player._id}, {$push: {cardIds: newCardId}});
      Cards.findOne({_id: newCardId}).turnOver();
    });
  },
  dealerValue: function() {
    totalValue = 0;
    this.dealerCards().forEach(function(card) {
      if (card.faceUp == 1) {
        totalValue += card.getBlackjackValue();
      }
    });
    return totalValue;
  },
  dealerBusted: function() {
    return this.dealerValue() > 21;
  },
  dealerBlackjack: function() {
    return this.dealerValue() == 21;
  },
  dealerGetStatus: function() {
    if (this.dealerBusted()){
      return "Busted";
    }
    if (this.dealerBlackjack()) {
      return "Blackjack"
    }
    return "";
  },
  dealDealer: function() {
    var lastCard = this.dealerCards()[this.dealerCardIds.length-1];
    if (lastCard.faceUp == 0) {
      lastCard.turnOver();
    } else {
      var newCardId = this.deck().drawCard();
      BlackjackGames.update({_id: this._id}, {$push: {dealerCardIds: newCardId}});
      Cards.findOne({_id: newCardId}).turnOver();
    }
  },
  hit: function() {
    this.dealPlayers();
    this.processWins();
  },
  stand: function() {
    this.dealDealer();
    this.processWins();
  },
  dealerCards: function() {
    var cards = [];
    this.dealerCardIds.forEach(function(id) {
      cards.push(Cards.findOne({ _id: id }));
    });
    return cards;
  },
  canPlay: function() {
    if (this.dealerGetStatus() != "") {
      return false;
    }
    var canPlay = true;
    this.players().forEach(function(player){
      if (player.getStatus() != "") {
        canPlay = false;
      }
    });
    return canPlay;
  },
  processWins: function() {
    if (this.dealerBlackjack()) {
      Session.set('charity', Session.get('charity') + this.dealerValue());
    }
    var player = Players.findOne({gameId: this._id});
    if (player.blackjack()) {
      Session.set('credits', Session.get('credits') + player.value() + player.value());
    }
  },
  restart: function() {
    BlackjackGames.update({_id: this._id}, {$set: {dealerCardIds: []}});
    Players.find({gameId: this._id}).forEach(function(player) {
      Players.update({_id: player._id}, {$set: {cardIds: [], bet: 0}});
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
    Decks.find({gameId: this._id}).forEach(function(deck) {
      Decks.remove({_id: deck._id});
    });
    var deckId = Decks.insert({
      gameId: this._id,
      cardIds: cardIds
    });
    Decks.findOne({_id: deckId}).shuffle();
  },
  cleanUp: function() {
    Players.find({gameId: this._id}).forEach(function(player) {
      Players.remove({_id: player._id});
    });
    this.deck().cardIds.forEach(function(cardId) {
      Cards.remove({_id: cardId});
    });
    Decks.find({gameId: this._id}).forEach(function(deck) {
      Decks.remove({_id: deck._id});
    });
  }
});

Decks.helpers({
  cards: function() {
    var cards = [];
    this.cardIds.forEach(function(id) {
      cards.push(Cards.findOne({ _id: id }));
    });
    return cards;
  },
  shuffle: function(){
    var temp = [];
    while (this.cardIds.length > 0) {
      var t = Math.random() * this.cardIds.length;
      temp.push(this.cardIds.splice(t,1)[0]);
    }
    Decks.update(this._id, {$set: {cardIds: temp}});
  },
  drawCard: function(){
    var cardId = this.cardIds.splice(0,1)[0];
    Decks.update(this._id, {$set: {cardIds: this.cardIds}});
    return cardId;
  }
});

Cards.helpers({
  getHumanSuit: function(){
    if(this.suit==1){
      return "Hearts";
    }
    else if(this.suit==2){
      return "Clubs";
    }
    else if(this.suit==3){
      return "Spades";
    }
    else{
      return "Diamonds";
    }
  },
  getImagePath: function() {
    if (this.faceUp == 0)
      return "/cards/b1fv.png"
    if (this.value < 11)
      return "/cards/" + this.getHumanSuit().charAt(0).toLowerCase() + this.value + ".png";
    else
      return "/cards/" + this.getHumanSuit().charAt(0).toLowerCase() + this.getHumanValue().charAt(0).toLowerCase() + ".png";
  },
  getValue: function(){
    return this.value;
  },
  getBlackjackValue: function() {
    if (this.value > 10) {
      return 10;
    }
    return this.value;
  },
  getHumanValue: function(){
    if(this.value==1){
      return "Ace";
    }
    else if(this.value==11){
      return "Jack";
    }
    else if(this.value==12){
      return "Queen";
    }
    else if(this.value==13){
      return "King";
    }
    else{
      return this.value;
    }
  },
  turnOver: function() {
    Cards.update(this._id, {$set: {faceUp: 1}});
  }
});
