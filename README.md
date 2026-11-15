# CostumeCloset – Costume Hire Backend

Backend Development Fundamentals · Group Assignment · Section GAI2B · Group 8

A theatre hires out costumes before every show and keeps losing track of which costume is with which actor, and returns come back late. This REST API records actors, costumes and hires, so the theatre can always see who has what.

## Team
| Member | Name | Part |
|---|---|---|
| M1 | M. Anirudh | 1 – Server and routes |
| M2 | Sai Krishna | 2 – Database |
| M3 | Sumanth | 3 – REST endpoints (CRUD + join) |
| M4 | P. Jashwanth | 4 – Validation and search, 5 – Twist (soft delete and restore) |
| M5 | P. Sai Ram | 6 – Postman and README |

## Tech stack
Node.js · Express · SQLite (sqlite3)

## How to run
```bash
git clone https://github.com/anirudhmittaofficial-tech/costumecloset-backend_LG-8.git
cd costumecloset-backend_LG-8
npm install
npm run seed     # creates the tables and adds sample data
npm start        # server runs on http://localhost:3000
```

## Project structure
```
server.js            Express setup, route wiring, error handling
db.js                SQLite connection and the 3 tables
seed.js              Sample data (5 actors, 22 costumes, 5 hires)
validators.js        Input validation functions
routes/
  actors.js          Actors endpoints
  costumes.js        Costumes endpoints (CRUD, search, soft delete, restore)
  hires.js           Hires endpoints (join, add, return)
```

## Database (3 related tables)
| Table | Columns |
|---|---|
| actors | id, name, phone |
| costumes | id, name, era, deleted |
| hires | id, actor_id, costume_id, hire_date, due_date, returned_date |

`hires.actor_id` links to `actors.id`, and `hires.costume_id` links to `costumes.id` (foreign keys).

## Endpoints
| Method | URL | Description | Status codes |
|---|---|---|---|
| GET | /costumes | All visible costumes. Search with `?era=Victorian` or `?name=gown` | 200 |
| GET | /costumes/:id | One costume | 200, 400, 404 |
| POST | /costumes | Add a costume `{name, era}` | 201, 400 |
| PUT | /costumes/:id | Update a costume `{name, era}` | 200, 400, 404 |
| DELETE | /costumes/:id | Soft delete (hides the costume) | 200, 400, 404 |
| POST | /costumes/:id/restore | Restore a hidden costume | 200, 400, 404 |
| GET | /actors | All actors | 200 |
| POST | /actors | Add an actor `{name, phone}` | 201, 400 |
| GET | /hires | Join: hires with actor name and costume name | 200 |
| POST | /hires | Add a hire `{actor_id, costume_id, hire_date, due_date}` (dates as YYYY-MM-DD) | 201, 400, 404 |
| PUT | /hires/:id/return | Mark a hire as returned today | 200, 400, 404 |

## Search
`GET /costumes?era=Victorian` returns only costumes whose era contains "Victorian".
`GET /costumes?name=gown` returns only costumes whose name contains "gown".

## Validation
Bad input returns status 400 with a clear message, for example:
```json
{ "error": "name is required and must be a non-empty string" }
```
Validation covers: empty or missing name and era, an id that is not a positive whole number, invalid dates, and a due date before the hire date.

## Soft delete and restore (our twist)
`DELETE /costumes/:id` does not remove the row. It only sets `deleted = 1`.
A hidden costume is missing from `GET /costumes` and returns 404 when fetched.
`POST /costumes/:id/restore` sets `deleted = 0` and brings the costume back.

| Test | Request | Expected |
|---|---|---|
| 1 | DELETE /costumes/15 | 200 |
| 2 | GET /costumes/15 | 404 |
| 3 | POST /costumes/15/restore, then GET /costumes/15 | 200, then 200 |

## Postman tests
1. Run `npm run seed` and `npm start`.
2. In Postman, click **Import** and choose `CostumeCloset.postman_collection.json`.
3. Open the collection, check that the variable `baseUrl` is `http://localhost:3000`.
4. Click **Run** (Collection Runner) and start the run. Every test should pass.
5. Run the **Twist Tests** folder in order: delete 15, get 15 (404), restore 15, get 15.
6. Run `npm run seed` again before re-running the collection, so the data is fresh.