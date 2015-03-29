
//- BlackjackGame
  - Deck
    - [ Card ] (52)
  - [ Card ] (1..5)
  - [ Player ] (0..5)
    - _id
    - [ Card ] (2..5)

## DB Collection Layout

- BlackjackGame
  - _id
  - name
  - createdAt
  - owner
  - players, array
    - playerId
    - cardIds
  - dealerCardIds

- Deck
  - _id
  - gameId
  - cardIds, array of card _ids

- Card
  - _id
  - suit (int, 0..3)
  - balue (int, 0..13)
  - faceUp (int, 0..1)

- Player
  - _id
  - accountId
  - gameId
  - cardIds
