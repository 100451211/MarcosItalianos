require('dotenv').config();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs');

// Function to remove accents from a string
function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");  // Normalize and remove accents
}

// Function to generate a random 15-character password
function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

// Function to generate a unique username (removing accents and appending random number if necessary)
function generateUniqueUsername(firstName, surname, users) {
    let baseUsername = `${removeAccents(firstName)}.${removeAccents(surname)}`.toLowerCase();
    let username = baseUsername;

    // Add random numbers if username already exists
    let isUsernameTaken = users.some(user => user.username === username);
    while (isUsernameTaken) {
        const randomNumber = Math.floor(Math.random() * 10000);  // Generate random number between 0 and 9999
        username = `${baseUsername}${randomNumber}`;
        isUsernameTaken = users.some(user => user.username === username);
    }

    return username;
}

// OAuth2 setup for sending emails via Gmail
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

// Function to send email using OAuth2
async function sendEmailToUser(name, surname, username, email, password) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Bienvenid@ a AURIDAL S.L!',
            text: `Hola ${name,surname},\nTu cuenta ha sido creada, aquí tienes tus datos.\n\tUsuario: ${username}.\n\tContraseña: ${password}\n`,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}: ${result.response}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Function to save user data into users.json file
function saveUserData(userData) {
    const filePath = './data/users/users.json';
    let usersData = [];

    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        usersData = JSON.parse(fileData);
    }

    usersData.push(userData);

    fs.writeFileSync(filePath, JSON.stringify(usersData, null, 2));
}

// Main function to create a user
async function createUser(firstName, surname, email) {
    const password = generateRandomPassword(15); // Generate the plain-text password
    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password

    // Load existing users from users.json
    const filePath = './data/users/users.json';
    let users = [];

    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        users = JSON.parse(fileData);
    }


    // Generate a unique username (removing accents and checking for duplicates)
    const username = generateUniqueUsername(firstName, surname, users);


    // Store the user data (including hashed password)
    const userData = {
        name: firstName,
        surname: surname,
        email: email,
        username: username,
        password: hashedPassword, // Only store the hashed password
    };

    saveUserData(userData); // Save user data to the database (e.g., users.json)

    // Send the plain-text password to the user's email
    await sendEmailToUser(usernData.name, userData.surname, userData.username, email, password);
    console.log(`User created: ${userData.username}`);
    console.log(`Plain password sent to user: ${password}`);
}

// Example usage
createUser('María', 'Tapia', 'mariatapiacosta@gmail.com');
