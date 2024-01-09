// app.use((req, res, next) => {
//     for (const [key, value] of Object.entries(req.headers)) {
//       if (key === "x-real-ip") console.log(`Remote IP: ${value}`);
//     }
//     next();
//   });

const fetchRemoteIp = (req,res,next) => {
	console.log(`${req.headers['x-real-ip'] || req.connection.remoteAddress} - ${req.method} - ${req.url.replace(/\n|\r/g, '')}`);
	next();
};

module.exports = fetchRemoteIp;