# Money calculator

> A money calculator projecting savings and helper for fixed budget.

## Versions
- Spring Boot: 3.3.0
- Java : 21
- Maven: 3.9.1
- Node : 18.17.1
- React : ^18.3.1

## Run the app

### Local

First, clone this repository.

**Launch the database**
1. Make sure that you have MySQL running and created a new database.
2. Create a `.env` in the resources folder with the `.env.example` given.

**Launch the backend**
1. Make sure you have the required versions of Java and dependencies installed.
2. Open a terminal or command prompt and navigate to the project directory "back".
3. Run the following command to build the project and create an executable JAR file : `mvn package`
4. Once the build is successful, you can launch the app using the following command : `java -jar target/back-0.0.1-SNAPSHOT.jar`

This will start the app on the configured server address : http://localhost:1010

**Launch the front**
```bash
npm install

npm run dev
```

## Endpoints

Swagger : http://localhost:8081/swagger-ui/index.html

## Git

**To push on the repo**
1. Have your own branch clean:
    1. Commit all your changes: `git commit` or via the IDE
    2. OR stash your changes: `git stash` (and later `git stash pop` to retrieve them)
2. `git fetch origin`
3. **If there are downloads**: `git rebase origin/main`
    - There may potentially be conflicts at this stage
    - If this is the case: resolve the conflicts in the IDE and commit the files
    - Do `git rebase --continue` to continue until there are no more conflicts
4. `git push`
5. Create the Pull Request on Github
6. Review and/or merge the PR

**To pull changes on branch**   
Follow steps 1 to 3.
