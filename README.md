# Combat Companion - Dungeons & Dragons DM Tool to Track Combat
## Description

Combat Companion is a simple web-based app that allows combat/encounter tracking and features for Dungeons &amp; Dragons. You can view the latest release live here: [Combat-Companion.Nexodus.net](https://combat-companion.nexodus.net)

Present notable features include:

- Connected to Open5E API to access predefined statblocks. By default, shows all statblocks in alphabetical order, but can also search by keyword.
- Create your own statblocks for enemies or PCs
- Initiative tracking
- Styled display of current combat and recreated statblocks
- Loading and saving current combat (to local storage)
- Turn and round tracking
- Status effect tracking (with optional feature to set status effect for set turns that decrements on each turn)
- Encounter XP tracking (total available, earned, and amount divided between PCs)
- Current HP modification

![image](https://user-images.githubusercontent.com/43420737/211461056-804b964c-4699-442d-a461-820b47e5020e.png)

Future features will include:
- Dynamic and improved saving and loading system to save and access a list of custom PCs and monsters with option to export and import
- Keeping track of special features like breath weapons
- Apply damage in bulk (e.g., fireball cast, mark which enemies are hit, roll Dex saves, and automatically apply damage appropriately)
- Further implementation of the Open5E API to access spell descriptions dynamically
- Polish

## Getting Started
### Installing
- Combat Companion is designed to be simple and lightweight. As a result, it uses vanilla Javascript, HTML, and CSS with minimal dependencies
- It can be installed by cloning the folder wherever you would like and unzipping if necessary
### Running the Program
- Open "Index.html" in a modern web browser
- Internet access is required to access the Open5E API, but otherwise the app is still fully functional offline
- **Can also be accessed live at [Combat-Companion.Nexodus.net](https://combat-companion.nexodus.net) with an internet connection**

## Help
Combat Companion is designed for a minimum screen resolution of 940px wide for optimal display. It will not display properly if used at a lower resolution.

Make sure to use a Javascript enabled modern web browser, such as the latest version of Firefox, Chrome, Edge, Opera, or Safari.

## Authors
- [Andrew Jacobsson](https://nexodus.net/about)

## Version History
- 0.2
  - Functional implementation connected to Open5E API
  - Stylized statblocks and initiative tracking
  - Status effect tracking, XP tracking, HP modification, full statblock modification
  - Turn & round tracking
- 0.1
  - Initial Release. Basic initiative ordering
  
## License
This project is licensed under the GPL-3.0 license - see the [License](LICENSE) File

Wizards of the Coast content provided under the terms of the [Open Gaming License Version 1.0a](docs/SRD-OGL_V1.1.pdf)

## Acknowledgements
- [Open5e](https://open5e.com/) For providing a fast, high-quality, free API for D&D
- [Chad Carteret](https://codepen.io/retractedhack/pen/gPLpWe) For providing the base design and beautiful CSS styling of the statblocks that Combat Companion uses
- [Improved Initiative](https://www.improved-initiative.com/), [Encounter Initiative Tracking](https://kastark.co.uk/rpgs/encounter-tracker/), and [Initiative Tracker](https://dm.tools/tracker) for providing inspiration in the design of Combat Companion
