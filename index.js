const connectToMongo = require('./db')
const express = require('express')
const multer = require('multer');
const XLSX = require('xlsx');
const Flag = require('./models/flags');
const User = require('./models/PlayerUser');
const path = require('path')
const fetchuser = require('./middleware/fetchuser')

const { signinPage, createUser, login, getUser } = require("./controllers/signin");


connectToMongo();
const app = express()
const port = 5000

app.use(express.json());


// handling static files 
app.use(express.static(path.join(process.cwd(), 'public')));

// handling ejs specific stuff
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename for uploaded files
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res)=>{
  res.render('homePage.ejs');
})
app.get('/signin', signinPage)
app.post('/createuser', createUser)
app.post('/login', login)
app.get('/getuser', fetchuser, getUser)

app.post('/fetch-flag',fetchuser, async (req, res) => {
  
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    const {ctfdFlag } = req.body;
    const  teamName=user.name;
  
    try {
      const flag = await Flag.findOne({ teamName, ctfdFlag });
      
  
      if (flag) {
        return res.json({ encryptedFlag: flag.encryptedFlag });
      } else {
        return res.status(404).json({ error: 'Flag not found' });
      }
    } catch (error) {
      console.error('Error fetching encrypted flag:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Endpoint to handle file upload and store data in the database
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      // Read the uploaded Excel file
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
  
      // Array to store data from Excel sheet
      const flagsData = [];
  
      // Iterate over rows in the Excel sheet
      for (let i = 1; ; i++) { // Start from row 2 (assuming headers are in row 1)
        const teamNameCell = sheet['A' + i];
        const ctfdChallengeCell = sheet['B' + i];
        const ctfdFlagCell = sheet['C' + i];
        const encryptedFlagCell = sheet['D' + i];
  
        // Break loop if any cell in the row is empty
        if (!teamNameCell || !ctfdChallengeCell || !ctfdFlagCell || !encryptedFlagCell) {
          break;
        }
  
        // Extract data from cells
        const teamName = teamNameCell.v;
        const ctfdChallenge = ctfdChallengeCell.v;
        const ctfdFlag = ctfdFlagCell.v;
        const encryptedFlag = encryptedFlagCell.v;
  
        // Add data to flagsData array
        flagsData.push({ teamName, ctfdChallenge, ctfdFlag, encryptedFlag });
      }
  
      // Save data to the database
      const flags = await Flag.insertMany(flagsData);
  
      // Send response
      res.status(200).json({ message: 'Data uploaded successfully', flags });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


app.listen(port,()=>{
    console.log(`Listening on port: ${port}`)
})