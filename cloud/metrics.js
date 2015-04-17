module.exports = exports = metrics = [
  {
    key: "name",
    type: "name",
    source: "static",
    important: true,
    collections: ["champions"]
  },
  {
    key: "minionsKilled",
    title: "Total Sentient Kills",
    type: "totalSentientKillsPerGame",
    derived: true,
    important: true,
    collections: ["champions"]
  },
  {
  	key: "champLevel",
  	collections: ["champions"]
  },
  {
  	key: "samples",
  	collections: ["champions"]
  },
  {
  	key: "bans",
  	collections: ["champions"]
  },
  {
  	key: "bans",
    title: "Ban Rate",
    type: "percentage",
    derived: true,
  	collections: ["champions"]
  },
  {
  	key: "winner",
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
  	collections: ["champions"]
  },
  {
  	key: "pentaKills",
  	collections: ["champions"]
  },
  {
  	key: "largestMultiKill",
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
  	collections: ["champions"]
  },
  {
  	key: "goldEarned",
  	collections: ["champions"]
  },
  {
  	key: "magicDamageDealt",
  	collections: ["champions"]
  },
  {
  	key: "magicDamageDealtToChampions",
  	collections: ["champions"]
  },
  {
  	key: "physicalDamageDealt",
  	collections: ["champions"]
  },
  {
  	key: "physicalDamageDealtToChampions",
  	collections: ["champions"]
  },
  {
  	key: "largestCriticalStrike",
  	collections: ["champions"]
  },
  {
  	key: "trueDamageDealt",
  	collections: ["champions"]
  },
  {
  	key: "trueDamageDealtToChampions",
  	collections: ["champions"]
  },
  {
  	key: "totalDamageDealt",
  	collections: ["champions"]
  },
  {
  	key: "totalDamageDealtToChampions",
  	collections: ["champions"]
  },
  {
  	key: "totalTimeCrowdControlDealt",
  	collections: ["champions"]
  },
  {
  	key: "magicDamageTaken",
  	collections: ["champions"]
  },
  {
  	key: "physicalDamageTaken",
  	collections: ["champions"]
  },
  {
  	key: "trueDamageTaken",
  	collections: ["champions"]
  },
  {
  	key: "totalDamageTaken",
  	collections: ["champions"]
  },
  {
  	key: "totalHeal",
  	collections: ["champions"]
  },
  {
  	key: "totalUnitsHealed",
  	collections: ["champions"]
  },
  {
  	key: "minionsKilled",
    title: "Lane Sentient Kills",
    type: "perGame",
    important: true,
  	collections: ["champions"]
  },
  {
  	key: "neutralMinionsKilled",
    title: "Jungle Sentient Kills",
    type: "perGame",
    important: true,
  	collections: ["champions"]
  },
  {
  	key: "baronKills",
    important: true,
    type: "perGame",
  	collections: ["champions"]
  },
  {
  	key: "dragonKills",
    important: true,
    type: "perGame",
  	collections: ["champions"]
  },
  {
  	key: "neutralMinionsKilledEnemyJungle",
  	collections: ["champions"]
  },
  {
  	key: "neutralMinionsKilledTeamJungle",
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
  	collections: ["champions"]
  },
  {
  	key: "firstBloodKill",
  	collections: ["champions"]
  },
  {
  	key: "firstDragon",
  	collections: ["champions"]
  },
  {
  	key: "firstInhibitorAssist",
  	collections: ["champions"]
  },
  {
  	key: "firstInhibitorKill",
  	collections: ["champions"]
  },
  {
  	key: "firstTowerAssist",
  	collections: ["champions"]
  },
  {
  	key: "firstTowerKill",
  	collections: ["champions"]
  },

];
