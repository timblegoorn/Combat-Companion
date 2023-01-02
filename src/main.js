

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
  tableTitle.innerHTML = `<h1>Current Round: ${currentRound}</h1><button onclick="incrementTurn()">Next Turn</button>`;
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
        dataVal = `<i class="fa-solid fa-chevron-right"></i> `;
        dataVal += unit[columnTitleSlugs[i]];
      } else dataVal = unit[columnTitleSlugs[i]];

      if (columnTitles[i] == "Type") {
        if (unit[columnTitleSlugs[i]] == "PC") {
          numPCs++;
        } else {
          numEnemies++;
          var exp = challengeRatingXPTable[unit.challenge_rating];
          maxExp += exp;
          if (unit.current_hit_points == 0) {
            currentExp += exp;
          }
        }
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
  tableFooter.innerHTML = `Total EXP Available: <b>${maxExp}</b> Earned EXP: <b>${currentExp}</b> Earned EXP Divided Per PC: <b>${currentExp/numPCs}</b>`;
  objectListDiv.appendChild(tableFooter);

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

function incrementTurn() {
  if (units.length == 0) return;
  currentTurn++;

  if (currentTurn == units.length) {
    currentTurn = 0;
    currentRound++;
  }

  if (units[currentTurn].current_hit_points == 0) {
    incrementTurn();
    return;
  }

  RenderStatBlock(units[currentTurn]);
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



function SaveGame() {
    var saveFile = {
        currentRound: currentRound,
        units: units,
    }

    localStorage.setItem("CombatCompanionSave", JSON.stringify(saveFile));
}

function LoadGame() {
    var saveFile = JSON.parse(localStorage.getItem("CombatCompanionSave"));
    currentRound = saveFile.currentRound;
    units = saveFile.units;

    DisplayUnits();
}

function Init() {
  DisplayUnits();

  searchResults = document.getElementById("searchResults");
  searchBar = document.getElementById("monsterName");

  searchBar.addEventListener('input', UpdateSearchResults);

  getMonstersByName(""); // get list of all monsters
  
  if (units.length > 0) {
    currentStatBlock = units[currentTurn];
  }
  RenderStatBlock(currentStatBlock);
}

// Call the displayObjectList function when the page loads
window.addEventListener('load', Init);
