const { exec } = require('child_process');
const watchlog = require("watchlog-connect")

async function checkStatus() {
  const mongoStatus = await new Promise((resolve, reject) => {
    exec('systemctl status mongod', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        const isActive = stdout.includes('active (running)');
        resolve(isActive ? 'running' : 'stopped');
      }
    });
  });

  const nginxStatus = await new Promise((resolve, reject) => {
    exec('systemctl status nginx', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        const isActive = stdout.includes('active (running)');
        resolve(isActive ? 'running' : 'stopped');
      }
    });
  });

  const redisStatus = await new Promise((resolve, reject) => {
    exec('systemctl status redis', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        const isActive = stdout.includes('active (running)');
        resolve(isActive ? 'running' : 'stopped');
      }
    });
  });

  return {
    mongoDB: mongoStatus,
    nginx: nginxStatus,
    redis : redisStatus
  };
}


setInterval(()=>{
    checkStatus()
  .then(status => {
    console.log('Server Status:');
    if(status.mongoDB === "running"){
        watchlog.distribution("mongodb-status" , 1)
    }else{
        watchlog.distribution("mongodb-status" , 0)
    }
    if(status.nginx === "running"){
        watchlog.distribution("nginx-status" , 1)
    }else{
        watchlog.distribution("nginx-status" , 0)
    }
    if(status.redis === "running"){
        watchlog.distribution("redis-status" , 1)
    }else{
        watchlog.distribution("redis-status" , 0)
    }

  })
  .catch(error => {
    console.error('Error checking status:', error);
  });
}, 10000)

