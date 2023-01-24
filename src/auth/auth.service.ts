import { UserService } from '@app/user/user.service';
import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async googleLogin(token: string) {
    const oAuth2GoogleClient = new OAuth2Client({
      clientId:
        '459102036002-c3njpd4m3u89u6jvc3d4cmuv8mqu87s3.apps.googleusercontent.com',
      clientSecret: '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',
    });
    const ticket = await oAuth2GoogleClient.verifyIdToken({
      idToken: token,
      audience:
        '459102036002-c3njpd4m3u89u6jvc3d4cmuv8mqu87s3.apps.googleusercontent.com',
    });
    let payload = ticket.getPayload();
    const { email, name, picture, given_name } = payload;
    let userExist = await this.userService.getUserByEmail(email);
    let user = userExist.toObject({ getters: true });
    if (userExist) {
      let token = this.userService.generateJWT({
        id: userExist._id,
        email: userExist.email,
      });
      return { token, ...user };
    } else {
      //create new user
      let newUser = {
        fullName: name,
        username: given_name,
        email,
        image: picture,
        country: '63beb746dbe9063bcab93820',
        region: '63beb746dbe9063bcab93821',
      };
      let user = await this.userService.createUser(newUser);
      let token = this.userService.generateJWT({
        id: user._id,
        email: user.email,
      });
      console.log(JSON.stringify(user));

      return { token, ...user };
    }
  }
}
