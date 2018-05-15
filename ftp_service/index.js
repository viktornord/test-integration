const ftpd = require('ftpd');

const server = new ftpd.FtpServer('localhost', {
  getInitialCwd: function() {
    return '/';
  },
  getRoot: function() {
    return process.cwd();
  },
  pasvPortRangeStart: 1025,
  pasvPortRangeEnd: 1050,
  useWriteFile: false,
  useReadFile: false,
  uploadMaxSlurpSize: 7000, // N/A unless 'useWriteFile' is true.
});

server.on('error', function(error) {
  console.log('FTP Server error:', error);
});

server.on('client:connected', function(connection) {
  let username = null;
  console.log('client connected: ' + connection.remoteAddress);
  connection.on('command:user', function(user, success, failure) {
    if (user) {
      username = user;
      success();
    } else {
      failure();
    }
  });

  connection.on('command:pass', function(pass, success, failure) {
    if (pass) {
      success(username);
    } else {
      failure();
    }
  });
});

server.debugging = 4;
server.listen(7002);