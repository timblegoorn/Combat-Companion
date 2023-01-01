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

var blankStatblock = {
  "slug": "monster-identifier",
  "name": "Monster",
  "size": "Medium",
  "type": "monstrosity",
  "subtype": "",
  "group": null,
  "alignment": "chaotic evil",
  "armor_class": 15,
  "armor_desc": "natural armor",
  "hit_points": 50,
  "hit_dice": "5d10+25",
  "speed": {
      "walk": 30,
  },
  "strength": 16,
  "dexterity": 13,
  "constitution": 15,
  "intelligence": 8,
  "wisdom": 8,
  "charisma": 7,
  "strength_save": null,
  "dexterity_save": null,
  "constitution_save": null,
  "intelligence_save": null,
  "wisdom_save": null,
  "charisma_save": null,
  "perception": null,
  "skills": {},
  "damage_vulnerabilities": "",
  "damage_resistances": "",
  "damage_immunities": "",
  "condition_immunities": "",
  "senses": "",
  "languages": "Common",
  "challenge_rating": "2",
  "actions": [
      {
          "name": "Multiattack",
          "desc": "The monster makes two attacks, one bite and one claw attack."
      },
      {
          "name": "Bite",
          "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 3) piercing damage",
          "attack_bonus": 3,
          "damage_dice": "2d6"
      },
      {
          "name": "Claw",
          "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d4 + 3) slashing damage",
      }
  ],
  "reactions": "",
  "legendary_desc": "",
  "legendary_actions": "",
  "special_abilities": [
      {
          "name": "Regeneration",
          "desc": "The monster regains 5 hit points at the start of its turn."
      }
  ],
  "spell_list": [],
  "img_main": null,
  "document__slug": "custom",
  "document__title": "custom",
  "document__license_url": "https://github.com/timblegoorn/Combat-Companion"
}

