const teardown = async () => {
  
  const app = (global as any).testApp;
  const dataSource = (global as any).testDataSource;

  if (app) {
    await app.close();
  }

  if (dataSource?.isInitialized) {
    await dataSource.destroy();
  }

  await global.pg.stop();
};

export default teardown;
