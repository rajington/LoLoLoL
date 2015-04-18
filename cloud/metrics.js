module.exports = exports = metrics = [
  {
    key: "champion",
    derived: true,
    display: "title",
    important: true,
    unit: false,
    collections: ["champions"]
  },
  // {
  //   key: "item",
  //   derived: true,
  //   display: "title",
  //   important: true,
  //   unit: false,
  //   collections: ["items"]
  // },
  {
    key: "sentientKills",
    derived: true,
    important: true,
    unit: 'total Per Match',
    collections: ["champions"]
  },
  {
  	key: "minionsKilled",
    title: "Lane Sentient Kills",
    important: true,
  	collections: ["champions"]
  },
  {
  	key: "neutralMinionsKilled",
    title: "Jungle Sentient Kills",
    important: true,
  	collections: ["champions"]
  },
  {
  	key: "baronKills",
    important: true,
    collections: ["champions"]
  },
  {
  	key: "dragonKills",
    important: true,
    collections: ["champions"]
  },
  {
  	key: "neutralMinionsKilledTeamJungle",
    title: "Team's Jungle Sentient Kills",
    collections: ["champions"]
  },
  {
  	key: "neutralMinionsKilledEnemyJungle",
    title: "Enemy's Jungle Sentient Kills",
    collections: ["champions"]
  },
  {
  	key: "towerKills",
    collections: ["champions"]
  },
  {
  	key: "inhibitorKills",
    collections: ["champions"]
  },
  {
  	key: "firstBaron",
    title: 'First Baron Secured',
    display: 'percentage',
    unit: "%",
  	collections: ["champions"]
  },
  {
  	key: "firstBloodKill",
    title: 'First Blood Killed',
    display: 'percentage',
    unit: "%",
  	collections: ["champions"]
  },
  {
  	key: "firstDragon",
    title: 'First Dragon Secured',
    display: 'percentage',
    unit: "%",
  	collections: ["champions"]
  },
  {
  	key: "firstInhibitorKill",
    title: 'Killed First Inhibitor',
    display: 'percentage',
    unit: "%",
  	collections: ["champions"]
  },
  {
  	key: "firstInhibitorAssist",
    title: 'Assisted Killing First Inhibitor',
    display: 'percentage',
    unit: "%",
  	collections: ["champions"]
  },
  {
  	key: "firstTowerAssist",
    title: 'Assisted Killing First Tower',
    display: 'percentage',
    unit: "%",
  	collections: ["champions"]
  },
  {
  	key: "firstTowerKill",
    title: 'Killed First Tower',
    display: 'percentage',
    unit: "%",
  	collections: ["champions"]
  },
  {
  	key: "champLevel",
    title: 'Champion Level',
    unit: 'average',
  	collections: ["champions"]
  },
  {
  	key: "samples",
    title: "Picks",
    display: 'k',
    unit: 'total',
  	collections: ["champions"]
  },
  {
  	key: "pickRate",
    derived: true,
    display: 'percentage',
    unit: "%",
  	collections: ["champions"]
  },
  {
  	key: "bans",
    display: 'k',
    unit: 'total',
  	collections: ["champions"]
  },
  {
  	key: "banRate",
    derived: true,
    display: 'percentage',
    unit: "%",
  	collections: ["champions"]
  },
  {
  	key: "winner",
    title: 'Win Rate',
    display: 'percentage',
    unit: "%",
  	collections: ["champions"]
  },
  {
  	key: "kills",
    collections: ["champions"]
  },
  {
  	key: "deaths",
    collections: ["champions"]
  },
  {
  	key: "assists",
    collections: ["champions"]
  },
  {
  	key: "killingSprees",
    collections: ["champions"]
  },
  {
  	key: "largestKillingSpree",
    unit: 'average',
  	collections: ["champions"]
  },
  {
  	key: "pentaKills",
    display: 'perThousandMatches',
    unit: 'per 1000 matches',
    collections: ["champions"]
  },
  {
  	key: "largestMultiKill",
    unit: 'average',
  	collections: ["champions"]
  },
  {
  	key: "wardsPlaced",
    collections: ["champions"]
  },
  {
  	key: "wardsKilled",
    collections: ["champions"]
  },
  {
  	key: "goldSpent",
    display: 'k',
    collections: ["champions"]
  },
  {
  	key: "goldEarned",
    display: 'k',
    collections: ["champions"]
  },
  {
  	key: "magicDamageDealt",
    display: 'k',
    collections: ["champions"]
  },
  {
  	key: "magicDamageDealtToChampions",
    display: 'k',
    collections: ["champions"]
  },
  {
  	key: "physicalDamageDealt",
    display: 'k',
    collections: ["champions"]
  },
  {
  	key: "physicalDamageDealtToChampions",
    display: 'k',
    collections: ["champions"]
  },
  {
  	key: "largestCriticalStrike",
    unit: 'average',
    collections: ["champions"]
  },
  {
  	key: "trueDamageDealt",
    display: 'k',
    collections: ["champions"]
  },
  {
  	key: "trueDamageDealtToChampions",
    display: 'k',
    collections: ["champions"]
  },
  {
  	key: "totalDamageDealt",
    display: 'k',
    collections: ["champions"]
  },
  {
  	key: "totalDamageDealtToChampions",
    display: 'k',
  	collections: ["champions"]
  },
  {
  	key: "totalTimeCrowdControlDealt",
    display: 'k',
  	collections: ["champions"]
  },
  {
  	key: "magicDamageTaken",
    display: 'k',
  	collections: ["champions"]
  },
  {
  	key: "physicalDamageTaken",
    display: 'k',
  	collections: ["champions"]
  },
  {
  	key: "trueDamageTaken",
    display: 'k',
  	collections: ["champions"]
  },
  {
  	key: "totalDamageTaken",
    display: 'k',
  	collections: ["champions"]
  },
  {
  	key: "totalHeal",
    display: 'k',
  	collections: ["champions"]
  },
  {
  	key: "totalUnitsHealed",
  	collections: ["champions"]
  }
];
