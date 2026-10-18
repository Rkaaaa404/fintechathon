/**
 * AegisPath Design Tokens - Neutral JS Object
 * Zero DOM dependency, safe for Web, Node, and React Native / Capacitor
 */
const tokens = require('./tokens.json');

module.exports = {
  tokens,
  colors: tokens.color,
  radii: tokens.radius,
  shadows: tokens.shadow,
  typography: tokens.typography
};
