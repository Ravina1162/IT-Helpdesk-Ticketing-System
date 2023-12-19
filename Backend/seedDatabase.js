const mongoose = require('mongoose');
require('dotenv').config();
const UserModel = require('./models/userModel.js');
const AdminModel = require('./models/adminModel.js');
const SupportAgentModel = require('./models/agentModel.js');
const ClientModel = require('./models/clientModel.js');
const FAQModel = require('./models/FAQModel.js');
const IssueModel = require('./models/issueModel.js');
const LogModel = require('./models/logsModel.js');
const ManagerModel = require('./models/managerModel.js');
const TicketModel = require('./models/ticketModel.js');
const ChatModel = require('./models/chatModel.js');
const CustomizationModel = require('./models/customizationModel.js');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const seedData = async () => {
  try {
    // Clear existing data
    await UserModel.deleteMany({});
    await AdminModel.deleteMany({});
    await SupportAgentModel.deleteMany({});
    await ClientModel.deleteMany({});
    await FAQModel.deleteMany({});
    await IssueModel.deleteMany({});
    await ManagerModel.deleteMany({});
    await TicketModel.deleteMany({});
    await ChatModel.deleteMany({});
    await CustomizationModel.deleteMany({});

    const supportAgents = [];
    for (let i = 1; i <= 3; i++) {
      let mysalt = await generateSalt();
      const hashedPassword = await hashPassword('password123', mysalt);
      const user = new UserModel({
        _id: i,
        Email: `support${i}@example.com`,
        Password: hashedPassword,
        Username: `support${i}`,
        PhoneNumber: '123-456-7890',
        RoleID: 3, // Support Agent role
        MFA_Enabled: i % 2 === 0, // Every other user has MFA enabled
        Is_Enabled: true,
        theme: 'light', // Default theme is light
        logoPath: 'https://placekitten.com/200/200', // Placeholder image
        salt: mysalt,
      });

      const supportAgent = new SupportAgentModel({
        _id: user._id,
        Email: user.Email,
        Password: user.Password,
        Username: user.Username,
        PhoneNumber: user.PhoneNumber,
        RoleID: user.RoleID,
        MFA_Enabled: user.MFA_Enabled,
        Is_Enabled: user.Is_Enabled,
        Pref_Type: 'email', // Default preference type
        Average_Rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
        Ticket_Count: Math.floor(Math.random() * 10), // Random ticket count
        Active_Tickets: Math.floor(Math.random() * 5), // Random active ticket count
        Salt: user.salt,
      });

      await user.save();
      await supportAgent.save();

      user.supportAgentId = supportAgent._id;
      supportAgents.push(user);
    }
    
// Seed issue data
const issueTypes = [
  {
    Issue: 'Software',
    Custom_Workflow: 'Software_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Operating system',
  },
  {
    Issue: 'Software',
    Custom_Workflow: 'Software_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Application software',
  },
  {
    Issue: 'Software',
    Custom_Workflow: 'Software_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Custom software',
  },
  {
    Issue: 'Software',
    Custom_Workflow: 'Software_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Integration issues',
  },
  {
    Issue: 'Hardware',
    Custom_Workflow: 'Hardware_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Desktops',
  },
  {
    Issue: 'Hardware',
    Custom_Workflow: 'Hardware_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Laptops',
  },
  {
    Issue: 'Hardware',
    Custom_Workflow: 'Hardware_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Printers',
  },
  {
    Issue: 'Hardware',
    Custom_Workflow: 'Hardware_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Servers',
  },
  {
    Issue: 'Hardware',
    Custom_Workflow: 'Hardware_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Networking equipment',
  },
  {
    Issue: 'Network',
    Custom_Workflow: 'Network_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Email issues',
  },
  {
    Issue: 'Network',
    Custom_Workflow: 'Network_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Internet connection problems',
  },
  {
    Issue: 'Network',
    Custom_Workflow: 'Network_Workflow_Value', // Provide a value if needed
    Sub_Issue_Type: 'Website errors',
  },
];


const issuesData = await Promise.all(issueTypes.map(async (issue) => {
  const newIssue = new IssueModel({
    Issue: issue.Issue,
    Custom_Workflow: issue.Custom_Workflow,
    Sub_Issue_Type: issue.Sub_Issue_Type,
  });

  await newIssue.save();
  return newIssue;
}));

// Function to generate salt using bcrypt
async function generateSalt() {
  return bcrypt.genSalt(10); // 10 is the number of rounds for the salt generation
}


// Function to hash password using bcrypt
async function hashPassword(password, salt) {
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

// Seed user data
const users = [];
for (let i = 4; i <= 33; i++) {
  let mysalt = await generateSalt();
  const hashedPassword = await hashPassword('password123', mysalt); // Hash the password
  const randomRoleID = i % 3 === 0 ? 2 : i % 2 === 0 ? 4 : 1; // Alternating role IDs
  const user = new UserModel({
    _id: i + 1,
    Email: `user${i + 1}@example.com`,
    Password: hashedPassword,
    Username: `user${i + 1}`,
    PhoneNumber: '123-456-7890',
    RoleID: randomRoleID,
    MFA_Enabled: i % 2 === 0, // Every other user has MFA enabled
    Is_Enabled: true,
    theme: 'light', // Default theme is light
    logoPath: 'https://placekitten.com/200/200', // Placeholder image
    salt: mysalt,
    
  });

  // Save user data based on role ID
  switch (user.RoleID) {
    case 1: // Admin
      const admin = new AdminModel({
        _id: user._id,
        Email: user.Email,
        Password: user.Password,
        Username: user.Username,
        PhoneNumber: user.PhoneNumber,
        RoleID: user.RoleID,
        MFA_Enabled: user.MFA_Enabled,
        Is_Enabled: user.Is_Enabled,
        Salt: user.salt,
      });
      await admin.save();
      user.adminId = admin._id; // Link to AdminModel
      break;
    case 2: // Manager
      const manager = new ManagerModel({
        _id: user._id,
        Email: user.Email,
        Password: user.Password,
        Username: user.Username,
        PhoneNumber: user.PhoneNumber,
        RoleID: user.RoleID,
        MFA_Enabled: user.MFA_Enabled,
        Is_Enabled: user.Is_Enabled,
        Salt: user.salt,
      });
      await manager.save();
      user.managerId = manager._id; // Link to ManagerModel
      break;
    // case 3: // Support Agent
    //   const supportAgent = new SupportAgentModel({
    //     _id: user._id,
    //     Email: user.Email,
    //     Password: user.Password,
    //     Username: user.Username,
    //     PhoneNumber: user.PhoneNumber,
    //     RoleID: user.RoleID,
    //     MFA_Enabled: user.MFA_Enabled,
    //     Is_Enabled: user.Is_Enabled,
    //     Pref_Type: 'email', // Default preference type
    //     Average_Rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
    //     Ticket_Count: Math.floor(Math.random() * 10), // Random ticket count
    //     Active_Tickets: Math.floor(Math.random() * 5), // Random active ticket count
    //     Salt: user.salt,
    //   });
    //   await supportAgent.save();
    //   user.supportAgentId = supportAgent._id; // Link to SupportAgentModel
    //   break;
    case 4: // Client
      const client = new ClientModel({
        _id: user._id,
        Email: user.Email,
        Password: user.Password,
        Username: user.Username,
        PhoneNumber: user.PhoneNumber,
        RoleID: user.RoleID,
        MFA_Enabled: user.MFA_Enabled,
        Is_Enabled: user.Is_Enabled,
        Salt: user.salt,
      });
      await client.save();
      user.clientId = client._id; // Link to ClientModel
      break;
    default:
      break;
  }

  await user.save(); // Save UserModel
}
  const salt = await generateSalt();
  const hashedPassword = await hashPassword('password123', salt); // Hash the password
  // Create a valid user
// Find the last user in the database and get their ID
const lastUser = await UserModel.findOne({}, {}, { sort: { '_id': -1 } });

// Determine the next available ID
const nextUserId = lastUser ? lastUser._id + 1 : 1;

// Create a valid user with the next available ID
const validUser = new UserModel({
  _id: nextUserId,
  Email: 'zaidqarxoy@gmail.com',
  Password: hashedPassword,
  Username: 'zaidqarxoy',
  PhoneNumber: '123-456-7890',
  RoleID: 4,
  MFA_Enabled: false,
  Is_Enabled: false,
  salt: salt,
});

await validUser.save();
const validClient = new ClientModel({
  _id: validUser._id,
  Email: validUser.Email,
  Password: validUser.Password,
  Username: validUser.Username,
  PhoneNumber: validUser.PhoneNumber,
  RoleID: validUser.RoleID,
  MFA_Enabled: validUser.MFA_Enabled,
  Is_Enabled: validUser.Is_Enabled,
  Salt: validUser.salt,
});
await validClient.save();
    // Seed FAQ data
    const faqs = [];
    for (let i = 0; i < 5; i++) {
      const faq = new FAQModel({
        Question: `Question ${i + 1}`,
        Answer: `Answer ${i + 1}`,
        Category: `Category ${i + 1}`,
        Sub_Category: `Sub-Category ${i + 1}`,
      });
      faqs.push(faq.save());
    }


    // Seed ticket data
    const tickets = [];
    for (let i = 0; i < 5; i++) {
      const ticket = new TicketModel({
        _id: i + 1,
        Status: 'Open', // Default ticket status
        Assigned_AgentID: i % 5 + 1, // Assign tickets to agents in a loop
        Ticket_Owner: (i % 10) + 1, // Assign tickets to users in a loop
        Issue_Type: issuesData[i % 3].Issue, // Assign issues in a loop
        Description: `Ticket description ${i + 1}`,
        Priority: i % 3 === 0 ? 'High' : 'Low', // Alternate priority
        Resolution_Details: `Resolution details ${i + 1}`,
        Start_Date: new Date(), // Current date as the start date
        End_Date: new Date(), // Current date as the end date
        Sub_Issue_Type: issuesData[i % 3].Sub_Issue_Type, // Assign sub-issue types
      });
      tickets.push(ticket.save());
    }
     // Create a valid ticket
    const ValidTicket = new TicketModel({
      _id: 7,
      Status: 'Open', // Default ticket status
      Assigned_AgentID: 1, // Assign tickets to agents in a loop
      Ticket_Owner: 31, // Assign tickets to users in a loop
      Issue_Type: issuesData[0].Issue, // Assign issues in a loop
      Description: `Ticket description ${6}`,
      Priority: 'High', // Alternate priority
      Resolution_Details: `Resolution details ${6}`,
      Start_Date: new Date(), // Current date as the start date
      End_Date: new Date(), // Current date as the end date
      Sub_Issue_Type: issuesData[0].Sub_Issue_Type, // Assign sub-issue types
    });
    await ValidTicket.save();

      // Seed chat data
    const chats = [];
    const existingClients = await ClientModel.find({}, '_id'); // Get existing client IDs
    const existingSupportAgents = await SupportAgentModel.find({}, '_id'); // Get existing support agent IDs

    for (let i = 0; i < 5; i++) {
      const randomClientIndex = i % existingClients.length;
      const randomSupportAgentIndex = i % existingSupportAgents.length;

      const chat = new ChatModel({
        _id: i + 1,
        Client_ID: existingClients[randomClientIndex]._id, // Use existing client ID
        Support_AgentID: existingSupportAgents[randomSupportAgentIndex]._id, // Use existing support agent ID
        Messages: `Chat message ${i + 1}`,
        Start_Time: new Date(), // Current date as the start time
        End_Time: new Date(), // Current date as the end time
        Message_Count: i + 1, // Increment message count
        TicketID: (i % 5) + 1, // Assign tickets in a loop
      });

      chats.push(chat.save());
    }


    // Seed customization data for Tailwind themes
    const customizations = [];
    const tailwindThemes = ['light', 'dark', 'cyan', 'purple', 'green']; // Add your desired Tailwind themes

    for (let i = 1; i <= 30; i++) { // Assuming 30 users have been created
      const theme = tailwindThemes[i % tailwindThemes.length];
      const logoPath = `https://placekitten.com/200/200?random=${i}`; // Placeholder image with unique path

      const customization = new CustomizationModel({
        userId: i,
        theme,
        logoPath,
      });

      customizations.push(customization.save());
    }

    await Promise.all([...users, ...faqs, ...issuesData, ...tickets, ...chats, ...customizations]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

seedData();
