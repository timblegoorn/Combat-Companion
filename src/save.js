/**
 * Handles local storage of combat data.
 * 
 * Users can store and retrieve an existing combat session
 * TODO: add ability to save multiple combats and title the combat
 * TODO: add ability to store and retrieve individual statblocks locally, and connect it to monsterlist
 *
 * @author Andrew Jacobsson.
 * @since  v0.1
 */


  /**
   * Saves the current combat into local storage
   */
  function SaveGame() {
      var saveFile = {
          currentRound: currentRound,
          currentTurn: currentTurn,
          units: units,
      }
  
      localStorage.setItem("CombatCompanionSave", JSON.stringify(saveFile));
  }
  

  /**
   * Loads the last saved combat from local storage
   */
  function LoadGame() {
      var saveFile = JSON.parse(localStorage.getItem("CombatCompanionSave"));
      currentRound = saveFile.currentRound;
      currentTurn = saveFile.currentTurn;
      units = saveFile.units;
  
      DisplayUnits();
      if (units.length > 0) {
        let copiedSB = JSON.parse(JSON.stringify(units[currentTurn]));
        currentStatBlock = copiedSB;
        currentStatBlock.index = currentTurn;
        RenderUnit(currentStatBlock.id);
        DisplayStatBlock(currentStatBlock);
      }
  }


  /**
   * Deletes all stored data
   */
  function ClearLocalStorage() {
    localStorage.clear();
  }