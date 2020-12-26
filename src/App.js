import logo from './logo.svg';
import './App.css';
import {useEffect} from 'react'
import axios from 'axios'
import {Form,Input, Typography , Button} from 'antd'

const {Title} = Typography

function App() {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(window.location)
    console.log("eliran!!!")
  //   window.chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  //     let url = tabs[0].url;
  //     axios.post("https://eliran.free.beeceptor.com", {url})
  //     console.log({url})
  //     // use `url` here inside the callback because it's asynchronous!
  // });
  }, [])

  function save(values) {
  window.chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;
      axios.post("https://apiparrot.io/echo/kbe0dq0tqg", {...values,url})
  })
}

  return (
    <div className="App App-header">
      <Title type="success" keyboard level={3}>Elementeam.io</Title>
      <Form onFinish={save} form={form}>
        <Form.Item style={{width: 200}} name="name">
          <Input placeholder="Customer Name"/>
        </Form.Item>
        <Form.Item style={{width: 200}} name="description">
          <Input.TextArea placeholder="description"/>
        </Form.Item>
        <Button htmlType="submit">Save</Button>
      </Form>
    </div>
  );
}

export default App;
