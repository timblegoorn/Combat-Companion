

var currentRound = 1; // round increments after each unit has a turn
var currentTurn = 0; // corresponds to unit index

var searchBar, searchResults;
var columnTitles = ["Initiative", "Type", "Name", "Hit Points", "Armor Class", "Status Effects", "Actions"];
var columnTitleSlugs = ["initiative", "control_type", "name", "hit_points", "armor_class", "status_effects"];

function DisplayUnits() {
  units.sort((a,b) => b.initiative - a.initiative);
  // Get the object list div
  const objectListDiv = document.getElementById('list');
  objectListDiv.innerHTML = "";

  var numPCs = 0;
  var numEnemies = 0;
  var maxExp = 0;
  var currentExp = 0;

  // Setup table title display
  const orangeBorderTopTitle = document.createElement('div');
  orangeBorderTopTitle.className = "orange-border-table";
  objectListDiv.appendChild(orangeBorderTopTitle);

  const tableTitle = document.createElement('div');
  tableTitle.className = "tableTitle";
  if (units.length > 0) tableTitle.innerHTML = `<h1>Current Round: ${currentRound}</h1><h2>Current Turn: ${currentTurn + 1} (${units[currentTurn].name})</h2><button onclick="incrementTurn()">Next Turn</button>`;
  else tableTitle.innerHTML = `<h1>Current Round: ${currentRound}</h1><h2>Add Some Units to Get Started!</h2>`;
  objectListDiv.appendChild(tableTitle);

  const orangeBorderTop = document.createElement('div');
  orangeBorderTop.className = "orange-border-table";
  objectListDiv.appendChild(orangeBorderTop);

  // Create table headers
  const tableDisplay = document.createElement('table');
  tableDisplay.id = "initiativeTable"
  const columns = document.createElement('tr');
  for (var i = 0; i < columnTitles.length; i++) {
    const colTitle = document.createElement('th');
    colTitle.innerHTML = columnTitles[i];
    columns.appendChild(colTitle);
  }
  tableDisplay.appendChild(columns);

  // Loop through the objects and create a table row for each one
  for (var j = 0; j < units.length; j++) {
    if (units[j].id == undefined) units[j].id = crypto.randomUUID();
    const unit = units[j];
    const row = document.createElement('tr');
    for (var i = 0; i < columnTitles.length; i++) {
      const rowVal = document.createElement('td');
      var dataVal;
      if (columnTitles[i] == "Hit Points") {
        dataVal = `
        <div class="number-input">
          <button onclick="this.parentNode.querySelector('input[type=number]').stepDown(); HandleTableQuickEdit(event)" id="selectedminus-${j}-current_hit_points" class="minus"></button>
          <input type="number" min="0" max="${unit.hit_points}" class="inlineCustomNumInput" id="selected-${j}-current_hit_points" name="selected-current_hit_points" value="${unit.current_hit_points}">
          <button onclick="this.parentNode.querySelector('input[type=number]').stepUp(); HandleTableQuickEdit(event)" id="selectedplus-${j}-current_hit_points" class="plus"></button>
        </div>
        /${unit[columnTitleSlugs[i]]}
        `
      } else if (currentTurn == j && columnTitles[i] == "Initiative") {
        row.className = "selected";
        dataVal = `<i class="fa-solid fa-chevron-right"></i> `;
        dataVal += unit[columnTitleSlugs[i]];
      } else if (columnTitles[i] == "Actions") {
        dataVal = `<i class="fa-regular fa-copy icon" onclick="CopyUnit('${unit.id}')"></i>   
                   <i class="fa-regular fa-x icon" onclick="DeleteUnit('${unit.id}')"></i>`;
      } else dataVal = unit[columnTitleSlugs[i]];

      if (columnTitles[i] == "Type") {
        if (unit[columnTitleSlugs[i]] == "PC") {
          if (unit.dead == true) row.className = "dead"
          else numPCs++;
        } else {
          numEnemies++;
          var xp = challengeRatingXPTable[unit.challenge_rating];
          maxExp += xp;
          if (unit.current_hit_points == 0) {
            row.className = "dead";
            currentExp += xp;
          }
        }
      }
      
      if (columnTitles[i] == "Status Effects") {
        if (unit[columnTitleSlugs[i]] == undefined) unit[columnTitleSlugs[i]] = {};
        if ((unit.control_type == "PC" && unit.dead) || (unit.control_type != "PC" && unit.current_hit_points == 0)) dataVal = "";
        else {
          const statusEffectKeys = Object.keys(unit.status_effects);
          dataVal = "";
          for (var z = 0; z < statusEffectKeys.length; z++) {
            if (unit.status_effects[statusEffectKeys[z]] == 0) {
              dataVal += `<div class="statusEffect">${statusEffectKeys[z]} <i class="fa-solid fa-x icon" onclick="DeleteStatusEffect('${unit.id}', '${statusEffectKeys[z]}')"></i></div>`
            } else {
              dataVal += `<div class="statusEffect">${statusEffectKeys[z]} (${unit.status_effects[statusEffectKeys[z]]}) <i class="fa-solid fa-x icon" onclick="DeleteStatusEffect('${unit.id}', '${statusEffectKeys[z]}')"></i></div>`
            }
          }
          
          dataVal += `<span class="icon text" onclick="AddStatusEffect('${unit.id}')"><i class="fa-solid fa-plus icon"></i> Add Effect</span>`

          if (unit.control_type == "PC" && unit.current_hit_points == 0) {
            dataVal = `<div class="statusEffect">Unconscious</div>`
          }
        }
      }
      if (dataVal == undefined) dataVal = `<i class="fa-solid fa-pen-to-square icon" onclick="EditStatBlock(event, '${unit.id}')"></i>`;

      rowVal.innerHTML = dataVal;
      row.appendChild(rowVal);
    }
    const index = j;
    row.onclick = function() {ViewStatBlock(event, index)};
    tableDisplay.appendChild(row);
  }
  objectListDiv.appendChild(tableDisplay);

  const orangeBorderTableBottom = document.createElement('div');
  orangeBorderTableBottom.className = "orange-border-table bottom";

  objectListDiv.appendChild(orangeBorderTableBottom);

  const orangeBorderBottom = document.createElement('div');
  orangeBorderBottom.className = "orange-border-table bottom";

  const tableFooter = document.createElement('div');
  tableFooter.className = "tableTitle";
  var dividedXP = Math.floor(currentExp/numPCs);
  if (Number.isNaN(dividedXP)) dividedXP = 0;
  tableFooter.innerHTML = `Total XP Available: <b>${maxExp}</b> Earned XP: <b>${currentExp}</b> Earned XP Divided Per PC: <b>${dividedXP}</b>`;
  objectListDiv.appendChild(tableFooter);
  objectListDiv.appendChild(orangeBorderBottom);

  document.getElementById("initiativeTable").querySelectorAll("input").forEach((elem) => elem.addEventListener("change", HandleTableQuickEdit));
}

