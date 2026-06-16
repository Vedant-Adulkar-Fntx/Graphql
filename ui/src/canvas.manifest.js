export const manifest = {
  screens: {
    scr_tyo707: { name: "Search", route: "/", position: { "x": 160, "y": 220 } },
    scr_ksgft2: { name: "About Company", route: "/company/c1/about", position: { "x": 160, "y": 2200 } },
    scr_c8kv4z: { name: "Company Structure", route: "/company/c1/structure", position: { "x": 1560, "y": 2200 } },
    scr_7mac9j: { name: "Financials", route: "/company/c1/financials", position: { "x": 2960, "y": 2200 } },
    scr_zi3dsl: { name: "Peer Comparison", route: "/company/c1/peers", position: { "x": 4360, "y": 2200 } },
    scr_lnbpwg: { name: "Directors", route: "/company/c1/directors", position: { "x": 5760, "y": 2200 } },
    scr_irhwth: { name: "Charge Details", route: "/company/c1/charges", position: { "x": 7160, "y": 2200 } },
    scr_y2n25a: { name: "Compliance", route: "/company/c1/compliance", position: { "x": 1560, "y": 4180 } },
    scr_lrsnnn: { name: "GST", route: "/company/c1/gst", position: { "x": 2960, "y": 4180 } },
    scr_a81gco: { name: "Credit Ratings", route: "/company/c1/credit-ratings", position: { "x": 160, "y": 4180 } },
    scr_txnu75: { name: "Legal History", route: "/company/c1/legal", position: { "x": 4360, "y": 4180 } },
    scr_nm4t5y: { name: "EPFO", route: "/company/c1/epfo", position: { "x": 5760, "y": 4180 } }
  },
  sections: {
    sec_0xc4r3: { name: "Search", x: 0, y: 0, width: 1520, height: 1180 },
    sec_e3m47u: { name: "Company Details", x: 0, y: 1980, width: 8520, height: 1180 },
    sec_b9liwt: { name: "Compliance & Risk", x: 0, y: 3960, width: 7120, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_0xc4r3", children: [
    { kind: "screen", id: "scr_tyo707" }]
  },
  { kind: "section", id: "sec_e3m47u", children: [
    { kind: "screen", id: "scr_ksgft2" },
    { kind: "screen", id: "scr_c8kv4z" },
    { kind: "screen", id: "scr_7mac9j" },
    { kind: "screen", id: "scr_zi3dsl" },
    { kind: "screen", id: "scr_lnbpwg" },
    { kind: "screen", id: "scr_irhwth" }]
  },
  { kind: "section", id: "sec_b9liwt", children: [
    { kind: "screen", id: "scr_a81gco" },
    { kind: "screen", id: "scr_y2n25a" },
    { kind: "screen", id: "scr_lrsnnn" },
    { kind: "screen", id: "scr_txnu75" },
    { kind: "screen", id: "scr_nm4t5y" }]
  }]

};