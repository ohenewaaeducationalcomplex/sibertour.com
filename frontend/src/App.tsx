import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App(){
  const [elections, setElections] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [selected, setSelected] = useState('');
  useEffect(()=>{ axios.get('/api/elections').then(r=>setElections(r.data)).catch(()=>{}); },[]);
  const requestToken = async (id:string) => {
    const r = await axios.post(`/api/elections/${id}/request-ballot-token`, { email });
    setToken(r.data.ballot_token);
    alert('Token issued (demo): ' + r.data.ballot_token);
  };
  const cast = async (id:string) => {
    if(!token) return alert('request token first');
    await axios.post(`/api/elections/${id}/cast`, { ballot_token: token, ballot: { choice: selected }});
    alert('Vote cast');
    setToken('');
  };
  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h1>School Voting (Demo)</h1>
      <div style={{marginBottom:20}}>
        <input placeholder="your school email" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <h2>Open Elections</h2>
      <ul>
        {elections.map(e=>(
          <li key={e.id}>
            <strong>{e.title}</strong>
            <div>
              <button onClick={()=>requestToken(e.id)}>Request Ballot Token</button>
              <button onClick={()=>{ const choice = prompt('Enter your choice text'); if(choice) setSelected(choice); }}>Set Choice</button>
              <button onClick={()=>cast(e.id)}>Cast Vote</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
