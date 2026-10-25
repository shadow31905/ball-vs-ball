# Ball VS Ball — measured roster calibration

`bvb-balance.js`, table version 2, applies explicit HP and DMG coefficients to all 130 IDs. A global HP multiplier of 1.45 increases normal battle length. Evolution and upgrade multipliers remain in the underlying stats pipeline; displayed HP/DMG include the calibration. Cooldowns and movement are unchanged by this module.

The table was fitted using 2,600 initial full-engine battles, then a damped correction from 2,600 mirrored battles at the target tempo. This is a first measured calibration, not a claim of complete balance.

## Independent validation

Control and calibrated builds each ran **2,600 full-engine battles**, with identical seed base `200000`, opponent offset `9`, mirrored starting sides, V1 balls, no upgrades, level 4 AI for both sides, balanced tactics and six arenas. Each ball played 40 games against 20 distinct opponents. The validation seeds and opponent offsets were excluded from coefficient fitting. Draws count as half a point in `scoreRate`.

| Metric | Control | Calibration v2 |
|---|---:|---:|
| Median battle length | 22.82 s | 32.27 s |
| 10th percentile duration | 12.73 s | 20.50 s |
| 90th percentile duration | 41.03 s | 60.02 s |
| Time-limit decisions | 60 / 2600 | 261 / 2600 |
| Battles below 30 seconds | 1869 / 2600 | 1059 / 2600 |
| Lowest / highest roster score rate | 2.5% / 97.5% | 12.5% / 81.3% |
| Balls outside 25–75% score rate | 33 | 12 |
| Mean absolute distance from 50% | 17.77 percentage points | 12.12 percentage points |

The measured spread improves substantially and the median reaches the intended duration range. **Ten percent of games still end at the time limit**, and approximately 41% finish before 30 seconds. Defensive matchups, the remaining outliers, progression tiers, bosses and human play need further validation. Forty games per ball cannot establish precise individual win rates, and this sample does not cover every possible matchup.

The 60.02-second reported maximum is the fixed-step boundary at the 60-second round limit. No new invulnerability period or minimum-duration gate was introduced.

## Reproduction

Run the same holdout sample from the repository root:

```powershell
$env:BVB_BALANCE_GAMES='2600'
$env:BVB_BALANCE_SEED='200000'
$env:BVB_BALANCE_OFFSET='9'
$env:BVB_BALANCE_OUT='balance-report.json'
node tests/balance.cjs
```

For the control, also set `$env:BVB_BALANCE_DISABLE='1'`. Remove that variable for the calibrated run. Reports include results for each fight and each ball. New runs also record coefficient metadata and SHA-256 hashes of simulation source files for reproducibility.

`node --test tests/balance.test.cjs` checks complete coefficient coverage, progression-aware repeatable stat scaling and deterministic full-engine combat. This harness runs actual simulation code without DOM rendering; browser, device and network testing remain separate requirements.
