/**
 * Handles "Quick View" container.
 * 
 * This container displays information about the currently selected unit or displays information on
 * adding new units.
 *
 * @author Andrew Jacobsson.
 * @since  v0.3
 */

/**
 * Renders the unit of passed ID in the quick view container
 * 
 * If id is false, it will display nothing. If ID is of special type "newSB-X" then it will display
 * information on adding a new quick unit. If ID is of type "newSB", then it will display information on
 * adding a new unit based off a statblock.
 * 
 * @param {*} id unit ID to render
 */
function RenderUnit(id) {
    if (id == "newSB-QuickEdit") {
      var str = `
        <div class="quickInfoContainer">
        <hr class="orange-border top" />
        <input class="h1Input" type="text" id="quickview-name" name="statblockName" maxlength="40" value="Unit Name"><br>
        <i>(This is a new unit not yet in combat or saved that does NOT have a full statblock. Set some stats and add to combat. Click "Add Unit" instead to access full statblock editor)</i><br>`;
       
      str += `
      <br><b>Unit Type</b><br>
      <input type="radio" id="quickviewEnemy-control_type" name="quickview-control_type" value="Enemy" checked>
        <label for="quickviewEnemy-control_type">Enemy (Gives XP)</label><br>
        <input type="radio" id="quickviewPC-control_type" name="quickview-control_type" value="PC">
        <label for="quickviewPC-control_type">Player Character (Can make death saves, gets XP)</label><br>
        <input type="radio" id="quickviewNeutral-control_type" name="quickview-control_type" value="Neutral">
        <label for="quickviewNeutral-control_type">Neutral Character (Will not give XP, does not get XP)</label><br>`;
      str += `<b>Max Hit Points:</b><br>
      <input class="statblockNumberInput" type="number" min="1" max="999" id="quickview-hit_points" name="statblockHP" value="10"><br>`
  
      str += `<b><label for="statblock-initiative">Initiative (Leave blank to automatically roll):</label></b><br>
      <input class="statblockNumberInput" type="number" min="1" max="40" id="statblock-initiative" name="statblock-initiative"><br>`
  
      str += `<b>Armor Class (optional):</b><br>
      <input class="statblockNumberInput" type="number" min="1" max="40" id="quickview-armor_class" name="statblockAC" value=""><br>`
  
      str += `
      <b><label for="quickview-challenge_rating">Challenge Rating (optional, will calculate XP):</label></b><br>
      <select class="statblockSelect" name="quickview-challenge_rating" id="quickview-challenge_rating">
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
      </select> (<span id="quickview-challenge_ratingXP">0</span> XP) (PB: +<span id="quickview-challenge_ratingProficiency">2</span>)<br>`
  
      str += `
      <b>Notes (optional):</b><br><textarea class="statblockTextArea" id="quickview-notes">${currentStatBlock.notes}</textarea><br>`
      str += `
      <br><br>
      <button type="button" onclick="QuickAddToCombat()">Add To Combat</button>`
      
      str += `
      <br>
      `
      
        str += `
        <hr class="orange-border bottom" />
        </div>
        `;
      document.getElementById("unitZone").innerHTML = str;
      document.getElementById("unitZone").querySelectorAll("input, textarea, select").forEach((elem) => elem.addEventListener("change", HandleStatBlockEdit));
    } else if (id == "newSB") {
      var str = `
      <div class="quickInfoContainer">
      <hr class="orange-border top" />
      <h1>Adding New Unit</h1>
      <i>Below contains a basic example statblock to freely edit. You can also switch between preset statblocks to use as a template
      through the below buttons.</i><br><br>`;
    
      str += `
      <div class="centered">
        <button onclick="AddNewPC()">PC Statblock</button><button onclick="AddBasicUnit()">Monster Statblock</button>
      </div>
      `
  
      str += `
      <hr class="orange-border bottom" />
      </div>
      `;
      document.getElementById("unitZone").innerHTML = str;
    } else if (!id) {
      document.getElementById("unitZone").innerHTML = "";
    } else {
      let arrIndex = units.findIndex(unit => unit.id === id);
      if (arrIndex < 0) return;
      if (units[arrIndex].notes == undefined) units[arrIndex].notes = "";
      let sb = units[arrIndex];
      var statusEffects = "";
    
      var str = `
        <div class="quickInfoContainer">
        <hr class="orange-border top" />
        <input class="h1Input" type="text" id="quickview-name" name="statblockName" maxlength="40" value="${sb.name}"><br>`
      if (currentTurn == arrIndex) {
        str += `<i>(It is currently this unit's turn)</i>`
      } else {
        str += `<br>`
      }
      if (sb.control_type == "PC" && sb.death_saves_failed != undefined) {
        str += `<h2>`
        if (sb.death_saves_failed > 0 || sb.current_hit_points == 0)
          str += `Failed Death Saves: ${sb.death_saves_failed} <i class="fa-solid fa-arrow-rotate-left icon" onclick="ResetDeathSaves('${id}',true)"></i> `;
        if (sb.current_hit_points == 0)
          str += `Successful Saves: ${sb.death_saves_succeeded} <i class="fa-solid fa-arrow-rotate-left icon" onclick="ResetDeathSaves('${id}',false)"></i>`;
        str += `</h2>`;
      }
    
      str += `
        <h2>AC: ${sb.armor_class}</h2>
        <h2> Current HP ${sb.current_hit_points}/${sb.hit_points}</h2>
        <button type="button" onclick="HealUnit('${sb.id}')">Heal</button>
        <div class="number-input big">
          <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" id="selectedminus-current_hit_points" class="minus"></button>
          <input type="number" min="0" max="999" class="inlineCustomNumInput" id="selected-current_hit_points" name="selected-current_hit_points" value="0">
          <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" id="selectedplus-current_hit_points" class="plus"></button>
        </div>
        <button type="button" onclick="DamageUnit('${sb.id}')">Damage</button>
    
        <p><b>Notes: </b><br><textarea class="statblockTextArea" id="quickview-notes">${sb.notes}</textarea></p>
    
        <b>Status Effects: </b>`;
        if (sb.status_effects == undefined) sb.status_effects = {};
        if ((sb.control_type == "PC" && sb.dead) || (sb.control_type != "PC" && sb.current_hit_points == 0)) dataVal = "";
        else {
          const statusEffectKeys = Object.keys(sb.status_effects);
          statusEffects = "";
          for (var z = 0; z < statusEffectKeys.length; z++) {
            if (sb.status_effects[statusEffectKeys[z]] == 0) {
              statusEffects += `<div class="statusEffect">${statusEffectKeys[z]} <i class="fa-solid fa-x icon" onclick="DeleteStatusEffect('${sb.id}', '${statusEffectKeys[z]}')"></i></div>`
            } else {
              statusEffects += `<div class="statusEffect">${statusEffectKeys[z]} (${sb.status_effects[statusEffectKeys[z]]}) <i class="fa-solid fa-x icon" onclick="DeleteStatusEffect('${sb.id}', '${statusEffectKeys[z]}')"></i></div>`
            }
          }
          
          statusEffects += `<span class="icon text" onclick="AddStatusEffect('${sb.id}')"><i class="fa-solid fa-plus icon"></i> Add Effect</span>`
    
          if (sb.control_type == "PC" && sb.current_hit_points == 0) {
            statusEffects = `<div class="statusEffect">Unconscious</div>`
          }
        }
      str += statusEffects;
      str += `
        <hr class="orange-border bottom" />
        </div>
        `;
    
      document.getElementById("unitZone").innerHTML = str;
      document.getElementById("quickview-name").addEventListener("change", (event) => {HandleQuickInfoEdit(event, sb.id)});
      document.getElementById("quickview-notes").addEventListener("change", (event) => {HandleQuickInfoEdit(event, sb.id)});
    }
  }
  
  /**
   * Will add to the current health of a unit based on the value in the quick view container
   * 
   * @param {*} id unit ID to heal
   * @returns 
   */
  function HealUnit(id) {
    let arrIndex = units.findIndex(unit => unit.id === id);
    let amount = parseInt(document.getElementById('selected-current_hit_points').value);
    if (arrIndex < 0) return;
  
    units[arrIndex].current_hit_points += amount;
    if (units[arrIndex].current_hit_points > units[arrIndex].hit_points) units[arrIndex].current_hit_points = units[arrIndex].hit_points;
    DisplayUnits();
    DisplayStatBlock(units[arrIndex]);
    RenderUnit(id);
  }
  
  /**
   * Will subtract from the current health of a unit based on the value in the quick view container
   * 
   * @param {*} id unit ID to damage
   * @returns 
   */
  function DamageUnit(id) {
    let arrIndex = units.findIndex(unit => unit.id === id);
    let amount = parseInt(document.getElementById('selected-current_hit_points').value);
    if (arrIndex < 0) return;
  
    units[arrIndex].current_hit_points -= amount;
    if (units[arrIndex].current_hit_points < 0) {
      if (units[arrIndex].current_hit_points + units[arrIndex].hit_points <= 0 && units[arrIndex].control_type == "PC") {
        units[arrIndex].death_saves_failed = 3;
        units[arrIndex].death_saves_succeeded = 0;
        units[arrIndex].dead = true;
        console.log("MASSIVE DAMAGE! Instant kill");
      }
      units[arrIndex].current_hit_points = 0;
    }
    DisplayUnits();
    DisplayStatBlock(units[arrIndex]);
    RenderUnit(id);
  }

  /**
   * Handles edits in the quick view container when a unit is currently selected.
   * 
   * @param {*} e event 
   * @param {*} id unit id
   * @returns 
   */
  function HandleQuickInfoEdit(e, id) {
    let arrIndex = units.findIndex(unit => unit.id === id);
    if (arrIndex < 0) return;
    var elementID = e.target.id;
    var editContent;
    if (e.target.value == undefined) {
      editContent = e.target.innerHTML;
    } else {
      editContent = e.target.value;
    }
  
    key = elementID.slice(elementID.lastIndexOf('-')+1);
    units[arrIndex][key] = editContent;
    DisplayUnits();
    let copiedSB = JSON.parse(JSON.stringify(units[arrIndex]));
    currentStatBlock = copiedSB;
    DisplayStatBlock(currentStatBlock);
  }