function CopyUnit(id) {
  let arrIndex = units.findIndex(unit => unit.id === id);
  if (arrIndex < 0) return;
  let copiedSB = JSON.parse(JSON.stringify(units[arrIndex]));
  copiedSB.id = crypto.randomUUID();
  units.push(copiedSB);
  DisplayUnits();
}

function ConfirmDeleteUnit(index) {
  HidePopup();

  units.splice(index,1);
  if (currentTurn >= units.length) currentTurn = 0;
  DisplayUnits();
}

function DeleteUnit(id) {
  let arrIndex = units.findIndex(unit => unit.id === id);
  if (arrIndex < 0) return;
  var str = `<br><h1 class='themeDisplay'>Confirm Deleting ${units[arrIndex].name}</h1>`;

  str += `
  <button type="button" onclick="ConfirmDeleteUnit(${arrIndex})">Confirm Deletion</button><button type="button" onclick="HidePopup()">Cancel</button>`
  DisplayPopup(str);
}

function HandleTableQuickEdit(e) {
  var elementID = e.target.id;
  var editContent, editSubType, key;
  console.log(e.target.id)
  editContent = e.target.value;
  editSubType = e.target.className;
  console.log(editContent)
  console.log(editSubType)

  index = elementID.slice(elementID.indexOf('-')+1);
  index = index.slice(0, index.indexOf('-'));
  key = elementID.slice(elementID.lastIndexOf('-')+1);

  if (editSubType == 'plus' || editSubType == 'minus') {
    elementID = `selected-${index}-current_hit_points`;
    editContent = document.getElementById(elementID).value;
  }
  if (elementID.includes("hit_points")) {
    if (editSubType != 'plus' && editSubType != 'minus') {
      if (editContent <= 0) editContent = 0;
      if (editContent > units[index].hit_points) editContent = units[index].hit_points;
    }

    units[index][key] = editContent;
    DisplayUnits();
    //document.getElementById(elementID).value = editContent;
  }
}

