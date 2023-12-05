import { UsersService } from './users/users.service';
import { CreateUserDto } from './modules/user/dtos/user.dto';
import { NotificationFirebaseService } from './notification-firebase/notification-firebase.service';
import { FirebaseMiddleware } from './middlewares/otp.middleware';
import { LdbPaymentService } from './ldb-payment/ldb-payment.service';
import { BcelOneService } from './bcel-one/bcel-one.service';
import { TwilioService } from './twilio/twilio.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Controller, Request, Get, Post, UseGuards, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { PubnubService } from './pubnub/pubnub.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly twiloService: TwilioService,
    private readonly pubnubService: PubnubService,
    private readonly bcelOneService: BcelOneService,
    private authService: AuthService,
    private ldbPaymentService: LdbPaymentService,
    private notificationFirebaseService: NotificationFirebaseService,
    private usersService: UsersService,
  ) {}


  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }


  @UseGuards(JwtAuthGuard)
  @Get('user/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('forgot/password')
  async forgotPassword(@Body() body) {
    return this.usersService.forgotPassword(body);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('send/sms')
  sendSMS(): Promise<any> {
    return this.twiloService.sendSMS();
  }

  @Get('send/otp')
  sendOTP(): Promise<any> {
    return this.twiloService.sendOTP();
  }

  @Get('verify/otp')
  verifyOTP(): Promise<any> {
    return this.twiloService.verifyOTP('095552');
  }

  @Get('publish/sms')
  publishMessage(): Promise<any> {
    const messages = 'mam ua ib siab.';

    return this.pubnubService.publishMessage('Channel-Pao', messages);
  }

  @Get('subscript/sms')
  subScriptMessage(): Promise<any> {
    return this.pubnubService.subScribeToShopChannel();
  }

  @Get('generate/qr-bcel-one')
  generateQrBcelOne(): Promise<any> {
    return this.bcelOneService.generateQrBcelOne('HAL-OR-DF18N8440953', 50);
  }

  @Post('generate/ldb-qr-payment')
  generateLDBQrPayment(
    @Body() body: CreateUserDto
  ): Promise<any> {
    return this.ldbPaymentService.generateLDBQrPayment(body.order_number, body.amount);
  }

  @Get('verify-otp')
  @UseGuards(FirebaseMiddleware)
  verifyOtpWithFirebase() {

    return 'pass...';
  }

  @Post('send-notification-real-time')
  sendNotificationFirebase(@Body() payload: { token: string; message: string }) {
    const { token, message } = payload;

    const deviceToken = token;
    const body = message;

    return this.notificationFirebaseService.sendNotificationFirebase(deviceToken, body)
  }


  @Post('upload/file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }


}

// npm install -g pnpm
// npx @nestjs/cli new my-project
// cd my-project
// pnpm install
// pnpm run start:dev
