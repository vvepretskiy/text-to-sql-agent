export const customerTable = `
CREATE TABLE IF NOT EXISTS 'customer' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'email' TEXT NOT NULL,
    'name' TEXT NOT NULL
);`;

export const orderTable = `
CREATE TABLE IF NOT EXISTS 'order' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'createdate' TEXT NOT NULL,
    'shippingcost' REAL,
    'customerid' INTEGER NOT NULL,
    'carrier' TEXT NOT NULL,
    'trackingid' TEXT NOT NULL,
    FOREIGN KEY ('customerid') REFERENCES customer('id')
);
`;

export const SYSTEM_PROMPT = `You are an expert SQL assistant.
Generate SQL queries from plain-language requests.
Use the "get_from_db" tool to retrieve data.
Always enclose field names and table names in double quotes (").
Return concise, readable answers based on the database results.`;
