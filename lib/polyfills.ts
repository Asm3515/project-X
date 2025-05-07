// Client-side polyfills for Node.js built-ins
// Import this file in client components that need these polyfills

// Empty implementations that won't break the build
export const Buffer = {
  from: () => ({}),
  isBuffer: () => false,
}

export const EventEmitter = class {
  on() {}
  off() {}
  emit() {}
}
