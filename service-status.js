const { exec } = require('child_process');
const watchlog = require("watchlog-connect")
const services = require("./services.json")
async function checkStatus() {
  try {
    for (let i = 0; i < services.length; i++) {

      try {
        let serviceStatus = await new Promise((resolve, reject) => {
          exec(services[i].command, (error, stdout, stderr) => {
            if (error) {
              reject(error);
            } else {
              const isActive = stdout.includes(services[i].statusCheck);
              resolve(isActive ? 'running' : 'stopped');
            }
          });
        });

        if (serviceStatus === "running") {
          watchlog.distribution(services[i].name, 1)
        } else {
          watchlog.distribution(services[i].name, 0)
        }
      } catch (error) {

      }

    }
  } catch (error) {

  }


}


setInterval(() => {


  checkStatus()
    .then(() => null)
    .catch(error => {
      console.error('Error checking status:', error);
    });
}, 10000)

