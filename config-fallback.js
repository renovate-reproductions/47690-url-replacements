module.exports = {
  platform: 'local',
  dryRun: 'lookup',
  urlReplacements: [
    {
      matchUrlPrefix: 'https://repo.maven.apache.org/maven2/',
      // a mirror which can't be reached, so Renovate falls back to Maven Central
      replaceUrlPrefix: 'https://mirror.invalid/maven2/',
      matchHostTypes: ['maven'],
      fallback: true,
    },
  ],
};
