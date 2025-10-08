import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3128"; // your backend URL
export const socket = io(SOCKET_URL, { autoConnect: false });

export default socket;
