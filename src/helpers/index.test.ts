import {
    convertToOtp,
    convertToUTCTime,
    findPhone,
} from './';
import {metricsToChartData} from './metricsToChartData';

// tslint:disable-next-line:no-any
const defaults: any = {
    time: '2019-01-10T12:14:16Z',
    otp: true,
    phones: [
        {
            country: 'UA',
            number: '380000000000',
            validated_at: '2019-01-14T13:54:48.000Z',
        },
        {
            country: 'UA',
            number: '380111111111',
            validated_at: '2019-01-13T13:54:48.000Z',
        },
        {
            country: 'UA',
            number: 380222222222,
            validated_at: null,
        },
    ],
};


describe('Helpers', () => {
    it('convertToOtp', () => {
        expect(convertToOtp(defaults.otp)).toEqual('true');
        expect(convertToOtp(!defaults.otp)).toEqual('false');
    });

    it('convertToUTCTime', () => {
        expect(convertToUTCTime(defaults.time)).toEqual('Thu, 10 Jan 2019 12:14:16 GMT');
        expect(convertToUTCTime('potato')).toEqual('Invalid Date');
    });

    it('findPhone', () => {
        expect(findPhone(defaults.phones).number).toEqual('380000000000');
        defaults.phones.push(
            {
                country: 'AX',
                number: '123456789098',
                validated_at: '2019-01-17T13:54:48.000Z',
            });
        expect(findPhone(defaults.phones).number).toEqual('123456789098');
    });

    it('converts metrics to chart data', () => {
        const metrics = {
            signups: {
                '2019-05-24': 3,
            },
            sucessful_logins: {
                '2019-05-23': 2,
                '2019-05-24': 3,
            },
            failed_logins: {
                '2019-05-22': 1,
                '2019-05-23': 1,
                '2019-05-24': 3,
            },
            pending_applications: 0,
        };

        const expected = [
            {name: '18/05', signups: 0, sucessful_logins: 0, failed_logins: 0},
            {name: '19/05', signups: 0, sucessful_logins: 0, failed_logins: 0},
            {name: '20/05', signups: 0, sucessful_logins: 0, failed_logins: 0},
            {name: '21/05', signups: 0, sucessful_logins: 0, failed_logins: 0},
            {name: '22/05', signups: 0, sucessful_logins: 0, failed_logins: 1},
            {name: '23/05', signups: 0, sucessful_logins: 2, failed_logins: 1},
            {name: '24/05', signups: 3, sucessful_logins: 3, failed_logins: 3},
        ];

        expect(metricsToChartData(metrics, new Date('2019-05-24'))).toEqual(expected);
    });
});
