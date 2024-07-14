import { Hono } from 'hono'
import { blogRoute } from './routes/blog.route';
import { userRoute } from './routes/user.route';

const app = new Hono().basePath('/api/v1')


app.route('/blog', blogRoute)
app.route('/user', userRoute)

export default app