var currentStatBlock = blankStatblock;
  
  // Statblock HTML template and CSS provided from: https://codepen.io/retractedhack/pen/gPLpWe
  // Editable stat block contains all possible fields. Final rendered statblock only contains provided information
  function RenderEditableStatBlock(statblock) {
    const sb = statblock;

    // Name, size, type, alignment
    var str = `
    <div class="stat-block">
      <hr class="orange-border" />
      <div class="section-left">
        <div class="creature-heading">
          <h1><input class="h1Input" type="text" id="statblockName" name="statblockName" maxlength="40" value="${sb.name}"></h1>
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
        <div class="top-stats spanOnce">
          <div class="property-line first">
            <h4>Armor Class </h4>
            <input class="statblockNumberInput" type="number" min="1" max="40" id="statblockAC" name="statblockAC" value="${sb.armor_class}"> 
            (<span class="statblockTextInput" id="statblockACDesc" contenteditable="true">${sb.armor_desc}</span>)
          </div> <!-- property line -->
          <div class="property-line">
            <h4>Hit Points </h4>
            <input class="statblockNumberInput" type="number" min="1" max="999" id="statblockHP" name="statblockHP" value="${sb.hit_points}">
            (<span class="statblockTextInput" id="statblockHitDice" contenteditable="true">${sb.hit_dice}</span>)
          </div> <!-- property line -->
          <div class="property-line last firstCap">
            <h4>Speed </h4>
            <p>`
    
    // Iterate through speed string
    // TODO make speed editable
    for (const speedType in sb.speed) {
      if (speedType == 'hover') {
        str += `(Can <b>Hover</b>) `;
      } else {
        str += `${speedType} ${sb.speed[speedType]} ft. `;
      }
    }
  
    // Base stats
    str += `
            </p>
          </div> <!-- property line -->
          <svg height="5" width="100%" class="tapered-rule">
          <polyline points="0,0 400,2.5 0,5"></polyline>
        </svg>
          <div class="abilities">
            <div class="ability-strength">
              <h4>STR</h4>
              <p>${sb.strength} (${abilityModifierTable[sb.strength]})</p>
            </div> <!-- ability strength -->
            <div class="ability-dexterity">
              <h4>DEX</h4>
              <p>${sb.dexterity} (${abilityModifierTable[sb.dexterity]})</p>
            </div> <!-- ability dexterity -->
            <div class="ability-constitution">
              <h4>CON</h4>
              <p>${sb.constitution} (${abilityModifierTable[sb.constitution]})</p>
            </div> <!-- ability constitution -->
            <div class="ability-intelligence">
              <h4>INT</h4>
              <p>${sb.intelligence} (${abilityModifierTable[sb.intelligence]})</p>
            </div> <!-- ability intelligence -->
            <div class="ability-wisdom">
              <h4>WIS</h4>
              <p>${sb.wisdom} (${abilityModifierTable[sb.wisdom]})</p>
            </div> <!-- ability wisdom -->
            <div class="ability-charisma">
              <h4>CHA</h4>
              <p>${sb.charisma} (${abilityModifierTable[sb.charisma]})</p>
            </div> <!-- ability charisma -->
          </div> <!-- abilities -->
          <svg height="5" width="100%" class="tapered-rule">
          <polyline points="0,0 400,2.5 0,5"></polyline>
        </svg>`;
  
        // Saving throws
        if (sb.strength_save != null || sb.dexterity_save != null || sb.constitution_save != null || sb.intelligence_save != null || sb.wisdom_save != null || sb.charisma_save != null) {
          str+= `
          <div class="property-line">
            <h4>Saving Throws </h4>
            <p>`
          if (sb.strength_save != null) {
            str += `STR +${sb.strength_save} `
          }
          if (sb.dexterity_save != null) {
            str += `DEX +${sb.dexterity_save} `
          }
          if (sb.constitution_save != null) {
            str += `CON +${sb.constitution_save} `
          }
          if (sb.intelligence_save != null) {
            str += `INT +${sb.intelligence_save} `
          }
          if (sb.wisdom_save != null) {
            str += `WIS +${sb.wisdom_save} `
          }
          if (sb.charisma_save != null) {
            str += `CHA +${sb.charisma_save}`
          }
          str += `</p>
            </div> <!-- property line -->`;
        }

        // Skill bonuses
        var skillsKeys = Object.keys(sb.skills);
        if (skillsKeys.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Skills </h4>
            <p>`
          for (const skill in sb.skills) {
            str += `${skill} +${sb.skills[skill]} `;
          }
          str += `</p>
          </div> <!-- property line -->`;
        }

        // Damage vulnerability
        if (sb.damage_vulnerabilities.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Damage Vulnerabilities </h4>
            <p>${sb.damage_vulnerabilities}</p>
          </div> <!-- property line -->`
        }

        // Damage resistance
        if (sb.damage_resistances.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Damage Resistances </h4>
            <p>${sb.damage_resistances}</p>
          </div> <!-- property line -->`
        }

        // Damage immunity
        if (sb.damage_immunities.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Damage Immunities </h4>
            <p>${sb.damage_immunities}</p>
          </div> <!-- property line -->`
        }

        // Condition immunity
        if (sb.condition_immunities.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Condition Immunities </h4>
            <p>${sb.condition_immunities}</p>
          </div> <!-- property line -->`
        }

        // Senses
        if (sb.senses.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Senses </h4>
            <p>${sb.senses}</p>
          </div> <!-- property line -->`
        }

        // Languages
        if (sb.languages.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Languages </h4>
            <p>${sb.languages}</p>
          </div> <!-- property line -->`
        } else {
          str+= `
          <div class="property-line">
            <h4>Languages </h4>
            <p>&mdash;</p>
          </div> <!-- property line -->`        
        }
  
        // Challenge Rating + XP
        str+= `
          <div class="property-line first">
            <h4>Challenge </h4>
            <p>${sb.challenge_rating} (${challengeRatingXPTable[sb.challenge_rating]} XP)</p>
          </div> <!-- property line -->
          <svg height="5" width="100%" class="tapered-rule">
            <polyline points="0,0 400,2.5 0,5"></polyline>
          </svg>
        </div> <!-- top stats -->`;
  
        // Special Abilities
        if (sb.special_abilities.length > 0) {
          for (let specialAbility of sb.special_abilities) {
            str+= `
            <div class="property-block spanOnce">
              <h4>${specialAbility.name}. </h4>
              <p>${specialAbility.desc.replaceAll("\n", "<br>")}</p>
            </div> <!-- property block -->`;
          }
        }
        str+= `
      </div> <!-- section left -->
      <div class="section-right">`;
      
      // actions
      if (sb.actions.length > 0) {
          str += `
            <div class="actions">
              <h3>Actions</h3>`;
          for (let action of sb.actions) {
            str+= `
            <div class="property-block spanOnce">
              <h4>${action.name}. </h4>
              <p>${action.desc}</p>
            </div> <!-- property block -->`;
          }
          str += `
            </div> <!-- actions -->`
      }  

      // Legendary actions
      if (sb.legendary_actions.length > 0) {
        str += `
          <div class="actions">
            <h3>Legendary Actions</h3>
            <div class="property-block spanOnce">
              <p>${sb.legendary_desc}.</p>
            </div> <!-- property block -->`;
        for (let action of sb.legendary_actions) {
          str+= `
          <div class="property-block spanOnce">
            <h4>${action.name}. </h4>
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
  
  
    document.getElementById('addZone').innerHTML = str;  

    // Set values of drop down elements based on sb
    document.getElementById("statblockSize").value = sb.size;
    document.getElementById("statblockType").value = sb.type;
    document.getElementById("statblockAlignment").value = sb.alignment;
  }
  
  // Statblock HTML template and CSS provided from: https://codepen.io/retractedhack/pen/gPLpWe
  function RenderStatBlock(statblock) {
    const sb = statblock;

    var str = `
    <div class="stat-block">
      <hr class="orange-border" />
      <div class="section-left">
        <div class="creature-heading">
          <h1>${sb.name}</h1>
          <h2>${sb.size} ${sb.type}, ${sb.alignment}</h2>
        </div> <!-- creature heading -->
        <svg height="5" width="100%" class="tapered-rule">
          <polyline points="0,0 400,2.5 0,5"></polyline>
        </svg>
        <div class="top-stats spanOnce">
          <div class="property-line first">
            <h4>Armor Class </h4>
            <p>
            ${sb.armor_class}
             (${sb.armor_desc})</p>
          </div> <!-- property line -->
          <div class="property-line">
            <h4>Hit Points </h4>
            <p>${sb.hit_points}
             (${sb.hit_dice})</p>
          </div> <!-- property line -->
          <div class="property-line last firstCap">
            <h4>Speed </h4>
            <p>`
    
    // Iterate through speed string
    // TODO make speed editable
    for (const speedType in sb.speed) {
      if (speedType == 'hover') {
        str += `(Can <b>Hover</b>) `;
      } else {
        str += `${speedType} ${sb.speed[speedType]} ft. `;
      }
    }
  
    // Base stats
    str += `
            </p>
          </div> <!-- property line -->
          <svg height="5" width="100%" class="tapered-rule">
          <polyline points="0,0 400,2.5 0,5"></polyline>
        </svg>
          <div class="abilities">
            <div class="ability-strength">
              <h4>STR</h4>
              <p>${sb.strength} (${abilityModifierTable[sb.strength]})</p>
            </div> <!-- ability strength -->
            <div class="ability-dexterity">
              <h4>DEX</h4>
              <p>${sb.dexterity} (${abilityModifierTable[sb.dexterity]})</p>
            </div> <!-- ability dexterity -->
            <div class="ability-constitution">
              <h4>CON</h4>
              <p>${sb.constitution} (${abilityModifierTable[sb.constitution]})</p>
            </div> <!-- ability constitution -->
            <div class="ability-intelligence">
              <h4>INT</h4>
              <p>${sb.intelligence} (${abilityModifierTable[sb.intelligence]})</p>
            </div> <!-- ability intelligence -->
            <div class="ability-wisdom">
              <h4>WIS</h4>
              <p>${sb.wisdom} (${abilityModifierTable[sb.wisdom]})</p>
            </div> <!-- ability wisdom -->
            <div class="ability-charisma">
              <h4>CHA</h4>
              <p>${sb.charisma} (${abilityModifierTable[sb.charisma]})</p>
            </div> <!-- ability charisma -->
          </div> <!-- abilities -->
          <svg height="5" width="100%" class="tapered-rule">
          <polyline points="0,0 400,2.5 0,5"></polyline>
        </svg>`;
  
        // Saving throws
        if (sb.strength_save != null || sb.dexterity_save != null || sb.constitution_save != null || sb.intelligence_save != null || sb.wisdom_save != null || sb.charisma_save != null) {
          str+= `
          <div class="property-line">
            <h4>Saving Throws </h4>
            <p>`
          if (sb.strength_save != null) {
            str += `STR +${sb.strength_save} `
          }
          if (sb.dexterity_save != null) {
            str += `DEX +${sb.dexterity_save} `
          }
          if (sb.constitution_save != null) {
            str += `CON +${sb.constitution_save} `
          }
          if (sb.intelligence_save != null) {
            str += `INT +${sb.intelligence_save} `
          }
          if (sb.wisdom_save != null) {
            str += `WIS +${sb.wisdom_save} `
          }
          if (sb.charisma_save != null) {
            str += `CHA +${sb.charisma_save}`
          }
          str += `</p>
            </div> <!-- property line -->`;
        }

        // Skill bonuses
        var skillsKeys = Object.keys(sb.skills);
        if (skillsKeys.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Skills </h4>
            <p>`
          for (const skill in sb.skills) {
            str += `${skill} +${sb.skills[skill]} `;
          }
          str += `</p>
          </div> <!-- property line -->`;
        }

        // Damage vulnerability
        if (sb.damage_vulnerabilities.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Damage Vulnerabilities </h4>
            <p>${sb.damage_vulnerabilities}</p>
          </div> <!-- property line -->`
        }

        // Damage resistance
        if (sb.damage_resistances.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Damage Resistances </h4>
            <p>${sb.damage_resistances}</p>
          </div> <!-- property line -->`
        }

        // Damage immunity
        if (sb.damage_immunities.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Damage Immunities </h4>
            <p>${sb.damage_immunities}</p>
          </div> <!-- property line -->`
        }

        // Condition immunity
        if (sb.condition_immunities.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Condition Immunities </h4>
            <p>${sb.condition_immunities}</p>
          </div> <!-- property line -->`
        }

        // Senses
        if (sb.senses.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Senses </h4>
            <p>${sb.senses}</p>
          </div> <!-- property line -->`
        }

        // Languages
        if (sb.languages.length > 0) {
          str+= `
          <div class="property-line firstCap">
            <h4>Languages </h4>
            <p>${sb.languages}</p>
          </div> <!-- property line -->`
        } else {
          str+= `
          <div class="property-line">
            <h4>Languages </h4>
            <p>&mdash;</p>
          </div> <!-- property line -->`        
        }
  
        // Challenge Rating + XP
        str+= `
          <div class="property-line first">
            <h4>Challenge </h4>
            <p>${sb.challenge_rating} (${challengeRatingXPTable[sb.challenge_rating]} XP)</p>
          </div> <!-- property line -->
          <svg height="5" width="100%" class="tapered-rule">
            <polyline points="0,0 400,2.5 0,5"></polyline>
          </svg>
        </div> <!-- top stats -->`
  
        // Special Abilities
        if (sb.special_abilities.length > 0) {
          for (let specialAbility of sb.special_abilities) {
            str+= `
            <div class="property-block spanOnce">
              <h4>${specialAbility.name}. </h4>
              <p>${specialAbility.desc.replaceAll("\n", "<br>")}</p>
            </div> <!-- property block -->`;
          }
        }
        str+= `
      </div> <!-- section left -->
      <div class="section-right">`;
      
      // actions
      if (sb.actions.length > 0) {
          str += `
            <div class="actions">
              <h3>Actions</h3>`;
          for (let action of sb.actions) {
            str+= `
            <div class="property-block spanOnce">
              <h4>${action.name}. </h4>
              <p>${action.desc}</p>
            </div> <!-- property block -->`;
          }
          str += `
            </div> <!-- actions -->`
      }  

      // Legendary actions
      if (sb.legendary_actions.length > 0) {
        str += `
          <div class="actions">
            <h3>Legendary Actions</h3>
            <div class="property-block spanOnce">
              <p>${sb.legendary_desc}.</p>
            </div> <!-- property block -->`;
        for (let action of sb.legendary_actions) {
          str+= `
          <div class="property-block spanOnce">
            <h4>${action.name}. </h4>
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
  
    document.getElementById('addZone').innerHTML = str; 
  }