function HandleQuickInfoEdit(e, id) {
  let arrIndex = units.findIndex(unit => unit.id === id);
  if (arrIndex < 0) return;
  var elementID = e.target.id;
  var editContent;
  if (e.target.value == undefined) {
    editContent = e.target.innerHTML;
    console.log(e.target.innerHTML)
  } else {
    editContent = e.target.value;
    console.log(e.target.value)
  }

  key = elementID.slice(elementID.lastIndexOf('-')+1);
  units[arrIndex][key] = editContent;
  DisplayUnits();
  //RenderUnit(id);
  let copiedSB = JSON.parse(JSON.stringify(units[arrIndex]));
  currentStatBlock = copiedSB;
  DisplayStatBlock(currentStatBlock);
}

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

function AddSelectedEffect(index) {
  const selectedEffect = document.getElementById("statusEffectSelect").value;
  const forTurns = document.getElementById("statusEffectForTurns").value;

  units[index].status_effects[selectedEffect] = forTurns;
  RenderUnit(units[index].id);
  DisplayUnits();
  HidePopup();
}

function DeleteStatusEffect(id, type) {
  let arrIndex = units.findIndex(unit => unit.id === id);
  if (arrIndex < 0) return;
  delete units[arrIndex].status_effects[type];
  DisplayUnits();
}

function DisplayPopup(str) {
  var headerContent = `<i class="fa-solid fa-x icon rightCorner" onclick="HidePopup()"></i>`

  document.getElementById("popup").innerHTML = headerContent + str;

  document.getElementById("popupContainer").style.display = "block";
  document.getElementById("popup").style.display = "block";
}

function HidePopup(e) {
  if (e != undefined) e.stopPropagation();
  document.getElementById("popupContainer").style.display = "none";
  document.getElementById("popup").style.display = "none";
}

function incrementTurn() {
  if (units.length == 0) return;
  currentTurn++;

  if (currentTurn == units.length) {
    currentTurn = 0;
    currentRound++;
  }

  if (units[currentTurn].current_hit_points == 0) {
    if (units[currentTurn].control_type == "PC" && (units[currentTurn].death_saves_failed == undefined || units[currentTurn].death_saves_failed < 3)) {
      RenderDeathSavingThrows(units[currentTurn].id);
    } else {
      incrementTurn();
      return;
    }
  }

  for(var statusEffect in units[currentTurn].status_effects){
    if (units[currentTurn].status_effects[statusEffect] > 0) {
      units[currentTurn].status_effects[statusEffect]--;
      if (units[currentTurn].status_effects[statusEffect] == 0) delete units[currentTurn].status_effects[statusEffect];
    }
  }

  let copiedSB = JSON.parse(JSON.stringify(units[currentTurn]));
  currentStatBlock = copiedSB;
  currentStatBlock.index = currentTurn;
  DisplayUnits();
  RenderUnit(currentStatBlock.id);
  DisplayStatBlock(currentStatBlock);
}

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
    var str = `<br><h1 class='themeDisplay'>Make A Death Saving Throw For ${sb.name}</h1>`;
  
    str += `
    <h2>Successful Saves: ${sb.death_saves_succeeded} Failed Saves: ${sb.death_saves_failed}</h2>
    <button type="button" onclick="RollDeathSave('${id}')">Auto Roll Save</button><br>
    <button type="button" onclick="AddDeathSave('${id}', -1)">Add Failed Death Save</button><br>
    <button type="button" onclick="AddDeathSave('${id}', 1)">Add Successful Death Save</button><br>
    <button type="button" onclick="AddDeathSave('${id}', -2)">Add Critical Fail Death Save</button><br>
    <button type="button" onclick="AddDeathSave('${id}', 2)">Add Critical Success Death Save</button><br>`
    DisplayPopup(str)
}

