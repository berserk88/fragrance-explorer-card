window.customCards = window.customCards || [];
window.customCards.push({
  type: "fragrance-explorer-card",
  name: "Fragrance Explorer",
  description: "Fragrance blend discovery and application guide"
});

const DB = [
  { id:1,  name:"High-Heat Shield",          icon:"🧊", rating:4.5, season:"Summer",      time:"Day",   occasion:"Casual",  profile:"Sparkling ginger-citrus blend with marine elements.",                   synergy:"Perfect interlocking of blue ambroxan and spice notes.",              fragrances:["Immortal","Milestone","Turathi"],                                        steps:[{f:"Immortal",v:"2 sprays",z:"Chest"},{f:"Milestone",v:"1 spray",z:"Neck"},{f:"Turathi",v:"1 spray",z:"Wrists"}]},
  { id:2,  name:"Ultimate Luxury Blue",       icon:"💎", rating:5.0, season:"All Seasons", time:"All",   occasion:"Formal",  profile:"Deep amber powdery blue – versatile masterpiece.",                       synergy:"Caprice's cardamom softens the sharp edges.",                         fragrances:["Caprice","Heaven","National I"],                                         steps:[{f:"Caprice",v:"2 sprays",z:"Neck"},{f:"Heaven",v:"1 spray",z:"Chest"},{f:"National I",v:"1 spray",z:"Wrists"}]},
  { id:3,  name:"Ginger Elysium",             icon:"🌟", rating:4.5, season:"Summer",      time:"Day",   occasion:"Casual",  profile:"High-end effervescent lime and ginger.",                                 synergy:"Immortal boosts the bright, sparkling top notes.",                    fragrances:["Immortal","Divin Asylum"],                                               steps:[{f:"Immortal",v:"2 sprays",z:"Neck"},{f:"Divin Asylum",v:"1 spray",z:"Chest"}]},
  { id:4,  name:"Alpine Ocean Breeze",        icon:"🌊", rating:4.0, season:"Summer",      time:"Day",   occasion:"Casual",  profile:"Metallic marine sea-salt air, fresh and invigorating.",                 synergy:"Milestone adds crisp marine salt notes.",                             fragrances:["Milestone","Turathi"],                                                   steps:[{f:"Milestone",v:"2 sprays",z:"Neck"},{f:"Turathi",v:"1 spray",z:"Wrists"}]},
  { id:5,  name:"Modernized Emerald Vetiver", icon:"🌿", rating:4.0, season:"Spring",      time:"Day",   occasion:"Office",  profile:"Sharp retro-modern green for the office.",                               synergy:"Immortal updates the heavy, dark vetiver.",                           fragrances:["Immortal","Heaven"],                                                     steps:[{f:"Immortal",v:"1 spray",z:"Neck"},{f:"Heaven",v:"2 sprays",z:"Chest"}]},
  { id:6,  name:"Inky Citrus Bomb",           icon:"💣", rating:4.0, season:"Autumn",      time:"Day",   occasion:"Casual",  profile:"Earthy dark grapefruit explosion.",                                      synergy:"Turathi's bright grapefruit cuts through.",                           fragrances:["Turathi","Heaven"],                                                     steps:[{f:"Turathi",v:"2 sprays",z:"Neck"},{f:"Heaven",v:"1 spray",z:"Chest"}]},
  { id:7,  name:"Coastal Countryside",        icon:"🏕️", rating:4.0, season:"Spring",      time:"Day",   occasion:"Casual",  profile:"Salty crisp ozonic green.",                                              synergy:"Milestone adds bright oceanic breeze.",                               fragrances:["Milestone","Immortal"],                                                  steps:[{f:"Milestone",v:"1 spray",z:"Neck"},{f:"Immortal",v:"2 sprays",z:"Chest"}]},
  { id:8,  name:"Professional Comfort",       icon:"💼", rating:4.5, season:"Autumn",      time:"Day",   occasion:"Office",  profile:"Creamy fig and sharp vetiver.",                                          synergy:"Liam Grey's milky tea accord perfects balance.",                      fragrances:["Liam Grey","Heaven"],                                                    steps:[{f:"Liam Grey",v:"2 sprays",z:"Neck"},{f:"Heaven",v:"1 spray",z:"Wrists"}]},
  { id:9,  name:"Executive Fresh",            icon:"✨", rating:4.5, season:"Spring",      time:"Day",   occasion:"Office",  profile:"Elite fresh-cut grass and lime.",                                        synergy:"Highly clean, professional aura.",                                    fragrances:["Immortal","Caprice"],                                                    steps:[{f:"Immortal",v:"1 spray",z:"Neck"},{f:"Caprice",v:"1 spray",z:"Chest"}]},
  { id:10, name:"Upscale Ginger Cream-Soda",  icon:"🥃", rating:5.0, season:"Autumn",      time:"All",   occasion:"Evening", profile:"Sparkling gourmand vanilla.",                                            synergy:"Ghost's rich vanilla gourmand sweetness.",                            fragrances:["Ghost","Immortal"],                                                      steps:[{f:"Ghost",v:"2 sprays",z:"Neck"},{f:"Immortal",v:"1 spray",z:"Wrists"}]},
  { id:11, name:"Emperor's Tea Accord",       icon:"🍵", rating:4.5, season:"Spring",      time:"Day",   occasion:"Office",  profile:"Luxury green and black tea lounge.",                                     synergy:"Liam Grey adds dense black tea notes.",                               fragrances:["Liam Grey","Heaven"],                                                    steps:[{f:"Liam Grey",v:"2 sprays",z:"Chest"},{f:"Heaven",v:"1 spray",z:"Neck"}]},
  { id:12, name:"Luxury Cashmere",            icon:"🧥", rating:5.0, season:"Winter",      time:"All",   occasion:"Formal",  profile:"Niche woody shield.",                                                    synergy:"Encre Noire adds earthy framework.",                                  fragrances:["Encre Noire","Ghost"],                                                   steps:[{f:"Encre Noire",v:"2 sprays",z:"Chest"},{f:"Ghost",v:"1 spray",z:"Neck"}]},
  { id:13, name:"Seductive Pineapple",        icon:"🍍", rating:4.5, season:"Spring",      time:"Night", occasion:"Evening", profile:"Romantic fruity pineapple spice.",                                       synergy:"Caprice introduces sensual smoothness.",                              fragrances:["Caprice","SNOI"],                                                        steps:[{f:"Caprice",v:"1 spray",z:"Neck"},{f:"SNOI",v:"2 sprays",z:"Chest"}]},
  { id:14, name:"Bad Boy in a Clean Suit",    icon:"🎩", rating:5.0, season:"Winter",      time:"Night", occasion:"Evening", profile:"Rugged leather and clean powder.",                                       synergy:"Masculine spice perfection.",                                         fragrances:["Encre Noire","Hercules"],                                                steps:[{f:"Encre Noire",v:"2 sprays",z:"Neck"},{f:"Hercules",v:"1 spray",z:"Chest"}]},
  { id:15, name:"Freezing Powerhouse",        icon:"❄️", rating:5.0, season:"Winter",      time:"Night", occasion:"Formal",  profile:"Smoky spicy tobacco vanilla.",                                           synergy:"Hercules provides heavy tobacco richness.",                           fragrances:["Hercules","Ghost"],                                                      steps:[{f:"Hercules",v:"2 sprays",z:"Chest"},{f:"Ghost",v:"1 spray",z:"Neck"}]},
  { id:16, name:"Spiced Chai and Tobacco",    icon:"🌶️", rating:4.5, season:"Autumn",      time:"All",   occasion:"Casual",  profile:"Ultra-cozy spiced gourmand.",                                            synergy:"Hercules injects warm cinnamon spice.",                               fragrances:["Hercules","Immortal"],                                                   steps:[{f:"Hercules",v:"1 spray",z:"Neck"},{f:"Immortal",v:"1 spray",z:"Chest"}]},
  { id:17, name:"Smoked Pineapple Leather",   icon:"🔥", rating:4.5, season:"Winter",      time:"Night", occasion:"Evening", profile:"Alpha dark fruit and leather.",                                          synergy:"SNOI's intense smoky performance.",                                   fragrances:["SNOI","Encre Noire"],                                                    steps:[{f:"SNOI",v:"2 sprays",z:"Neck"},{f:"Encre Noire",v:"1 spray",z:"Chest"}]},
  { id:18, name:"Seductive Vanilla Leather",  icon:"💋", rating:5.0, season:"Winter",      time:"Night", occasion:"Evening", profile:"Sweet rugged luxury leather.",                                           synergy:"Spicy structural ambroxan excellence.",                               fragrances:["Ghost","SNOI"],                                                          steps:[{f:"Ghost",v:"1 spray",z:"Chest"},{f:"SNOI",v:"2 sprays",z:"Neck"}]},
  { id:19, name:"Spiced Vanilla Tobacco",     icon:"🚬", rating:4.5, season:"Autumn",      time:"Night", occasion:"Evening", profile:"Powdery warm tobacco lavender.",                                         synergy:"Caprice introduces clean smooth edges.",                              fragrances:["Caprice","Hercules"],                                                    steps:[{f:"Caprice",v:"1 spray",z:"Wrists"},{f:"Hercules",v:"2 sprays",z:"Neck"}]},
  { id:20, name:"Salty Watermelon Tobacco",   icon:"🍉", rating:4.0, season:"Autumn",      time:"Day",   occasion:"Casual",  profile:"Experimental sweet-salty ozonic tobacco.",                               synergy:"Milestone's ocean spray harmony.",                                    fragrances:["Milestone","Hercules"],                                                  steps:[{f:"Milestone",v:"1 spray",z:"Neck"},{f:"Hercules",v:"1 spray",z:"Chest"}]},
  { id:21, name:"Imperial Saffron Blue",      icon:"👑", rating:4.5, season:"Autumn",      time:"All",   occasion:"Evening", profile:"Exotic leathery blue amber.",                                            synergy:"National I creates elite amber base.",                                fragrances:["National I","SNOI"],                                                     steps:[{f:"National I",v:"2 sprays",z:"Chest"},{f:"SNOI",v:"1 spray",z:"Neck"}]},
  { id:22, name:"Midnight Metallic Ocean",    icon:"🌙", rating:4.0, season:"Summer",      time:"Night", occasion:"Casual",  profile:"Dark fruity metallic marine.",                                           synergy:"Milestone adds crisp ozonic salt.",                                   fragrances:["Milestone","SNOI"],                                                      steps:[{f:"Milestone",v:"1 spray",z:"Neck"},{f:"SNOI",v:"2 sprays",z:"Chest"}]},
  { id:23, name:"Creamy Alpine Woods",        icon:"🌲", rating:4.0, season:"Spring",      time:"Day",   occasion:"Office",  profile:"Green tea smoothed by milky fig.",                                       synergy:"Heaven's sharp ink and tea edges.",                                   fragrances:["Heaven","Liam Grey"],                                                    steps:[{f:"Heaven",v:"1 spray",z:"Neck"},{f:"Liam Grey",v:"2 sprays",z:"Chest"}]},
  { id:24, name:"Smoky Mountain Vetiver",     icon:"🗻", rating:4.0, season:"Autumn",      time:"Day",   occasion:"Office",  profile:"Dark ink vetiver meeting clean tea.",                                    synergy:"Heaven provides clean fresh air.",                                    fragrances:["Heaven","Encre Noire"],                                                  steps:[{f:"Heaven",v:"1 spray",z:"Wrists"},{f:"Encre Noire",v:"2 sprays",z:"Neck"}]},
  { id:25, name:"Absolute Universal King",    icon:"🏆", rating:5.0, season:"All Seasons", time:"All",   occasion:"Casual",  profile:"Crowdpleasing fresh cardamom blue.",                                     synergy:"Flawless interweaving of notes.",                                     fragrances:["Caprice","Immortal","Milestone"],                                        steps:[{f:"Caprice",v:"1 spray",z:"Neck"},{f:"Immortal",v:"1 spray",z:"Chest"},{f:"Milestone",v:"1 spray",z:"Wrists"}]},
  { id:26, name:"Aromatic Ink and Leather",   icon:"📖", rating:4.5, season:"Winter",      time:"Night", occasion:"Formal",  profile:"Intense ultra-masculine dark niche wood.",                               synergy:"Pure dark art excellence.",                                           fragrances:["Encre Noire","Ghost"],                                                   steps:[{f:"Encre Noire",v:"2 sprays",z:"Chest"},{f:"Ghost",v:"1 spray",z:"Neck"}]},
  { id:27, name:"Citrus Saffron Spark",       icon:"⚡", rating:4.0, season:"Autumn",      time:"Day",   occasion:"Office",  profile:"Leathery zesty ginger.",                                                 synergy:"Immortal's ginger introduces brightness.",                            fragrances:["Immortal","Turathi"],                                                    steps:[{f:"Immortal",v:"1 spray",z:"Neck"},{f:"Turathi",v:"1 spray",z:"Wrists"}]},
  { id:28, name:"Golden Pineapple Breeze",    icon:"🌞", rating:4.5, season:"Summer",      time:"Day",   occasion:"Casual",  profile:"Premium sharp tropical pineapple.",                                      synergy:"Divin Asylum supercharges fruity notes.",                             fragrances:["Divin Asylum","Immortal"],                                               steps:[{f:"Divin Asylum",v:"2 sprays",z:"Neck"},{f:"Immortal",v:"1 spray",z:"Chest"}]},
  { id:29, name:"Emperor's Sovereign",        icon:"🎖️", rating:5.0, season:"Spring",      time:"All",   occasion:"Formal",  profile:"3-Layer deep multi-dimensional smoky pineapple.",                       synergy:"SNOI anchors the composition perfectly.",                             fragrances:["SNOI","Divin Asylum","Caprice"],                                         steps:[{f:"SNOI",v:"1 spray",z:"Neck"},{f:"Divin Asylum",v:"1 spray",z:"Chest"},{f:"Caprice",v:"1 spray",z:"Wrists"}]},
  { id:30, name:"Gothic Vanilla Incense",     icon:"💀", rating:4.5, season:"Winter",      time:"Night", occasion:"Formal",  profile:"3-Layer mysterious dark woody vanilla.",                                 synergy:"Encre Noire adds rich dark framework.",                               fragrances:["Encre Noire","Ghost","Hercules"],                                        steps:[{f:"Encre Noire",v:"1 spray",z:"Neck"},{f:"Ghost",v:"1 spray",z:"Chest"},{f:"Hercules",v:"1 spray",z:"Wrists"}]},
  { id:31, name:"Velvet Oud Royale",          icon:"🕌", rating:5.0, season:"Winter",      time:"Night", occasion:"Formal",  profile:"3-Layer majestic oud rose leather trinity.",                             synergy:"SNOI bridges the oud and ambroxan layers.",                           fragrances:["SNOI","National I","Ghost"],                                             steps:[{f:"SNOI",v:"2 sprays",z:"Neck"},{f:"National I",v:"1 spray",z:"Chest"},{f:"Ghost",v:"1 spray",z:"Wrists"}]},
  { id:32, name:"Autumn Rain Ritual",         icon:"🍂", rating:4.5, season:"Autumn",      time:"Day",   occasion:"Casual",  profile:"Petrichor-soaked leaves with cedar warmth.",                             synergy:"Heaven's vetiver grounds the earthy top notes.",                      fragrances:["Heaven","Liam Grey","Turathi"],                                          steps:[{f:"Heaven",v:"2 sprays",z:"Chest"},{f:"Liam Grey",v:"1 spray",z:"Neck"},{f:"Turathi",v:"1 spray",z:"Wrists"}]},
  { id:33, name:"Solar Citrus Armour",        icon:"🛡️", rating:4.0, season:"Spring",      time:"Day",   occasion:"Office",  profile:"Bright bergamot shielded by clean musk.",                               synergy:"Milestone's aquatic heart keeps freshness alive all day.",            fragrances:["Milestone","Caprice"],                                                   steps:[{f:"Milestone",v:"2 sprays",z:"Neck"},{f:"Caprice",v:"1 spray",z:"Chest"}]},
  { id:34, name:"Sovereign Niche Overlord",   icon:"👁️", rating:5.0, season:"Winter",      time:"Night", occasion:"Formal",  profile:"4-Layer ultimate niche symphony.",                                       synergy:"Heavy dense base elements shifting smoothly into sweet gourmand top.", fragrances:["Encre Noire Extreme","Costume National I","Lattafa Liam Grey","Spectre Ghost"], steps:[{f:"Encre Noire Extreme",v:"1 spray",z:"Skin Lower Back"},{f:"Costume National I",v:"2 sprays",z:"Skin Chest"},{f:"Lattafa Liam Grey",v:"1 spray",z:"Skin Neck"},{f:"Spectre Ghost",v:"1 spray",z:"Hair Shoulders"}]}
];

