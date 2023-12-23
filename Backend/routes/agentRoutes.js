const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agentController");

router.post(
  "/api/v1/agent/tickets/close/:ticketId",
  agentController.closeTicket
); //close ticket

// const {updateTicket} = require('../controllers/agentController');

// router.post('/api/v1/agent/tickets/update/:ticketId',updateTicket);
router.post(
  "/api/v1/agent/tickets/update/:ticketId",
  agentController.updateTicket
);

router.get("/api/v1/agentTickets", agentController.getAllAgentTickets
); //get all tickets
module.exports = router;
