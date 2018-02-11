defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = MemoryWeb.GameBackup.load(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => game}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("checkpreviouscard", %{"cardId" => cardId, "cardName" => cardName}, socket) do
    game = Game.check_previous_card(socket.assigns[:game], cardId , cardName)
    MemoryWeb.GameBackup.save(socket.assigns[:name],game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => game}}, socket}
  end

  def handle_in("checkmatchpreviouscard", %{"cardId" => cardId, "cardName" => cardName}, socket) do
    game = Game.check_match_previous_card(socket.assigns[:game], cardId , cardName)
    MemoryWeb.GameBackup.save(socket.assigns[:name],game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => game}}, socket}
  end

  def handle_in("cardmatchcheck",%{"cardId" => cardId ,"cardName" => cardName}, socket) do
    game = Game.card_match_check(socket.assigns[:game], cardId , cardName)
    MemoryWeb.GameBackup.save(socket.assigns[:name],game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => game}}, socket}
  end

  def handle_in("resetgame",%{},socket) do
    game = Game.reset(socket.assigns[:game])
    MemoryWeb.GameBackup.save(socket.assigns[:name],game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => game}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