var SEASONS   = ["Spring","Summer","Autumn","Winter","All Seasons"];
var TIMES     = ["Day","Night","All"];
var OCCASIONS = ["Casual","Office","Evening","Formal"];

var SEASON_ICONS   = {Spring:"🌸",Summer:"☀️",Autumn:"🍂",Winter:"❄️","All Seasons":"🌍"};
var TIME_ICONS     = {Day:"🌤️",Night:"🌙",All:"🕐"};
var OCCASION_ICONS = {Casual:"👟",Office:"💼",Evening:"🍷",Formal:"🎩"};

function starsHtml(r) {
  var full  = Math.floor(r);
  var half  = (r % 1) >= 0.5 ? 1 : 0;
  var empty = 5 - full - half;
  var s = "";
  for (var i = 0; i < full;  i++) s += "★";
  if (half) s += "½";
  for (var i = 0; i < empty; i++) s += "☆";
  return s;
}

function e(s) {
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

var CSS = [
  "* { box-sizing: border-box; margin: 0; padding: 0; }",
  ".shell { display: flex; flex-direction: column; height: var(--fh, 400px); max-height: var(--fh, 400px); background: var(--ha-card-background, #1c1c1e); border-radius: var(--ha-card-border-radius, 12px); overflow: hidden; position: relative; font-family: var(--paper-font-body1_-_font-family, Helvetica, Arial, sans-serif); color: var(--primary-text-color, #e0e0e0); font-size: 14px; }",
  ".searchbar { flex-shrink: 0; padding: 10px 12px 8px; background: var(--sidebar-background-color, #111); border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08)); }",
  ".searchinput { width: 100%; padding: 8px 12px; border-radius: 8px; border: 1.5px solid var(--divider-color, rgba(255,255,255,0.15)); background: var(--secondary-background-color, #2c2c2e); color: var(--primary-text-color, #fff); font-size: 13px; font-family: inherit; outline: none; -webkit-appearance: none; display: block; }",
  ".searchinput:focus { border-color: var(--accent-color, #e07b54); }",
  ".body { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 12px; -webkit-overflow-scrolling: touch; }",
  ".bottomnav { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--sidebar-background-color, #111); border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08)); min-height: 44px; }",
  ".navinfo { font-size: 12px; color: var(--secondary-text-color, #888); font-weight: 500; }",
  ".navbtns { display: flex; gap: 8px; }",
  ".btn { padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; border: none; -webkit-tap-highlight-color: transparent; }",
  ".btnback { background: var(--secondary-background-color, #2c2c2e); color: var(--primary-text-color, #fff); }",
  ".btnhome { background: var(--accent-color, #e07b54); color: #fff; }",
  ".seclabel { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--accent-color, #e07b54); margin: 0 0 8px; }",
  ".secblock { margin-bottom: 14px; }",
  ".chiprow { display: flex; flex-wrap: wrap; gap: 7px; }",
  ".chip { display: inline-flex; align-items: center; gap: 5px; padding: 6px 11px; border-radius: 20px; border: 1.5px solid var(--divider-color, rgba(255,255,255,0.15)); background: var(--secondary-background-color, #2c2c2e); color: var(--primary-text-color, #e0e0e0); font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; user-select: none; }",
  ".chip.active { background: var(--accent-color, #e07b54); border-color: var(--accent-color, #e07b54); color: #fff; }",
  ".blendlist { display: flex; flex-direction: column; gap: 9px; }",
  ".blendcard { display: flex; align-items: flex-start; gap: 10px; padding: 11px 12px; border-radius: 10px; background: var(--secondary-background-color, #2c2c2e); border: 1px solid var(--divider-color, rgba(255,255,255,0.07)); cursor: pointer; -webkit-tap-highlight-color: transparent; }",
  ".blendcard:active { opacity: 0.75; }",
  ".blendicon { font-size: 24px; flex-shrink: 0; margin-top: 2px; line-height: 1; }",
  ".blendinfo { flex: 1; min-width: 0; }",
  ".blendname { font-size: 13px; font-weight: 700; color: var(--primary-text-color, #fff); margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }",
  ".blendtags { display: flex; flex-wrap: wrap; gap: 4px; }",
  ".tag { font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 4px; background: rgba(224,123,84,0.15); color: var(--accent-color, #e07b54); white-space: nowrap; }",
  ".starscol { flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }",
  ".staricons { font-size: 12px; color: #f5c518; letter-spacing: 1px; white-space: nowrap; }",
  ".starnum { font-size: 10px; font-weight: 700; color: var(--secondary-text-color, #888); }",
  ".empty { text-align: center; padding: 32px 16px; color: var(--secondary-text-color, #888); }",
  ".emptyicon { font-size: 36px; margin-bottom: 8px; }",
  ".detailhero { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.1)); }",
  ".detailicon { font-size: 32px; flex-shrink: 0; line-height: 1; }",
  ".detailbody { flex: 1; min-width: 0; }",
  ".detailname { font-size: 15px; font-weight: 700; margin-bottom: 6px; color: var(--primary-text-color, #fff); }",
  ".detailmeta { display: flex; flex-wrap: wrap; gap: 5px; }",
  ".detailstars { flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }",
  ".detailstaricons { font-size: 15px; color: #f5c518; letter-spacing: 1px; }",
  ".detailstarnum { font-size: 11px; font-weight: 700; color: var(--secondary-text-color, #888); }",
  ".infobox { border-radius: 8px; padding: 11px 13px; font-size: 13px; line-height: 1.6; color: var(--primary-text-color, #e0e0e0); margin-bottom: 14px; }",
  ".infobox-profile { background: rgba(224,123,84,0.1); border-left: 3px solid var(--accent-color, #e07b54); }",
  ".infobox-synergy { background: rgba(100,200,255,0.08); border-left: 3px solid #64c8ff; }",
  ".fragtags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }",
  ".fragtag { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; border: 1.5px solid var(--accent-color, #e07b54); color: var(--accent-color, #e07b54); background: rgba(224,123,84,0.08); }",
  ".timeline { position: relative; display: flex; flex-direction: column; gap: 12px; padding-left: 4px; margin-bottom: 8px; }",
  ".timeline::before { content: ''; position: absolute; left: 17px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(to bottom, var(--accent-color, #e07b54), rgba(224,123,84,0.2)); }",
  ".timelinenode { display: flex; gap: 12px; }",
  ".timelinecircle { flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background: var(--accent-color, #e07b54); color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; z-index: 1; }",
  ".timelinecontent { flex: 1; background: var(--secondary-background-color, #2c2c2e); border-radius: 8px; padding: 9px 12px; border: 1px solid var(--divider-color, rgba(255,255,255,0.07)); }",
  ".timelinefrag { font-size: 13px; font-weight: 700; color: var(--accent-color, #e07b54); margin-bottom: 5px; }",
  ".timelinedetail { font-size: 11px; color: var(--secondary-text-color, #888); display: flex; gap: 10px; flex-wrap: wrap; }",
  ".timelinepill { background: rgba(255,255,255,0.06); padding: 2px 7px; border-radius: 4px; font-weight: 600; }",
  ".overlay { position: absolute; inset: 0; border-radius: inherit; background: rgba(0,0,0,0.72); display: flex; align-items: flex-end; justify-content: center; padding: 20px; z-index: 99; }",
  ".toast { background: var(--secondary-background-color, #2c2c2e); border: 1px solid var(--accent-color, #e07b54); border-radius: 10px; padding: 14px 18px; text-align: center; max-width: 300px; width: 100%; }",
  ".toastp { margin: 0 0 12px; font-size: 13px; color: var(--primary-text-color, #fff); }",
  ".toastbtns { display: flex; gap: 8px; }",
  ".btnstay { flex: 1; padding: 8px; border-radius: 6px; font-size: 13px; font-weight: 600; border: 1.5px solid var(--divider-color, rgba(255,255,255,0.2)); background: transparent; color: var(--primary-text-color, #fff); cursor: pointer; font-family: inherit; }",
  ".btnexit { flex: 1; padding: 8px; border-radius: 6px; font-size: 13px; font-weight: 700; border: none; background: var(--accent-color, #e07b54); color: #fff; cursor: pointer; font-family: inherit; }"
].join(" ");

class FragranceExplorerCard extends HTMLElement {

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
    this._view   = "dashboard";
    this._q      = "";
    this._fS     = null;
    this._fT     = null;
    this._fO     = null;
    this._item   = null;
    this._exit   = false;
    this._etmr   = null;
    this._sfocus  = false;
    this._cfg    = {};
    this._popfn  = null;
  }

  setConfig(cfg) {
    this._cfg = cfg || {};
  }

  getCardSize() {
    return 5;
  }

  connectedCallback() {
    var self = this;
    this._popfn = function() { self._onPop(); };
    window.addEventListener("popstate", this._popfn);
    history.pushState({ fv: "dashboard" }, "");
    this._draw();
  }

  disconnectedCallback() {
    if (this._popfn) {
      window.removeEventListener("popstate", this._popfn);
    }
    clearTimeout(this._etmr);
  }

  _onPop() {
    if (this._exit) {
      this._exit = false;
      this._draw();
      return;
    }
    if (this._view === "detail") {
      this._view = "list";
      this._item = null;
      history.pushState({ fv: "list" }, "");
      this._draw();
      return;
    }
    if (this._view === "list") {
      this._view = "dashboard";
      history.pushState({ fv: "dashboard" }, "");
      this._draw();
      return;
    }
    this._exit = true;
    history.pushState({ fv: "dashboard" }, "");
    clearTimeout(this._etmr);
    var self = this;
    this._etmr = setTimeout(function() { self._exit = false; self._draw(); }, 2500);
    this._draw();
  }

  _filtered() {
    var q = this._q.trim().toLowerCase();
    if (q) {
      return DB.filter(function(d) {
        return d.name.toLowerCase().indexOf(q) > -1 ||
               d.profile.toLowerCase().indexOf(q) > -1 ||
               d.fragrances.some(function(f) { return f.toLowerCase().indexOf(q) > -1; });
      });
    }
    var fS = this._fS, fT = this._fT, fO = this._fO;
    return DB.filter(function(d) {
      if (fS && d.season   !== fS && d.season   !== "All Seasons") return false;
      if (fT && d.time     !== fT && d.time     !== "All")          return false;
      if (fO && d.occasion !== fO)                                   return false;
      return true;
    });
  }

  _filtersHtml() {
    var self = this;
    var html = "";

    html += '<div class="secblock">';
    html += '<p class="seclabel">Season</p>';
    html += '<div class="chiprow">';
    SEASONS.forEach(function(s) {
      var active = self._fS === s ? " active" : "";
      html += '<button class="chip' + active + '" data-filter="s" data-val="' + e(s) + '">' + (SEASON_ICONS[s] || "") + " " + e(s) + "</button>";
    });
    html += "</div></div>";

    html += '<div class="secblock">';
    html += '<p class="seclabel">Time of Day</p>';
    html += '<div class="chiprow">';
    TIMES.forEach(function(t) {
      var active = self._fT === t ? " active" : "";
      html += '<button class="chip' + active + '" data-filter="t" data-val="' + e(t) + '">' + (TIME_ICONS[t] || "") + " " + e(t) + "</button>";
    });
    html += "</div></div>";

    html += '<div class="secblock">';
    html += '<p class="seclabel">Occasion</p>';
    html += '<div class="chiprow">';
    OCCASIONS.forEach(function(o) {
      var active = self._fO === o ? " active" : "";
      html += '<button class="chip' + active + '" data-filter="o" data-val="' + e(o) + '">' + (OCCASION_ICONS[o] || "") + " " + e(o) + "</button>";
    });
    html += "</div></div>";

    return html;
  }

  _dashboardHtml() {
    return (
      '<div class="body">' + this._filtersHtml() + "</div>" +
      '<div class="bottomnav">' +
        '<span class="navinfo">' + DB.length + " blends in library</span>" +
        '<div class="navbtns">' +
          '<button class="btn btnhome" data-action="browse">Browse All</button>' +
        "</div>" +
      "</div>"
    );
  }

  _listHtml() {
    var items = this._filtered();
    var q = this._q.trim();
    var info = q
      ? items.length + " result" + (items.length !== 1 ? "s" : "") + " for &ldquo;" + e(q) + "&rdquo;"
      : items.length + " blend" + (items.length !== 1 ? "s" : "") + " matched";

    var listHtml = "";
    if (items.length === 0) {
      listHtml = '<div class="empty"><div class="emptyicon">🔍</div><p style="font-size:13px">No blends match your filters.</p></div>';
    } else {
      listHtml = '<div class="blendlist">';
      items.forEach(function(d) {
        listHtml += (
          '<div class="blendcard" data-action="detail" data-id="' + d.id + '">' +
            '<span class="blendicon">' + d.icon + "</span>" +
            '<div class="blendinfo">' +
              '<div class="blendname">' + e(d.name) + "</div>" +
              '<div class="blendtags">' +
                '<span class="tag">' + e(d.season)   + "</span>" +
                '<span class="tag">' + e(d.time)     + "</span>" +
                '<span class="tag">' + e(d.occasion) + "</span>" +
              "</div>" +
            "</div>" +
            '<div class="starscol">' +
              '<span class="staricons">' + starsHtml(d.rating) + "</span>" +
              '<span class="starnum">'   + d.rating.toFixed(1) + "</span>" +
            "</div>" +
          "</div>"
        );
      });
      listHtml += "</div>";
    }

    return (
      '<div class="body">' +
        this._filtersHtml() +
        '<p class="seclabel" style="margin-top:4px">Results (' + items.length + ")</p>" +
        listHtml +
      "</div>" +
      '<div class="bottomnav">' +
        '<span class="navinfo">' + info + "</span>" +
        '<div class="navbtns">' +
          '<button class="btn btnback" data-action="home">&#8962; Home</button>' +
        "</div>" +
      "</div>"
    );
  }

  _detailHtml() {
    var d = this._item;
    if (!d) return "";

    var tags = (
      '<span class="tag">' + e(d.season)   + "</span>" +
      '<span class="tag">' + e(d.time)     + "</span>" +
      '<span class="tag">' + e(d.occasion) + "</span>"
    );

    var fragTagsHtml = "";
    d.fragrances.forEach(function(f) {
      fragTagsHtml += '<span class="fragtag">' + e(f) + "</span>";
    });

    var stepsHtml = "";
    d.steps.forEach(function(s, i) {
      stepsHtml += (
        '<div class="timelinenode">' +
          '<div class="timelinecircle">' + (i + 1) + "</div>" +
          '<div class="timelinecontent">' +
            '<div class="timelinefrag">' + e(s.f) + "</div>" +
            '<div class="timelinedetail">' +
              '<span class="timelinepill">💧 ' + e(s.v) + "</span>" +
              '<span class="timelinepill">📍 ' + e(s.z) + "</span>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    });

    return (
      '<div class="body">' +
        '<div class="detailhero">' +
          '<span class="detailicon">' + d.icon + "</span>" +
          '<div class="detailbody">' +
            '<div class="detailname">' + e(d.name) + "</div>" +
            '<div class="detailmeta">' + tags + "</div>" +
          "</div>" +
          '<div class="detailstars">' +
            '<span class="detailstaricons">' + starsHtml(d.rating) + "</span>" +
            '<span class="detailstarnum">'   + d.rating.toFixed(1) + "</span>" +
          "</div>" +
        "</div>" +
        '<p class="seclabel">Scent Profile</p>' +
        '<div class="infobox infobox-profile">' + e(d.profile) + "</div>" +
        '<p class="seclabel">Synergy Notes</p>' +
        '<div class="infobox infobox-synergy">' + e(d.synergy) + "</div>" +
        '<p class="seclabel">Fragrances Used</p>' +
        '<div class="fragtags">' + fragTagsHtml + "</div>" +
        '<p class="seclabel">Application Sequence</p>' +
        '<div class="timeline">' + stepsHtml + "</div>" +
      "</div>" +
      '<div class="bottomnav">' +
        '<span class="navinfo">' + d.fragrances.length + " fragrances &middot; " + d.steps.length + " steps</span>" +
        '<div class="navbtns">' +
          '<button class="btn btnback" data-action="back">&#8592; Back</button>' +
          '<button class="btn btnhome" data-action="home">&#8962; Home</button>' +
        "</div>" +
      "</div>"
    );
  }

  _exitHtml() {
    if (!this._exit) return "";
    return (
      '<div class="overlay">' +
        '<div class="toast">' +
          '<p class="toastp">Press back again to exit Home Assistant.</p>' +
          '<div class="toastbtns">' +
            '<button class="btnstay" data-action="stay">Stay</button>' +
            '<button class="btnexit" data-action="exit">Exit</button>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  _draw() {
    var h = (this._cfg && this._cfg.card_height) ? this._cfg.card_height : "400px";

    var viewHtml = "";
    if (this._view === "dashboard") viewHtml = this._dashboardHtml();
    else if (this._view === "list") viewHtml = this._listHtml();
    else if (this._view === "detail") viewHtml = this._detailHtml();

    var searchVal = this._q.replace(/"/g, "&quot;");

    this._shadow.innerHTML = (
      "<style>" + CSS + "</style>" +
      '<div class="shell" style="--fh:' + h + '">' +
        '<div class="searchbar">' +
          '<input class="searchinput" type="text" placeholder="Search blends, profiles, fragrances" value="' + searchVal + '" autocomplete="off" spellcheck="false">' +
        "</div>" +
        viewHtml +
        this._exitHtml() +
      "</div>"
    );

    this._attachEvents();
  }

  _attachEvents() {
    var self   = this;
    var shadow = this._shadow;

    var inp = shadow.querySelector(".searchinput");
    if (inp) {
      if (this._sfocus) {
        inp.focus();
        var len = inp.value.length;
        try { inp.setSelectionRange(len, len); } catch(ex) {}
      }
      inp.addEventListener("focus", function() { self._sfocus = true; });
      inp.addEventListener("blur",  function() { self._sfocus = false; });
      inp.addEventListener("input", function() {
        self._q = inp.value;
        self._sfocus = true;
        if (self._q.trim() && self._view === "dashboard") {
          self._view = "list";
          history.pushState({ fv: "list" }, "");
        }
        self._draw();
      });
    }

    shadow.addEventListener("click", function(ev) {
      var el = ev.target;
      while (el && el !== shadow) {
        var action = el.getAttribute("data-action");
        var filter = el.getAttribute("data-filter");

        if (action === "browse") {
          self._view = "list";
          history.pushState({ fv: "list" }, "");
          self._draw();
          return;
        }
        if (action === "home") {
          self._view = "dashboard";
          self._item = null;
          history.pushState({ fv: "dashboard" }, "");
          self._draw();
          return;
        }
        if (action === "back") {
          self._view = "list";
          self._item = null;
          history.pushState({ fv: "list" }, "");
          self._draw();
          return;
        }
        if (action === "detail") {
          var id = parseInt(el.getAttribute("data-id"), 10);
          var found = null;
          for (var i = 0; i < DB.length; i++) {
            if (DB[i].id === id) { found = DB[i]; break; }
          }
          if (found) {
            self._item = found;
            self._view = "detail";
            history.pushState({ fv: "detail" }, "");
            self._draw();
          }
          return;
        }
        if (action === "stay") {
          clearTimeout(self._etmr);
          self._exit = false;
          self._draw();
          return;
        }
        if (action === "exit") {
          self._exit = false;
          history.back();
          return;
        }
        if (filter) {
          var val = el.getAttribute("data-val");
          if (filter === "s") self._fS = self._fS === val ? null : val;
          if (filter === "t") self._fT = self._fT === val ? null : val;
          if (filter === "o") self._fO = self._fO === val ? null : val;
          if ((self._fS || self._fT || self._fO) && self._view === "dashboard") {
            self._view = "list";
            history.pushState({ fv: "list" }, "");
          }
          self._draw();
          return;
        }

        el = el.parentElement;
      }
    });
  }
}

if (!customElements.get("fragrance-explorer-card")) {
  customElements.define("fragrance-explorer-card", FragranceExplorerCard);
}
