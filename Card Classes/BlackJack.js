var player = class.extend({

	init: function(money) {
		this.money=money;
	}
	hand=[];
	giveCard: function(card){
		hand.push(card);
	}
});

var playerArray = class.extend({
	init: function(){
		this.playerArr=[];
	}
	addPlayer: function(player){
		playerArr.push(player);
	}
});

var dealer= class.extend({
	init: function(deck, playerArray){
		this.deck = deck;
		this.playerArray= playerArray;
	}
	hand=[];
	deal: function(){
		for(i=0; i<=1; i++){
			for(k=0; k< playerArray.length; k++){
				playerArray[k].getCard(deck.draw()); //this is gonna need to be fixed
			}
			hand.push(deck.draw());
		}
	}
	hit: function(player){
		player.setCard(deck.draw());
	}
});