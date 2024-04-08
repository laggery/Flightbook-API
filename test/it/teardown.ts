import { getDatasource } from "./util";

const teardown = async () => {
  await global.pg.stop();
  
  await (await getDatasource()).destroy();
};

export default teardown;
