/* Ball VS Ball — first measured roster calibration.
   Calibration: 2,600 initial battles + two mirrored samples of 2,600 battles.
   These coefficients reduce measured global outliers; matchup balance and all
   progression tiers still require further independent playtesting. */
(() => {
'use strict';
const rows=[
  [1.051,1.077], // 0: Szarża, v2 sample score 33.8%
  [1.054,1.083], // 1: Topór, v2 sample score 67.5%
  [1.059,1.089], // 2: Trujący kolec, v2 sample score 76.3%
  [1.104,1.160], // 3: Złodziej, v2 sample score 35%
  [1.031,1.048], // 4: Ostrze, v2 sample score 58.8%
  [1.037,1.055], // 5: Karabin, v2 sample score 72.5%
  [1.010,1.015], // 6: Pająk, v2 sample score 36.3%
  [0.993,0.990], // 7: Wampir, v2 sample score 52.5%
  [1.044,1.067], // 8: Włócznia, v2 sample score 28.8%
  [1.019,1.029], // 9: Rozbłysk, v2 sample score 81.3%
  [1.080,1.122], // 10: Szachy, v2 sample score 45%
  [1.067,1.102], // 11: Kostka, v2 sample score 26.3%
  [1.057,1.086], // 12: Lodowy Stożek, v2 sample score 36.3%
  [0.833,0.760], // 13: Laser, v2 sample score 42.5%
  [1.066,1.100], // 14: Wąż, v2 sample score 61.3%
  [1.082,1.126], // 15: Hak, v2 sample score 32.5%
  [1.062,1.094], // 16: Przekuwacz, v2 sample score 50%
  [0.874,0.816], // 17: Komórka, v2 sample score 80%
  [1.080,1.122], // 18: Elektryk, v2 sample score 41.3%
  [1.087,1.134], // 19: Strefa, v2 sample score 61.3%
  [0.917,0.878], // 20: Promień, v2 sample score 51.3%
  [1.094,1.144], // 21: WDC, v2 sample score 50%
  [0.932,0.899], // 22: Jabłko, v2 sample score 33.8%
  [1.091,1.141], // 23: Armata, v2 sample score 55%
  [1.025,1.039], // 24: Wirus, v2 sample score 32.5%
  [1.050,1.074], // 25: Wielki Kolec, v2 sample score 50%
  [1.062,1.094], // 26: Łuk, v2 sample score 20%
  [1.101,1.154], // 27: Król Elektryków, v2 sample score 61.3%
  [1.031,1.046], // 28: Zasięg, v2 sample score 53.8%
  [1.163,1.254], // 29: Mróz, v2 sample score 21.3%
  [1.068,1.104], // 30: Harpun, v2 sample score 27.5%
  [1.010,1.015], // 31: Rój, v2 sample score 73.8%
  [1.004,1.006], // 32: Eliksir, v2 sample score 43.8%
  [0.952,0.929], // 33: Konduktor, v2 sample score 75%
  [0.968,0.953], // 34: Czarny Pająk, v2 sample score 46.3%
  [1.033,1.050], // 35: Grób, v2 sample score 38.8%
  [1.025,1.037], // 36: Skrzydło Światła, v2 sample score 80%
  [0.996,0.993], // 37: Pudełko Cukierków, v2 sample score 37.5%
  [0.936,0.906], // 38: Szlam, v2 sample score 43.8%
  [1.089,1.138], // 39: Kajdany, v2 sample score 71.3%
  [1.049,1.075], // 40: Kwas, v2 sample score 50%
  [0.870,0.811], // 41: Promień Świetlny, v2 sample score 52.5%
  [1.059,1.089], // 42: Trujący Gaz, v2 sample score 53.8%
  [1.026,1.038], // 43: Shuriken, v2 sample score 58.8%
  [1.046,1.070], // 44: Fibonacci, v2 sample score 27.5%
  [0.822,0.746], // 45: Kaktus, v2 sample score 53.8%
  [0.978,0.967], // 46: Bomba, v2 sample score 60%
  [1.017,1.026], // 47: Orbita, v2 sample score 67.5%
  [0.946,0.919], // 48: Medyk, v2 sample score 66.3%
  [0.921,0.885], // 49: Prawda, v2 sample score 60%
  [1.018,1.028], // 50: Szkło, v2 sample score 68.8%
  [1.190,1.298], // 51: Portal, v2 sample score 65%
  [0.793,0.706], // 52: Tarcza, v2 sample score 52.5%
  [0.980,0.970], // 53: Magik, v2 sample score 58.8%
  [1.136,1.209], // 54: Chronos, v2 sample score 25%
  [1.151,1.236], // 55: Ninja, v2 sample score 50%
  [0.953,0.931], // 56: Pirat, v2 sample score 68.8%
  [1.031,1.048], // 57: Górnik, v2 sample score 36.3%
  [0.997,0.996], // 58: Szeryf, v2 sample score 65%
  [0.980,0.970], // 59: Magma, v2 sample score 58.8%
  [0.899,0.851], // 60: Plazma, v2 sample score 47.5%
  [1.046,1.068], // 61: Meteor, v2 sample score 37.5%
  [1.109,1.167], // 62: Cyklon, v2 sample score 55%
  [1.049,1.073], // 63: Pryzmat, v2 sample score 52.5%
  [0.997,0.995], // 64: Echo, v2 sample score 76.3%
  [1.094,1.145], // 65: Grawitacja, v2 sample score 61.3%
  [1.028,1.043], // 66: Kotwica, v2 sample score 25%
  [0.853,0.788], // 67: Lustro, v2 sample score 38.8%
  [0.983,0.974], // 68: Pustka, v2 sample score 51.3%
  [0.981,0.972], // 69: Słońce, v2 sample score 56.3%
  [1.014,1.021], // 70: Księżyc, v2 sample score 48.8%
  [1.132,1.205], // 71: Zaćmienie, v2 sample score 40%
  [0.922,0.886], // 72: Supernowa, v2 sample score 46.3%
  [1.047,1.071], // 73: Mgławica, v2 sample score 73.8%
  [1.059,1.089], // 74: Pulsar, v2 sample score 20%
  [0.908,0.865], // 75: Kwazar, v2 sample score 61.3%
  [0.961,0.942], // 76: Kometa, v2 sample score 48.8%
  [1.025,1.038], // 77: Asteroida, v2 sample score 66.3%
  [1.167,1.260], // 78: Kwant, v2 sample score 32.5%
  [1.055,1.085], // 79: Atom, v2 sample score 46.3%
  [1.099,1.154], // 80: Proton, v2 sample score 22.5%
  [0.887,0.836], // 81: Neutron, v2 sample score 42.5%
  [1.067,1.102], // 82: Elektron, v2 sample score 52.5%
  [1.062,1.094], // 83: Iskra, v2 sample score 38.8%
  [1.004,1.006], // 84: Piekło, v2 sample score 47.5%
  [1.019,1.029], // 85: Tsunami, v2 sample score 28.8%
  [1.082,1.126], // 86: Wstrząs, v2 sample score 47.5%
  [1.088,1.134], // 87: Nawałnica, v2 sample score 46.3%
  [1.107,1.163], // 88: Zamieć, v2 sample score 56.3%
  [0.939,0.912], // 89: Miraż, v2 sample score 43.8%
  [1.005,1.007], // 90: Widmo, v2 sample score 48.8%
  [1.133,1.206], // 91: Upiór, v2 sample score 33.8%
  [1.019,1.028], // 92: Zjawa, v2 sample score 61.3%
  [1.017,1.026], // 93: Kosiarz, v2 sample score 52.5%
  [1.036,1.054], // 94: Zagłada, v2 sample score 56.3%
  [0.981,0.972], // 95: Chaos, v2 sample score 52.5%
  [0.853,0.787], // 96: Porządek, v2 sample score 46.3%
  [0.988,0.982], // 97: Feniks, v2 sample score 57.5%
  [1.057,1.086], // 98: Kraken, v2 sample score 66.3%
  [1.130,1.201], // 99: Król Dyń, v2 sample score 60%
  [0.971,0.956], // 100: 🎃 Wiedźma, v2 sample score 12.5%
  [1.057,1.088], // 101: 🎃 Kocioł, v2 sample score 78.8%
  [1.187,1.294], // 102: 🎃 Czarny Kot, v2 sample score 21.3%
  [1.059,1.091], // 103: 🎃 Nietoperz, v2 sample score 32.5%
  [0.964,0.945], // 104: 🎃 Zombie, v2 sample score 52.5%
  [1.039,1.058], // 105: 🎃 Voodoo, v2 sample score 63.8%
  [1.039,1.061], // 106: 🎃 Strach na Wróble, v2 sample score 57.5%
  [1.065,1.100], // 107: 🎃 Ognik, v2 sample score 42.5%
  [1.008,1.012], // 108: 🎃 Wilkołak, v2 sample score 63.8%
  [1.058,1.087], // 109: 🎃 Banshee, v2 sample score 48.8%
  [0.816,0.737], // 110: 🎃 Golem Cmentarny, v2 sample score 43.8%
  [1.081,1.124], // 111: 🎃 Krwawy Księżyc, v2 sample score 42.5%
  [0.972,0.956], // 112: 🎃 Duch Latarni, v2 sample score 55%
  [0.780,0.700], // 113: 🎃 Mumia, v2 sample score 58.8%
  [0.879,0.823], // 114: 🎃 Gargulec, v2 sample score 31.3%
  [1.094,1.145], // 115: 🎃 Nekromanta, v2 sample score 53.8%
  [0.874,0.818], // 116: 🎃 Przeklęte Lustro, v2 sample score 51.3%
  [1.004,1.006], // 117: 🎃 Pająk Wdowa, v2 sample score 51.3%
  [0.963,0.944], // 118: 🎃 Jeździec Bez Głowy, v2 sample score 66.3%
  [0.984,0.975], // 119: 🎃 Żniwiarz Dusz, v2 sample score 47.5%
  [1.068,1.104], // 120: 🎃 Dzwon Północy, v2 sample score 57.5%
  [1.051,1.078], // 121: 🎃 Lodowy Upiór, v2 sample score 45%
  [1.073,1.110], // 122: 🎃 Królowa Kruków, v2 sample score 28.8%
  [1.016,1.027], // 123: 🎃 Zgniła Dynia, v2 sample score 63.8%
  [0.811,0.729], // 124: 🎃 Widmowy Rycerz, v2 sample score 65%
  [1.020,1.030], // 125: 🎃 Cukierkowy Koszmar, v2 sample score 26.3%
  [1.166,1.258], // 126: 🎃 Księżycowy Nietoperz, v2 sample score 65%
  [1.025,1.038], // 127: 🎃 Grobowy Alchemik, v2 sample score 43.8%
  [1.055,1.084], // 128: 🎃 Płacząca Marionetka, v2 sample score 27.5%
  [1.003,1.004], // 129: 🎃 Kryształ Zaświatów, v2 sample score 72.5%
];
const calibration=Object.freeze(rows.map(([hp,damage],id)=>Object.freeze({id,hp,damage})));
if(calibration.length!==130)throw new Error('Expected 130 balance coefficients');
const api={version:3,enabled:true,tempoHp:1.45,calibrationGames:7800,calibration};
const previousStats=getBallStats;
getBallStats=function(id,...args){
 const stats=previousStats(id,...args),entry=calibration[id];
 if(!api.enabled||!entry)return stats;
 stats.hp=Math.max(1,Math.round(stats.hp*api.tempoHp*entry.hp));
 stats.dmg=Math.max(1,Math.round(stats.dmg*entry.damage));
 stats.balance={version:api.version,hp:entry.hp,damage:entry.damage,tempoHp:api.tempoHp};
 return stats;
};
window.BVBBalance=api;
})();
