BlackjackGames = new Mongo.Collection("blackjackGames");
Decks = new Mongo.Collection("decks");
Cards = new Mongo.Collection("cards");

BlackjackGames.helpers({
  deck: function() {
    return Decks.findOne({ gameId: this._id });
  },
  players: function() {
    var players = [];
    this.playerIds.forEach(function(index, e, array) {
      players.push(Players.findOne({ _id: e }));
    });
    return players;
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
    return this.cardIds.splice(0,1)[0];
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
