### Palette Picker API
Each endpoint is prefaced by `https://palette-picker-1908.herokuapp.com`

| Purpose | URL | Verb | Request Body | Sample Success Response |
|----|----|----|----|----|
| Get all projects |`/api/v1/projects`| GET | N/A | All projects in database: `{projects: [{id: 1, title: "Kitchen"}, {id: 2, title: "Bedroom"},...]}` |
| Get specific project |`/api/v1/projects/:id`| GET | N/A | Single project: `{id: 1, title: "Kitchen"}` |
| Submit a new project |`/api/v1/projects`| POST | `{title: <String>}` | The project that was successfully created: `{id: 100, title: "Hallway"}` |
| Update an existing project's title |`/api/v1/projects/:id`| PATCH | `{id: <Integer>, title: <String>}` | The project with new title: `{id: 100, title: "Living Room"}` |
| Update an existing palette |`/api/v1/palettes/:id`| PATCH | Palette with id and property/properties to update: `{id: <Integer>, title: <String>, color_3_id: <String>}` | The palette with updated info: `{id: 278, title: "floor", color_1_id: "#e4e321", color_2_id: "#e4a567", color_3_id: "#bad876", color_4_id: "#ebf112", color_5_id: "#ffffff", project_id: 20}` |
| Remove a specific palette  |`/api/v1/palettes/:id`| DELETE | N/A | 200 status code (NO CONTENT in response body) |
| Get specific palette |`/api/v1/palettes/:id`| GET | N/A | Single palette: `{id: 278, title: "floor", color_1_id: "#e4e321", color_2_id: "#e4a567", color_3_id: "#bad876", color_4_id: "#ebf112", color_5_id: "#ffffff", project_id: 20}` |
| Get all palettes |`/api/v1/palettes`| GET | N/A | All palettes in database: `{palettes: [{id: 278, title: "floor", color_1_id: "#e4e321", color_2_id: "#e4a567", color_3_id: "#bad876", color_4_id: "#ebf112", color_5_id: "#ffffff", project_id: 20}, ...]}` |
| Submit a new palette |`/api/v1/palettes`| POST | `{title: <String>, color_1_id: <String>, color_2_id: <String>, color_3_id: <String>, color_4_id: <String>, color_5_id: <String>, project_id: <Integer>}` | The palette that was successfully created: `{id: 300, title: "floor", color_1_id: "#e4e321", color_2_id: "#e4a567", color_3_id: "#bad876", color_4_id: "#ebf112", color_5_id: "#ffffff", project_id: 20}` |
| Delete a project and all associated palettes |`/api/v1/projects/:id`| DELETE | N/A | 204 status code (NO CONTENT in response body) |