/**
 * Performs a "quick add" based on the provided form in the quick view container.
 * 
 * Note: quick add units do not have a full statblock and cannot have a full statblock.
 */
  function QuickAddToCombat() {
    currentStatBlock.control_type = document.querySelector(`[name="quickview-control_type"]:checked`).value,
    currentStatBlock.hit_points = document.getElementById("quickview-hit_points").value
    currentStatBlock.armor_class = document.getElementById("quickview-armor_class").value
    currentStatBlock.notes = document.getElementById("quickview-notes").value
    currentStatBlock.challenge_rating = document.getElementById("quickview-challenge_rating").value

    let id = AddCurrentStatBlockToCombat();
    RenderUnit(id);
  }


  /**
   * Creates an empty quick unit statblock and displays quick edit view
   */
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
    
    RenderUnit("newSB-QuickEdit");
  }


  /**
   * Uses a preset default enemy statblock to set as the current statblock for statblock editing
   */
  function AddBasicUnit() {
    let copiedSB = JSON.parse(JSON.stringify(blankStatblock));
    currentStatBlock = copiedSB;
    currentStatBlock.id = crypto.randomUUID();
    
    RenderUnit("newSB");
    RenderEditableStatBlock(currentStatBlock)
  }


  /**
   * Uses a preset default player character statblock to set as the current statblock for statblock editing
   */
  function AddNewPC() {
    let copiedSB = JSON.parse(JSON.stringify(blankPCStatblock));
    currentStatBlock = copiedSB;
    currentStatBlock.id = crypto.randomUUID();
    
    RenderUnit("newSB");
    RenderEditableStatBlock(currentStatBlock)
  }