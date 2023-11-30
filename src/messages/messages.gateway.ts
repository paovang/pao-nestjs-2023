import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    const message = await this.messagesService.create(createMessageDto, client.id);

    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllMessages')
  async findAll() {
    return await this.messagesService.findAll();
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }

  /** Special */
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket
  ) {
    return this.messagesService.indentify(name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: string,
    @ConnectedSocket() client: Socket 
  ) {
    const name = await this.messagesService.getClientName(client.id);

    client.broadcast.emit('typing', { name, isTyping });
  }
}