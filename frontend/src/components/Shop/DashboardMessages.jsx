import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { useNavigate } from "react-router-dom";
import { TfiGallery } from "react-icons/tfi";
import { format } from "timeago.js";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import styles from "../../styles/styles";
import socketId from "../../socket";
const DashBoardMessages = () => {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState({});
  const [conversation, setConversation] = useState([]);
  const { seller } = useSelector((state) => state.seller);
  const [loading, setLoading] = useState(false);
  const [arivalMessage, setArivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState("");
  const [newmessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [activestatus, setActiveStatus] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    arivalMessage &&
      currentChat?.members?.includes(arivalMessage.sender) &&
      setMessages((prev) => [...prev, arivalMessage]);
  }, [arivalMessage, currentChat]);

  useEffect(() => {
    if (!seller?._id) return;
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversation(response.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [seller?._id, messages]);
  useEffect(() => {
    if (seller) {
      const sellerId = seller?._id;
      if (!sellerId) return;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  //get Messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);
  const onLineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    const message = {
      sender: seller?._id,
      text: newmessage,
      conversationId: currentChat?._id,
    };
    const reciverId = currentChat?.members?.find(
      (member) => member.id !== seller?._id
    );
    socketId.emit("sendMessage", {
      senderId: seller?._id,
      reciverId,
      text: newmessage,
    });
    try {
      if (newmessage !== "") {
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
      lastMessage: newmessage,
      lastMessageId: seller?._id,
    });
    axios
      .put(`${server}/conversation/update-last-message/${currentChat?._id}`, {
        lastMessage: newmessage,
        lastMessageId: seller?._id,
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
        const imageData = reader.result;
        setImages(imageData);
        imageSendingHandler(imageData);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const imageSendingHandler = async (imageData) => {
    const receiverId = currentChat?.members?.find(
      (member) => member !== seller?._id
    );
    socketId.emit("sendMessage", {
      senderId: seller?._id,
      receiverId,
      images: imageData,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          sender: seller?._id,
          conversationId: currentChat?._id,
          images: imageData,
        })
        .then((res) => {
          setLoading(false);
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
        lastMessageId: seller?._id,
      }
    );
  };

  return (
    <div className="w-full bg-white m-5 h-[85vh] overflow-y-scroll rounded ">
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins ">
            All Messages
          </h1>
          {conversation.map((item, index) => (
            <MessageList
              key={index}
              me={seller?._id}
              item={item}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              setUserData={setUserData}
              userData={userData}
              online={onLineCheck(item)}
              setActiveStatus={setActiveStatus}
            />
          ))}
        </>
      )}
      {open && (
        <SellerInbox
          setOpen={setOpen}
          messages={messages}
          sellerId={seller?._id}
          newmessage={newmessage}
          setNewMessage={setNewMessage}
          scrollRef={scrollRef}
          sendMessageHandler={sendMessageHandler}
          userData={userData}
          activestatus={activestatus}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  item,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`?${id}`);
  };

  useEffect(() => {
    const userId = item.members.find((user) => user != me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, item]);

  return (
    <div
      className={`w-full flex p-3 px-3 ${
        active == index ? " bg-[#dfa2a255]" : "bg-transparent"
      } cursor-pointer`}
      onClick={() => {
        setActive(index) ||
          handleClick(item._id) ||
          setCurrentChat(item) ||
          setUserData(user) ||
          setActiveStatus(online) ||
          setOpen(true);
      }}
    >
      <div className="relative">
        <img
          className="w-[50px] h-[50px] rounded-full "
          src={`${user?.avatar?.url}`}
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]"></div>
        ) : (
          <div className="w-[12px] h-[12px] bg-[#00000016] rounded-full absolute top-[2px] right-[2px]"></div>
        )}
      </div>
      <div className="pl-3">
        <h1 className=" text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          <span>
            {item?.lastMessageId !== user?._id
              ? "YOU: "
              : `${user?.name?.split(" ")[0]}: `}
            {item?.lastMessage}
          </span>
        </p>
      </div>
    </div>
  );
};
const SellerInbox = ({
  setOpen,
  sellerId,
  messages,
  newmessage,
  setNewMessage,
  sendMessageHandler,
  userData,
  activestatus,
  handleImageUpload,
  scrollRef,
}) => {
  return (
    <div
      className="w-full min-h-screen flex flex-col justify-between"
      ref={scrollRef}
    >
      {/* Message Header */}
      <div className="w-full flex items-center justify-between p-3 bg-slate-200">
        <div className="flex">
          <img
            alt="User Avatar"
            className="w-[60px] h-[60px] rounded-full"
            src={`${userData?.avatar?.url}`}
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1 className="">{activestatus ? "Active Now" : null}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>
      {/* Messages Map */}
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => {
            return (
              <div
                key={index}
                className={`w-full flex my-2 ${
                  item.sender === sellerId ? "justify-end" : "justify-start"
                }`}
              >
                {item.sender !== sellerId && (
                  <img
                    src={`${userData?.avatar?.url}`}
                    alt="sender-image"
                    className="w-[40px] h-[40px] rounded-full mr-3"
                  />
                )}
                {item.images && (
                  <img
                    src={`${item.images?.url}`}
                    className="w-[300px] h-[300px] object-cover rounded-[10px] mr-2"
                  />
                )}

                {item.text?.trim() && (
                  <div>
                    <div
                      className={`w-max p-2 rounded ${
                        item.sender === sellerId ? "bg-[#000]" : "bg-[#38c776]"
                      } text-[#fff] h-min`}
                    >
                      <p>{item?.text}</p>
                    </div>

                    <p className="text-[12px] text-[#000000d3] pt-1">
                      {format(item.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* All the Messages */}

      {/* Send Message Input */}
      <form
        aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[3%]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery size={20} className="cursor-pointer" />
          </label>
        </div>
        <div className="w-[97%]">
          <input
            className={`${styles.input}`}
            type="text"
            placeholder="Enter Your Message"
            value={newmessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <input
            type="submit"
            required
            value="send"
            className="hidden"
            id="send"
          />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};
export default DashBoardMessages;
