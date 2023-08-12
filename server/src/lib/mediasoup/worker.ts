import * as mediasoup from "mediasoup";
import { Worker } from "mediasoup/node/lib/types";
import { config } from "../../global/config";

const workers: Worker[] = [];

let nextMediasoupWorkerIdx = 0;
const createWorkers = async () => {
  let { numWorkers } = config.mediasoup;

  for (let i = 0; i < numWorkers; i++) {
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

    workers.push(worker);
  }
};

const getMediasoupRouter = async () => {
  const worker = workers[nextMediasoupWorkerIdx];

  if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0;

  const router = await worker.createRouter({
    mediaCodecs: config.mediasoup.router.mediaCodecs,
  });

  return router;
};

export { createWorkers, getMediasoupRouter };