function RollDeathSave(id) {
  var roll = Math.floor(Math.random()*20+1);
  console.log("Death save roll: "+roll)
  if (roll == 20) AddDeathSave(id, 3);
  else if (roll == 1) AddDeathSave(id, -2);
  else if (roll >= 10) AddDeathSave(id, 1);
  else AddDeathSave(id, -1);
}

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
    RenderDeathSavingThrows(id);
  } else {
    HidePopup();
    incrementTurn();
  }
}

function ResetDeathSaves(id, type) {
  let arrIndex = units.findIndex(unit => unit.id === id);
  if (arrIndex < 0) return;

  if (type) {
    units[arrIndex].death_saves_failed = 0;
  } else {
    units[arrIndex].death_saves_succeeded = 0;
  }

  RenderUnit(id);
}

function RenderUnit(id) {
  let arrIndex = units.findIndex(unit => unit.id === id);
  if (arrIndex < 0) return;
  if (units[arrIndex].notes == undefined) units[arrIndex].notes = "";
  let sb = units[arrIndex];
  var statusEffects = "";

  var str = `
    <div class="quickInfoContainer">
    <hr class="orange-border top" />
    <h1><input class="h1Input" type="text" id="quickview-name" name="statblockName" maxlength="40" value="${sb.name}"></h1>`
  if (sb.control_type == "PC" && sb.death_saves_failed != undefined) {
    str += `<h2>`
    if (sb.death_saves_failed > 0 || sb.current_hit_points == 0)
      str += `Failed Death Saves: ${sb.death_saves_failed} <i class="fa-solid fa-arrow-rotate-left icon" onclick="ResetDeathSaves('${id}',true)"></i> `;
    if (sb.current_hit_points == 0)
      str += `Successful Saves: ${sb.death_saves_succeeded} <i class="fa-solid fa-arrow-rotate-left icon" onclick="ResetDeathSaves('${id}',false)"></i>`;
    str += `</h2>`;
  }

  str += `
    <h2> Current HP ${sb.current_hit_points}/${sb.hit_points}</h2>
    <button type="button" onclick="HealUnit('${sb.id}')">Heal</button>
    <div class="number-input big">
      <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" id="selectedminus-current_hit_points" class="minus"></button>
      <input type="number" min="0" max="999" class="inlineCustomNumInput" id="selected-current_hit_points" name="selected-current_hit_points" value="0">
      <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" id="selectedplus-current_hit_points" class="plus"></button>
    </div>
    <button type="button" onclick="DamageUnit('${sb.id}')">Damage</button>

    <p><b>Notes: </b><br><textarea class="statblockTextArea" id="quickview-notes">${sb.notes}</textarea></p>

    <b>Status Effects: </b>`;
    if (sb.status_effects == undefined) sb.status_effects = {};
    if ((sb.control_type == "PC" && sb.dead) || (sb.control_type != "PC" && sb.current_hit_points == 0)) dataVal = "";
    else {
      const statusEffectKeys = Object.keys(sb.status_effects);
      statusEffects = "";
      for (var z = 0; z < statusEffectKeys.length; z++) {
        if (sb.status_effects[statusEffectKeys[z]] == 0) {
          statusEffects += `<div class="statusEffect">${statusEffectKeys[z]} <i class="fa-solid fa-x icon" onclick="DeleteStatusEffect('${sb.id}', '${statusEffectKeys[z]}')"></i></div>`
        } else {
          statusEffects += `<div class="statusEffect">${statusEffectKeys[z]} (${sb.status_effects[statusEffectKeys[z]]}) <i class="fa-solid fa-x icon" onclick="DeleteStatusEffect('${sb.id}', '${statusEffectKeys[z]}')"></i></div>`
        }
      }
      
      statusEffects += `<span class="icon text" onclick="AddStatusEffect('${sb.id}')"><i class="fa-solid fa-plus icon"></i> Add Effect</span>`

      if (sb.control_type == "PC" && sb.current_hit_points == 0) {
        statusEffects = `<div class="statusEffect">Unconscious</div>`
      }
    }
  str += statusEffects;
  str += `
    <hr class="orange-border bottom" />
    </div>
    `;

  document.getElementById("unitZone").innerHTML = str;
  document.getElementById("quickview-name").addEventListener("change", (event) => {HandleQuickInfoEdit(event, sb.id)});
  document.getElementById("quickview-notes").addEventListener("change", (event) => {HandleQuickInfoEdit(event, sb.id)});
}

