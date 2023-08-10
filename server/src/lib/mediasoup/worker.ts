import * as mediasoup from "mediasoup";
import { Worker, Router } from "mediasoup/node/lib/types";
import { config } from "../../global/config";

const worker: Array<{
  worker: Worker;
  router: Router;
}> = [];

let nextMediasoupWorkerIdx = 0;

const createWorker = async () => {
  const worker = await mediasoup.createWorker({
    logLevel: config.mediasoup.worker.logLevel,
    logTags: config.mediasoup.worker.logTags,
    rtcMinPort: config.mediasoup.worker.rtcMinPort,
    rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
  });

  worker.on("died", () => {
    console.log(`mediasoup worker died, exiting in 2 sec... ${worker.pid}`);

    setTimeout(() => {
      process.exit(1);
    }, 2000);
  });

  const mediasoupRouter = await worker.createRouter({
    mediaCodecs: config.mediasoup.router.mediaCodecs,
  });

  return mediasoupRouter;
};

export { createWorker };
