
const express = require('express')
const { webosService } = require('./spnp_webos_service/index')
const cors = require('cors')
const app = express()

const router = express.Router()
const port = 8051


router.post('/', async (req, res) => {
    const { body } = req
    const { method } = body
    delete body.method
    
    console.log(`req ${method}`)
    console.log(body)
    const message = {
        respond: response => {
            if (response) {
                if ('returnValue' in response) {
                    if (response.returnValue === false) {
                        res.status(500).json(response)
                    } else {
                        res.status(200).json(response)
                    }
                } else {
                    res.status(200).json(response)
                }
            } else {
                res.sendStatus(200)
            }
        },
        payload: body.payload || {}
    }
    if (method) {
        webosService[method](message)
    } else {
        res.sendStatus(401)
    }
})

app.use(cors())
app.use(express.json())

app.use('/webos', router)

app.listen(port, () => {
    console.log(`api escuchando en el puerto ${port}`)
})
