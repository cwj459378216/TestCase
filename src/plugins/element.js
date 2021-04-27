import Vue from 'vue'
import {
  Container,
  Header,
  Main,
  Row,
  Col,
  Select,
  Option,
  Button,
  Card,
  Tree,
  Input,
  MessageBox,
  Dialog,
  Table,
  TableColumn,
  Loading,
  Message,
  FormItem,
  Form,
  Upload
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Card)
Vue.use(Tree)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Loading)
Vue.use(Upload)
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
