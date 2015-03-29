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
  }
});

BlackjackGames.helpers({
  deck: function() {
    return Decks.findOne({ gameId: this._id });
  },
  players: function() {
    return Players.find({ gameId: this._id });
  },
  deal: function() {
    var self = this;
    this.players().forEach(function(player) {
      Players.update({_id: player._id}, {$push: {cardIds: self.deck().drawCard()}});
    });
    BlackjackGames.update({_id: this._id}, {$push: {dealerCardIds: this.deck().drawCard()}});
  },
  dealerCards: function() {
    var cards = [];
    this.dealerCardIds.forEach(function(id) {
      cards.push(Cards.findOne({ _id: id }));
    });
    return cards;
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
    if(this.value < 11)
      return "/cards/" + this.getHumanSuit().charAt(0).toLowerCase() + this.value + ".png";
    else
      return "/cards/" + this.getHumanSuit().charAt(0).toLowerCase() + this.getHumanValue().charAt(0).toLowerCase() + ".png";
  },
  getValue: function(){
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
  }
});
