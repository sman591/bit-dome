/*var player = class.extend({

	init: function(money) {
		this.money=money;
	}
	hand=[];
	giveCard: function(card){
		hand.push(card);
	}
	bet: function(amount){
		money-=amount;
		return amount;
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
	play: function(){
		var z=true;
		while(z==true)
			var total=0;
			for(i=0; i<hand.length; i++){
				total+=hand[i];
			}
			if(total<14)
				hit();
	}
});
var rounds = class.extend({
	init: function(dealer. playerArray){
		this.dealer=dealer;
		this.playerArray=playerArray;
	}
	choose: function(tem){
		if(tem==true){
			player.hit();
		}
	}
	round: function(){
		while(true){
			dealer.deal();
			for(i=0; i<playerArray.length; i++){
				playerArray[i].bet();

			}
			for(i=0; i<playerArray.length; i++){
				this.choose();
			}
			dealer.play();
		}
	}
});*/
