import { DEFAULT_QUEUE_SERVICE } from '@/infrastructure/adapters/queue/inject-key';
import { JobNames } from './../infrastructure/adapters/queue/bull/constants/queue.constants';
import { IDefualtQueue } from '@/infrastructure/ports/queue/default-queue.interface';
import { ICache } from '@/infrastructure/ports/cache/cache.interface';
import { CACHE_SERVICE } from '@/infrastructure/adapters/cache-manager/inject-key';
import { LoginService } from './ldb-login.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import * as axios from 'axios';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class LdbPaymentService {
    private readonly _ldbMcid;
    private readonly _ldbSecretKey;
    private readonly _ldbPartnerId;
    private readonly _urlGenerateQrPayment;

    constructor(
        private readonly _loginService: LoginService,
        @Inject(CACHE_SERVICE) private readonly cacheService: ICache<any>,
        private readonly i18n: I18nService,
        @Inject(DEFAULT_QUEUE_SERVICE)
        private readonly _queue: IDefualtQueue<any>
    ) {
        this._ldbMcid = process.env.LDB_MCID;
        this._ldbSecretKey = process.env.LDB_SECRET_KEY;
        this._ldbPartnerId = process.env.LDB_PARTNER_ID;
        this._urlGenerateQrPayment = process.env.LDB_URL_GEN_QR_PAYMENT;
    }

    async generateLDBQrPayment(orderNumber: string, total: number): Promise<any> {
        // const transMessage = this.i18n.t('error.BAD_REQUEST', {
        //     lang: I18nContext.current().lang
        // });
        // return transMessage;

        // await this._queue.addJob(JobNames.SendMail, { data: 'i need send email.' });


        const ref1 = 'CUS-229';
        const ref2 = orderNumber;
        const amount = total;
        let responseAccessToken = '';

        try {
            
            if (!await this.cacheService.get('accessToken')) {
                responseAccessToken = await this._loginService.loginWithLDB();
                await this.cacheService.set('accessToken', responseAccessToken, 3600000);
            }
            
            const { genDigest, body } = await this.generateDigestAndBody(amount, ref1, ref2, this._ldbMcid);
            const genUUIDV4 = await this.generateUUID4();
            const genSignature = await this.generateSignature(genDigest, genUUIDV4, this._ldbSecretKey);

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await this.cacheService.get('accessToken'),
                'x-client-transaction-id': genUUIDV4,
                'x-client-Transaction-datetime': '2023-12-24T17:26:40.979+0700',
                'partnerId': this._ldbPartnerId,
                'digest': 'SHA-256=' + genDigest,
                'signature': `keyId="key1",algorithm="hs2019",created=1687621783,expires=1687621783,headers="digest (request-target) (created) x-client-transaction-id",signature="${genSignature}"`,
            };

            const response = await axios.default.post(this._urlGenerateQrPayment, body, { headers: headers });
            
            return response.data;
        } catch (e) {
            const status = e.response?.status || 500;
            const message = e.response?.data || 'Internal Server Error';

            throw new HttpException({ errors: message }, status);
        }
    }

    async generateDigestAndBody(amount: number, ref1: string, ref2: string, ldbMcid: string) {
        const body = {
            qrType: "38",
            platformType: "IOS",
            merchantId: ldbMcid,
            terminalId: null,
            promotionCode: null,
            expiryTime: "15",
            makeTxnTime: "1",
            amount: amount,
            currency: "LAK",
            ref1: ref1,
            ref2: ref2,
            ref3: "HAL-2023",
            mobileNum: "2099490807",
            deeplinkMetaData: {
                deeplink: "N",
                switchBackURL: null,
                switchBackInfo: null,
            },
            metadata: "PAYMENT ORDER",
        };
    
        const bodyJson = JSON.stringify(body);
        const digest = crypto.createHash('sha256').update(bodyJson).digest('base64');
    
        return {
            genDigest: digest,
            body: body,
        };
    }

    async generateSignature(genDigest: string, uuid4: string, secretKey: string): Promise<string> {
        const digest = `digest: SHA-256=${genDigest}\n`;
        const requestTarget = '(request-target): post /vboxConsumers/api/v1/qrpayment/initiate.service\n';
        const created = '(created): 1687621783\n';
        const xClientTransactionId = `x-client-transaction-id: ${uuid4}`;

        const payload = `${digest}${requestTarget}${created}${xClientTransactionId}`; // The data you want to generate an HMAC for
        
        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(payload);

        const base64Hash = hmac.digest('base64'); // Encode the hash in Base64

        return base64Hash || null;
    }

    async generateUUID4(): Promise<string> {
        return uuid.v4();
    }
}

// https://www.devglan.com/online-tools/hmac-sha256-online