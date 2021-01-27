import "./App.css";
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { Form, message, Input, Typography, Button, Select } from "antd";
import { database, handleGoogleLogin, fetchActiveUser } from "./fb";
import { useList } from "react-firebase-hooks/database";

const { Title, Text } = Typography;

function App() {
  const [form] = Form.useForm();
  const [activeUser, setActiveUser] = useState({ displayName: "" });
  const [snapshots, loading, error] = useList(database.ref("categories"));
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    handleActiveUser();
  }, []);

  function handleActiveUser() {
    fetchActiveUser().then((user) => {
      setActiveUser(user);
    });
  }

  function handleLogin() {
    handleGoogleLogin().then(() => {
      handleActiveUser();
    });
  }

  function save(values) {
    window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let url = tabs[0].url;
      setIsLoading(true);
      const updates = {};
      const key = database.ref().child("elements").push().key;
      updates["/elements/" + key] = { ...values, url, createdBy: activeUser };
      database
        .ref()
        .update(updates)
        .then(() => {
          setTimeout(() => {
            setIsLoading(false);
            message.success("Element has been added successfully");
            form.resetFields();
          }, 500);
          // database
          // .ref("users/" + activeUser.uid)
          // .set({ ...values, url, createdBy: activeUser });
        });
    });
  }

  return (
    <div style={{ padding: "20px 50px" }} className="App App-header">
      <Title style={{ margin: 15 }} type="success" keyboard level={3}>
        Elementeam.io
      </Title>
      {activeUser ? (
        <Fragment>
          <Text style={{ color: "white", marginBottom: 15 }}>
            Hi {activeUser.displayName}
          </Text>
          <Form onFinish={save} form={form}>
            <Form.Item style={{ width: 200 }} name="category">
              <Select placeholder="Category">
                {snapshots.map((snap) => {
                  const category = snap.val();
                  console.log({ snap, category });
                  return (
                    <Select.Option key={snap.key} value={snap.key}>
                      {category.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item style={{ width: 200 }} name="title">
              <Input placeholder="Title" />
            </Form.Item>
            <Form.Item style={{ width: 200 }} name="description">
              <Input.TextArea placeholder="Description" />
            </Form.Item>
            <Button loading={isLoading} htmlType="submit">
              Save
            </Button>
          </Form>
        </Fragment>
      ) : (
        <Fragment>
          <Button onClick={handleLogin}>Login</Button>
        </Fragment>
      )}
      <div
        style={{
          marginTop: 35,
          fontSize: 10,
        }}
      >
        <span style={{ marginRight: 3 }}>Powered by</span>
        <a rel="noreferrer" target="_blank" href="https://webo-tech.com">
          Webo-Tech.com
        </a>
      </div>
    </div>
  );
}

export default App;
