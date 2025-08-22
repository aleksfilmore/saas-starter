// Mock for drizzle-orm/postgres-js during build time
// This prevents loading the real drizzle postgres adapter during Next.js build

const postgresMock = require('./postgres-mock.js');

console.log('🏗️ Using webpack-aliased drizzle-orm mock for build');

// Mock drizzle function that returns a compatible object
function createMockDrizzle(client) {
  return {
    query: {},
    _: {
      schema: {},
      fullSchema: {},
      tableNamesMap: {},
    },
    // Add common drizzle methods
    select: () => ({ from: () => ({ where: () => ({ execute: async () => [] }) }) }),
    insert: () => ({ values: () => ({ execute: async () => ({ insertId: 1 }) }) }),
    update: () => ({ set: () => ({ where: () => ({ execute: async () => ({ affectedRows: 1 }) }) }) }),
    delete: () => ({ where: () => ({ execute: async () => ({ affectedRows: 1 }) }) }),
    transaction: async (callback) => {
      // Simple transaction mock
      return await callback({
        select: () => ({ from: () => ({ where: () => ({ execute: async () => [] }) }) }),
        insert: () => ({ values: () => ({ execute: async () => ({ insertId: 1 }) }) }),
        update: () => ({ set: () => ({ where: () => ({ execute: async () => ({ affectedRows: 1 }) }) }) }),
        delete: () => ({ where: () => ({ execute: async () => ({ affectedRows: 1 }) }) }),
      });
    },
  };
}

// Export drizzle function
function drizzle(client, config = {}) {
  console.log('🏗️ Creating mock drizzle instance during build');
  return createMockDrizzle(client);
}

module.exports = {
  drizzle,
  // Export default for ES module compatibility
  default: drizzle,
};
