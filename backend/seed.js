require('dotenv').config();
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8', ...dns.getServers()]);

const mongoose = require('mongoose');
const User = require('./models/User');
const Document = require('./models/Document');
const Share = require('./models/Share');

const USERS = [
  { name: 'Alice Johnson', email: 'alice@demo.com', password: 'password123' },
  { name: 'Bob Smith', email: 'bob@demo.com', password: 'password123' },
  { name: 'Charlie Lee', email: 'charlie@demo.com', password: 'password123' },
];

const SAMPLE_DOCS = [
  {
    title: 'Project Roadmap Q3',
    content:
      '<h2>Q3 2026 Roadmap</h2><p>This document outlines our <strong>key initiatives</strong> for the upcoming quarter.</p><ul><li>Launch collaborative editor v1</li><li>Implement real-time sync</li><li>User feedback integration</li></ul><p>Priority is on <em>shipping quality</em> over feature count.</p>',
  },
  {
    title: 'Meeting Notes — Design Review',
    content:
      '<h2>Design Review — July 28</h2><p>Attendees: Alice, Bob, Charlie</p><h3>Key Decisions</h3><ol><li>Adopt a <strong>minimal UI</strong> approach</li><li>Use TipTap for rich-text editing</li><li>Ship sharing before collaboration</li></ol><p><em>Next review scheduled for August 4.</em></p>',
  },
  {
    title: 'API Documentation Draft',
    content:
      '<h2>REST API Reference</h2><p>Base URL: <code>/api</code></p><h3>Authentication</h3><p>All requests require a <strong>Bearer token</strong> in the Authorization header.</p><h3>Endpoints</h3><ul><li><strong>POST</strong> /auth/login</li><li><strong>GET</strong> /documents/owned</li><li><strong>PATCH</strong> /documents/:id</li></ul>',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || 'docflow',
  });
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Document.deleteMany({});
  await Share.deleteMany({});
  console.log('Cleared existing data');

  const users = [];
  for (const u of USERS) {
    const user = new User({ name: u.name, email: u.email });
    await user.setPassword(u.password);
    await user.save();
    users.push(user);
    console.log(`  Created user: ${u.email}`);
  }

  const [alice, bob] = users;

  const docs = [];
  for (const d of SAMPLE_DOCS) {
    const doc = await Document.create({ ...d, owner: alice._id });
    docs.push(doc);
    console.log(`  Created doc: ${d.title}`);
  }

  await Share.create({
    document: docs[0]._id,
    owner: alice._id,
    sharedWith: bob._id,
    permission: 'edit',
  });
  console.log(`  Shared "${docs[0].title}" with Bob (edit)`);

  await Share.create({
    document: docs[1]._id,
    owner: alice._id,
    sharedWith: bob._id,
    permission: 'view',
  });
  console.log(`  Shared "${docs[1].title}" with Bob (view)`);

  console.log('\nSeed complete! Demo accounts:');
  USERS.forEach((u) => console.log(`  ${u.email} / ${u.password}`));

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
