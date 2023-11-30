import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class BcelOneService {
    private readonly _mcid;
    private readonly _mcc;
    
    constructor() {
        this._mcid = process.env.BCEL_ONE_MCID;
        this._mcc = process.env.BCEL_ONE_MCC;
    }

    async generateQrBcelOne(orderNumber: string, totalPrice: number): Promise<any> {
        console.log(this._mcid, this._mcc);
        
        const uuid = orderNumber;
        const tid = 'HALCENTER-' + orderNumber;
        const total = totalPrice;

        if (!uuid) {
            throw new HttpException('Please set uuid in GET parameter', HttpStatus.BAD_REQUEST);
        }

        // Bank provide these data
        const mcid = this._mcid; // Replace with your actual MCID
        const mcc = this._mcc; // Replace with your actual MCC
        const ccy = 418;
        const country = 'LA';
        const province = 'VTE';

        // You set these data
        const amount = total;
        const transactionid = uuid; 
        const terminalid = tid;
        const description = '';

        const rawqr = this.buildqr({
            0: '01',
            1: '11',
            33: this.buildqr({
                0: 'BCEL',
                1: 'ONEPAY',
                2: mcid,
            }),
            52: mcc,
            53: ccy,
            54: amount,
            58: country,
            60: province,
            62: this.buildqr({
                1: uuid,
                3: '',
                5: transactionid,
                6: '',
                7: terminalid,
                8: description,
            }),
        });
        
        const fullqr = rawqr + this.buildqr({ 63: this.crc16(rawqr + '6304') }); // Adding itself into checksum

        return fullqr;
    }

    buildqr(arr: { [key: string]: any }): string {
        let res = '';
        for (const [key, val] of Object.entries(arr)) {
            if (!val) continue;
            res +=
            String(key).padStart(2, '0') +
            String(String(val).length).padStart(2, '0') +
            val;
        }
        
        return res;
    }
    
    crc16(sStr: string, aParams: { [key: string]: any } = {}): string {
        const aDefaults = {
            polynome: 0x1021,
            init: 0xFFFF,
            xor_out: 0,
        };
    
        Object.keys(aDefaults).forEach((key) => {
            if (!(key in aParams)) {
                aParams[key] = aDefaults[key];
            }
        });
    
        sStr += '';
        let crc = aParams.init;
        let len = sStr.length;
        let i = 0;
    
        while (len--) {
            crc ^= sStr.charCodeAt(i++) << 8;
            crc &= 0xffff;
        
            for (let j = 0; j < 8; j++) {
                crc = crc & 0x8000 ? (crc << 1) ^ aParams.polynome : crc << 1;
                crc &= 0xffff;
            }
        }
    
        crc ^= aParams.xor_out;

        return crc.toString(16).toUpperCase().padStart(4, '0');
    }
}
