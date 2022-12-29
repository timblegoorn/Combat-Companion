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

/* Sample Statblock HTML
<div class="stat-block">
	<hr class="orange-border" />
	<div class="section-left">
		<div class="creature-heading">
			<h1>Animated Armor</h1>
			<h2>Medium construct, unaligned</h2>
		</div> <!-- creature heading -->
		<svg height="5" width="100%" class="tapered-rule">
	    <polyline points="0,0 400,2.5 0,5"></polyline>
	  </svg>
		<div class="top-stats">
			<div class="property-line first">
				<h4>Armor Class</h4>
				<p>18 (natural armor)</p>
			</div> <!-- property line -->
			<div class="property-line">
				<h4>Hit Points</h4>
				<p>33 (6d8 + 6)</p>
			</div> <!-- property line -->
			<div class="property-line last">
				<h4>Speed</h4>
				<p>25ft.</p>
			</div> <!-- property line -->
			<svg height="5" width="100%" class="tapered-rule">
	    <polyline points="0,0 400,2.5 0,5"></polyline>
	  </svg>
			<div class="abilities">
				<div class="ability-strength">
					<h4>STR</h4>
					<p>14 (+2)</p>
				</div> <!-- ability strength -->
				<div class="ability-dexterity">
					<h4>DEX</h4>
					<p>11 (+0)</p>
				</div> <!-- ability dexterity -->
				<div class="ability-constitution">
					<h4>CON</h4>
					<p>13 (+1)</p>
				</div> <!-- ability constitution -->
				<div class="ability-intelligence">
					<h4>INT</h4>
					<p>1 (-5)</p>
				</div> <!-- ability intelligence -->
				<div class="ability-wisdom">
					<h4>WIS</h4>
					<p>3 (-4)</p>
				</div> <!-- ability wisdom -->
				<div class="ability-charisma">
					<h4>CHA</h4>
					<p>1 (-5)</p>
				</div> <!-- ability charisma -->
			</div> <!-- abilities -->
			<svg height="5" width="100%" class="tapered-rule">
	    <polyline points="0,0 400,2.5 0,5"></polyline>
	  </svg>
			<div class="property-line first">
				<h4>Damage Immunities</h4>
				<p>poison, psychic</p>
			</div> <!-- property line -->
			<div class="property-line">
				<h4>Condition Immunities</h4>
				<p>blinded, charmed, deafened, exhaustion, frightened,
						petrified, poisoned</p>
			</div> <!-- property line -->
			<div class="property-line">
				<h4>Senses</h4>
				<p>blindsight 60ft. (blind beyond this radius), passive Perception 6</p>
			</div> <!-- property line -->
			<div class="property-line">
				<h4>Languages</h4>
				<p>&mdash;</p>
			</div> <!-- property line -->
			<div class="property-line last">
				<h4>Challenge</h4>
				<p>1 (200 XP)</p>
			</div> <!-- property line -->
		</div> <!-- top stats -->
		<svg height="5" width="100%" class="tapered-rule">
	    <polyline points="0,0 400,2.5 0,5"></polyline>
	  </svg>
		<div class="property-block">
			<h4>Antimagic Suceptibility.</h4>
			<p>The armor is incapacitated while in the area of an <i>antimagic
	        field</i>.  If targeted by <i>dispel magic</i>, the armor must succeed
	        on a Constitution saving throw against the caster’s spell save DC or
	        fall unconscious for 1 minute.</p>
		</div> <!-- property block -->
		<div class="property-block">
			<h4>False Appearance.</h4>
			<p>While the armor remains motionless, it is indistinguishable from a
	        normal suit of armor.</p>
		</div> <!-- property block -->
	</div> <!-- section left -->
	<div class="section-right">
		<div class="actions">
			<h3>Actions</h3>
			<div class="property-block">
				<h4>Multiattack.</h4>
				<p>The armor makes two melee attacks.</p>
			</div> <!-- property block -->
			<div class="property-block">
				<h4>Slam.</h4>
				<p><i>Melee Weapon Attack:</i> +4 to hit, reach 5 ft., one target.
        <i>Hit:</i> 5 (1d6 + 2) bludgeoning damage.</p>
			</div> <!-- property block -->
		</div> <!-- actions -->
		<div class="actions">
			<h3>Legendary Actions</h3>
			<div class="property-block">
				<h4>Multiattack.</h4>
				<p>The armor makes two melee attacks.</p>
			</div> <!-- property block -->
			<div class="property-block">
				<h4>Slam.</h4>
				<p><i>Melee Weapon Attack:</i> +4 to hit, reach 5 ft., one target.
        <i>Hit:</i> 5 (1d6 + 2) bludgeoning damage.</p>
			</div> <!-- property block -->
		</div> <!-- actions -->
	</div> <!-- section right -->
	<hr class="orange-border bottom" />
</div> <!-- stat block -->
*/

