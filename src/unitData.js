// Modifier corresponding to ability score from 0-30 (index 0 based, which is never used but there as placeholder)
const abilityModifierTable = [
    "-5", "-5", "-4", "-4", "-3", "-3", "-2", "-2",
    "-1", "-1", "+0", "+0", "+1", "+1", "+2", "+2",
    "+3", "+3", "+4", "+4", "+5", "+5", "+6", "+6",
    "+7", "+7", "+8", "+8", "+9", "+9", "+10"
  ];

// List of 5E Skills
const skillList = [
  "acrobatics", "animal handling", "arcana", "athletics", "deception",
  "history", "insight", "intimidation", "investigation", "medicine",
  "nature", "perception", "performance", "persuasion", "religion",
  "sleight of hand", "stealth", "survival",  
]

// List of 5E Skills corresponding to their ability modifier
const skillToAbilityTable = {
  "acrobatics": "dexterity",
  "animal handling": "wisdom",
  "arcana": "intelligence",
  "athletics": "strength",
  "deception": "charisma",
  "history": "intelligence",
  "insight": "wisdom",
  "intimidation": "charisma",
  "investigation": "intelligence",
  "medicine": "wisdom",
  "nature": "intelligence",
  "perception": "wisdom",
  "performance": "charisma",
  "persuasion": "charisma",
  "religion": "intelligence",
  "sleight of hand": "dexterity",
  "stealth": "dexterity",
  "survival": "wisdom",
};
  
  // Convert challenge rating to a proficiency bonus
const challengeRatingProficiencyBonusTable = {
    "0": 2,
    "1/8": 2,
    "1/4": 2,
    "1/2": 2,
    "1": 2,
    "2": 2,
    "3": 2,
    "4": 2,
    "5": 3,
    "6": 3,
    "7": 3,
    "8": 3,
    "9": 4,
    "10": 4,
    "11": 4,
    "12": 4,
    "13": 5,
    "14": 5,
    "15": 5,
    "16": 5,
    "17": 6,
    "18": 6,
    "19": 6,
    "20": 6,
    "21": 7,
    "22": 7,
    "23": 7,
    "24": 7,
    "25": 8,
    "26": 8,
    "27": 8,
    "28": 8,
    "29": 9,
    "30": 9,
  };

  // Convert challenge rating to a numerical XP reward
const challengeRatingXPTable = {
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
  };

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
};

var currentStatBlock = blankStatblock;

