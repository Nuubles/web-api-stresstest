import async from "async";
import fetch from "node-fetch";
import fs from "fs";
import ws from "ws";

const HOST = "192.168.1.169";
const PORT = "3000";
let errorCount = 0;

const users = [];
for (let i = 1; i <= 4096; ++i) {
  users.push(i);
}

export const Timeout = (time) => {
  let controller = new AbortController();
  errorCount++;
  setTimeout(() => controller.abort(), time * 1000);
  return controller;
};

let successFetchCount = 0;

function attemptFetches(limit) {
  let averageClientTimes = [];

  // construct all promises
  let promises = [...users].map((user) => {
    //return async () => async.retry(1000000, async () => fetch(`http://${HOST}:${PORT}/users/${user}/cards`));
    return async () => {
      const start = performance.now();
      await fetch(`http://${HOST}:${PORT}/users/${user}/cards`, {
        signal: Timeout(30).signal,
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.length === 11) {
            ++successFetchCount;
          } else {
            errorCount++;
          }
        })
        .catch((err) => {
          errorCount++;
        })
        .finally(() => {
          const end = performance.now();
          averageClientTimes.push(end - start);
        });
    };
  });

  const promise = new Promise(async (resolve, reject) => {
    const startTime = performance.now();
    async
      .parallelLimit(promises, limit)
      .then(() => {
        const endTime = performance.now();
        resolve([endTime - startTime, average(averageClientTimes)]);
      })
      .catch((err) => {
        reject(err);
      });
  });

  return promise;
}

let socketSet = new Set();
function createParentWS(resolve, retrieveCount, sockets) {
  // Prepare parent client beforehand
  let client = new ws(`ws://${HOST}:${PORT}/clock`);
  client.startTime = undefined;

  // prepare to kill parent if it actually hangs
  let parentTerminator = setTimeout(async () => {
    for (let s of sockets()) {
      try {
        s.terminate();
      } catch (err) {}
    }
    client.terminate();

    await sleep(10000); // wait for 10s to let some random cleaning to happen
    successFetchCount = 0;
    resolve(undefined);
  }, 20000);

  // now update until limit is reached
  client.on("close", async () => {
    if (retrieveCount > 0) {
      console.log("Parent socket closed prematurely...");
    } else {
      ++successFetchCount;
    }
    const endTime = performance.now();
    // close all sockets
    console.log("Closing all...");
    for (let s of sockets()) {
      try {
        s.close();
      } catch (err) {}
    }

    let resultTime = endTime - client.startTime;
    await sleep(1000); // sleep for 1s before checking, we can save some time here if the sockets close fast enough

    clearTimeout(parentTerminator);
    if (
      sockets().filter((socket) => socket.readyState !== ws.CLOSED).length > 0
    ) {
      // connection close failed, kill all if after 30s they havent closed
      console.log("Closing sockets softly...");
      setTimeout(() => {
        for (let s of sockets()) {
          try {
            s.terminate();
          } catch (err) {}
        }
        resolve(resultTime);
      }, 29000); // there's a 30s timeout on as the timeout may take 30s internally
    } else {
      // sockets already closed, good job
      resolve(resultTime);
    }
  });

  client.on("message", (data) => {
    if (--retrieveCount > 0) {
      client.send("requestTime");
    } else {
      client.terminate();
    }
  });

  client.on("error", (err) => {
    console.error("Got error on parent socket, must close...");
    try {
      client.terminate();
    } catch (err_) {
      console.error("Failed to close on error...", err_);
    }
  });

  client.on("open", () => {
    // ignore
  });
  return client;
}

function wsFunction(id, requestCount, terminateLimit) {
  return (resolve) => {
    //console.log("Creating new resolve...");
    let limit = requestCount;
    let resolved = false;
    let closed = false;

    // construct all promises
    const client = new ws(`ws://${HOST}:${PORT}/clock`);
    client.id = id;

    let timeout = undefined;
    timeout = setTimeout(() => {
      closed = true;
      client.terminate();
      if (!resolved) {
        resolve(undefined);
        //console.log("Terminated client for exceeding 2s timeout...");
      }
    }, terminateLimit); // wait 10 seconds before timeout and kill

    client.on("message", (data) => {
      if (--limit == 0) {
        ++successFetchCount;
        client.close();
      }
    });

    client.on("close", () => {
      if (limit > 0) {
        //console.log("Socket closed prematurely... ", limit);
        clearTimeout(timeout);
        socketSet.delete(id);
      }

      if (!resolved) {
        resolve(undefined);
      }
    });

    client.on("open", () => {
      resolved = true;
      clearTimeout(timeout);
      resolve(client); // client connected
    });

    client.on("error", (err) => {
      // ignore socket error, just retry connection
      //console.log("Got error in client socket...", errorCount);
      if (!resolved) {
        resolved = true;
        resolve(undefined);
      }

      if (!closed) {
        closed = true;
        client.close();
      }
    });

    const close = () => {
      if (client.readyState !== ws.CLOSED && client.readyState !== ws.CLOSING) {
        console.log("Requesting force close...");
      }
      client.close();
    };

    const terminate = () => {
      if ([ws.CLOSING, ws.OPEN, ws.CONNECTING].includes(client.readyState)) {
        client.terminate();
      }
    };
  };
}

