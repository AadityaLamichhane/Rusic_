export const sendToSocket = (socket:WebSocket,datainString:string)=>{
    console.log('Sending to the COnnected user');
    socket.send(datainString);
}