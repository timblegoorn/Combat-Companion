  // Statblock HTML template and CSS provided from: https://codepen.io/retractedhack/pen/gPLpWe
  // Editable stat block contains all possible fields. Final rendered statblock only contains provided information

  var draggableID = 0;

  function RenderEditableStatBlock(statblock) {
    const sb = statblock;
    if (sb.quickAdd) {
      document.getElementById('statblockZone').innerHTML = "";  
      return;
    }

    // Name, size, type, alignment
    var str = `
    <div id="stat-block-edit" class="stat-block">
      <hr class="orange-border" />
      <div class="section-left">
        <div class="creature-heading">
          <h1><input class="h1Input" type="text" id="statblock-name" name="statblockName" maxlength="40" value="${sb.name}"></h1>
          <span class="icon text" onclick="SaveCurrentStatBlock()"><i class="fa-solid fa-floppy-disk icon"></i> Save Statblock</span>
          <br>
        <span class="icon text" onclick="AddCurrentStatBlockToCombat()"><i class="fa-solid fa-plus icon"></i> Add to Combat With Initiative: </span>
        <input class="statblockNumberInput" type="number" min="1" max="40" id="statblock-initiative" name="statblock-initiative">`;
        str += `
          <h2>
            <select class="statblockSelect italic" name="statblock" id="statblock-size">
              <option value="Tiny">Tiny</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Huge">Huge</option>
              <option value="Gargantuan">Gargantuan</option>
              <option value="Colossal">Colossal</option>
            </select>
            <select class="statblockSelect italic" name="statblockType" id="statblock-type">
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
            <select class="statblockSelect italic" name="statblockAlignment" id="statblock-alignment">
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
            <select class="statblockSelect italic" name="statblockControlType" id="statblock-control_type">
              <option value="Enemy">Enemy</option>
              <option value="PC">Player Character</option>
              <option value="Neutral Character">Neutral Character</option>
            </select>
          </h2>
        </div> <!-- creature heading -->
        <svg height="5" width="100%" class="tapered-rule">
          <polyline points="0,0 400,2.5 0,5"></polyline>
        </svg>
        <div class="top-stats spanOnce">
          <div class="property-line first">
            <h4>Armor Class </h4>
            <input class="statblockNumberInput" type="number" min="1" max="40" id="statblock-armor_class" name="statblockAC" value="${sb.armor_class}"> 
            (<span class="statblockTextInput" id="statblock-armor_desc" contenteditable="true">${sb.armor_desc}</span>)
          </div> <!-- property line -->
          <div class="property-line">
            <h4>Hit Points </h4>
            <input class="statblockNumberInput" type="number" min="1" max="999" id="statblock-hit_points" name="statblockHP" value="${sb.hit_points}">
            (<span class="statblockTextInput" id="statblock-hit_dice" contenteditable="true">${sb.hit_dice}</span>)
          </div> <!-- property line -->
          <div class="property-line last firstCap">
            <h4>Speed </h4>
            <p class="relativeContainer">`
    
    // Iterate through speed string
    for (const speedType in sb.speed) {
      if (speedType == 'hover') {
        str += `(Can <b>Hover</b>) <i class="fa-solid fa-x solidIcon" onclick="sbRemoveSpeed('${speedType}')"></i> `;
      } else {
        str += `<span class="statblockTextInput" id="statblockSpeedType-${speedType}" contenteditable="true">${speedType}</span>
                <input class="statblockNumberInput" type="number" min="1" max="120" id="statblockSpeed-${speedType}" name="statblockSpeed-${speedType}" value="${sb.speed[speedType]}"> 
                <i class="fa-solid fa-x solidIcon" onclick="sbRemoveSpeed('${speedType}')"></i> `;
      }
    }
    str += `<br><span class="icon text" onclick="sbAddSpeed()"><i class="fa-solid fa-plus solidIcon" ></i> Add Speed</span>`
  
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
              <p><input class="statblockNumberInput small" type="number" min="1" max="30" id="statblockabilitiescore-strength" name="statblock-strength" value="${sb.strength}">
              (<span id="statblockabilitiescore-strengthMod">${abilityModifierTable[sb.strength]}</span>)</p>
            </div> <!-- ability strength -->
            <div class="ability-dexterity">
              <h4>DEX</h4>
              <p><input class="statblockNumberInput small" type="number" min="1" max="30" id="statblockabilitiescore-dexterity" name="statblock-dexterity" value="${sb.dexterity}">
              (<span id="statblockabilitiescore-dexterityMod">${abilityModifierTable[sb.dexterity]}</span>)</p>
            </div> <!-- ability dexterity -->
            <div class="ability-constitution">
              <h4>CON</h4>
              <p><input class="statblockNumberInput small" type="number" min="1" max="30" id="statblockabilitiescore-constitution" name="statblock-constitution" value="${sb.constitution}">
              (<span id="statblockabilitiescore-constitutionMod">${abilityModifierTable[sb.constitution]}</span>)</p>
            </div> <!-- ability constitution -->
            <div class="ability-intelligence">
              <h4>INT</h4>
              <p><input class="statblockNumberInput small" type="number" min="1" max="30" id="statblockabilitiescore-intelligence" name="statblock-intelligence" value="${sb.intelligence}">
              (<span id="statblockabilitiescore-intelligenceMod">${abilityModifierTable[sb.intelligence]}</span>)</p>
            </div> <!-- ability intelligence -->
            <div class="ability-wisdom">
              <h4>WIS</h4>
              <p><input class="statblockNumberInput small" type="number" min="1" max="30" id="statblockabilitiescore-wisdom" name="statblock-wisdom" value="${sb.wisdom}">
              (<span id="statblockabilitiescore-wisdomMod">${abilityModifierTable[sb.wisdom]}</span>)</p>
            </div> <!-- ability wisdom -->
            <div class="ability-charisma">
              <h4>CHA</h4>
              <p><input class="statblockNumberInput small" type="number" min="1" max="30" id="statblockabilitiescore-charisma" name="statblock-charisma" value="${sb.charisma}">
              (<span id="statblockabilitiescore-charismaMod">${abilityModifierTable[sb.charisma]}</span>)</p>
            </div> <!-- ability charisma -->
          </div> <!-- abilities -->
          <svg height="5" width="100%" class="tapered-rule">
          <polyline points="0,0 400,2.5 0,5"></polyline>
        </svg>`;
  
        // Saving throws
        str+= `
          <div class="property-line first">
            <h4>Saving Throws </h4>
            <p>`
            str+= `STR <input type="checkbox" id="statblockSaves-strength_save" name="statblockSaves-strength_save" value="strength">`;
            str+= `DEX <input type="checkbox" id="statblockSaves-dexterity_save" name="statblockSaves-dexterity_save" value="dexterity">`;
            str+= `CON <input type="checkbox" id="statblockSaves-constitution_save" name="statblockSaves-constitution_save" value="constitution">`;
            str+= `INT <input type="checkbox" id="statblockSaves-intelligence_save" name="statblockSaves-intelligence_save" value="intelligence">`;
            str+= `WIS <input type="checkbox" id="statblockSaves-wisdom_save" name="statblockSaves-wisdom_save" value="wisdom">`;
            str+= `CHA <input type="checkbox" id="statblockSaves-charisma_save" name="statblockSaves-charisma_save" value="charisma">`;
          str += `</p>
            </div> <!-- property line -->`;

        // Skill bonuses
        str+= `
          <div class="property-line firstCap">
            <h4>Skills </h4>
            <p>`
        var numSkills = Object.keys(sb.skills).length;
        var i = 0;
        for (const skill in sb.skills) {
          str += `
          <select class="statblockSelect" name="statblockSkillType" id="statblockSkillType-${skill}">
            <option value="acrobatics">Acrobatics</option>
            <option value="animal handling">Animal Handling</option>
            <option value="arcana">Arcana</option>
            <option value="athletics">Athletics</option>
            <option value="deception">Deception</option>
            <option value="history">History</option>
            <option value="insight">Insight</option>
            <option value="intimidation">Intimidation</option>
            <option value="investigation">Investigation</option>
            <option value="medicine">Medicine</option>
            <option value="nature">Nature</option>
            <option value="perception">Perception</option>
            <option value="performance">Performance</option>
            <option value="persuasion">Persuasion</option>
            <option value="religion">Religion</option>
            <option value="sleight of hand">Sleight of Hand</option>
            <option value="stealth">Stealth</option>
            <option value="survival">Survival</option>
          </select>`
           str += `
           EXPERT: <input type="checkbox" id="statblockSkillTypeExpert-${skill}" name="statblockSkillTypeExpert-${skill}">
            <i class="fa-solid fa-x solidIcon" onclick="sbRemoveSkill('${skill}')"></i> `;
        }
        if (numSkills < 18) str += `<br><span class="icon text" onclick="sbAddSkill()"><i class="fa-solid fa-plus solidIcon" onclick="sbAddSkill()"></i> Add Skill Proficiency</span>`
        str += `</p>
          </div> <!-- property line -->`;

        // Damage vulnerability
        str+= `
          <div class="property-line firstCap">
            <h4>Damage Vulnerabilities </h4>
            <p><span class="statblockTextInput" id="statblock-damage_vulnerabilities" contenteditable="true">${sb.damage_vulnerabilities}</span></p>
          </div> <!-- property line -->`

        // Damage resistance
        str+= `
          <div class="property-line firstCap">
            <h4>Damage Resistances </h4>
            <p><span class="statblockTextInput" id="statblock-damage_resistances" contenteditable="true">${sb.damage_resistances}</span></p>
          </div> <!-- property line -->`

        // Damage immunity
        str+= `
          <div class="property-line firstCap">
            <h4>Damage Immunities </h4>
            <p><span class="statblockTextInput" id="statblock-damage_immunities" contenteditable="true">${sb.damage_immunities}</span></p>
          </div> <!-- property line -->`

        // Condition immunity
        str+= `
          <div class="property-line firstCap">
            <h4>Condition Immunities </h4>
            <p><span class="statblockTextInput" id="statblock-condition_immunities" contenteditable="true">${sb.condition_immunities}</span></p>
          </div> <!-- property line -->`

        // Senses
        str+= `
          <div class="property-line firstCap">
            <h4>Senses </h4>
            <p><span class="statblockTextInput" id="statblock-senses" contenteditable="true">${sb.senses}</span></p>
          </div> <!-- property line -->`

        // Languages
        str+= `
        <div class="property-line firstCap">
          <h4>Languages </h4>
          <p><span class="statblockTextInput" id="statblock-languages" contenteditable="true">${sb.languages}</span></p>
        </div> <!-- property line -->`;
  
        // Challenge Rating + XP
        if (sb.control_type == undefined || sb.control_type == 'Enemy') {
        str+= `
          <div class="property-line last">
            <h4>Challenge </h4>
            <select class="statblockSelect" name="statblock-challenge_rating" id="statblock-challenge_rating">
              <option value="0">0</option>
              <option value="1/8">1/8</option>
              <option value="1/4">1/4</option>
              <option value="1/2">1/2</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
              <option value="27">27</option>
              <option value="28">28</option>
              <option value="29">29</option>
              <option value="30">30</option>
            </select>
            <p>(<span id="statblock-challenge_ratingXP">${challengeRatingXPTable[sb.challenge_rating]}</span> XP) <b>Proficiency</b> +<span id="statblock-challenge_ratingProficiency">${challengeRatingProficiencyBonusTable[sb.challenge_rating]}</span></p>
          </div> <!-- property line -->`
        } else if (sb.control_type == 'PC') {
          str+= `
          <div class="property-line last">
            <h4>Level </h4>
            <select class="statblockSelect" name="statblock-challenge_rating" id="statblock-challenge_rating">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
            </select>
            <p><b>Proficiency Bonus</b> +<span id="statblock-challenge_ratingProficiency">${challengeRatingProficiencyBonusTable[sb.challenge_rating]}</span></p>
          </div> <!-- property line -->`
        }
        str += `
          <svg height="5" width="100%" class="tapered-rule">
            <polyline points="0,0 400,2.5 0,5"></polyline>
          </svg>
        </div> <!-- top stats -->`;
  
        // Special Abilities
        for (var i = 0; i < sb.special_abilities.length; i++) {
          var specialAbility = sb.special_abilities[i];
          str+= `
          <div class="property-block spanOnce">
            <h4><span class="statblockTextInput" id="statblockSpecialAbilityName-${i}" contenteditable="true">${specialAbility.name}</span> </h4><i class="fa-solid fa-x solidIcon" onclick="sbRemoveSA('${i}')"></i><br>
            <p><span class="statblockTextInput" id="statblockSpecialAbilityDesc-${i}" contenteditable="true">${specialAbility.desc.replaceAll("\n", "<br>")}</span></p>
          </div> <!-- property block -->`;
          str += ` `;
        }
        str += `<br><span class="icon text" onclick="sbAddSA()"><i class="fa-solid fa-plus solidIcon" onclick="sbAddSA()"></i> Add Special Ability</span>`;
        str += `<br><span class="icon text" onclick="sbAddSASpell()"><i class="fa-solid fa-plus solidIcon" onclick="sbAddSASpell()"></i> Add Spellcasting</span>`;
        str+= `
      </div> <!-- section left -->
      <div class="section-right">`;
      
      // actions
      str += `
      <div class="actions">
        <h3>Actions</h3>`;
      for (var i = 0; i < sb.actions.length; i++) {
        var action = sb.actions[i];
        str+= `
        <div class="property-block spanOnce">
          <h4><span class="statblockTextInput" id="statblockActionName-${i}" contenteditable="true">${action.name}</span> </h4><i class="fa-solid fa-x solidIcon" onclick="sbRemoveAction('${i}')"></i><br>
          <p><span class="statblockTextInput" id="statblockActionDesc-${i}" contenteditable="true">${action.desc}</span></p>
        </div> <!-- property block -->`;
        str += ` `;
      }
      str += `<br><span class="icon text" onclick="sbAddAction()"><i class="fa-solid fa-plus solidIcon" onclick="sbAddAction()"></i> Add Action</span>`;
      str += `</div> <!-- actions -->`      

      // Legendary actions
      if (sb.control_type == undefined || sb.control_type == 'Enemy') {
        str += `
          <div class="actions">
            <h3>Legendary Actions</h3>`;

        if (sb.legendary_desc == "") {
          str += `
              <div class="property-block spanOnce first">
                <p><span class="icon text" onclick="sbAddLegendaryDescription()"><i class="fa-solid fa-plus solidIcon" onclick="sbAddLegendaryDescription()"></i> Add Legendary Description</span></p>
              </div> <!-- property block -->`;
        } else {
          str += `
              <div class="property-block spanOnce first">
                <h4>Legendary Description </h4><i class="fa-solid fa-x solidIcon" onclick="sbRemoveLegendaryDescription()"></i><br>
                <p><span class="statblockTextInput" id="statblockLegendaryDescription-legendary_desc" contenteditable="true">${sb.legendary_desc}</span></p>
              </div> <!-- property block -->`;
        }
        for (var i = 0; i < sb.legendary_actions.length; i++) {
          var action = sb.legendary_actions[i];
          str+= `
          <div class="property-block spanOnce">
            <h4><span class="statblockTextInput" id="statblockLegendaryActionName-${i}" contenteditable="true">${action.name}</span> </h4>
            <i class="fa-solid fa-x solidIcon" onclick="sbRemoveLegendaryAction('${i}')"></i><br>
            <p><span class="statblockTextInput" id="statblockLegendaryActionDesc-${i}" contenteditable="true">${action.desc}</span></p>
          </div> <!-- property block -->`;
        }
        str += `<br><span class="icon text" onclick="sbAddLegendaryAction()"><i class="fa-solid fa-plus solidIcon" onclick="sbAddLegendaryAction()"></i> Add Legendary Action</span>`;
        str += `
          </div> <!-- legendary actions -->`
            
      }
      str += `
      </div> <!-- section right -->
      <hr class="orange-border bottom" />
    </div> <!-- stat block -->`;
  
  
    document.getElementById('statblockZone').innerHTML = str;  

    // Set values of drop down elements based on sb
    document.getElementById("statblock-size").value = sb.size;
    document.getElementById("statblock-type").value = sb.type;
    document.getElementById("statblock-alignment").value = sb.alignment;
    document.getElementById("statblock-control_type").value = sb.control_type;
    document.getElementById("statblock-challenge_rating").value = sb.challenge_rating

    for (const skill in sb.skills) {
      var expertVal = parseInt(abilityModifierTable[sb[skillToAbilityTable[skill]]]) + (challengeRatingProficiencyBonusTable[sb.challenge_rating] * 2);
      if (sb.skills[skill] - expertVal == 0) document.getElementById(`statblockSkillTypeExpert-${skill}`).checked = true;
      document.getElementById(`statblockSkillType-${skill}`).value = skill;
    }

    //document.getElementById("statblockSize").addEventListener('input', UpdateSearchResults);
    document.getElementById("stat-block-edit").querySelectorAll("input, select, span.statblockTextInput").forEach((elem) => elem.addEventListener("input", HandleStatBlockEdit));
  }

  // Handles input to the current editable stat block and updates the current relevant statblock object properties accordingly
  function HandleStatBlockEdit(e) {
    var elementID = e.target.id;
    var editContent, newKey, oldKey;
    console.log(e.target.id)
    // Get edit content if in a span or input element
    if (e.target.value == undefined) {
      editContent = e.target.innerHTML;
      console.log(e.target.innerHTML)
    } else {
      editContent = e.target.value;
      console.log(e.target.value)
    }

    // Certain edits require specific actions, so type is checked
    if (elementID.includes("statblockSpeedType")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      newKey = editContent;
      currentStatBlock.speed[newKey] = currentStatBlock.speed[oldKey];
      delete currentStatBlock.speed[oldKey];
      document.getElementById(elementID).id = `statblockSpeedType-${newKey}`;
      console.log(oldKey)
    } else if (elementID.includes("statblockSpeed")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      if (editContent < 1) editContent = 1;
      if (editContent > 120) editContent = 120;
      currentStatBlock.speed[oldKey] = editContent;
      document.getElementById(elementID).value = editContent;
      console.log(oldKey)     
    } else if (elementID.includes("abilitiescore")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      if (editContent < 1) editContent = 1;
      if (editContent > 30) editContent = 30;
      currentStatBlock[oldKey] = editContent;
      document.getElementById(elementID).value = editContent
      document.getElementById(`${elementID}Mod`).innerHTML = abilityModifierTable[editContent];
    } else if (elementID.includes("challenge_rating")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      currentStatBlock[oldKey] = editContent;
      if (currentStatBlock.control_type != "PC") document.getElementById(`${elementID}XP`).innerHTML = challengeRatingXPTable[editContent];
      document.getElementById(`${elementID}Proficiency`).innerHTML = challengeRatingProficiencyBonusTable[editContent];
    } else if (elementID.includes("Saves")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      if (document.getElementById(elementID).checked) {
        currentStatBlock[oldKey] = challengeRatingProficiencyBonusTable[currentStatBlock.challenge_rating] + parseInt(abilityModifierTable[currentStatBlock[editContent]]);
      } else {
        currentStatBlock[oldKey] = null;
      }
    } else if (elementID.includes("SkillTypeExpert")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      if (document.getElementById(elementID).checked) {
        currentStatBlock.skills[oldKey] = parseInt(abilityModifierTable[currentStatBlock[skillToAbilityTable[oldKey]]]) + (challengeRatingProficiencyBonusTable[currentStatBlock.challenge_rating] * 2);
      } else {
        currentStatBlock.skills[oldKey] = parseInt(abilityModifierTable[currentStatBlock[skillToAbilityTable[oldKey]]]) + (challengeRatingProficiencyBonusTable[currentStatBlock.challenge_rating]);
      }
    } else if (elementID.includes("SkillType")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      newKey = editContent;
      if (oldKey == newKey) return;
      if (currentStatBlock.skills[newKey] == undefined) {
        if (document.getElementById(`statblockSkillTypeExpert-${oldKey}`).checked) {
          currentStatBlock.skills[oldKey] = parseInt(abilityModifierTable[currentStatBlock[skillToAbilityTable[oldKey]]]) + (challengeRatingProficiencyBonusTable[currentStatBlock.challenge_rating] * 2);
        } else {
          currentStatBlock.skills[oldKey] = parseInt(abilityModifierTable[currentStatBlock[skillToAbilityTable[oldKey]]]) + (challengeRatingProficiencyBonusTable[currentStatBlock.challenge_rating]);
        }
        delete currentStatBlock.skills[oldKey];
        document.getElementById(elementID).id = `statblockSkillType-${newKey}`;
        document.getElementById(`statblockSkillTypeExpert-${oldKey}`).id = `statblockSkillTypeExpert-${newKey}`;
      } else {
        document.getElementById(elementID).value = oldKey;
      }
    } else if (elementID.includes("statblockSpecialAbilityName")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      currentStatBlock.special_abilities[oldKey].name = editContent;
    } else if (elementID.includes("statblockSpecialAbilityDesc")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      currentStatBlock.special_abilities[oldKey].desc = editContent;
    } else if (elementID.includes("statblockActionName")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      currentStatBlock.actions[oldKey].name = editContent;
    } else if (elementID.includes("statblockActionDesc")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      currentStatBlock.actions[oldKey].desc = editContent;
    } else if (elementID.includes("statblockLegendaryActionName")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      currentStatBlock.legendary_actions[oldKey].name = editContent;
    } else if (elementID.includes("statblockLegendaryActionDesc")) {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      currentStatBlock.legendary_actions[oldKey].desc = editContent;
    } else {
      oldKey = elementID.slice(elementID.lastIndexOf('-')+1);
      currentStatBlock[oldKey] = editContent;
    }
    //RenderEditableStatBlock(currentStatBlock);
  }
  
  // Statblock HTML template and CSS provided from: https://codepen.io/retractedhack/pen/gPLpWe
  function RenderStatBlock(statblock, options = {}) {
    const sb = statblock;
    if (sb.quickAdd) {
      document.getElementById('statblockZone').innerHTML = "";  
      return "";
    }

    var str = `<div class="stat-block">
      <hr class="orange-border" />
      <div class="section-left">
        <div class="creature-heading">`

    if (options.draggable) {
      str += `<h1>${sb.name}</h1>`
    } else {
      str +=`
      <h1>${sb.name} <i class="fa-solid fa-arrow-up-right-from-square icon" onclick="PopoutSB(event)"></i></h1>
      <span class="icon text" onclick="EditCurrentStatBlock()"><i class="fa-solid fa-pen-to-square icon"></i> Edit Statblock</span>`
      // See if monster already exists in initiative
      let arrIndex = units.findIndex(unit => unit.id === sb.id);
      
      if (options.addable || arrIndex < 0) {
        str += `<br>
        <span class="icon text" onclick="AddCurrentStatBlockToCombat()"><i class="fa-solid fa-plus icon"></i> Add to Combat With Initiative: </span>
        <input class="statblockNumberInput" type="number" min="1" max="40" id="statblock-initiative" name="statblock-initiative">`
      }
    }
        if (sb.control_type == undefined || sb.control_type == 'Enemy') {
          str += `
          <h2>${sb.size} ${sb.type}, ${sb.alignment}</h2>`;
        } else {
          str += `
          <h2>${sb.size} ${sb.type}, ${sb.alignment} (Player Character)</h2>`;
        }
        str += `
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
        str+= `
          <div class="property-line firstCap">
            <h4>Languages </h4>
            <p>${sb.languages}</p>
          </div> <!-- property line -->`;

        // Challenge Rating + XP
        if (sb.control_type == undefined || sb.control_type == 'Enemy') {
          str+= `
            <div class="property-line first">
              <h4>Challenge </h4>
              <p>${sb.challenge_rating} (${challengeRatingXPTable[sb.challenge_rating]} XP) <span class="floatRight"><b>Proficiency</b> +${challengeRatingProficiencyBonusTable[sb.challenge_rating]}</span></p>
            </div> <!-- property line -->`;
        } else if (sb.control_type == "PC") {
          str+= `
            <div class="property-line first">
              <h4>Level </h4>
              <p>${sb.challenge_rating}<span class="floatRight"><b>Proficiency Bonus</b> +${challengeRatingProficiencyBonusTable[sb.challenge_rating]}</span></p>
            </div> <!-- property line -->`;          
        }
          str += `
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
              <p>${sb.legendary_desc}</p>
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
  
    return str;
  }

  function PopoutSB(e) {
    var id = DisplayDraggableStatBlock(currentStatBlock);
    document.getElementById(id).style.left = e.clientX + "px";
    document.getElementById(id).style.top = e.clientY + "px";
  }


  var dragging = false;
  function DisplayDraggableStatBlock(sb) {
    const draggableWindow = document.createElement('div');
    draggableWindow.id = `draggable-${draggableID}`;
    draggableWindow.className = `draggable`
    draggableID++;
    var str = RenderStatBlock(sb, {draggable: true});
    draggableWindow.innerHTML = str;
    document.getElementById("contentContainer").append(draggableWindow);
    draggableWindow.innerHTML += `<i class="fa-solid fa-x icon rightCorner dragCorner" onclick="this.parentNode.remove()"></i>`;
    draggableWindow.innerHTML += `<i class="fa-solid fa-grip leftCorner dragCorner"></i>`;
    
    const collection = draggableWindow.getElementsByClassName("orange-border");
    collection[0].className = "orange-border draggable"


    document.getElementById(draggableWindow.id).addEventListener("mousedown", startDrag);
    return draggableWindow.id;
  }

  var dragging = false;
  var draggingID;
  var dragStart = {x:0,y:0};
  function startDrag(e) {
    var el = e.target;
    if (el.className != "orange-border draggable") return;
    e = e || window.event;
    e.preventDefault();
    dragging = true;

    if (el.id.includes("draggable")) {
      draggingID = el.id;
    } else {
      while (el && el.parentNode) {
        el = el.parentNode;
        if (el.id.includes("draggable")) {
          draggingID = el.id;
          break;
        }
      }
    }

    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    document.onmouseup = stopDrag;
    // call a function whenever the cursor moves:
    document.onmousemove = handleDrag;
  }

  function stopDrag(e) {
    dragging = false;
    draggingID = undefined;
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function handleDrag(e) {
    e = e || window.event;
    e.preventDefault();
    lastDifference.x = dragStart.x - e.clientX;
    lastDifference.y = dragStart.y - e.clientY;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    if (dragging) {
      if (draggingID != undefined) {
        var newLeft = (document.getElementById(draggingID).offsetLeft - lastDifference.x);
        var newTop = (document.getElementById(draggingID).offsetTop - lastDifference.y);
        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + document.getElementById(draggingID).offsetWidth > window.innerWidth) newLeft = window.innerWidth - document.getElementById(draggingID).offsetWidth;
        //if (newTop + document.getElementById(draggingID).offsetHeight > window.innerHeight) newTop = window.innerHeight - document.getElementById(draggingID).offsetHeight;
        document.getElementById(draggingID).style.top = newTop + "px";
        document.getElementById(draggingID).style.left = newLeft + "px";
      }
    };
  }

  function DisplayStatBlock(sb = false, options) {
    if (sb == false) {
      document.getElementById('statblockZone').innerHTML = ""; 
      return;
    }
    var str = RenderStatBlock(sb, options)
    document.getElementById('statblockZone').innerHTML = str; 
  }

  function sbAddSpeed() {
    var numSpeed = Object.keys(currentStatBlock.speed).length;

    currentStatBlock.speed[`Speed${numSpeed}`] = 30;
    console.log(currentStatBlock)
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbRemoveSpeed(speedType) {
    delete currentStatBlock.speed[speedType];
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbAddSkill() {
    var randSkillNum = Math.floor(Math.random() * skillList.length);
    var randSkill = skillList[randSkillNum];
    if (currentStatBlock.skills[randSkill] != undefined) return sbAddSkill();
    currentStatBlock.skills[randSkill] = parseInt(abilityModifierTable[currentStatBlock[skillToAbilityTable[randSkill]]]) + challengeRatingProficiencyBonusTable[currentStatBlock.challenge_rating];
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbRemoveSkill(skill) {
    delete currentStatBlock.skills[skill];
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbAddSA() {
    var newSpecialAbility = {
      "name": "New Special Ability",
      "desc": "Special ability description"
    }
    currentStatBlock.special_abilities.push(newSpecialAbility);
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbAddSASpell() {
    var spellSaveDC = 8 + parseInt(abilityModifierTable[currentStatBlock.intelligence]) + parseInt(challengeRatingProficiencyBonusTable[currentStatBlock.challenge_rating]);
    var spellAttack = spellSaveDC - 8;
    var newSpecialAbility = {
      "name": "Spellcasting",
      "desc": `The ${currentStatBlock.name} is a 3rd level spell caster. its spell casting ability is Intelligence 
      (spell save DC ${spellSaveDC}, +${spellAttack} to hit with spell attacks). The ${currentStatBlock.name} has the following spells prepared:
      
      -Cantrips (at will): mage hand, prestidigtation
      
      -1st level (3 slots): detect magic, magic missile
      
      -2nd level (1 slot): invisibility`
    }
    currentStatBlock.special_abilities.push(newSpecialAbility);
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbRemoveSA(specialAbility) {
    currentStatBlock.special_abilities.splice(specialAbility, 1);
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbAddAction() {
    var tempMod = parseInt(abilityModifierTable[currentStatBlock.strength]) + challengeRatingProficiencyBonusTable[currentStatBlock.challenge_rating];
    var newAction = {
      "name": "New Action",
      "desc": `Melee Weapon Attack: +${tempMod} to hit, reach 5ft., one target. Hit: 10 (2d6 + 3) slashing damage.`
    }
    currentStatBlock.actions.push(newAction);
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbRemoveAction(action) {
    currentStatBlock.actions.splice(action, 1);
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbRemoveLegendaryDescription() {
    currentStatBlock.legendary_desc = "";
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbAddLegendaryDescription() {
    var defaultLegendaryDescription = `The ${currentStatBlock.name} can take 3 legendary actions, choosing from the options below. 
    Only one legendary action option can be used at a time and only at the end of another creature's turn. 
    The ${currentStatBlock.name} regains spent legendary actions at the start of its turn.`;

    currentStatBlock.legendary_desc = defaultLegendaryDescription;
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbAddLegendaryAction() {
    var newAction = {
      "name": "Bite Attack",
      "desc": `The ${currentStatBlock.name} makes a bite attack.`
    }
    if (currentStatBlock.legendary_actions == "") currentStatBlock.legendary_actions = [];
    currentStatBlock.legendary_actions.push(newAction);
    RenderEditableStatBlock(currentStatBlock);
  }

  function sbRemoveLegendaryAction(action) {
    currentStatBlock.legendary_actions.splice(action, 1);
    RenderEditableStatBlock(currentStatBlock);
  }

  function EditCurrentStatBlock() {
    RenderEditableStatBlock(currentStatBlock);
  }

  function EditStatBlock(e, index) {
    let copiedSB = JSON.parse(JSON.stringify(units[index]));
    currentStatBlock = copiedSB;
    currentStatBlock.index = index;
    RenderEditableStatBlock(currentStatBlock);
  }

  function ViewStatBlock(e, index) {
    // prevent parent event propagation

    if (e.target.className == "" || e.target.className == "selected" || e.target.className == "dead") {
      const collection = document.getElementsByClassName("selected");
      if (collection.length > 0) {
        console.log(collection[0].className)
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

  //units.some(unit => unit.id !== copiedSB.id)
  function SaveCurrentStatBlock() {
    let copiedSB = JSON.parse(JSON.stringify(currentStatBlock));

    let arrIndex = units.findIndex(unit => unit.id === copiedSB.id);
    if (arrIndex < 0) {
      DisplayStatBlock(currentStatBlock);
      return;
    }

    if (units[arrIndex].current_hit_points > copiedSB.hit_points) copiedSB.current_hit_points = copiedSB.hit_points;
    else copiedSB.current_hit_points = units[arrIndex].current_hit_points;
    units[arrIndex] = copiedSB;

    DisplayUnits();
    RenderUnit(currentStatBlock.id);
    DisplayStatBlock(currentStatBlock);
  }

  function QuickAddToCombat() {
    currentStatBlock.control_type = document.querySelector(`[name="quickview-control_type"]:checked`).value,
    currentStatBlock.hit_points = document.getElementById("quickview-hit_points").value
    currentStatBlock.armor_class = document.getElementById("quickview-armor_class").value
    currentStatBlock.notes = document.getElementById("quickview-notes").value

    let id = AddCurrentStatBlockToCombat();
    RenderUnit(id);
  }

  function AddCurrentStatBlockToCombat() {
    // Get the value of the input field
    if (document.getElementById("statblock-initiative").value == '') {
      var initiative = Math.floor(Math.random() * 20) + 1;
      if (currentStatBlock.dexterity != undefined) initiative += parseInt(abilityModifierTable[currentStatBlock.dexterity]);
    } else var initiative = document.getElementById("statblock-initiative").value

    if (currentStatBlock.current_hit_points == undefined) currentStatBlock.current_hit_points = currentStatBlock.hit_points;
    if (currentStatBlock.control_type == undefined) currentStatBlock.control_type = "Enemy";

    let copiedSB = JSON.parse(JSON.stringify(currentStatBlock));
    copiedSB.initiative = initiative;
    if (copiedSB.id == undefined) copiedSB.id = crypto.randomUUID();
    console.log(copiedSB.id)
    units.push(copiedSB);
    DisplayUnits();
    return copiedSB.id;  
  }

  function AddQuickUnit() {
    let sb = {
      name: "Unit Name",
      hit_points: 10,
      armor_class: undefined,
      notes: "",
      status_effects: {},
      control_type: "Enemy",
      quickAdd: true,
      xp: 0,
      id: crypto.randomUUID()
    }
    
    

    currentStatBlock = sb;
    document.getElementById('statblockZone').innerHTML = ""; 
    
    RenderUnit("newSB-Monster");
  }

  function AddBasicUnit() {
    let copiedSB = JSON.parse(JSON.stringify(blankStatblock));
    currentStatBlock = copiedSB;
    currentStatBlock.id = crypto.randomUUID();
    
    RenderUnit("newSB");
    RenderEditableStatBlock(currentStatBlock)
  }

  function AddNewPC() {
    let copiedSB = JSON.parse(JSON.stringify(blankPCStatblock));
    currentStatBlock = copiedSB;
    currentStatBlock.id = crypto.randomUUID();
    
    RenderUnit("newSB");
    RenderEditableStatBlock(currentStatBlock)
    //DisplayStatBlock(currentStatBlock)
  }