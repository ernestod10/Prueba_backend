import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

chai.use(chaiHttp);

describe('User', () => {
    describe('POST /signup', () => {
        it('should create a new user', (done) => {
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
                    expect(res.body).to.have.property('username', 'test');
                    expect(res.body).to.have.property('email', 'test@test.com');
                    // Add more assertions as needed
                    done();
                });
        });
    });
});
