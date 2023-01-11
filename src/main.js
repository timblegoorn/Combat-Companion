/**
 * Handles initialization and basic turn logic.
 *
 * @author Andrew Jacobsson.
 * @since  v0.1
 */

// Current round which increments after each unit has a turn
var currentRound = 1; 
// Current turn which corresponds to unit index
var currentTurn = 0; 

var searchBar, searchResults;

// Initialize functions that needed to wait for document load
window.addEventListener('load', Init);
/**
 * Initializes game
 */
function Init() {
  OrderUnits();

  searchResults = document.getElementById("searchResults");
  searchBar = document.getElementById("monsterName");

  searchBar.addEventListener('input', UpdateSearchResults);

  getMonstersByName(""); // get list of all monsters
  
  if (units.length > 0) {
    let copiedSB = JSON.parse(JSON.stringify(units[currentTurn]));
    currentStatBlock = copiedSB;
    currentStatBlock.index = 0;
    RenderUnit(currentStatBlock.id);
    DisplayStatBlock(currentStatBlock);
    DisplayUnits();
  }
}


/**
 * Increments the current turn of combat. If stay is declared, the turn index will not increment.
 * This is used if a unit is deleted due to the shifting of indexes.
 * 
 * @param {boolean} stay 
 * @returns 
 */
function incrementTurn(stay = false) {
  if (units.length == 0) {
    ResetGame();
    return;
  }
  if (!stay) currentTurn++;

  // Loop index and increment round if reached end of order
  if (currentTurn == units.length) {
    currentTurn = 0;
    currentRound++;
  }

  // Trigger start of turn effects such as death saves
  // If a unit is dead, recursively increment turn until there is a unit not dead
  if (units[currentTurn].current_hit_points == 0) {
    if (units[currentTurn].control_type == "PC" && (units[currentTurn].death_saves_failed == undefined || units[currentTurn].death_saves_failed < 3)) {
      RenderDeathSavingThrows(units[currentTurn].id);
    } else {
      incrementTurn();
      return;
    }
  }

  // Decrement status effect at start of turn if relevant
  for(var statusEffect in units[currentTurn].status_effects){
    if (units[currentTurn].status_effects[statusEffect] > 0) {
      units[currentTurn].status_effects[statusEffect]--;
      if (units[currentTurn].status_effects[statusEffect] == 0) delete units[currentTurn].status_effects[statusEffect];
    }
  }

  UpdateCurrentStatblock(units[currentTurn].id)
  DisplayUnits();
  RenderUnit(currentStatBlock.id);
  DisplayStatBlock(currentStatBlock);
}


/**
 * Resets the current combat
 */
function ResetGame() {
  currentRound = 1;
  currentTurn = 0;
  units = [];

  DisplayUnits();
  document.getElementById('unitZone').innerHTML = ""; 
  document.getElementById('statblockZone').innerHTML = ""; 
}