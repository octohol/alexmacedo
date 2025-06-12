# Tailspin Toys

This repository contains the project for a 1 hour guided workshop to explore GitHub Copilot Agent Mode and related features in Visual Studio Code. The project is a website for a fictional game crowd-funding company, with a [Flask](https://flask.palletsprojects.com/en/stable/) backend using [SQLAlchemy](https://www.sqlalchemy.org/) and [Astro](https://astro.build/) frontend using [Svelte](https://svelte.dev/) for dynamic pages.

To begin the workshop, start at [docs/README.md](./docs/README.md)

Or, if just want to run the app...

## Launch the site

A script file has been created to launch the site. You can run it by:

```bash
./scripts/start-app.sh
```

Then navigate to the [website](http://localhost:4321) to see the site!

## API Documentation

The backend provides several REST API endpoints:

### Games API

#### Get all games (with optional filtering)
- **GET** `/api/games`
- **Query Parameters:**
  - `category` (optional): Filter by category ID
  - `publisher` (optional): Filter by publisher ID
- **Example:** `/api/games?category=1&publisher=2`

#### Get single game
- **GET** `/api/games/{id}`

### Categories API

#### Get all categories
- **GET** `/api/categories`
- Returns categories sorted by name with game counts

### Publishers API

#### Get all publishers
- **GET** `/api/publishers`
- Returns publishers sorted by name with game counts

## License 

This project is licensed under the terms of the MIT open source license. Please refer to the [LICENSE](./LICENSE) for the full terms.

## Maintainers 

You can find the list of maintainers in [CODEOWNERS](./.github/CODEOWNERS).

## Support

This project is provided as-is, and may be updated over time. If you have questions, please open an issue.
