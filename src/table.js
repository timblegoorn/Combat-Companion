/**
 * Handles "Table" display of units.
 * 
 * Code pertaining to the display of the unit list, ordering of unit list, and quick actions associated with
 * the table display.
 *
 * @author Andrew Jacobsson.
 * @since  v0.1
 */

// Column display titles for the table
var columnTitles = ["Initiative", "Type", "Name", "Hit Points", "Armor Class", "Status Effects", "Actions"];
// Column ID's that correlate to the column titles and reference unit object parameters
var columnTitleSlugs = ["initiative", "control_type", "name", "hit_points", "armor_class", "status_effects"];

/**
 * Orders the unit list by initiative
 * TODO: contested initiative
 */
function OrderUnits() {
  units.sort((a,b) => b.initiative - a.initiative);
}

/**
 * Renders the table displaying the list of units
 */
function DisplayUnits() {
  OrderUnits();
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
    if (units[j].id == currentStatBlock.id) row.className = "selected";

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
          var xp = unit.xp;
          if (unit.challenge_rating != undefined) xp = challengeRatingXPTable[unit.challenge_rating];
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
      if (dataVal == undefined || dataVal == "") dataVal = `&ndash;`
      //dataVal = `<i class="fa-solid fa-pen-to-square icon" onclick="EditStatBlock(event, '${unit.id}')"></i>`;

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

  // Handle XP calculation and display
  var dividedXP = Math.floor(currentExp/numPCs);
  if (Number.isNaN(dividedXP)) dividedXP = 0;
  tableFooter.innerHTML = `Total XP Available: <b>${maxExp}</b> Earned XP: <b>${currentExp}</b> Earned XP Divided Per PC: <b>${dividedXP}</b>`;
  objectListDiv.appendChild(tableFooter);
  objectListDiv.appendChild(orangeBorderBottom);

  document.getElementById("initiativeTable").querySelectorAll("input").forEach((elem) => elem.addEventListener("change", HandleTableQuickEdit));
}

/**
 * Creates a deep copy of the selected unit and pushes it to the unit list
 * 
 * @param {*} id unit ID to copy
 * @returns 
 */
function CopyUnit(id) {
  let arrIndex = units.findIndex(unit => unit.id === id);
  if (arrIndex < 0) return;
  let copiedSB = JSON.parse(JSON.stringify(units[arrIndex]));
  copiedSB.id = crypto.randomUUID();
  units.push(copiedSB);
  DisplayUnits();
}

/**
 * Deletes a unit at specified index and updates the current turn and display of units if necessary.
 * If selected unit was deleted unit, new selected unit becomes the unit with the current turn.
 * 
 * @param {int} index Index of units array to delete
 */
function ConfirmDeleteUnit(index) {
  HidePopup();
  let currentID = units[currentTurn].id;
  units.splice(index,1);

  let arrIndex = units.findIndex(unit => unit.id === currentID);
  if (arrIndex < 0) {
    incrementTurn(true);
  } else {
    currentTurn = arrIndex;
    DisplayUnits();

    // If the deleted unit was the selected unit, update the selected unit
    let unitSelectedIndex = units.findIndex(unit => unit.id === currentStatBlock.id);
    if (unitSelectedIndex < 0) {
      UpdateCurrentStatblock(units[currentTurn].id)
    }
  }
}


/**
 * Handles quick edits to the table (which presently just include dynamic HP modification)
 * 
 * @param {*} e event
 */
function HandleTableQuickEdit(e) {
  var elementID = e.target.id;
  var editContent, editSubType, key;
  editContent = e.target.value;
  editSubType = e.target.className;

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

    units[index][key] = parseInt(editContent);
    DisplayUnits();
    if (currentStatBlock.id == units[index].id) {
        UpdateCurrentStatblock(units[index].id)
    }
  }
}


/**
 * Called when a unit is clicked in the unit list table. Will set the current statblock to the
 * selected unit and display the unit and statblock (if applicable)
 * 
 * @param {*} e event
 * @param {*} index index of unit to view
 */
function ViewStatBlock(e, index) {
  if (e.target.className == "" || e.target.className == "selected" || e.target.className == "dead") {
    const collection = document.getElementsByClassName("selected");
    if (collection.length > 0) {
      collection[0].className = collection[0].className.replace("selected", "");
    }
    e.target.parentNode.className += " selected";
    let copiedSB = JSON.parse(JSON.stringify(units[index]));
    currentStatBlock = copiedSB;
    currentStatBlock.index = index;
    RenderUnit(currentStatBlock.id);
    DisplayStatBlock(currentStatBlock);
  }
}


/**
 * Sets the currentStatBlock to the passed ID and renders it
 * 
 * @param {*} id unit ID to update
 * @returns 
 */
function UpdateCurrentStatblock(id) {
    let arrIndex = units.findIndex(unit => unit.id === id);
    if (arrIndex < 0) return;
    let copiedSB = JSON.parse(JSON.stringify(units[arrIndex]));
    currentStatBlock = copiedSB;
    RenderUnit(units[arrIndex].id);
    DisplayStatBlock(currentStatBlock);
}