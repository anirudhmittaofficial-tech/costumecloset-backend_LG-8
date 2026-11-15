const db = require('./db');

const actors = [
  ['Ravi Kumar', '9000000001'], ['Meena Rao', '9000000002'],
  ['Arjun Reddy', '9000000003'], ['Priya Sharma', '9000000004'],
  ['Kiran Das', '9000000005']
];
const costumes = [
  ['Royal Crown Robe', 'Medieval'], ['Knight Armour', 'Medieval'],
  ['Peasant Tunic', 'Medieval'], ['Court Jester', 'Medieval'],
  ['Ball Gown', 'Victorian'], ['Top Hat Suit', 'Victorian'],
  ['Maid Dress', 'Victorian'], ['Detective Coat', 'Victorian'],
  ['Flapper Dress', '1920s'], ['Gangster Suit', '1920s'],
  ['Pharaoh Costume', 'Ancient Egypt'], ['Cleopatra Gown', 'Ancient Egypt'],
  ['Roman Toga', 'Roman'], ['Gladiator Set', 'Roman'],
  ['Pirate Captain Coat', 'Pirate Age'], ['Pirate Bandana Set', 'Pirate Age'],
  ['Maharaja Sherwani', 'Mughal'], ['Queen Saree', 'Mughal'],
  ['Disco Jumpsuit', '1970s'], ['Space Suit', 'Futuristic'],
  ['Robot Costume', 'Futuristic'], ['Wizard Cloak', 'Fantasy']
];
const hires = [
  [1, 1, '2026-11-01', '2026-11-08', '2026-11-07'],
  [2, 5, '2026-11-02', '2026-11-09', null],
  [3, 11, '2026-11-03', '2026-11-10', null],
  [4, 15, '2026-11-04', '2026-11-11', '2026-11-13'],
  [5, 9, '2026-11-05', '2026-11-12', null]
];

db.serialize(() => {
  db.run('DELETE FROM hires');
  db.run('DELETE FROM actors');
  db.run('DELETE FROM costumes');
  db.run('DELETE FROM sqlite_sequence');

  actors.forEach(a => db.run('INSERT INTO actors (name, phone) VALUES (?, ?)', a));
  costumes.forEach(c => db.run('INSERT INTO costumes (name, era) VALUES (?, ?)', c));
  hires.forEach(h => db.run(
    'INSERT INTO hires (actor_id, costume_id, hire_date, due_date, returned_date) VALUES (?, ?, ?, ?, ?)', h));

  db.close(() => console.log('Seeded: 5 actors, 22 costumes, 5 hires'));
});
