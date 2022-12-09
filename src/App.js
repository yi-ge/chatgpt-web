import { useEffect, useState } from "react";
import Chat, {
  Bubble,
  useMessages,
  Notice,
  Icon,
  Modal,
  Button,
  toast,
} from "@chatui/core";
import axios from "axios";
import { io } from "socket.io-client";
import { v4 as uuid } from 'uuid'

const axiosInstance = axios.create();
const converter = new showdown.Converter(); // eslint-disable-line no-undef

let userUUID = localStorage.getItem("userUUID");
if (!userUUID) {
  userUUID = uuid()
  localStorage.setItem("userUUID", userUUID);
}

const socket = io("//" + process.env.REACT_APP_API_DOMAIN, {
  query: {
    userUUID
  },
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  timeout: 10000,
});

socket.on("connect", () => {
  console.log("socket connected");
});

const initialMessages = [
  {
    type: "notice",
    content: { text: "受限于光速，响应较慢属于正常现象" },
  },
  {
    type: "notice",
    content: { text: "目前系统只同时支持 1 个人进行测试" },
  },
];

const defaultQuickReplies = [
  {
    icon: "message",
    name: "联系人工服务（报告故障）",
    isNew: true,
    isHighlight: true,
  },
];

let isExecuted = false;
function App() {
  const { messages, appendMsg, setTyping, deleteMsg } =
    useMessages(initialMessages);
  const [onlineUserNum, setOnlineUserNum] = useState(1);
  const [waitingUserNum, setWaitingUserNum] = useState(0);
  const [open, setOpen] = useState(false);

  function handleModalConfirm(action) {
    if (action === 1) {
      toast.show("正在抢占体验名额")
      socket.emit('rush', true)
    } else {
      toast.show("此功能尚在开发中")
    }
  }

  function socketHandler() {
    isExecuted = true
    if (!sessionStorage.getItem("token")) toast.show("正在抢占体验名额");
    setTimeout(() => {
      socket.on("systemInfo", (data) => {
        console.log("online user num", data);
        setOnlineUserNum(data.onlineUserNum);
        setWaitingUserNum(data.waitingUserNum);
      });

      socket.on("restricted", (data) => {
        console.log("restricted");
        toast.show("未能抢到体验名额");
        setOpen(true);
      })

      socket.on("token", (data) => {
        sessionStorage.setItem('token', data)
        setOpen(false);
        toast.success("成功抢到体验名额");
      })

      socket.emit('ready', true)
    }, 2000); // 避免用户频繁刷新
  }

  useEffect(() => {
    console.log('更新')
    if (!isExecuted) socketHandler();
    document.querySelectorAll('pre code').forEach((el) => hljs.highlightElement(el)) // eslint-disable-line no-undef
  });

  async function handleSend(type, val) {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });

      setTyping(true);

      try {
        const { data } = await axiosInstance.get(
          `//${process.env.REACT_APP_API_DOMAIN}/chatgpt?token=${sessionStorage.getItem("token")}&userUUID=${userUUID}&text=${val.trim()}`
        );
        if (data.code === 1) {
          appendMsg({
            type: "html",
            content: { text: converter.makeHtml(data.result) },
            user: { avatar: "/ai.png" },
          });
        }
      } catch (err) {
        appendMsg({
          type: "error",
          content: { text: "请求错误，请重试。" },
          user: { avatar: "/system.png" },
        });
      }
    }
  }

  function reSend() {
    for (const m of messages) {
      if (m.position === "right") {
        handleSend("text", m.content);
        break
      }
    }
  }


  // 根据消息类型来渲染
  function renderMessageContent({ type, content, _id }) {
    switch (type) {
      case "text":
        return <Bubble content={content.text} />;
      case "error":
        return (
          <Bubble content={content.text}>
            <Icon
              onClick={reSend}
              type="refresh"
              className="btn-refresh"
            />
          </Bubble>
        );
      case "html":
        return (
          <Bubble>
            <div dangerouslySetInnerHTML={{ __html: content.text }} />
          </Bubble>
        );
      case "notice":
        return (
          <Notice
            content={content.text}
            onClose={deleteMsg.bind(this, _id)}
          />
        );
      default:
        return null;
    }
  }

  function handleQuickReplyClick(item) {
    setTyping(true);
    setTimeout(() => {
      appendMsg({
        type: "text",
        content: { text: "请微信联系轶哥：cn-yige" },
        user: { avatar: "/system.png" },
      });
    }, 1000);
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="left-info">{onlineUserNum} 人在线</div>
      <div className="right-info">{waitingUserNum} 人等待</div>
      <Chat
        navbar={{ title: "ChatGPT 测试" }}
        messages={messages}
        renderMessageContent={renderMessageContent}
        quickReplies={defaultQuickReplies}
        onQuickReplyClick={handleQuickReplyClick}
        onSend={handleSend}
      />
      <Modal
        active={open}
        title="🚫 限流提示"
        showClose={false}
        backdrop='static'
      >
        <p style={{ paddingLeft: '15px' }}>⚠️ 由于ChatGPT系统限制，为确保上下文关联正确，只允许同时1个用户体验，系统采用抢单模式进入，下一个用户退出后将释放 1 一个体验名额，点击下方“体验”按钮抢占名额（拼手速），也可以使用您自己的账号。需要注意的是，如果您使用自己的OpenAI账号（支持账号密码或cookie，不支持第三方登录），服务器端将在您退出后销毁内存记录，不会将您的账号借给他人使用。</p>
        <p style={{ paddingLeft: '15px' }}>报告故障微信：molegeek</p>
        <p style={{ paddingLeft: '15px', marginTop: '15px' }}>当前在线人数：{onlineUserNum} 人</p>
        <p style={{ paddingLeft: '15px', fontWeight: 600 }}>当前正在体验人数：{onlineUserNum - waitingUserNum} 人</p>
        <p style={{ paddingLeft: '15px' }}>当前等待体验人数：{waitingUserNum} 人</p>
        <p style={{ paddingLeft: '15px' }}>目前版本支持同时体验人数：1 人</p>
        <p style={{ textAlign: 'center' }}>
          <Button color="primary" onClick={handleModalConfirm.bind(this, 1)}>直接体验</Button>
          <Button style={{ marginLeft: '20px' }} onClick={handleModalConfirm.bind(this, 2)}>使用账号体验</Button>
        </p>
      </Modal>
    </div>
  );
}

export default App;
