/**
 * Handles API requests from https://api.open5e.com
 * 
 * Code pertaining to calling the API and handling requests and returned data
 *
 * @author Andrew Jacobsson.
 * @since  v0.1
 */

// Stores the current searched list of monsters
var monsterList = [];
// Stores the last post from the API
var lastPost;
// A lock to prevent multiple calls while currently loading the next page of the API list
var loadingNewList = false;
// Flag to include custom statblocks in results
var includeCustom = true;

/**
 * Searches for monsters containing the provided string and updates the search list
 * 
 * @param {string} string name(s) of monsters to filter by
 * @returns 
 */
async function getMonstersByName(string) {
  if (loadingNewList) return;
    var url;
    document.getElementById("searchResults").scrollTop = 0;
    if (string == "") {
      url = `https://api.open5e.com/monsters`;
    } else {
      url = `https://api.open5e.com/monsters/?search=${string}`;
    }
    const post = await fetch(url).then((res) => res.json());
    console.log(post);
    lastPost = post;
    monsterList = post.results;

    if (includeCustom) {
      if (customStatblocks.length > 0) {
        customStatblocks.forEach(unit => {
          var strName = unit.name.toLowerCase();
          if (strName.includes(string)) {
            monsterList.push(unit);
            lastPost.count++;
          }
        });
      }
    }
    DisplaySearchResults();
}


/**
 * Appends the existing monster search list 
 * (This is used if you have scrolled far enough to buffer additional results, if available)
 */
async function appendMonsterList() {
  const url = lastPost.next;
  const post = await fetch(url).then((res) => res.json());
  console.log(post);
  lastPost = post;
  for (const newMonster of post.results) {
    monsterList.push(newMonster);
  }
  DisplaySearchResults();  
  loadingNewList = false;
}

/**
 * Sets flag to include custom statblocks
 */
function IncludeCustomStatBlocksInSearch() {
  includeCustom = document.getElementById("checkbox-include-custom-statblocks").checked
  if (includeCustom && customStatblocks.length > 0) {
    document.getElementById("searchCustomStatblocksInfo").style.display = "block";
  }
  UpdateSearchResults();
}



/**
 * Called when the search bar value is changed and searches for monsters based on passed string
 * 
 * @param {*} e event
 */
function UpdateSearchResults() {
  getMonstersByName(document.getElementById("monsterName").value);
}


/**
 * Resets the search bar to blank and pulls in alphabetical list of monsters
 * 
 * @returns 
 */
function ResetSearchBar() {
  if (document.getElementById("monsterName").value == "") return;
  document.getElementById("monsterName").value = "";
  getMonstersByName("");
}


/**
 * Will load the next list of monsters (if applicable) if the bottom of the searched list is 
 * reached by scrolling
 * 
 * @param {*} e event
 */
function ScrollSearchResults(e) {
  if (lastPost != undefined) {
    if (lastPost.next != null) {
      var searchResElement = document.getElementById("searchResults")
      if(!loadingNewList && Math.abs(searchResElement.scrollHeight - searchResElement.scrollTop - searchResElement.clientHeight) < 400) {
        loadingNewList = true;
        appendMonsterList();
      }
    }
  }
}


/**
 * Renders the list of monsters in the HTML
 */
function DisplaySearchResults() {
  searchResults.innerHTML = "";
  if (monsterList.length == 0) {
    searchResults.innerHTML = "<br>No Results Found";
    return;
  }
  monsterList.sort((a, b) => {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  
    // names must be equal
    return 0;
  });
  var count = lastPost.count;
  document.getElementById('searchCount').innerHTML = "Results: " + count;
  for (const monster of monsterList) {
    const listItem = document.createElement('div');
    listItem.className = "searchResultsUnit";
    listItem.id = `${monster.slug}`;
    listItem.innerHTML = `<div class="searchName">${monster.name}</div><div class="searchTag type">${monster.type}</div><div class="searchTag cr">CR ${monster.challenge_rating}</div>`;
    listItem.onclick = function() {ClickSearchedItem(this.id);};
    searchResults.appendChild(listItem);
  }

}


/**
 * Called onclick of unit in search list to retrieve their statblock object
 * 
 * @param {string} id monster_slug (unique identifier) to retrieve
 */
function ClickSearchedItem(id) {
  var foundMonster = monsterList.find((monster) => monster.slug === id);

  if (foundMonster != undefined) {
    let copiedSB = JSON.parse(JSON.stringify(foundMonster));
    currentStatBlock = copiedSB;
    DisplayStatBlock(currentStatBlock, {addable: true});
    RenderUnit(false);
  }
}