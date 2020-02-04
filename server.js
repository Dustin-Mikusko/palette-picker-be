const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Palette Picker';

app.get('/', (req, res) => {
  res.send('oh hello')
})
 


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
})
