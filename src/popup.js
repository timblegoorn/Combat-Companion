/**
 * Handles popup window for contextual events.
 *
 * @author Andrew Jacobsson.
 * @since  v0.3
 */


// Variable to determine if popup can be closed in conventional means
var cantClose = false;


/**
 * Renders a popup window that can be closed with an X in the corner or clicking anywhere outside the window.
 * 
 * If "cantClose" global variable is true, then the window cannot be closed out through those means, the
 * window can only be closed programatically at that point by changing cantClose back to false and calling
 * HidePopup.
 * 
 * @param {String} str HTML markup of string to display in popup
 */
function DisplayPopup(str) {
  if (!cantClose) {
    let headerContent = `<i id="popupX" class="fa-solid fa-x icon rightCorner" onclick="HidePopup()"></i>`
    document.getElementById("popup").innerHTML = headerContent + str;
  } else document.getElementById("popup").innerHTML = str;
    document.getElementById("popupContainer").style.display = "block";
    document.getElementById("popup").style.display = "block";
  }

  
/**
 * Hides the popup menu
 * 
 * @param {click event} e Click event passed by onclick or event listener
 * @returns 
 */
function HidePopup(e) {
    if (e != undefined) e.stopPropagation();
    if (cantClose) return;
    document.getElementById("popupContainer").style.display = "none";
    document.getElementById("popup").style.display = "none";
}


/**
 * Triggered on the start of a unit's turn if they are at 0 HP
 * Renders a popup with dialog to handle death saving throws.
 * 
 * @param {*} id unit ID to render death saves for
 * @returns 
 */
function RenderDeathSavingThrows(id) {
    let arrIndex = units.findIndex(unit => unit.id === id);
    if (arrIndex < 0) return;
  
    if (units[arrIndex].death_saves_succeeded == undefined) units[arrIndex].death_saves_succeeded = 0;
    if (units[arrIndex].death_saves_failed == undefined) units[arrIndex].death_saves_failed = 0;
  
    let sb = units[arrIndex];
  
    if (sb.death_saves_succeeded >= 3) {
      sb.death_saves_succeeded = 0;
      units[arrIndex].current_hit_points = 1;
      HidePopup();
      incrementTurn();
      return;
    }
    if (sb.death_saves_failed >= 3) {
      sb.death_saves_succeeded = 0;
      units[arrIndex].dead = true;
      HidePopup();
      incrementTurn();
      return;
    }
    cantClose = true;
    var str = `<br><h1 class='themeDisplay'>Make A Death Saving Throw For ${sb.name}</h1>`;
    
    str += `
    <h2>Successful Saves: ${sb.death_saves_succeeded} Failed Saves: ${sb.death_saves_failed}</h2>
    <button type="button" onclick="RollDeathSave('${id}')">Auto Roll Save</button><br>
    <button type="button" onclick="AddDeathSave('${id}', -1)">Add Failed Death Save</button><br>
    <button type="button" onclick="AddDeathSave('${id}', 1)">Add Successful Death Save</button><br>
    <button type="button" onclick="AddDeathSave('${id}', -2)">Add Critical Fail Death Save</button><br>
    <button type="button" onclick="AddDeathSave('${id}', 2)">Add Critical Success Death Save</button><br>`
    DisplayPopup(str);
  }

    
/**
 * Roll a death saving through automatically
 * 
 * @param {*} id unit id
 */
function RollDeathSave(id) {
    var roll = Math.floor(Math.random()*20+1);
    console.log("Death save roll: "+roll)
    if (roll == 20) AddDeathSave(id, 3);
    else if (roll == 1) AddDeathSave(id, -2);
    else if (roll >= 10) AddDeathSave(id, 1);
    else AddDeathSave(id, -1);
}
  

/**
 * Adds death saving throughs to the appropriate statblock.
 * 
 * @param {*} id unit ID
 * @param {*} amount amount of death saves. negative for failed, positive for success. 
 * @returns 
 */
function AddDeathSave(id, amount) {
    let arrIndex = units.findIndex(unit => unit.id === id);
    if (arrIndex < 0) return;
  
    if (amount < 0) {
      units[arrIndex].death_saves_failed -= amount;
    }
    if (amount > 0) {
      units[arrIndex].death_saves_succeeded += amount;
    }
    if (units[arrIndex].death_saves_failed >= 3 || units[arrIndex].death_saves_succeeded >= 3) {
      cantClose = false;
      RenderDeathSavingThrows(id);
    } else {
      cantClose = false;
      HidePopup();
      incrementTurn();
    }
}
  

