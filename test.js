const chats = [
  { chatId: 1, content: "chat1" },
  { chatId: 2, content: "chat2" },
];

let tempChats = [];

chats.map((chat, i) => tempChats.push(chat));

tempChats[0].content = "fake chat";

const arr = [1, 2, 3];

console.log(arr.slice(-1)[0]);
