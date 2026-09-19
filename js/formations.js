(function (global) {
  const C = 26.665;
  const LT = 20.7;
  const LG = 23.7;
  const RG = 29.63;
  const RT = 32.63;

  const ol = [
    { slot: "LT", x: LT, depth: 0 },
    { slot: "LG", x: LG, depth: 0 },
    { slot: "C", x: C, depth: 0 },
    { slot: "RG", x: RG, depth: 0 },
    { slot: "RT", x: RT, depth: 0 },
  ];

  const dl = [
    { slot: "LDE", x: 20.4, depth: 1, align: "DE" },
    { slot: "LDT", x: 24.3, depth: 1, align: "DT" },
    { slot: "RDT", x: 29.0, depth: 1, align: "DT" },
    { slot: "RDE", x: 33.3, depth: 1, align: "DE" },
  ];

  global.FORMATIONS = {
    offense: {
      "base-spread-2x2": {
        name: "Base Spread 2x2",
        spots: ol.concat([
          { slot: "QB", x: C, depth: 5 },
          { slot: "RB", x: 24.1, depth: 6 },
          { slot: "WR-X", x: 3.4, depth: 0.5, align: "X" },
          { slot: "WR-SL", x: 16.2, depth: 1, align: "SL" },
          { slot: "TE", x: 35.0, depth: 0.3 },
          { slot: "WR-Z", x: 49.9, depth: 0.5, align: "Z" },
        ]),
      },
      "trips-right": {
        name: "Trips Right",
        spots: ol.concat([
          { slot: "QB", x: C, depth: 5 },
          { slot: "RB", x: 23.8, depth: 6 },
          { slot: "WR-X", x: 3.4, depth: 0.5, align: "X" },
          { slot: "TE", x: 35.4, depth: 1 },
          { slot: "WR-SL", x: 42.2, depth: 1, align: "SL" },
          { slot: "WR-Z", x: 50.2, depth: 0.5, align: "Z" },
        ]),
      },
      "empty-3x2": {
        name: "Empty 3x2",
        spots: ol.concat([
          { slot: "QB", x: C, depth: 5 },
          { slot: "WR-X", x: 3.2, depth: 0.5, align: "X" },
          { slot: "WR-SL", x: 12.4, depth: 1, align: "SL" },
          { slot: "RB", x: 17.6, depth: 1, align: "H" },
          { slot: "TE", x: 36.2, depth: 1 },
          { slot: "WR-Z", x: 50.2, depth: 0.5, align: "Z" },
        ]),
      },
    },
    defense: {
      "base-over": {
        name: "Base Over",
        spots: dl.concat([
          { slot: "WLB", x: 21.2, depth: 5 },
          { slot: "MLB", x: 30.6, depth: 5 },
          { slot: "LCB", x: 3.6, depth: 6, align: "CB" },
          { slot: "NB", x: 16.0, depth: 6 },
          { slot: "SS", x: 37.8, depth: 8 },
          { slot: "RCB", x: 49.8, depth: 6, align: "CB" },
          { slot: "FS", x: C, depth: 13 },
        ]),
      },
      "nickel-blitz": {
        name: "Nickel Blitz",
        spots: dl.concat([
          { slot: "NB", x: 17.2, depth: 1 },
          { slot: "WLB", x: 22.0, depth: 4 },
          { slot: "MLB", x: 31.2, depth: 4 },
          { slot: "LCB", x: 3.4, depth: 1, align: "CB" },
          { slot: "RCB", x: 50.0, depth: 1, align: "CB" },
          { slot: "SS", x: 38.4, depth: 8 },
          { slot: "FS", x: C, depth: 14 },
        ]),
      },
      "quarters": {
        name: "Quarters",
        spots: dl.concat([
          { slot: "WLB", x: 21.6, depth: 4.5 },
          { slot: "MLB", x: 31.4, depth: 4.5 },
          { slot: "NB", x: 16.2, depth: 6.5 },
          { slot: "LCB", x: 4.2, depth: 8, align: "CB" },
          { slot: "RCB", x: 49.2, depth: 8, align: "CB" },
          { slot: "SS", x: 16.8, depth: 12 },
          { slot: "FS", x: 37.4, depth: 12 },
        ]),
      },
    },
  };
})(window);
