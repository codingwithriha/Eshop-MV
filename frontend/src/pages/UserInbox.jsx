import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import socketId from "../socket";
import { format } from "timeago.js";
import { server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/styles";

const UserInbox = () => {
  const { user,loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [, setImages] = useState();
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members?.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (!user?._id) return;
    const getConversation = async () => {
      try {
        const resonse = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversations(resonse.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [user?._id, messages]);

  useEffect(() => {
    if (user) {
      const sellerId = user?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user?._id,
      text: newMessage,
      conversationId: currentChat?._id,
    };
    const receiverId = currentChat?.members?.find(
      (member) => member !== user?._id
    );

    socketId.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: user?._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat?._id}`, {
        lastMessage: newMessage,
        lastMessageId: user?._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {

    const receiverId = currentChat?.members?.find(
      (member) => member !== user?._id
    );

    socketId.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(
          `${server}/message/create-new-message`,
          {
            images: e,
            sender: user?._id,
            text: newMessage,
            conversationId: currentChat?._id,
          }
        )
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat?._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: user?._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-[75vh] w-full bg-[#f7f9f6] pb-12">
      {!open && (
        <>
          <Header />
          <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6"><div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#9a8058]">Your conversations</p><h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#26372d]">Messages</h1><p className="mt-2 text-sm text-[#87938a]">Connect with shops and get help with your orders.</p></div><span className="rounded-full border border-[#e2e9e0] bg-white px-4 py-2 text-xs font-bold text-[#657369]">{conversations.length} conversations</span></div><div className="overflow-hidden rounded-[24px] border border-[#e5ebe3] bg-white shadow-[0_12px_36px_rgba(36,55,42,.055)]">
          {/* All messages list */}
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user?._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
                loading={loading}
              />
            ))}
          {conversations.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3ed] text-2xl text-[#315c46]">✉</div>
              <h2 className="mt-4 font-display text-lg font-extrabold text-[#344238]">No conversations yet</h2>
              <p className="mt-1 text-sm text-[#87938a]">When you contact a shop, your messages will appear here.</p>
            </div>
          )}
          </div>
          </section>
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={user?._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data, online, setActiveStatus]);

  return (
    <button type="button"
      className={`flex w-full items-center gap-4 border-b border-[#f0f3ee] px-5 py-4 text-left transition hover:bg-[#f7faf6] ${active === index ? "bg-[#edf3ed]" : "bg-white"}`}
      onClick={() => { setActive(index); setCurrentChat(data); setUserData(user); setActiveStatus(online); handleClick(data._id); }}
    >
      <div className="relative">
        <img
          src={`${user?.avatar?.url}`}
          alt=""
          className="h-12 w-12 rounded-full border border-[#e5ebe3] object-cover"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {!loading && data?.lastMessageId !== userData?._id
            ? "You:"
            : userData?.name.split(" ")[0] + ": "}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </button>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-110px)] w-full max-w-6xl flex-col justify-between bg-[#f7f9f6] p-3 sm:p-6">
      {/* message header */}
      <div className="flex w-full items-center justify-between rounded-t-[22px] border border-[#e5ebe3] bg-white p-4 shadow-sm">
        <div className="flex">
          <img
            src={`${userData?.avatar?.url}`}
            alt=""
            className="h-12 w-12 rounded-full border border-[#e5ebe3] object-cover"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* messages */}
      <div className="h-[68vh] overflow-y-auto border-x border-[#e5ebe3] bg-[#fbfcfa] px-4 py-5 sm:px-7">
        {messages &&
          messages.map((item, index) => (
            <div
              className={`flex w-full my-2 ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
              ref={scrollRef}
            >
              {item.sender !== sellerId && (
                <img
                  src={`${userData?.avatar?.url}`}
                  className="w-[40px] h-[40px] rounded-full mr-3"
                  alt=""
                />
              )}
              {item.images && (
                <img
                  src={`${item.images?.url}`}
                  className="w-[300px] h-[300px] object-cover rounded-[10px] ml-2 mb-2"
                  alt="Message attachment"
                />
              )}
              {item.text !== "" && (
                <div>
                  <div
                    className={`max-w-[min(78vw,560px)] rounded-2xl px-4 py-3 shadow-sm ${
                      item.sender === sellerId ? "rounded-br-md bg-[#315c46] text-white" : "rounded-bl-md border border-[#e7ece5] bg-white text-[#344238]"
                    } h-min`}
                  >
                    <p>{item.text}</p>
                  </div>

                  <p className="text-[12px] text-[#000000d3] pt-1">
                    {format(item.createdAt)}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* send message input */}
      <form
        className="relative flex w-full items-center gap-3 rounded-b-[22px] border border-t-0 border-[#e5ebe3] bg-white p-4 shadow-sm"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#e3e9e1] bg-[#f8faf7] px-4 pr-12 text-sm text-[#344238] outline-none transition focus:border-[#315c46] focus:ring-4 focus:ring-[#315c46]/10"
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-7 top-1/2 -translate-y-1/2 cursor-pointer text-[#315c46]"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default UserInbox;
