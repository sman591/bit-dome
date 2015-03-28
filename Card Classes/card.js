var card = class.extend({
	init: function(suit,value){
		this.suit = suit;
		this.value=value;
	}
	getHumanSuit: function(){
		if(suit==1){
			return "Hearts";
		}
		else if(suit==2){
			return "Clubs";
		}
		else if(suit==3){
			return "Spades";
		}
		else{
			return "Diamonds";
		}
	}
	getSuit: function(){
		return suit;
	}
	getValue: function(){
		return value;
	}
	getHumanValue: function(){
		if(value==1){
			return "Ace";
		}
		else if(value==11){
			return "Jack";
		}
		else if(value==12){
			return "Queen";
		}
		else if(value==13){
			return "King";
		}
		else{
			return value;
		}
	}
});

var Deck = class.extend({

	init: function(){
		this.cards=[];
	
		
		for(i=1; i<=4; i++){
			for(k=1; k<=13; k++){
				this.cards[(i*k)+1]=card(i,k);
					
			}
		}
	}
	shuffle: function(){
		var temp=[];
		for(i=cards.length; i>=0; i--){
			var t =Math.random()*i;
			temp[t]=cards[i];
			cards.splice[i,1];

	}
	draw: function(){
		var temp =cards[0];
		cards.splice[0,1];
		return temp;
	}
	getCards: function(){
		return cards;
	}
	getcard: function(z){
		return cards[z];
	}
});