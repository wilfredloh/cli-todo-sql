console.log("APPLICATION RUNNING!!");

let input1 = process.argv[2];
let input2 = process.argv[3];

const pg = require('pg');

const configs = {
    user: 'wilfredloh',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);
const d = new Date();

let changeTodos = (err, result) => {
    if (err) {
        console.log("query error", err.message);
    } else {
        // console.log(result.rows);
    }
};

let toggleTodos = (err, result) => {
    let text;
    if (err) {
        console.log("query error", err.message);
    } else {
        for (let i=0; i<result.rows.length; i++) {
            let todo = result.rows[i];
            if (todo.completed) {
                text = `UPDATE items set completed='0', date=($2), updated='0' where id=($1) RETURNING *`;
            } else {
                text = `UPDATE items set completed='1', date=($2), updated='1' where id=($1) RETURNING *`;
            }
        }
    }
};

let showTodos = (err, result) => {
    if (err) {
        console.log("query error", err.message);
    } else {
        for (let i=0; i<result.rows.length; i++) {
            let todo = result.rows[i];
            let completed = ' ';
            let createOrUpdate = 'created';
            if (todo.completed) {
                completed = 'X';
            }
            if (todo.updated) {
                createOrUpdate = 'updated';
            }
            let text = `${i+1}. ID: ${todo.id} [${completed}] - ${todo.name} ${createOrUpdate} ${todo.date}`
            console.log(text);
        }
    }
    process.exit();
};

let clientConnectionCallback = (err) => {
    if( err ){
        console.log( "error", err.message );
    } else {
        let text;
        let values = [input2, d];

        switch (input1) {
            case 'show':
                text = "select * from items order by id asc";
                client.query(text, showTodos);
                text = "SELECT * from items";
                client.query(text, showTodos);
                break;
            case 'add':
                text = "INSERT INTO items (name, date) VALUES ($1, $2) RETURNING *";
                client.query(text, values, changeTodos);
                text = "select * from items order by id asc";
                client.query(text, showTodos);
                text = "SELECT * from items";
                client.query(text, showTodos);
                break;
            case 'check':
                text = `UPDATE items set completed='1', date=($2), updated='1' where id=($1) RETURNING *`;
                client.query(text, values, changeTodos);
                text = "select * from items order by id asc";
                client.query(text, showTodos);
                text = "SELECT * from items";
                client.query(text, showTodos);
                break;
            case 'delete':
                if (input2 === 'all') {
                    text = "DELETE from items where id > 0";
                    client.query(text, changeTodos);
                    text = "select * from items order by id asc";
                    client.query(text, showTodos);
                    text = "SELECT * from items";
                    client.query(text, showTodos);
                } else {
                    text = "DELETE from items where id=($1)"
                    values = [input2];
                    client.query(text, values, changeTodos);
                    text = "select * from items order by id asc";
                    client.query(text, showTodos);
                    text = "SELECT * from items";
                    client.query(text, showTodos);
                }
                break;
            case 'fonts':
                showFig('Fonts');
                checkFigFonts();
                break;
            default:
                showFig('The Todolist!');
                showOptions();
                break;
        }
        // client.query(text, values, changeTodos);
    }
};

client.connect(clientConnectionCallback);


// extra features:
// 1. ascii
// 2. toggle done or not done
// 3. toggle all
// 4. commander
// 5. refactor