# Memory game : HW05
# The module accepts client requests and then calculates and return back the game state
# The module handles the rules/state transitions of the game
defmodule Memory.Game do

  # Initialize cards and other state attributes
  def new do
    list =  [
           %{name: "A", match: false, turned: false},
           %{name: "B", match: false, turned: false},
           %{name: "C", match: false, turned: false},
           %{name: "D", match: false, turned: false},
           %{name: "A", match: false, turned: false},
           %{name: "B", match: false, turned: false},
           %{name: "C", match: false, turned: false},
           %{name: "D", match: false, turned: false},
           %{name: "E", match: false, turned: false},
           %{name: "E", match: false, turned: false},
           %{name: "F", match: false, turned: false},
           %{name: "G", match: false, turned: false},
           %{name: "H", match: false, turned: false},
           %{name: "F", match: false, turned: false},
           %{name: "G", match: false, turned: false},
           %{name: "H", match: false, turned: false},
        ]
        # For shuffling the cards and getting new game cards positions
        shuffle_list = Enum.shuffle(list)
    %{
      cards: shuffle_list,
      disabled: false,
      previousCard: [],
      clicksPerformed: 0,
      matchdone: 0
    }
  end

  # Reset the game state
  def reset(game) do
    new()
  end

  # Check the card and return new state
  def card_match_check(game, cardId, cardName) do
    if game.disabled == false do
      {:ok, my_list} = Map.fetch(game, :cards)
      map = Enum.at(my_list, cardId)
      value = map.turned
      map1=Map.put(map, :turned, true)
      new_list =  List.replace_at(my_list, cardId, map1)
      %{
      cards: new_list,
      disabled: true,
      previousCard: game.previousCard,
      clicksPerformed: game.clicksPerformed,
      matchdone: game.matchdone
      }
    end
  end

  # Set the card as previous open card and return new state
  def check_previous_card(game, cardId, cardName) do
    {:ok, my_list} = Map.fetch(game, :cards)
    map = Enum.at(my_list, cardId)
    value = map.turned
    map1=Map.put(map, :turned, true)
    new_list =  List.replace_at(my_list, cardId, map1)
    updateClicks=game.clicksPerformed
    %{
      cards: new_list,
      disabled: false,
      previousCard: [ %{id: cardId,
                        name: cardName
                    }],
      clicksPerformed: updateClicks + 1,
      matchdone: game.matchdone
      }
  end

  # Check for match with previously opened card and return new state
  def check_match_previous_card(game, cardId, cardName) do
    if game.previousCard != '' do
      [name]= Enum.map(game.previousCard, & &1[:name])
      cond do
        name == cardName ->
          card_match_found(game, cardId, cardName)
        name != cardName ->
          card_match_not_found(game, cardId, cardName)
      end
    end
  end

  # If match found with the previous card. set state attributes and return new state
  def card_match_found(game, cardId, cardName) do
      {:ok, new_list} = Map.fetch(game, :cards)
      currcard = Enum.at(new_list, cardId)
      map1=Map.put(currcard, :match, true)
      [index]= Enum.map(game.previousCard, & &1[:id])
      prevcard = Enum.at(new_list, index)
      map2=Map.put(prevcard, :match, true)
      new_list =  List.replace_at(new_list, cardId, map1)
      new_list =  List.replace_at(new_list, index, map2)
      updateMatch = game.matchdone
      updateClicks=game.clicksPerformed
      %{
      cards: new_list,
      disabled: false,
      previousCard: [],
      clicksPerformed: updateClicks+1,
      matchdone: updateMatch + 2
      }
  end

  # If match not found with the previous card. set state attributes and return new state
  def card_match_not_found(game, cardId, cardName) do
    undoturnedstatus(game,cardId)
  end

  # Set attributes in case of un-match with previous card
  def undoturnedstatus(game,cardId) do
    {:ok, my_list} = Map.fetch(game, :cards)
    currcard = Enum.at(my_list, cardId)
    map1=Map.put(currcard, :turned, false)
    [index]= Enum.map(game.previousCard, & &1[:id])
    prevcard = Enum.at(my_list, index)
    map2=Map.put(prevcard, :turned, false)
    new_list =  List.replace_at(my_list, cardId, map1)
    new_list =  List.replace_at(new_list, index , map2)
    %{
    cards: new_list,
    disabled: false,
    previousCard: [],
    clicksPerformed: game.clicksPerformed+1,
    matchdone: game.matchdone
    }
  end
end
