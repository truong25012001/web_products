const express = require("express");
var path = require('path');
var methodOverride = require('method-override');
const app = express();


const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");

var flash = require('express-flash');
require('dotenv').config();
const port = process.env.PORT;
const systemConfig = require("./config/system");
var bodyParser = require('body-parser');
const database = require("./config/database");
database.connect();

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

// Tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//End Tinymce

app.use(cookieParser('xnxx'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(methodOverride('_method'));
app.use(express.static(`${__dirname}/public`));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

routeAdmin(app);
route(app);

// App Local variable

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.get("*",(req, res) => {
	res.render("client/pages/error/404", {
		pageTitle: "404 Not Found"
	})
})

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
})