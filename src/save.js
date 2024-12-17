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
   * Saves the current statblock to local storage and custom statblocks array
   */
  function SaveCurrentStatblockToStorage() {
    currentStatBlock.slug = `${currentStatBlock.name}-custom`;
    currentStatBlock.document__slug = "Custom";
    currentStatBlock.document__title = "User Defined Statblock";
    currentStatBlock.document__license_url = "http://open5e.com/legal";
    currentStatBlock.document__url = "https://combat-companion.nexodus.net";

    // If the statblock doesn't exist in the unit list, display edited statblock and exit early
    // (this would be done if editing a predefined statblock)
    if (customStatblocks.length > 0) {
      let arrIndex = customStatblocks.findIndex(unit => unit.id === currentStatBlock.id);
      if (arrIndex < 0) { // Statblock doesn't exist in list, add new statblock
        customStatblocks.push(currentStatBlock);
      } else {
        customStatblocks[arrIndex] = currentStatBlock;
      }
    } else { // Statblock does exist with same ID. Overwrite
      customStatblocks.push(currentStatBlock);
    }

    if (customStatblocks.length > 0) {
      document.getElementById("searchCustomStatblocksInfo").style.display = "block";
      document.getElementById("searchCustomStatblocksCount").innerHTML = customStatblocks.length + "User-Defined Statblocks Exist";
    }

    localStorage.setItem("CombatCompanionSavedStatblocks", JSON.stringify(customStatblocks));
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
   * Restores saved statblocks from local storage
   */
  function LoadSavedStatblocks() {
    var savedBlocks = JSON.parse(localStorage.getItem("CombatCompanionSavedStatblocks"));
    if (savedBlocks != null) {
      customStatblocks = savedBlocks
    }
    if (customStatblocks.length > 0) {
      document.getElementById("searchCustomStatblocksInfo").style.display = "block";
      document.getElementById("searchCustomStatblocksCount").innerHTML = customStatblocks.length + " User-Defined Statblocks Exist";
    }

  }


  /**
   * Deletes all stored data
   */
  function ClearLocalStorageAll() {
    localStorage.clear();
  }

  /**
   * Deletes all savegame stored data
   */
  function ClearLocalStorageSavegame() {
    localStorage.removeItem("CombatCompanionSave");
  }

    /**
   * Deletes all statblocks stored data
   */
    function ClearLocalStorageStatblocks() {
      localStorage.clear("CombatCompanionSavedStatblocks");
    }