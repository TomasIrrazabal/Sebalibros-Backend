import 'dotenv/config';
import colors from 'colors'
import app from './server'


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(colors.yellow(`Server running on port:  `) + colors.bgMagenta.black.bold(` ${PORT} `))
  console.log(colors.magenta("Conexion exitosa a la base de datos"))
})
