var units = [
    {name: "Goblin", initiative: 20, hp: 14},
    {name: "Goblin Archer", initiative: 16, hp: 14},
    {name: "Goblin Chief", initiative: 13, hp: 32},
    {name: "Ulfric", initiative: 18, hp: 53},
    {name: "Leah", initiative: 7, hp: 45},
]

var currentRound = 1;

var searchBar, searchResults;

function DisplayUnits() {
  units.sort((a,b) => b.initiative - a.initiative);
  // Get the object list div
  const objectListDiv = document.getElementById('list');
  objectListDiv.innerHTML = ("Current Round: " + currentRound + "<br>");
  
  // Loop through the objects and create a list item for each one
  for (const unit of units) {
    const listItem = document.createElement('div');
    listItem.className = "unit";
    listItem.innerHTML = `(${unit.initiative}) ${unit.name} (HP: ${unit.hp})`;
    objectListDiv.appendChild(listItem);
  }
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
}

// Call the displayObjectList function when the page loads
window.addEventListener('load', Init);
