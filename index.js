const app = require('./app');
const PORT = 3000;
app.listen(PORT, function() {
	console.log(`Server listening on 0.0.0.0:${PORT}`);
})