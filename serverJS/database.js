const sqlite = require("sqlite3").verbose()

const db = new sqlite.Database("database/pikkngo.db")
db.serialize(() => {
    //users
    db.run(
        "CREATE TABLE IF NOT EXISTS users (id text PRIMARY KEY, fname text, lname text, username text, email text, mno number, password text, datetime number, verified number)"
    )
    db.run(
        "CREATE TABLE IF NOT EXISTS user_location (id text PRIMARY KEY, uid text , lat number, long number, display_address text, datetime number, FOREIGN KEY (uid) REFERENCES users(id))"
    )
    db.run(
        "CREATE TABLE IF NOT EXISTS user_photo (id text PRIMARY KEY, uid text , photo blob, datetime numbe, FOREIGN KEY (uid) REFERENCES users(id))"
    )
    //stores
    db.run(
        "CREATE TABLE IF NOT EXISTS stores (id text PRIMARY KEY, name text, username text, email text, mno number, password text, datetime number)"
    )
    db.run(
        "CREATE TABLE IF NOT EXISTS store_location (id text PRIMARY KEY, sid text , lat number, long number, display_address text, datetime number, FOREIGN KEY (sid) REFERENCES stores(id))"
    )
    db.run(
        "CREATE TABLE IF NOT EXISTS store_photo (id text PRIMARY KEY, sid text , photo blob, datetime number, FOREIGN KEY (sid) REFERENCES stores(id))"
    )
    db.run(
        "CREATE TABLE IF NOT EXISTS items (id text PRIMARY KEY, sid text , name text, description text, price number, datetime number, FOREIGN KEY (sid) REFERENCES stores(id))"
    )
    db.run(
        "CREATE TABLE IF NOT EXISTS subitems (id text PRIMARY KEY, item_id text , name text, description text, price number, datetime number, FOREIGN KEY (item_id) REFERENCES items(id))"
    )
    db.run(
        "CREATE TABLE IF NOT EXISTS wallet(id text PRIMARY KEY, sid text, value number, datetime number, FOREIGN KEY (sid) REFERENCES stores(id))"
    )
    db.run(
        "CREATE TABLE IF NOT EXISTS waller_history(id text PRIMARY KEY, wallet_id text, withdraw_value number, transactionID text, datetime number, FOREIGN KEY (wallet_id) REFERENCES wallet(id))"
    )

    //orders
    db.run(
        "CREATE TABLE IF NOT EXISTS orders (id text PRIMARY KEY, uid text, sid text, status text, datetime number, FOREIGN KEY (uid) REFERENCES users(id), FOREIGN KEY (sid) REFERENCES stores(id))"
    )
    db.run(
        "CREATE TABLE IF NOT EXISTS order_detail(id text PRIMARY KEY, order_id text, item_id text, datetime number, FOREIGN KEY (order_id) REFERENCES orders(id))"
    )
    // Payments

    console.log("Database is ready to go!")
})

module.exports = db