/**
 * Resets death save fails or successes for provided ID
 * 
 * @param {*} id unit id
 * @param {*} forFailed true if resetting failed death saves, otherwise resets successes
 * @returns 
 */
function ResetDeathSaves(id, forFailed) {
    let arrIndex = units.findIndex(unit => unit.id === id);
    if (arrIndex < 0) return;
  
    if (forFailed) {
      units[arrIndex].death_saves_failed = 0;
    } else {
      units[arrIndex].death_saves_succeeded = 0;
    }
  
    RenderUnit(id);
}


/**
 * Opens a popup to add a selected status effect to the provided unit
 * 
 * @param {*} id unit id
 * @returns 
 */
function AddStatusEffect(id) {
    let arrIndex = units.findIndex(unit => unit.id === id);
    if (arrIndex < 0) return;
    var str = `<br><h1 class='themeDisplay'>Add Status Effect to ${units[arrIndex].name}</h1>`;
  
    str += `
    <label for="statusEffectSelect">Select Status Effect</label>
    <select class="statusEffectSelect" name="statusEffectSelect" id="statusEffectSelect" value="Blinded">
      <option value="Blinded">Blinded</option>
      <option value="Charmed">Charmed</option>
      <option value="Deafened">Deafened</option>
      <option value="Frightened">Frightened</option>
      <option value="Grappled">Grappled</option>
      <option value="Incapacitated">Incapacitated</option>
      <option value="Invisible">Invisible</option>
      <option value="Paralyzed">Paralyzed</option>
      <option value="Petrified">Petrified</option>
      <option value="Poisoned">Poisoned</option>
      <option value="Prone">Prone</option>
      <option value="Restrained">Restrained</option>
      <option value="Stunned">Stunned</option>
      <option value="Unconscious">Unconscious</option>
      <option value="Exhaustion">Exhaustion</option>
    </select>
    <br>
    <label for="statusEffectForTurns">Apply Status Effect For How Many Turns? </label>
    <div class="number-input">
      <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" id="statusEffectMinus" class="minus"></button>
      <input type="number" min="0" max="20" class="inlineCustomNumInput" id="statusEffectForTurns" name="selected-current_hit_points" value="${0}">
      <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" id="statusEffectPlus" class="plus"></button>
    </div>
    <br><i>Leave at 0 for indefinite</i>
    <br><br>
    <button type="button" onclick="AddSelectedEffect(${arrIndex})">Add Status Effect</button>`
    DisplayPopup(str)
}

  
/**
 * Actually adds status effect based on selection from AddStatusEffect() above
 * 
 * @param {int} index index of units array to actually apply status effect to
 */
function AddSelectedEffect(index) {
    const selectedEffect = document.getElementById("statusEffectSelect").value;
    const forTurns = document.getElementById("statusEffectForTurns").value;
  
    units[index].status_effects[selectedEffect] = forTurns;
    RenderUnit(units[index].id);
    DisplayUnits();
    HidePopup();
}


/**
 * Deletes a status effect from selected unit of type
 * 
 * @param {*} id unit id to delete from
 * @param {*} type key value for status effect
 * @returns 
 */
function DeleteStatusEffect(id, type) {
    let arrIndex = units.findIndex(unit => unit.id === id);
    if (arrIndex < 0) return;
    delete units[arrIndex].status_effects[type];
    DisplayUnits();
}


/**
 * Renders a popup to confirm deleting a selected unit
 * 
 * @param {*} id unit id to delete
 * @returns 
 */
function DeleteUnit(id) {
  let arrIndex = units.findIndex(unit => unit.id === id);
  if (arrIndex < 0) return;
  var str = `<br><h1 class='themeDisplay'>Confirm Deleting ${units[arrIndex].name}</h1>`;

  str += `
  <button type="button" onclick="ConfirmDeleteUnit(${arrIndex})">Confirm Deletion</button><button type="button" onclick="HidePopup()">Cancel</button>`
  DisplayPopup(str);
}