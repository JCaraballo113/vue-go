import { createRouter, createWebHistory } from 'vue-router'
import Body from '../components/BodyBlock.vue'
import Login from '../components/Login.vue'
import Books from '../components/Books.vue'
import Book from '../components/Book.vue'
import BooksAdmin from '../components/BooksAdmin.vue'
import BookEdit from '../components/BookEdit.vue'
import Users from '../components/Users.vue'
import UserEdit from '../components/UserEdit.vue'
import Security from '@/components/security'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Body
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/books',
    name: 'Books',
    component: Books
  },
  {
    path: '/books/:bookName',
    name: 'Book',
    component: Book
  },
  {
    path: '/admin/books',
    name: 'BooksAdmin',
    component: BooksAdmin
  },
  {
    path: '/admin/books/:bookId',
    name: 'BookEdit',
    component: BookEdit
  },
  {
    path: '/admin/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/admin/users/:userId',
    name: 'UserEdit',
    component: UserEdit
  },
]

const PROTECTED_ROUTES = routes.filter(route => route.path.includes('/admin')).map(route => route.path)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if(PROTECTED_ROUTES.includes(to.matched[0].path)) {
    await Security.checkToken();
  }
  next()
});

export default router
