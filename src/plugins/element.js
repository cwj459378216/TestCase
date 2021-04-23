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
  Loading
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
Vue.use(Loading)
Vue.prototype.$alert = MessageBox.alert
