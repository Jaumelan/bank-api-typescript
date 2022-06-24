import UsersRoute from './users';
import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(UsersRoute);

export default app;