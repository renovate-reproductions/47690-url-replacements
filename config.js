module.exports = {
  platform: 'local',
  dryRun: 'lookup',
  urlReplacements: [
    {
      matchUrlPrefix: 'https://repo.maven.apache.org/maven2/',
      replaceUrlPrefix:
        'https://maven-central.storage-download.googleapis.com/maven2/',
      matchHostTypes: ['maven'],
    },
  ],
};