function HealUnit(id) {
  let arrIndex = units.findIndex(unit => unit.id === id);
  let amount = parseInt(document.getElementById('selected-current_hit_points').value);
  if (arrIndex < 0) return;

  units[arrIndex].current_hit_points += amount;
  if (units[arrIndex].current_hit_points > units[arrIndex].hit_points) units[arrIndex].current_hit_points = units[arrIndex].hit_points;
  DisplayUnits();
  DisplayStatBlock(units[arrIndex]);
  RenderUnit(id);
}

function DamageUnit(id) {
  let arrIndex = units.findIndex(unit => unit.id === id);
  let amount = parseInt(document.getElementById('selected-current_hit_points').value);
  if (arrIndex < 0) return;

  units[arrIndex].current_hit_points -= amount;
  if (units[arrIndex].current_hit_points < 0) {
    if (units[arrIndex].current_hit_points + units[arrIndex].hit_points <= 0 && units[arrIndex].control_type == "PC") {
      units[arrIndex].death_saves_failed = 3;
      units[arrIndex].death_saves_succeeded = 0;
      units[arrIndex].dead = true;
      console.log("MASSIVE DAMAGE! Instant kill");
    }
    units[arrIndex].current_hit_points = 0;
  }
  DisplayUnits();
  DisplayStatBlock(units[arrIndex]);
  RenderUnit(id);
}

function AddUnit() {
  // Get the value of the input field
  var name = document.getElementById("itemName").value;
  var initiative = document.getElementById("itemInitiative").value;
  var hp = document.getElementById("itemHP").value;
  var ac = document.getElementById("itemAC").value;

  if (isNaN(initiative) || initiative < 0 || initiative == "") {
    initiative = Math.floor(Math.random() * 20) + 1;
  }
  if (isNaN(hp) || hp < 0 || hp == "") {
    console.log("invalid hp");
    return false;
  }
  if (name == "") {
    console.log("invalid name");
    return false;
  }
  // Reset the value of the input field
  document.getElementById("itemName").value = "";
  document.getElementById("itemInitiative").value = "";
  document.getElementById("itemHP").value = "";
  document.getElementById("itemAC").value = "";

  var obj = {name: name, initiative: initiative, hp: hp, ac:ac};
  units.push(obj);
  DisplayUnits();
  return false;
}

function ResetGame() {
  currentRound = 1;
  currentTurn = 0;
  units = [];

  DisplayUnits();
  document.getElementById('statblockZone').innerHTML = "No currently selected unit"; 
}

function SaveGame() {
    var saveFile = {
        currentRound: currentRound,
        currentTurn: currentTurn,
        units: units,
    }

    localStorage.setItem("CombatCompanionSave", JSON.stringify(saveFile));
}

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

var mousecoords;
var lastCoords = {x: 0, y: 0};
var lastDifference = {x: 0, y: 0}
function Init() {
  DisplayUnits();

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
  }


}


// Call the displayObjectList function when the page loads
window.addEventListener('load', Init);
