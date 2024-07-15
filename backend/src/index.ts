import { Hono } from 'hono'
import { blogRoute } from './routes/blog.route';
import { userRoute } from './routes/user.route';
import { cors } from 'hono/cors';


const app = new Hono().basePath('/api/v1')

app.use(cors())
app.route('/blog', blogRoute)
app.route('/user', userRoute)

export default app
