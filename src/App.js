import "./App.css";
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { Form, message, Input, Typography, Button, Select } from "antd";
import {
  database,
  takeScreenshot,
  handleGoogleLogin,
  fetchActiveUser,
  storage,
} from "./fb";
import { useList } from "react-firebase-hooks/database";
import { v4 as uuidv4 } from "uuid";
import { CameraOutlined, UndoOutlined, CopyOutlined } from "@ant-design/icons";
import Tags from "./Tags";
const { Title, Text } = Typography;

function App() {
  const [form] = Form.useForm();
  const [activeUser, setActiveUser] = useState({ displayName: "" });
  const [snapshots, loading, error] = useList(database.ref("categories"));
  const [screenshot, setScreenshot] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueId, setUniqueId] = useState();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    form.setFields([{ description: "" }]);
    handleActiveUser();
    const uniqueId = uuidv4();
    setUniqueId(uniqueId);
    return () => {
      setScreenshot();
      form.resetFields();
    };
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

  function copyToClipboard() {
    const el = document.createElement("textarea");
    el.value = screenshot;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    message.success({
      content: "Copied!",
      style: {
        marginTop: "40%",
      },
    });
  }

  function playSound(url) {
    const audio = new Audio(url);
    audio.play();
  }

  function takeAScreenShot() {
    window.chrome.tabs.captureVisibleTab((image) => {
      fetch(image)
        .then((res) => res.blob())
        .then(async (blob) => {
          const screenshotsRef = storage
            .ref()
            .child(`screenshots/some_context`);
          const path = `/${uniqueId}.jpg`;
          playSound(
            "https://webo-tests.s3.eu-west-3.amazonaws.com/camera_click.mp3"
          );
          await screenshotsRef.child(path).put(blob);
          const downloadUrl = await screenshotsRef.child(path).getDownloadURL();
          console.log({ downloadUrl });
          setScreenshot(downloadUrl);
        });
    });
  }

  function save(values) {
    values.tags = tags;
    values.description = values.description ? values.description : "";
    window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let url = tabs[0].url;
      setIsLoading(true);
      const updates = {};
      const key = database.ref().child("elements").push().key;
      updates["/elements/" + key] = {
        key,
        ...values,
        url,
        createdBy: activeUser,
      };
      if (screenshot) {
        updates["/elements/" + key].screenshot = screenshot;
      }
      database
        .ref()
        .update(updates)
        .then(() => {
          setTimeout(() => {
            setIsLoading(false);
            message.success("Element has been added successfully");
            form.resetFields();
            setScreenshot();
          }, 500);
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
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please input a title",
                },
              ]}
              style={{ width: 200 }}
              name="title"
            >
              <Input placeholder="Title" />
            </Form.Item>
            <Form.Item style={{ width: 200 }} name="description">
              <Input.TextArea placeholder="Description (optional)" />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please select category",
                },
              ]}
              name="category"
            >
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
            <Tags onSelect={(tags) => setTags(tags)} />
            <Button
              type="link"
              style={{
                margin: "10px 0",
              }}
              onClick={takeAScreenShot}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {!screenshot ? "Take a Screenshot" : "Take another one"}
                {!screenshot ? (
                  <CameraOutlined style={{ marginLeft: 5, fontSize: 18 }} />
                ) : (
                  <UndoOutlined style={{ marginLeft: 5, fontSize: 18 }} />
                )}
              </div>
            </Button>
            {screenshot && (
              <div
                style={{
                  cursor: "pointer",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                Copy URL
                <CopyOutlined
                  onClick={copyToClipboard}
                  style={{
                    marginRight: 5,
                    color: "white",
                    fontSize: 18,
                  }}
                />
              </div>
            )}
            <Button loading={isLoading} htmlType="submit">
              Save
            </Button>
            <div style={{ marginTop: 20 }}>
              <a
                rel="noreferrer"
                target="_blank"
                href="https://admin.elementeam.io"
              >
                Go to Admin Panel
              </a>
            </div>
          </Form>
        </Fragment>
      ) : (
        <Fragment>
          <Button onClick={handleLogin}>Login</Button>
        </Fragment>
      )}
      <div
        style={{
          marginTop: 5,
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