var units = [
    {
      "slug": "goblin",
      "name": "Goblin",
      "size": "Small",
      "type": "humanoid",
      "subtype": "goblinoid",
      "group": null,
      "alignment": "neutral evil",
      "armor_class": 15,
      "armor_desc": "leather armor, shield",
      "current_hit_points": 21,
      "hit_points": 21,
      "hit_dice": "6d6",
      "speed": {
          "walk": 30
      },
      "strength": 8,
      "dexterity": 14,
      "constitution": 10,
      "intelligence": 10,
      "wisdom": 8,
      "charisma": 8,
      "strength_save": null,
      "dexterity_save": null,
      "constitution_save": null,
      "intelligence_save": null,
      "wisdom_save": null,
      "charisma_save": null,
      "perception": null,
      "skills": {
          "stealth": 6
      },
      "damage_vulnerabilities": "",
      "damage_resistances": "",
      "damage_immunities": "",
      "condition_immunities": "",
      "senses": "darkvision 60 ft., passive Perception 9",
      "languages": "Common, Goblin",
      "challenge_rating": "1/4",
      "actions": [
          {
              "name": "Scimitar",
              "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.",
              "attack_bonus": 4,
              "damage_dice": "1d6",
              "damage_bonus": 2
          },
          {
              "name": "Shortbow",
              "desc": "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage.",
              "attack_bonus": 4,
              "damage_dice": "1d6",
              "damage_bonus": 2
          }
      ],
      "reactions": "",
      "legendary_desc": "",
      "legendary_actions": "",
      "special_abilities": [
          {
              "name": "Nimble Escape",
              "desc": "The goblin can take the Disengage or Hide action as a bonus action on each of its turns."
          }
      ],
      "spell_list": [],
      "img_main": null,
      "document__slug": "wotc-srd",
      "document__title": "Systems Reference Document",
      "document__license_url": "http://open5e.com/legal",
      "initiative": 20,
      "control_type": "Enemy"
  },
  {
    "slug": "goblin",
    "name": "Goblin Archer",
    "size": "Small",
    "type": "humanoid",
    "subtype": "goblinoid",
    "group": null,
    "alignment": "neutral evil",
    "armor_class": 15,
    "armor_desc": "leather armor, shield",
    "current_hit_points": 21,
    "hit_points": 21,
    "hit_dice": "6d6",
    "speed": {
        "walk": 30
    },
    "strength": 8,
    "dexterity": 14,
    "constitution": 10,
    "intelligence": 10,
    "wisdom": 8,
    "charisma": 8,
    "strength_save": null,
    "dexterity_save": null,
    "constitution_save": null,
    "intelligence_save": null,
    "wisdom_save": null,
    "charisma_save": null,
    "perception": null,
    "skills": {
        "stealth": 6
    },
    "damage_vulnerabilities": "",
    "damage_resistances": "",
    "damage_immunities": "",
    "condition_immunities": "",
    "senses": "darkvision 60 ft., passive Perception 9",
    "languages": "Common, Goblin",
    "challenge_rating": "1/4",
    "actions": [
        {
            "name": "Dagger",
            "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 2) slashing damage.",
            "attack_bonus": 4,
            "damage_dice": "1d6",
            "damage_bonus": 2
        },
        {
            "name": "Shortbow",
            "desc": "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage.",
            "attack_bonus": 4,
            "damage_dice": "1d6",
            "damage_bonus": 2
        }
    ],
    "reactions": "",
    "legendary_desc": "",
    "legendary_actions": "",
    "special_abilities": [
        {
            "name": "Nimble Escape",
            "desc": "The goblin can take the Disengage or Hide action as a bonus action on each of its turns."
        }
    ],
    "spell_list": [],
    "img_main": null,
    "document__slug": "wotc-srd",
    "document__title": "Systems Reference Document",
    "document__license_url": "http://open5e.com/legal",
    "initiative": 16,
    "control_type": "Enemy"
},
{
  "slug": "dust-goblin-chieftain",
  "name": "Goblin Chieftain",
  "size": "Small",
  "type": "humanoid",
  "subtype": "goblinoid",
  "group": null,
  "alignment": "neutral evil",
  "armor_class": 16,
  "armor_desc": "studded leather",
  "current_hit_points": 44,
  "hit_points": 44,
  "hit_dice": "8d6+16",
  "speed": {
      "walk": 30
  },
  "strength": 8,
  "dexterity": 18,
  "constitution": 15,
  "intelligence": 14,
  "wisdom": 13,
  "charisma": 13,
  "strength_save": null,
  "dexterity_save": 7,
  "constitution_save": null,
  "intelligence_save": 5,
  "wisdom_save": null,
  "charisma_save": null,
  "perception": null,
  "skills": {
      "intimidation": 3,
      "stealth": 8,
      "survival": 3
  },
  "damage_vulnerabilities": "",
  "damage_resistances": "",
  "damage_immunities": "",
  "condition_immunities": "",
  "senses": "darkvision 60 ft., passive Perception 11",
  "languages": "Common, Goblin, and one ancient language",
  "challenge_rating": "3",
  "actions": [
      {
          "attack_bonus": 6,
          "damage_dice": "1d6+4",
          "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 7 (1d6 + 4) piercing damage plus 4 (1d8) poison damage. The target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success",
          "name": "Shortsword"
      },
      {
          "attack_bonus": 6,
          "damage_dice": "1d8+4",
          "desc": "Ranged Weapon Attack: +6 to hit, range 80/320 ft., one target. Hit: 8 (1d8 + 4) piercing damage plus 4 (1d8) poison damage. The target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
          "name": "Light Crossbow"
      }
  ],
  "reactions": [
      {
          "desc": "The dust goblin chieftain adds 2 to its AC against one melee attack that would hit it. To do so, the chieftain must see the attacker and be wielding a melee weapon.",
          "name": "Parry"
      }
  ],
  "legendary_desc": "",
  "legendary_actions": "",
  "special_abilities": [
      {
          "desc": "The dust goblin chieftain has advantage on saving throws against being charmed or frightened. In addition, it can use an action to read the surface thoughts of one creature within 30 feet. This works like the detect thoughts spell, except it can only read surface thoughts and there is no limit to the duration. The dust goblin chieftain can end this effect as a bonus action or by using an action to change the target.",
          "name": "Alien Mind"
      },
      {
          "desc": "On each of its turns, the dust goblin chieftain can use a bonus action to take the Dash, Disengage, or Hide action.",
          "name": "Cunning Action"
      },
      {
          "desc": "The dust goblin chieftain deals an extra 10 (3d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 feet of an ally of the dust goblin chieftain that isn't incapacitated and the chieftain doesn't have disadvantage on the attack roll.",
          "name": "Sneak Attack (1/Turn)"
      },
      {
          "desc": "When the dust goblin chieftain attacks a creature from hiding, the target must succeed on a DC 13 Wisdom saving throw or be frightened until the end of its next turn.",
          "name": "Twisted"
      }
  ],
  "spell_list": [],
  "img_main": null,
  "document__slug": "cc",
  "document__title": "Creature Codex OGL",
  "document__license_url": "http://open5e.com/legal",
  "initiative": 13,
  "control_type": "Enemy"
},
  {
    "slug": "ulfric",
    "name": "Ulfric",
    "size": "medium",
    "type": "humanoid",
    "subtype": "dwarf",
    "group": null,
    "alignment": "lawful good",
    "armor_class": 22,
    "armor_desc": "scale armor, shield",
    "current_hit_points": 60,
    "hit_points": 60,
    "hit_dice": "6d10",
    "speed": {
        "walk": 30
    },
    "strength": 12,
    "dexterity": 14,
    "constitution": 16,
    "intelligence": 11,
    "wisdom": 13,
    "charisma": 13,
    "strength_save": null,
    "dexterity_save": null,
    "constitution_save": null,
    "intelligence_save": null,
    "wisdom_save": null,
    "charisma_save": null,
    "perception": null,
    "skills": {
    },
    "damage_vulnerabilities": "",
    "damage_resistances": "",
    "damage_immunities": "",
    "condition_immunities": "",
    "senses": "darkvision 60 ft., passive Perception 9",
    "languages": "Common, Dwarven",
    "challenge_rating": "1/4",
    "actions": [
        {
            "name": "Warhammer",
            "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 3) bludgeoning damage.",
            "attack_bonus": 4,
            "damage_dice": "1d6",
            "damage_bonus": 2
        },
    ],
    "reactions": "",
    "legendary_desc": "",
    "legendary_actions": "",
    "special_abilities": [
        {
            "name": "Boots of Jumping",
            "desc": "Can jump 3x the normal amount"
        }
    ],
    "spell_list": [],
    "img_main": null,
    "document__slug": "custom",
    "document__title": "custom",
    "document__license_url": "https://github.com/timblegoorn/Combat-Companion",
    "initiative": 18, 
    "control_type": "PC"
    },
    {
        "slug": "leah",
        "name": "Leah",
        "size": "medium",
        "type": "humanoid",
        "subtype": "elf",
        "group": null,
        "alignment": "lawful good",
        "armor_class": 17,
        "armor_desc": "scale armor",
        "current_hit_points": 45,
        "hit_points": 45,
        "hit_dice": "6d10",
        "speed": {
            "walk": 30
        },
        "strength": 12,
        "dexterity": 14,
        "constitution": 16,
        "intelligence": 11,
        "wisdom": 13,
        "charisma": 13,
        "strength_save": null,
        "dexterity_save": null,
        "constitution_save": null,
        "intelligence_save": null,
        "wisdom_save": null,
        "charisma_save": null,
        "perception": null,
        "skills": {
        },
        "damage_vulnerabilities": "",
        "damage_resistances": "",
        "damage_immunities": "",
        "condition_immunities": "",
        "senses": "darkvision 60 ft., passive Perception 9",
        "languages": "Common, Dwarven",
        "challenge_rating": "1/4",
        "actions": [
            {
                "name": "Warhammer",
                "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 3) bludgeoning damage.",
                "attack_bonus": 4,
                "damage_dice": "1d6",
                "damage_bonus": 2
            },
        ],
        "reactions": "",
        "legendary_desc": "",
        "legendary_actions": "",
        "special_abilities": [
            {
                "name": "Boots of Jumping",
                "desc": "Can jump 3x the normal amount"
            }
        ],
        "spell_list": [],
        "img_main": null,
        "document__slug": "custom",
        "document__title": "custom",
        "document__license_url": "https://github.com/timblegoorn/Combat-Companion",
        "initiative": 6, 
        "control_type": "PC"
        },
]