// Modifier corresponding to ability score from 0-30 (index 0 based, which is never used but there as placeholder)
abilityModifierTable = [
    "-5", "-5", "-4", "-4", "-3", "-3", "-2", "-2",
    "-1", "-1", "+0", "+0", "+1", "+1", "+2", "+2",
    "+3", "+3", "+4", "+4", "+5", "+5", "+6", "+6",
    "+7", "+7", "+8", "+8", "+9", "+9", "+10"
  ];
  
  // Convert challenge rating to a numerical XP reward
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
  
  // Statblock HTML template and CSS provided from: https://codepen.io/retractedhack/pen/gPLpWe
  function RenderEditableStatBlock(statblock) {
    var str = `
    <div class="stat-block wide">
      <hr class="orange-border" />
      <div class="section-left">
        <div class="creature-heading">
          <h1><input class="h1Input" type="text" id="statblockName" name="statblockName" maxlength="40" value="${statblock.name}"></h1>
          <h2>
            <select class="statblockSelect italic" name="statblockSize" id="statblockSize">
              <option value="Tiny">Tiny</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Huge">Huge</option>
              <option value="Gargantuan">Gargantuan</option>
              <option value="Colossal">Colossal</option>
            </select>
            <select class="statblockSelect italic" name="statblockType" id="statblockType">
              <option value="aberration">aberration</option>
              <option value="beast">beast</option>
              <option value="celestial">celestial</option>
              <option value="construct">construct</option>
              <option value="dragon">dragon</option>
              <option value="elemental">elemental</option>
              <option value="fey">fey</option>
              <option value="fiend">fiend</option>
              <option value="giant">giant</option>
              <option value="humanoid">humanoid</option>
              <option value="monstrosity">monstrosity</option>
              <option value="ooze">ooze</option>
              <option value="plant">plant</option>
              <option value="undead">undead</option>
            </select>
            <select class="statblockSelect italic" name="statblockAlignment" id="statblockAlignment">
              <option value="lawful good">lawful good</option>
              <option value="neutral good">neutral good</option>
              <option value="chaotic good">chaotic good</option>
              <option value="lawful neutral">lawful neutral</option>
              <option value="true neutral">true neutral</option>
              <option value="chaotic neutral">chaotic neutral</option>
              <option value="lawful evil">lawful evil</option>
              <option value="neutral evil">neutral evil</option>
              <option value="chaotic evil">chaotic evil</option>
              <option value="unaligned">unaligned</option>
            </select>
          </h2>
        </div> <!-- creature heading -->
        <svg height="5" width="100%" class="tapered-rule">
          <polyline points="0,0 400,2.5 0,5"></polyline>
        </svg>
        <div class="top-stats">
          <div class="property-line first">
            <h4>Armor Class</h4>
            <input class="statblockNumberInput" type="number" min="1" max="40" id="statblockAC" name="statblockAC" value="${statblock.armor_class}"> 
            (<span class="statblockTextInput" id="statblockACDesc" contenteditable="true">${statblock.armor_desc}</span>)
          </div> <!-- property line -->
          <div class="property-line">
            <h4>Hit Points</h4>
            <input class="statblockNumberInput" type="number" min="1" max="999" id="statblockHP" name="statblockHP" value="${statblock.hit_points}">
            (<span class="statblockTextInput" id="statblockHitDice" contenteditable="true">${statblock.hit_dice}</span>)
          </div> <!-- property line -->
          <div class="property-line last">
            <h4>Speed</h4>
            <p>`
    
    // Iterate through speed string
    // TODO make speed editable
    for (const speedType in statblock.speed) {
      if (speedType == 'walk') {
        str += `${statblock.speed[speedType]} ft. `;
      }
      else {
        str += `${speedType} ${statblock.speed[speedType]} ft.`;
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
            <p>&mdash;</p>
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
              <p>${specialAbility.desc.replaceAll("\n", "<br>")}</p>
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
        for (let action of statblock.legendary_actions) {
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
  
  
    document.getElementById('addContainer').innerHTML = str;  
    document.getElementById("statblockSize").value = statblock.size;
    document.getElementById("statblockType").value = statblock.type;
    document.getElementById("statblockAlignment").value = statblock.alignment;
  }
  
  // Statblock HTML template and CSS provided from: https://codepen.io/retractedhack/pen/gPLpWe
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
    for (const speedType in statblock.speed) {
      if (speedType == 'walk') {
        str += `${statblock.speed[speedType]} ft.n`;
      }
      else {
        str += `${speedType} ${statblock.speed[speedType]} ft.`;
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
            <p>&mdash;</p>
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
  
  
    document.getElementById('searchResults').innerHTML = str;
  }