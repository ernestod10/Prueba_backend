import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

chai.use(chaiHttp);
const expect = chai.expect;

describe('post /singup', () => {
    it('should return 200', (done) => {
        chai.request(app)
        .post('/signup')
        .send({
            username: 'test',
            email: 'test@test.com',
            password: 'test1234',
            password2: 'test1234'
        })
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
    }
    );
}
);