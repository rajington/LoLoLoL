module.exports = exports = metrics = [
  {
    key: 'champion',
    derived: true,
    display: 'title',
    important: true,
    unit: false,
    collections: ['champions']
  },
  {
    key: 'item',
    derived: true,
    display: 'title',
    important: true,
    unit: false,
    collections: ['items']
  },
  {
    key: 'regionTier',
    title: 'Region/Tier',
    derived: true,
    display: 'title',
    important: true,
    unit: false,
    collections: ['regionTiers']
  },
  {
    key: 'sentientKills',
    derived: true,
    important: true,
    unit: 'total Per Match',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'minionsKilled',
    title: 'Lane Sentient Kills',
    important: true,
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'neutralMinionsKilled',
    title: 'Jungle Sentient Kills',
    important: true,
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'baronKills',
    important: true,
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'dragonKills',
    important: true,
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'neutralMinionsKilledTeamJungle',
    title: 'Team\'s Jungle Sentient Kills',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'neutralMinionsKilledEnemyJungle',
    title: 'Enemy\'s Jungle Sentient Kills',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'towerKills',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'inhibitorKills',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'firstBaron',
    title: 'First Baron Secured',
    display: 'percentage',
    unit: '%',
  	collections: ['champions']
  },
  {
  	key: 'firstBloodKill',
    title: 'First Blood Killed',
    display: 'percentage',
    unit: '%',
  	collections: ['champions']
  },
  {
  	key: 'firstDragon',
    title: 'First Dragon Secured',
    display: 'percentage',
    unit: '%',
  	collections: ['champions']
  },
  {
  	key: 'firstInhibitorKill',
    title: 'Killed First Inhibitor',
    display: 'percentage',
    unit: '%',
  	collections: ['champions']
  },
  {
  	key: 'firstInhibitorAssist',
    title: 'Assisted Killing First Inhibitor',
    display: 'percentage',
    unit: '%',
  	collections: ['champions']
  },
  {
  	key: 'firstTowerAssist',
    title: 'Assisted Killing First Tower',
    display: 'percentage',
    unit: '%',
  	collections: ['champions']
  },
  {
  	key: 'firstTowerKill',
    title: 'Killed First Tower',
    display: 'percentage',
    unit: '%',
  	collections: ['champions']
  },
  {
  	key: 'champLevel',
    title: 'Champion Level',
    unit: 'average',
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'samples',
    title: 'Picks',
    display: 'k',
    unit: 'total',
  	collections: ['champions']
  },
  {
  	key: 'pickRate',
    derived: true,
    display: 'percentage',
    unit: '%',
  	collections: ['champions']
  },
  {
  	key: 'bans',
    display: 'k',
    unit: 'total',
  	collections: ['champions']
  },
  {
  	key: 'banRate',
    derived: true,
    display: 'percentage',
    unit: '%',
  	collections: ['champions']
  },
  {
  	key: 'winner',
    title: 'Win Rate',
    display: 'percentage',
    unit: '%',
  	collections: ['champions', 'items']
  },
  {
  	key: 'kills',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'deaths',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'assists',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'killingSprees',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'largestKillingSpree',
    unit: 'average',
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'pentaKills',
    display: 'perThousandMatches',
    unit: 'per 1000 matches',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'largestMultiKill',
    unit: 'average',
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'wardsPlaced',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'wardsKilled',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'goldSpent',
    display: 'k',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'goldEarned',
    display: 'k',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'magicDamageDealt',
    display: 'k',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'magicDamageDealtToChampions',
    display: 'k',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'physicalDamageDealt',
    display: 'k',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'physicalDamageDealtToChampions',
    display: 'k',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'largestCriticalStrike',
    unit: 'average',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'trueDamageDealt',
    display: 'k',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'trueDamageDealtToChampions',
    display: 'k',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'totalDamageDealt',
    display: 'k',
    collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'totalDamageDealtToChampions',
    display: 'k',
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'totalTimeCrowdControlDealt',
    display: 'k',
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'magicDamageTaken',
    display: 'k',
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'physicalDamageTaken',
    display: 'k',
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'trueDamageTaken',
    display: 'k',
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'totalDamageTaken',
    display: 'k',
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'totalHeal',
    display: 'k',
  	collections: ['champions', 'items', 'regionTiers']
  },
  {
  	key: 'totalUnitsHealed',
  	collections: ['champions', 'items', 'regionTiers']
  }
];
