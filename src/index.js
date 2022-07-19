const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const app = express();
const port = 3000;

const SortMidleware = require('./app/middlewares/SortMidleware')

const route = require('./routes');
const db = require('./config/db');

//connect to db
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

//http logger
// app.use(morgan('combined'))

//aplly middleware (de req.body hoat dong)
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// override with POST having ?_method=PUT
app.use(methodOverride('_method'));

//Custom middleware
app.use(SortMidleware)

//template engine
app.engine(
    'hbs',
    handlebars.engine({
        //đổi tên đuôi main.handlbars thành main.hbs và file khác
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                const sortType = field === sort.column ? sort.type : 'default';
                const icons = {
                    default: 'oi oi-elevator',
                    asc: "oi oi-sort-ascending",
                    desc: "oi oi-sort-descending"
                }
                const types = {
                    default: "desc",
                    asc: 'desc',
                    desc: 'asc'
                }

                const icon = icons[sortType]
                const type = types[sortType]
                return `<a href="?_sort&column=${field}&type=${type}">
                <span class="${icon}"></span>
            </a>`
            }
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app);

app.listen(port, () => {
    console.log(`App listening on port localhost:${port}`);
});
