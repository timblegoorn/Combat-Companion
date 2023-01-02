

var currentRound = 1; // round increments after each unit has a turn
var currentTurn = 0; // corresponds to unit index

var searchBar, searchResults;
var columnTitles = ["Initiative", "Type", "Name", "Hit Points", "Armor Class", "Status Effects"];
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
      } else dataVal = unit[columnTitleSlugs[i]];

      if (columnTitles[i] == "Type") {
        if (unit[columnTitleSlugs[i]] == "PC") {
          numPCs++;
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
        //if (unit[columnTitleSlugs[i]] == "") dataVal = `<i class="fa-solid fa-plus icon" onclick="EditStatBlock(event, ${j})"></i>`
        const statusEffectKeys = Object.keys(unit.status_effects);
        dataVal = "";
        for (var z = 0; z < statusEffectKeys.length; z++) {
          if (unit.status_effects[statusEffectKeys[z]] == 0) {
            dataVal += `<div class="statusEffect">${statusEffectKeys[z]} <i class="fa-solid fa-x icon" onclick="DeleteStatusEffect(${j}, '${statusEffectKeys[z]}')"></i></div>`
          } else {
            dataVal += `<div class="statusEffect">${statusEffectKeys[z]} (${unit.status_effects[statusEffectKeys[z]]}) <i class="fa-solid fa-x icon" onclick="DeleteStatusEffect(${j}, '${statusEffectKeys[z]}')"></i></div>`
          }
        }
        
        dataVal += `<i class="fa-solid fa-plus icon" onclick="AddStatusEffect(${j})"></i>`
      }
      if (dataVal == undefined) dataVal = `<i class="fa-solid fa-pen-to-square icon" onclick="EditStatBlock(event, ${j})"></i>`;

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
    if (editContent <= 0) editContent = 0;
    if (editContent > units[index].hit_points) editContent = units[index].hit_points;
    units[index][key] = editContent;
    DisplayUnits();
    //document.getElementById(elementID).value = editContent;
  }
}

function AddStatusEffect(index) {
  var str = `<br><h1 class='themeDisplay'>Add Status Effect to ${units[index].name}</h1>`;

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
  <button type="button" onclick="AddSelectedEffect(${index})">Add Status Effect</button>`
  DisplayPopup(str)
}

function AddSelectedEffect(index) {
  const selectedEffect = document.getElementById("statusEffectSelect").value;
  const forTurns = document.getElementById("statusEffectForTurns").value;

  units[index].status_effects[selectedEffect] = forTurns;
  DisplayUnits();
  HidePopup();
}

function DeleteStatusEffect(index, type) {
  delete units[index].status_effects[type];
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

  if (units[currentTurn].current_hit_points == 0 && units[currentTurn].control_type != "PC") {
    incrementTurn();
    return;
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
  RenderStatBlock(currentStatBlock);
  DisplayUnits();
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
  document.getElementById('addZone').innerHTML = "No currently selected unit"; 
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
      RenderStatBlock(currentStatBlock);
    }
}

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
    RenderStatBlock(currentStatBlock);
  }
}

// Call the displayObjectList function when the page loads
window.addEventListener('load', Init);
