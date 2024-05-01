import express from 'express'
import bodyParser, { json } from 'body-parser'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import routes from './routes';

const PORT = process.env.PORT || 3500;

const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
}));
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(routes);

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));



export default app;
