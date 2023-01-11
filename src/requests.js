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
 * Called when the search bar value is changed and searches for monsters based on passed string
 * 
 * @param {*} e event
 */
function UpdateSearchResults(e) {
    if (e.target.value.length > 0) {
        getMonstersByName(e.target.value);
    } else {
        getMonstersByName(e.target.value);
    }
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
  for (const monster of monsterList) {
    const listItem = document.createElement('div');
    listItem.className = "searchResultsUnit";
    listItem.id = `${monster.slug}`;
    listItem.innerHTML = `${monster.name}`;
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