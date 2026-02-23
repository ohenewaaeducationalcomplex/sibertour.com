import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { randomBytes, createHash } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;

// In-memory simple stores (replace with DB in production)
const elections = {};
const ballotTokens = {};
const votes = [];

app.get('/api/health', (req, res) => res.json({status:'ok'}));

// Create a simple election (admin)
app.post('/api/elections', (req, res) => {
  const id = randomBytes(8).toString('hex');
  const e = { id, title: req.body.title || 'Untitled', start_at: req.body.start_at, end_at: req.body.end_at };
  elections[id] = e;
  res.json(e);
});

// Get elections
app.get('/api/elections', (req, res) => {
  res.json(Object.values(elections));
});

// Request ballot token (mock auth by email)
app.post('/api/elections/:id/request-ballot-token', (req, res) => {
  const electionId = req.params.id;
  const email = req.body.email;
  if(!email) return res.status(400).json({error:'email required'});
  // issue token
  const token = randomBytes(24).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 15*60*1000).toISOString();
  ballotTokens[tokenHash] = { tokenHash, email, electionId, expiresAt, used:false };
  // In production: SEND magic-link or show token via secure channel. Here return token for demo.
  res.json({ ballot_token: token, expiresAt });
});

// Cast vote
app.post('/api/elections/:id/cast', (req, res) => {
  const { ballot_token, ballot } = req.body;
  if(!ballot_token || !ballot) return res.status(400).json({error:'token and ballot required'});
  const tokenHash = createHash('sha256').update(ballot_token).digest('hex');
  const tokenRow = ballotTokens[tokenHash];
  if(!tokenRow) return res.status(400).json({error:'invalid token'});
  if(tokenRow.used) return res.status(400).json({error:'token used'});
  if(new Date(tokenRow.expiresAt) < new Date()) return res.status(400).json({error:'token expired'});
  // store encrypted_vote as JSON string for demo; compute vote_hash
  const voteStr = JSON.stringify(ballot);
  const voteHash = createHash('sha256').update(voteStr + Date.now().toString()).digest('hex');
  votes.push({ electionId: req.params.id, voteHash, ballot });
  tokenRow.used = true;
  res.json({ status:'ok', voteHash });
});

// Get simple tally (counts for single-choice)
app.get('/api/elections/:id/results', (req, res) => {
  const electionId = req.params.id;
  const rows = votes.filter(v => v.electionId === electionId);
  const tally = {};
  for(const r of rows){
    if(r.ballot && r.ballot.choice){
      tally[r.ballot.choice] = (tally[r.ballot.choice]||0)+1;
    }
  }
  res.json({ total: rows.length, tally });
});

app.listen(PORT, () => console.log('Backend running on port', PORT));
