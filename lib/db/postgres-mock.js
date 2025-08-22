// Mock postgres.js module for build time
// This completely replaces postgres.js during Next.js build to prevent type parser errors

console.log('🏗️ Using webpack-aliased postgres mock for build');

// Create a comprehensive mock that covers all postgres.js functionality
function createMockClient() {
  const mockClient = {
    query: () => Promise.resolve([]),
    begin: () => Promise.resolve({ 
      query: () => Promise.resolve([]), 
      commit: () => Promise.resolve(), 
      rollback: () => Promise.resolve() 
    }),
    end: () => Promise.resolve(),
    // Mock all possible postgres.js properties
    parsers: new Array(10000).fill((val) => val),
    types: {
      builtins: {},
      getTypeParser: () => (val) => val,
      setTypeParser: () => {},
    },
    connection: {
      parsers: new Array(10000).fill((val) => val),
    },
    options: {},
    connect: () => Promise.resolve(),
    listen: () => Promise.resolve(),
    notify: () => Promise.resolve(),
    unlisten: () => Promise.resolve(),
    parameters: {},
    escapeIdentifier: (str) => `"${str}"`,
    escapeLiteral: (str) => `'${str.replace(/'/g, "''")}'`,
  };

  // Self-reference for any code that accesses client.client
  mockClient.client = mockClient;

  return mockClient;
}

// Export the mock as a function (like postgres.js does)
function postgresMock(connectionString, options = {}) {
  return createMockClient();
}

// Add static methods that postgres.js might have
postgresMock.postgres = postgresMock;
postgresMock.default = postgresMock;

module.exports = postgresMock;
module.exports.default = postgresMock;
module.exports.postgres = postgresMock;