/* Sample Object
{
    "slug": "adult-black-dragon",
    "name": "Adult Black Dragon",
    "size": "Huge",
    "type": "dragon",
    "subtype": "",
    "group": "Black Dragon",
    "alignment": "chaotic evil",
    "armor_class": 19,
    "armor_desc": "natural armor",
    "hit_points": 195,
    "hit_dice": "17d12+85",
    "speed": {
        "walk": 40,
        "fly": 80,
        "swim": 40
    },
    "strength": 23,
    "dexterity": 14,
    "constitution": 21,
    "intelligence": 14,
    "wisdom": 13,
    "charisma": 17,
    "strength_save": null,
    "dexterity_save": 7,
    "constitution_save": 10,
    "intelligence_save": null,
    "wisdom_save": 6,
    "charisma_save": 8,
    "perception": 11,
    "skills": {
        "perception": 11,
        "stealth": 7
    },
    "damage_vulnerabilities": "",
    "damage_resistances": "",
    "damage_immunities": "acid",
    "condition_immunities": "",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 21",
    "languages": "Common, Draconic",
    "challenge_rating": "14",
    "actions": [
        {
            "name": "Multiattack",
            "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
        },
        {
            "name": "Bite",
            "desc": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 4 (1d8) acid damage.",
            "attack_bonus": 11,
            "damage_dice": "2d10+1d8",
            "damage_bonus": 6
        },
        {
            "name": "Claw",
            "desc": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.",
            "attack_bonus": 11,
            "damage_dice": "2d6",
            "damage_bonus": 6
        },
        {
            "name": "Tail",
            "desc": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage.",
            "attack_bonus": 11,
            "damage_dice": "2d8",
            "damage_bonus": 6
        },
        {
            "name": "Frightful Presence",
            "desc": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
        },
        {
            "name": "Acid Breath (Recharge 5-6)",
            "desc": "The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one.",
            "attack_bonus": 0,
            "damage_dice": "12d8"
        }
    ],
    "reactions": "",
    "legendary_desc": "The dragon can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The dragon regains spent legendary actions at the start of its turn.",
    "legendary_actions": [
        {
            "name": "Detect",
            "desc": "The dragon makes a Wisdom (Perception) check."
        },
        {
            "name": "Tail Attack",
            "desc": "The dragon makes a tail attack."
        },
        {
            "name": "Wing Attack (Costs 2 Actions)",
            "desc": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
        }
    ],
    "special_abilities": [
        {
            "name": "Amphibious",
            "desc": "The dragon can breathe air and water."
        },
        {
            "name": "Legendary Resistance (3/Day)",
            "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
        }
    ],
    "spell_list": [],
    "img_main": null,
    "document__slug": "wotc-srd",
    "document__title": "Systems Reference Document",
    "document__license_url": "http://open5e.com/legal"
}
*/

// Modifier corresponding to ability score from 0-30 (index 0 based, which is never used but there as placeholder)
abilityModifierTable = [
  "-5", "-5", "-4", "-4", "-3", "-3", "-2", "-2",
  "-1", "-1", "+0", "+0", "+1", "+1", "+2", "+2",
  "+3", "+3", "+4", "+4", "+5", "+5", "+6", "+6",
  "+7", "+7", "+8", "+8", "+9", "+9", "+10"
];

