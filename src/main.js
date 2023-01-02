

var currentRound = 1;

var searchBar, searchResults;
var columnTitles = ["Initiative", "Type", "Name", "Hit Points", "Armor Class", "Status Effects"];
var columnTitleSlugs = ["initiative", "control_type", "name", "hit_points", "armor_class", "status_effects"];

function DisplayUnits() {
  units.sort((a,b) => b.initiative - a.initiative);
  // Get the object list div
  const objectListDiv = document.getElementById('list');
  objectListDiv.innerHTML = ("Current Round: " + currentRound + "<br>");
  
  const tableDisplay = document.createElement('table');
  tableDisplay.id = "initiativeTable"
  const columns = document.createElement('tr');
  for (var i = 0; i < columnTitles.length; i++) {
    const colTitle = document.createElement('th');
    colTitle.innerHTML = columnTitles[i];
    columns.appendChild(colTitle);
  }
  tableDisplay.appendChild(columns);

  // Loop through the objects and create a list item for each one
  for (var j = 0; j < units.length; j++) {
    const unit = units[j];
    const row = document.createElement('tr');
    for (var i = 0; i < columnTitles.length; i++) {
      const rowVal = document.createElement('td');
      if (columnTitles[i] == "Hit Points") var dataVal = `${unit.current_hit_points}/${unit[columnTitleSlugs[i]]}`
      else var dataVal = unit[columnTitleSlugs[i]];
      if (dataVal == undefined) dataVal = `<i class="fa-solid fa-pen-to-square icon" onclick="EditStatBlock(${j})"></i>`;
      rowVal.innerHTML = dataVal;
      row.appendChild(rowVal);
    }
    const index = j;
    row.onclick = function() {ViewStatBlock(index)};
    //listItem.className = "unit";
    //listItem.innerHTML = `(${unit.initiative}) ${unit.name} (HP: ${unit.hit_points})`;
    tableDisplay.appendChild(row);
  }
  objectListDiv.appendChild(tableDisplay);
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
  RenderStatBlock(currentStatBlock);
}

// Call the displayObjectList function when the page loads
window.addEventListener('load', Init);