/**
 *
 * @param {*} limit
 * @returns operation time for limit messages, or -1 if connection is cut
 */
function attemptClockFetches(clientCount, retrieveCount) {
  let clients = [];
  for (let i = 0; i < clientCount - 1; ++i) {
    clients.push(
      async () =>
        new Promise(
          wsFunction(i + 1, retrieveCount, Math.max(clientCount * 10, 500))
        )
    );
  }

  let promise = new Promise(async (resolve) => {
    //console.log("Opening...");
    // create parent updater
    let sockets = [];
    const getSockets = () => {
      return sockets;
    };
    let client = createParentWS(resolve, retrieveCount, getSockets);

    // wait for the parent to open first, others need to wait for this
    client.on("open", async () => {
      // open sockets
      sockets = await async.parallel(clients); // connect all clients
      // add start time
      client.startTime = performance.now();

      // remove unsuccessful clients
      sockets = sockets.filter(
        (value) => !!value && value.readyState == ws.OPEN
      );

      //console.log("Continuing after opening " + sockets.length + " sockets, starting update cycle");
      // start update loop
      client.send("requestTime");
    });
  });

  return promise;
}

function appendResult(
  output,
  type,
  count,
  result,
  errorCount,
  averageClientTimes
) {
  if (!Object.keys(output[type]).includes(count)) {
    output[type][count] = {
      success: [],
      error: [],
      averageClientTimes: [],
    };
  }
  output[type][count]["success"].push(result);
  output[type][count]["error"].push(errorCount);
  output[type][count]["averageClientTimes"].push(averageClientTimes);
}

function average(array) {
  return array.reduce((a, b) => a + b) / array.length;
}

async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

const repeatCount = 5;
async function doStressTest() {
  let testServer = "";
  if (process.argv.length === 3) {
    testServer = process.argv[2];
    console.log(`Tested server: ${testServer}`);
  } else {
    console.log(
      "Tested server unknown, please retry with 'npm run start <env>'"
    );
    return;
  }

  const results = {
    ws: {},
    fetch: {},
  };

  for (let repeat = 0; repeat < repeatCount; ++repeat) {
    console.log(`Running test set ${repeat + 1} out of ${repeatCount}`);

    let skipREST = false;
    if (!skipREST) {
      // warmup - seems as if sometimes the times just jump randomly
      console.log("Doing rest warmups...");
      try {
        await attemptFetches(10);
        await attemptFetches(10);
        await attemptFetches(10);
        await sleep(30000); // wait for some cleanup
      } catch (err) {
        console.error("Failed card warmup fetch...", err);
      }
      console.log(
        "Warmups complete, starting real tests: 4096 fetches in specified group sizes"
      );

      // actual rest tests
      for (let i = 1; i <= 4096; i *= 2) {
        successFetchCount = 0;
        try {
          errorCount = 0;
          let [result, averageClientTime] = await attemptFetches(i);
          appendResult(
            results,
            "fetch",
            i,
            result,
            4096 - successFetchCount,
            averageClientTime
          );
          console.log(
            `${i}, ${result}, ${4096 - successFetchCount}, ${averageClientTime}`
          );
          socketSet.clear();
        } catch (err) {
          console.error("Failed card fetch...", err);
        }
        successFetchCount = 0;
        await sleep(30000); // wait for some cleanup
      }
    }

    // run websocket test warmup
    let skipWebsockets = false;
    if (!skipWebsockets) {
      console.log("Doing websocket warmups...");
      try {
        await attemptClockFetches(10, 10);
        await attemptClockFetches(10, 10);
        await attemptClockFetches(10, 10);
      } catch (err) {
        console.error("Failed websocket warmups...");
      }
      console.log("Warmups complete, starting real websocket tests");

      // actual websocket tests
      for (let i = 1; i <= 4096; i += i) {
        successFetchCount = 0;
        usedCooldown = false;
        try {
          errorCount = 0;
          let result = await attemptClockFetches(i, 20);
          if (result) {
            appendResult(results, "ws", i, result, i - successFetchCount, 0);
            console.log(
              `${i}, ${result}, ${
                i - successFetchCount
              }, SUCCESS: ${successFetchCount}`
            );
            errorCount = 0;
          } else {
            console.error("Looks like ws parent got terminated...");
          }
        } catch (err) {
          console.error("Failed websockets...", err);
        }
        usedCooldown = false;
        successFetchCount = 0;
      }
    }
  }

  let writeStream =
    "type,repeatCount,testRepeatCount,testRepeatAverage,errors,averageClientTime";
  for (let rootKey of Object.keys(results)) {
    for (let count of Object.keys(results[rootKey])) {
      writeStream +=
        "\n" +
        [
          rootKey,
          count,
          repeatCount,
          average(results[rootKey][count].success),
          average(results[rootKey][count].error),
          average(results[rootKey][count].averageClientTimes),
        ].join(",");
    }
  }

  writeStream += "\n";
  fs.writeFile(
    testServer + "_" + performance.now() + ".csv",
    writeStream,
    (err) => {
      console.log("Benchmark complete");
    }
  );
}

const i = setInterval(() => {
  // prevent node from killing process
}, 1000);

doStressTest().then(() => {
  clearInterval(i);
});
