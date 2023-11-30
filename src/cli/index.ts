import { PubNubSubScribeBcelOneCommand } from './../pubnub/cli/pubnub-subscribe-bcel-one.command';
import { Provider } from '@nestjs/common';
import { TaskRunner } from './task.cli';

export const runners: Provider[] = [PubNubSubScribeBcelOneCommand];