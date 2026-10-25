/* Ball VS Ball — first measured roster calibration.
   Calibration: 2,600 initial battles + 2,600 mirrored target-tempo battles.
   These coefficients reduce measured global outliers; matchup balance and all
   progression tiers still require further independent playtesting. */
(() => {
'use strict';
const rows=[
  [1.024,1.036], // 0: Szarża, tempo sample score 35%
  [1.084,1.129], // 1: Topór, tempo sample score 61.3%
  [1.104,1.160], // 2: Trujący kolec, tempo sample score 58.8%
  [1.078,1.119], // 3: Złodziej, tempo sample score 83.8%
  [1.046,1.070], // 4: Ostrze, tempo sample score 41.3%
  [1.075,1.114], // 5: Karabin, tempo sample score 5%
  [0.988,0.982], // 6: Pająk, tempo sample score 90%
  [0.997,0.996], // 7: Wampir, tempo sample score 51.3%
  [1.009,1.014], // 8: Włócznia, tempo sample score 56.3%
  [1.071,1.109], // 9: Rozbłysk, tempo sample score 41.3%
  [1.071,1.109], // 10: Szachy, tempo sample score 31.3%
  [1.027,1.041], // 11: Kostka, tempo sample score 33.8%
  [1.034,1.051], // 12: Lodowy Stożek, tempo sample score 81.3%
  [0.823,0.746], // 13: Laser, tempo sample score 36.3%
  [1.085,1.130], // 14: Wąż, tempo sample score 81.3%
  [1.052,1.080], // 15: Hak, tempo sample score 73.8%
  [1.062,1.094], // 16: Przekuwacz, tempo sample score 30%
  [0.917,0.877], // 17: Komórka, tempo sample score 21.3%
  [1.065,1.099], // 18: Elektryk, tempo sample score 48.8%
  [1.107,1.165], // 19: Strefa, tempo sample score 52.5%
  [0.919,0.881], // 20: Promień, tempo sample score 10%
  [1.094,1.144], // 21: WDC, tempo sample score 62.5%
  [0.908,0.865], // 22: Jabłko, tempo sample score 5%
  [1.100,1.155], // 23: Armata, tempo sample score 60%
  [0.997,0.996], // 24: Wirus, tempo sample score 41.3%
  [1.050,1.074], // 25: Wielki Kolec, tempo sample score 65%
  [1.012,1.018], // 26: Łuk, tempo sample score 70%
  [1.121,1.186], // 27: Król Elektryków, tempo sample score 32.5%
  [1.037,1.055], // 28: Zasięg, tempo sample score 65%
  [1.111,1.170], // 29: Mróz, tempo sample score 66.3%
  [1.030,1.046], // 30: Harpun, tempo sample score 87.5%
  [1.049,1.075], // 31: Rój, tempo sample score 75%
  [0.994,0.991], // 32: Eliksir, tempo sample score 72.5%
  [0.991,0.986], // 33: Konduktor, tempo sample score 38.8%
  [0.962,0.944], // 34: Czarny Pająk, tempo sample score 36.3%
  [1.015,1.022], // 35: Grób, tempo sample score 28.8%
  [1.075,1.114], // 36: Skrzydło Światła, tempo sample score 35%
  [0.976,0.964], // 37: Pudełko Cukierków, tempo sample score 85%
  [0.927,0.893], // 38: Szlam, tempo sample score 26.3%
  [1.127,1.198], // 39: Kajdany, tempo sample score 20%
  [1.049,1.075], // 40: Kwas, tempo sample score 70%
  [0.873,0.816], // 41: Promień Świetlny, tempo sample score 21.3%
  [1.065,1.099], // 42: Trujący Gaz, tempo sample score 73.8%
  [1.040,1.060], // 43: Shuriken, tempo sample score 33.8%
  [1.009,1.014], // 44: Fibonacci, tempo sample score 86.3%
  [0.827,0.753], // 45: Kaktus, tempo sample score 48.8%
  [0.994,0.991], // 46: Bomba, tempo sample score 37.5%
  [1.046,1.070], // 47: Orbita, tempo sample score 41.3%
  [0.971,0.956], // 48: Medyk, tempo sample score 12.5%
  [0.936,0.906], // 49: Prawda, tempo sample score 37.5%
  [1.049,1.075], // 50: Szkło, tempo sample score 40%
  [1.219,1.346], // 51: Portal, tempo sample score 52.5%
  [0.796,0.710], // 52: Tarcza, tempo sample score 55%
  [0.994,0.991], // 53: Magik, tempo sample score 42.5%
  [1.091,1.139], // 54: Chronos, tempo sample score 68.8%
  [1.151,1.236], // 55: Ninja, tempo sample score 76.3%
  [0.982,0.974], // 56: Pirat, tempo sample score 47.5%
  [1.009,1.014], // 57: Górnik, tempo sample score 56.3%
  [1.021,1.033], // 58: Szeryf, tempo sample score 21.3%
  [0.994,0.991], // 59: Magma, tempo sample score 37.5%
  [0.895,0.846], // 60: Plazma, tempo sample score 31.3%
  [1.025,1.036], // 61: Meteor, tempo sample score 75%
  [1.118,1.181], // 62: Cyklon, tempo sample score 38.8%
  [1.053,1.079], // 63: Pryzmat, tempo sample score 58.8%
  [1.040,1.060], // 64: Echo, tempo sample score 33.8%
  [1.114,1.176], // 65: Grawitacja, tempo sample score 50%
  [0.988,0.982], // 66: Kotwica, tempo sample score 65%
  [0.838,0.767], // 67: Lustro, tempo sample score 33.8%
  [0.985,0.977], // 68: Pustka, tempo sample score 41.3%
  [0.991,0.987], // 69: Słońce, tempo sample score 28.8%
  [1.012,1.018], // 70: Księżyc, tempo sample score 40%
  [1.114,1.176], // 71: Zaćmienie, tempo sample score 80%
  [0.916,0.878], // 72: Supernowa, tempo sample score 46.3%
  [1.088,1.134], // 73: Mgławica, tempo sample score 20%
  [1.009,1.013], // 74: Pulsar, tempo sample score 61.3%
  [0.925,0.889], // 75: Kwazar, tempo sample score 7.5%
  [0.959,0.939], // 76: Kometa, tempo sample score 37.5%
  [1.052,1.079], // 77: Asteroida, tempo sample score 53.8%
  [1.135,1.208], // 78: Kwant, tempo sample score 77.5%
  [1.049,1.075], // 79: Atom, tempo sample score 50%
  [1.052,1.080], // 80: Proton, tempo sample score 83.8%
  [0.876,0.821], // 81: Neutron, tempo sample score 45%
  [1.071,1.109], // 82: Elektron, tempo sample score 26.3%
  [1.043,1.065], // 83: Iskra, tempo sample score 72.5%
  [1.000,1.000], // 84: Piekło, tempo sample score 40%
  [0.985,0.978], // 85: Tsunami, tempo sample score 81.3%
  [1.078,1.119], // 86: Wstrząs, tempo sample score 53.8%
  [1.081,1.124], // 87: Nawałnica, tempo sample score 92.5%
  [1.118,1.181], // 88: Zamieć, tempo sample score 28.8%
  [0.930,0.898], // 89: Miraż, tempo sample score 40%
  [1.003,1.004], // 90: Widmo, tempo sample score 3.8%
  [1.104,1.160], // 91: Upiór, tempo sample score 93.8%
  [1.037,1.056], // 92: Zjawa, tempo sample score 75%
  [1.021,1.032], // 93: Kosiarz, tempo sample score 41.3%
  [1.046,1.070], // 94: Zagłada, tempo sample score 26.3%
  [0.985,0.978], // 95: Chaos, tempo sample score 46.3%
  [0.848,0.780], // 96: Porządek, tempo sample score 43.8%
  [1.000,1.000], // 97: Feniks, tempo sample score 25%
  [1.085,1.129], // 98: Kraken, tempo sample score 46.3%
  [1.148,1.230], // 99: Król Dyń, tempo sample score 72.5%
  [0.914,0.874], // 100: 🎃 Wiedźma, tempo sample score 52.5%
  [1.107,1.166], // 101: 🎃 Kocioł, tempo sample score 17.5%
  [1.134,1.208], // 102: 🎃 Czarny Kot, tempo sample score 87.5%
  [1.030,1.046], // 103: 🎃 Nietoperz, tempo sample score 92.5%
  [0.968,0.951], // 104: 🎃 Zombie, tempo sample score 18.8%
  [1.062,1.094], // 105: 🎃 Voodoo, tempo sample score 50%
  [1.052,1.080], // 106: 🎃 Strach na Wróble, tempo sample score 38.8%
  [1.052,1.080], // 107: 🎃 Ognik, tempo sample score 73.8%
  [1.030,1.046], // 108: 🎃 Wilkołak, tempo sample score 57.5%
  [1.056,1.084], // 109: 🎃 Banshee, tempo sample score 52.5%
  [0.808,0.726], // 110: 🎃 Golem Cmentarny, tempo sample score 63.8%
  [1.068,1.104], // 111: 🎃 Krwawy Księżyc, tempo sample score 67.5%
  [0.980,0.968], // 112: 🎃 Duch Latarni, tempo sample score 13.8%
  [0.791,0.704], // 113: 🎃 Mumia, tempo sample score 52.5%
  [0.853,0.787], // 114: 🎃 Gargulec, tempo sample score 51.3%
  [1.101,1.155], // 115: 🎃 Nekromanta, tempo sample score 55%
  [0.876,0.820], // 116: 🎃 Przeklęte Lustro, tempo sample score 50%
  [1.006,1.009], // 117: 🎃 Pająk Wdowa, tempo sample score 62.5%
  [0.988,0.982], // 118: 🎃 Jeździec Bez Głowy, tempo sample score 15%
  [0.980,0.969], // 119: 🎃 Żniwiarz Dusz, tempo sample score 93.8%
  [1.081,1.124], // 120: 🎃 Dzwon Północy, tempo sample score 47.5%
  [1.043,1.065], // 121: 🎃 Lodowy Upiór, tempo sample score 62.5%
  [1.037,1.055], // 122: 🎃 Królowa Kruków, tempo sample score 60%
  [1.039,1.061], // 123: 🎃 Zgniła Dynia, tempo sample score 43.8%
  [0.831,0.756], // 124: 🎃 Widmowy Rycerz, tempo sample score 37.5%
  [0.982,0.973], // 125: 🎃 Cukierkowy Koszmar, tempo sample score 72.5%
  [1.194,1.304], // 126: 🎃 Księżycowy Nietoperz, tempo sample score 46.3%
  [1.015,1.023], // 127: 🎃 Grobowy Alchemik, tempo sample score 38.8%
  [1.018,1.027], // 128: 🎃 Płacząca Marionetka, tempo sample score 67.5%
  [1.040,1.060], // 129: 🎃 Kryształ Zaświatów, tempo sample score 33.8%
];
const calibration=Object.freeze(rows.map(([hp,damage],id)=>Object.freeze({id,hp,damage})));
if(calibration.length!==130)throw new Error('Expected 130 balance coefficients');
const api={version:2,enabled:true,tempoHp:1.45,calibrationGames:5200,calibration};
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
