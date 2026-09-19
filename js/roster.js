(function (global) {
  let byUnit = {
    offense: {},
    defense: {},
    specialTeams: {},
    reserves: {},
  };

  function indexUnit(unitName, unit) {
    const map = {};
    (unit.positions || []).forEach(function (entry) {
      map[entry.position] = entry.depth.slice();
    });
    byUnit[unitName] = map;
  }

  function load() {
    const data = global.DEPTH_CHART;
    if (!data || !data.units) {
      throw new Error("DEPTH_CHART is missing; js/roster-data.js failed to load");
    }
    indexUnit("offense", data.units.offense);
    indexUnit("defense", data.units.defense);
    if (data.units.specialTeams) indexUnit("specialTeams", data.units.specialTeams);
    if (data.units.reserves) indexUnit("reserves", data.units.reserves);
    return data;
  }

  function getPlayers(unit, slot) {
    const map = byUnit[unit] || {};
    return map[slot] || [];
  }

  function getPlayerAt(unit, slot, rank) {
    const players = getPlayers(unit, slot);
    if (!players.length) return null;
    const index = Math.min(rank, players.length - 1);
    return players[index];
  }

  global.Roster = {
    load: load,
    getPlayers: getPlayers,
    getPlayerAt: getPlayerAt,
  };
})(window);
