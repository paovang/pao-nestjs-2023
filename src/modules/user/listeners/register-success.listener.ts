import { RegisterSuccessEvent } from './../domain/events/register-success.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(RegisterSuccessEvent)
export class RegisterSuccessListener implements IEventHandler<RegisterSuccessEvent>
{
  async handle({ id, amount }: RegisterSuccessEvent): Promise<any> {
    console.log('id: ', id, 'amount: ', amount);
  }
}