
Object.defineProperties(global, {
  window: {
    get() {
      return process.domain && process.domain.window || undefined;
    },
  },
  fetch: {
    get() {
      return process.domain && process.domain.window.fetch || undefined;
    },
  },
  document: {
    get() {
      return process.domain && process.domain.window.document || undefined;
    },
  },
  navigator: {
    get() {
      return process.domain && process.domain.window.navigator || undefined;
    },
  },
  location: {
    get() {
      return process.domain && process.domain.window.location || undefined;
    },
  },
});
