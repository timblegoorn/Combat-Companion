var monsterList = [];


async function getMonstersByName(string) {
    const url = `https://api.open5e.com/monsters/?search=${string}`;
    const post = await fetch(url).then((res) => res.json());
    console.log(post);
    monsterList = post.results;
    DisplaySearchResults();
}

function UpdateSearchResults(e) {
    getMonstersByName(e.target.value);
}

function DisplaySearchResults() {
  searchResults.innerHTML = "";

  for (const monster of monsterList) {
    const listItem = document.createElement('div');
    listItem.className = "unit";
    listItem.innerHTML = `${monster.name}`;
    searchResults.appendChild(listItem);
  }



  //searchResults.textContent = monsterList.length;
}