const Message = require("../models/message");
const Conversation = require("../models/conversation");
const { getReceiverSocketId, io } = require("../socket/socket");

console.log("Socket module exports:", Object.keys(getReceiverSocketId));
console.log("io value:", getReceiverSocketId.io);

// send message
exports.sendMessage = async (req, res) => {
  try {
    // fetch data
    const { receiverId, message } = req.body;
    const senderId = req.user.userId;

    // validation
    if (!receiverId || !senderId || !message) {
      return res.status(400).json({
        success: false,
        message: "Something went Wrong while fetching data!",
      });
    }

    if (receiverId === senderId) {
      return res.status(400).json({
        success: false,
        message: "Both the Ids are same",
      });
    }

    // find the conversation history
    let conversation = await Conversation.findOne({
      members: { $all: [receiverId, senderId] },
    });

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    // create new message
    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });

    if (newMessage) {
      conversation.allMessages.push(newMessage);
    }

    await Promise.all([newMessage.save(), conversation.save()]);

    // socket.io implementation
    const receiverSocketId = getReceiverSocketId(receiverId);

    if(receiverSocketId){
      io.to(receiverSocketId).emit("new-message",newMessage);
    }
    
    // return response
    return res.status(200).json({
      success: true,
      message: "Message sent Successfully!",
      newMessage: newMessage,
      conversation: conversation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// find conversation
exports.findConversation = async (req, res) => {
  try {
    // fetch data
    const { receiverId } = req.params;
    const senderId = req.user.userId;

    // validation
    if (!receiverId || !senderId) {
      return res.status(400).json({
        success: false,
        message: "Something went Wrong while fetching Ids!",
      });
    }

    if (receiverId === senderId) {
      return res.status(400).json({
        success: false,
        message: "Both the Ids are same",
      });
    }

    // find conversation
    const conversation = await Conversation.find({
      members: { $all: [senderId, receiverId] },
    })
      .populate("members", "-password")
      .populate("allMessages")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Conversation found Successfully!",
      conversation: conversation === null ? [] : conversation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// find all chat users
exports.chatUsers = async (req, res) => {
  try {
    // fetch currect user id
    const userId = req.user.userId;

    // validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Something went Wrong while fetching userId!",
      });
    }

    // find all users
    const allUsers = await Conversation.find({
      members: { $in: [userId] },
    }).populate("members", "-password");

    // return response
    return res.status(200).json({
      success: true,
      message: "Fetched all users Successfully!",
      allUsers: allUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};
