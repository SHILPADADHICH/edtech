const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
const server = express();
const port = process.env.PORT || 8080;

server.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: true,
}));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(express.static('Edtech-master'));

const { Schema } = mongoose;
const userSchema = new Schema({
    username: {type:String},
    password: String,
    email: {type:String,unique:true},
    phone: {type:Number,unique:true},
    institute: String,
    gender: String
});

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const User = mongoose.model("User", userSchema);

async function main() {
    // await mongoose.connect(`mongodb+srv://username:password@cluster0.3r4pbup.mongodb.net/students`, { auth: { username: MONGODB_USERNAME, password: MONGODB_PASSWORD } });
    await mongoose.connect(`mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.qvqjdtf.mongodb.net/`)
    console.log("Database connected"); 
}
main().catch(err => console.error(err));

server.post('/signup', async(req, res) => {
    try {
        const { username, email, password, phone, institute, gender } = req.body;
        const newUser = new User({
            username: username,
            password: password,
            email: email,
            phone: phone,
            institute: institute,
            gender: gender
        });
        await newUser.save();
        console.log("Document added to the database");
        res.send(`
            <script>
                alert('Signed up successfully!');
                window.location.href = '/login';
            </script>
        `);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
            res.send(`
                <script>
                    alert('Username already exists. Please choose a different one.');
                    window.location.href = '/signup'; 
                </script>
            `);
        } else {
            console.error(err);
            res.status(500).send("Error occurred during signup");
        }
    }
});

server.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        req.session.email = email;
        if (!user || user.password !== password) {
            res.send(`
                <script>
                    alert('Invalid Username or Password!');
                    window.location.href='/login';
                </script>
            `);
        } else {
            res.send(`
                <script>
                    alert('Login successfully!');
                    window.location.href='/home';
                </script>
            `);
        }
    } catch (err) {
        console.error(err);
        res.send(`
            <script>
                alert('Internal error occured!');
                window.location.href='/login';
            </script>
        `);
    }
});

server.get('/api/data', async (req, res) => {
    try {
      const items = await User.findOne({email:req.session.email});
      res.json(items);
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

const signup = fs.readFileSync("Edtech-master/signup.html", 'utf8');
const login = fs.readFileSync(`Edtech-master/login.html`, "utf8");
const home = fs.readFileSync("Edtech-master/home1.html","utf-8");

server.get('/home',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.send(home);
});

server.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(index);
});

server.get('/signup', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(signup);
});

server.get('/login', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(login);
});

server.listen(8080, () => {
    console.log(`Server is running on ${port}`);
});
