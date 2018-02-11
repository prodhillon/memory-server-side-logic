// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
//import "phoenix_html"
//import React from 'react';
//import Appln from './Appln';

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

 import socket from "./socket"

import memorygame_init from "./MemoryGame";

function form_init() {
  //let channel = socket.channel("games:demo", {});
  $('#game-submit').click(() => {
    let xx= $('#playername').val();
    let channel = socket.channel("games:"+{xx}, {});
    channel.join()
           .receive("ok", resp => { console.log("Joined successfully", resp) })
           .receive("error", resp => { console.log("Unable to join", resp) });
           window.location.href = "/game/" +xx;
  });
}

  function start() {
    let root = document.getElementById('game');
    if (root) {
      let channel = socket.channel("games:"+window.gameName, {});
      memorygame_init(root,channel);
    }

  if (document.getElementById('index-page')) {
    //let nn=document.getElementById('index-page').value;
    //console.log("name is"+nn);
    form_init();
  }
}

$(start);
