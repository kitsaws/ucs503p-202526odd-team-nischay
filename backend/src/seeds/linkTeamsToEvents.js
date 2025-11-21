// scripts/linkTeamsToEvents.js

require('dotenv').config();
const mongoose = require('mongoose');

// 🟡 TODO: update these paths to your actual model paths
const Team = require('../models/Team');
const Event = require('../models/Event');

const MONGO_URI = process.env.MONGO_URI;

(async () => {
  try {
    if (!MONGO_URI) {
      console.error('❌ MONGO_URI / DATABASE_URL not set in .env');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    console.log('📦 Fetching all teams with an eventId...');
    const teams = await Team.find({ eventId: { $exists: true, $ne: null } })
      .select('_id eventId teamName');

    console.log(`Found ${teams.length} teams.`);

    let updatedCount = 0;
    let missingEvents = 0;

    for (const team of teams) {
      const eventId = team.eventId;

      const event = await Event.findByIdAndUpdate(
        eventId,
        { $addToSet: { teams: team._id } }, // avoid duplicates
        { new: true }
      );

      if (!event) {
        missingEvents++;
        console.warn(`⚠️ Event not found for team ${team._id} (${team.teamName}) with eventId ${eventId}`);
        continue;
      }

      updatedCount++;
    }

    console.log('✅ Done linking teams to events.');
    console.log(`➡️ Teams successfully linked: ${updatedCount}`);
    console.log(`⚠️ Teams with missing events: ${missingEvents}`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error while linking teams to events:', err);
    process.exit(1);
  }
})();
