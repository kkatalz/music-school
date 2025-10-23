# This project is aimed to operate Music school website. The school that has teachers and students. The project itself is implemented in Nest.js using TypeORM, Postgres on backend and Streamlit (Python's library) on frontend.#

# _Steps to start a project_

I'll assume you have Node.js, npm (or yarn), and Python (for Streamlit) already installed. If you do, proceed to the next steps:

1. You'll need to install Docker desktop and sign up there (official website: https://www.docker.com/)

2. Navigate to your backend directory: _cd backend_

   - npm install -g @nestjs/cli
   - npm install

3. Navigate to your frontend directory: _cd frontend_

   - python -m venv venv
   - .\venv\Scripts\activate
   - pip install streamlit

4. terminate venv and navigate back to music-school. Run:
   docker-compose up --build  
   The command above will build a project. You shouldn't see any errors in terminal. To check if everything is okay, go
   to http://localhost:8501/ (frontend page) and http://localhost:3000/api (backend page)

# ! 1. To run a project

- backend use _docker-compose up -d_ -> docker-compose exec api npm run migration:run -> docker-compose logs -f api
- frontend do: cd frontend-react -> npm i -> npm run dev

! In order to make any changes in terminal (generate migration, drop db) you should run your project using the command above first (docker-compose up -d) because it starts the db with backend. And when it's running, just open another window in terminal and do your commands there.

# ! 2. Use the Docker Container's Log: To see the actual application logs, use: _docker-compose logs -f api_

# ! When you change something (e.g., in services), you need to notify docker about them: _docker-compose restart api_ -> _docker-compose logs -f api_

# Notes:

- If you change _Docker_ files or .env, do the following commands in terminal:

  1. docker-compose down -v
  2. docker-compose up -d --build
  3. docker-compose exec api npm run migration:run

- If you change _docker-compose.yml_ file, do the following commands in terminal:

  1. docker-compose down -v
  2. docker-compose up -d
  3. docker-compose exec api npm run migration:run

- To generate a migration - stay in root folder (music-school) and run:
  docker-compose exec api npx typeorm-ts-node-commonjs migration:generate -d src/ormconfig.ts src/migrations/CreateTeacherEntity
  (\*after generating new migration, always run it! (command below))

- To run (apply generated migrations use):
  docker-compose exec api npm run migration:run

- To clean db (you wat to start over or messed up with migrations):
  docker-compose exec api npm run db:drop

- To see you Postgres db, type in terminal while in _music-school_ folder:
  1. docker-compose exec db bash (to open a shell (bash) session)
  2. psql -U postgres -d music-school
  3. then use Postgres commands (see below)

Postgres cheat sheet:

1. \dt - List all tables in the current schema
2. \d teachers - Describe the teachers table
3. SELECT \* FROM teachers;
4. \q - exit
5. DELETE FROM grades;
6. INSERT INTO teachers ( first_name, last_name, phone, education, email, password, is_head_teacher) VALUES ('Head', 'Headovich', '3809565909', 'Master of Computer Science', 'test@test.com', '$2a$12$okyYpX4/Vo0TwKFYVQkRzub0ok0AMzDoLF2eIcK8BLVJPemLEEz/u', TRUE);

<!-- password: test12 -->