challengeRatingXPTable = {
  "0": 0,
  "1/8": 25,
  "1/4": 50,
  "1/2": 100,
  "1": 200,
  "2": 450,
  "3": 700,
  "4": 1100,
  "5": 1800,
  "6": 2300,
  "7": 2900,
  "8": 3900,
  "9": 5000,
  "10": 5900,
  "11": 7200,
  "12": 8400,
  "13": 10000,
  "14": 11500,
  "15": 13000,
  "16": 15000,
  "17": 18000,
  "18": 20000,
  "19": 22000,
  "20": 25000,
  "21": 33000,
  "22": 41000,
  "23": 50000,
  "24": 62000,
  "25": 75000,
  "26": 90000,
  "27": 105000,
  "28": 120000,
  "29": 135000,
  "30": 155000,
}

function RenderStatBlock(statblock) {
  var str = `
  <div class="stat-block">
    <hr class="orange-border" />
    <div class="section-left">
      <div class="creature-heading">
        <h1>${statblock.name}</h1>
        <h2>${statblock.size} ${statblock.type}, ${statblock.alignment}</h2>
      </div> <!-- creature heading -->
      <svg height="5" width="100%" class="tapered-rule">
        <polyline points="0,0 400,2.5 0,5"></polyline>
      </svg>
      <div class="top-stats">
        <div class="property-line first">
          <h4>Armor Class</h4>
          <p>${statblock.armor_class} (${statblock.armor_desc})</p>
        </div> <!-- property line -->
        <div class="property-line">
          <h4>Hit Points</h4>
          <p>${statblock.hit_points} (${statblock.hit_dice})</p>
        </div> <!-- property line -->
        <div class="property-line last">
          <h4>Speed</h4>
          <p>`
  
  // Iterate through speed string
  for (const speedType of statblock.speed) {
    if (speedType == 'walk') {
      str += `${statblock.speed[speedType] ft.}`;
    }
    else {
      str += `${speedType} ${statblock.speed[speedType] ft.}`;
    }
  }

  str += `
          </p>
        </div> <!-- property line -->
        <svg height="5" width="100%" class="tapered-rule">
        <polyline points="0,0 400,2.5 0,5"></polyline>
      </svg>
        <div class="abilities">
          <div class="ability-strength">
            <h4>STR</h4>
            <p>${statblock.strength} (${abilityModifierTable[statblock.strength]})</p>
          </div> <!-- ability strength -->
          <div class="ability-dexterity">
            <h4>DEX</h4>
            <p>${statblock.dexterity} (${abilityModifierTable[statblock.dexterity]})</p>
          </div> <!-- ability dexterity -->
          <div class="ability-constitution">
            <h4>CON</h4>
            <p>${statblock.constitution} (${abilityModifierTable[statblock.constitution]})</p>
          </div> <!-- ability constitution -->
          <div class="ability-intelligence">
            <h4>INT</h4>
            <p>${statblock.intelligence} (${abilityModifierTable[statblock.intelligence]})</p>
          </div> <!-- ability intelligence -->
          <div class="ability-wisdom">
            <h4>WIS</h4>
            <p>${statblock.wisdom} (${abilityModifierTable[statblock.wisdom]})</p>
          </div> <!-- ability wisdom -->
          <div class="ability-charisma">
            <h4>CHA</h4>
            <p>${statblock.charisma} (${abilityModifierTable[statblock.charisma]})</p>
          </div> <!-- ability charisma -->
        </div> <!-- abilities -->
        <svg height="5" width="100%" class="tapered-rule">
        <polyline points="0,0 400,2.5 0,5"></polyline>
      </svg>`;

      /*
      const dmgVulnerabilityKeys = Object.keys(statblock.damage_vulnerabilities);
      if (dmgVulnerabilityKeys.length > 0) {
        str += `<div class="property-line first">
                  <h4>Damage Vulnerabilities</h4>
                  <p>`;
        
        dmgVulnerabilityKeys.forEach((key, index) => {
          console.log(`${key}: ${courses[key]}`);
          str += ``
        });
        str += `</p>
                </div> <!-- property line -->`
      }
      const dmgResistanceKeys = Object.keys(statblock.damage_resistances);
      const dmgImmunitiesKeys = Object.keys(statblock.damage_immunities);
      const conditionImmunitiesKeys = Object.keys(statblock.condition_immunities);
      const sensesKeys = Object.keys(statblock.senses);
      */

      if (statblock.damage_vulnerabilities.length > 0) {
        str+= `
        <div class="property-line first">
          <h4>Damage Vulnerabilities</h4>
          <p>${statblock.damage_vulnerabilities}</p>
        </div> <!-- property line -->`
      }
      if (statblock.damage_resistances.length > 0) {
        str+= `
        <div class="property-line first">
          <h4>Damage Resistances</h4>
          <p>${statblock.damage_resistances}</p>
        </div> <!-- property line -->`
      }
      if (statblock.damage_immunities.length > 0) {
        str+= `
        <div class="property-line first">
          <h4>Damage Immunities</h4>
          <p>${statblock.damage_immunities}</p>
        </div> <!-- property line -->`
      }
      if (statblock.condition_immunities.length > 0) {
        str+= `
        <div class="property-line first">
          <h4>Condition Immunities</h4>
          <p>${statblock.condition_immunities}</p>
        </div> <!-- property line -->`
      }
      if (statblock.senses.length > 0) {
        str+= `
        <div class="property-line first">
          <h4>Senses</h4>
          <p>${statblock.senses}</p>
        </div> <!-- property line -->`
      }
      if (statblock.languages.length > 0) {
        str+= `
        <div class="property-line first">
          <h4>Languages</h4>
          <p>${statblock.languages}</p>
        </div> <!-- property line -->`
      } else {
        str+= `
        <div class="property-line first">
          <h4>Languages</h4>
          <p>&mdash</p>
        </div> <!-- property line -->`        
      }

      str+= `
        <div class="property-line first">
          <h4>Challenge</h4>
          <p>${statblock.challenge_rating} (${challengeRatingXPTable[statblock.challenge_rating]} XP)</p>
        </div> <!-- property line -->
      </div> <!-- top stats -->`


      str+= `
      <svg height="5" width="100%" class="tapered-rule">
        <polyline points="0,0 400,2.5 0,5"></polyline>
      </svg>`;


      if (statblock.special_abilities.length > 0) {
        for (let specialAbility of statblock.special_abilities) {
          str+= `
          <div class="property-block">
            <h4>${specialAbility.name}.</h4>
            <p>${specialAbility.desc}</p>
          </div> <!-- property block -->`;
        }
      }
      str+= `
    </div> <!-- section left -->
    <div class="section-right">`;
    
    if (statblock.actions.length > 0) {
        str += `
          <div class="actions">
            <h3>Actions</h3>`;
        for (let action of statblock.actions) {
          str+= `
          <div class="property-block">
            <h4>${action.name}.</h4>
            <p>${action.desc}</p>
          </div> <!-- property block -->`;
        }
        str += `
          </div> <!-- actions -->`
    }  
    if (statblock.legendary_actions.length > 0) {
      str += `
        <div class="actions">
          <h3>Legendary Actions</h3>
          <div class="property-block">
            <p>${statblock.legendary_desc}.</p>
          </div> <!-- property block -->`;
      for (let action of statblock.actions) {
        str+= `
        <div class="property-block">
          <h4>${action.name}.</h4>
          <p>${action.desc}</p>
        </div> <!-- property block -->`;
      }
      str += `
        </div> <!-- legendary actions -->`
    }   
        str += `
    </div> <!-- section right -->
    <hr class="orange-border bottom" />
  </div> <!-- stat block -->`;
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
