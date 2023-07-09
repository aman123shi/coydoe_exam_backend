import { UserService } from '@app/user/user.service';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async googleLogin(token: string) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`,
      );

      console.log(response.data);

      const { email, name, picture, given_name } = response.data; //payload;
      const userExist = await this.userService.getUserByEmail(email);

      if (userExist) {
        const user = userExist.toObject({ getters: true });
        const token = this.userService.generateJWT({
          id: userExist._id,
          email: userExist.email,
        });
        return { token, ...user };
      } else {
        //create new user with default country and region
        const newUser = {
          fullName: name,
          username: given_name,
          email,
          image: picture,
          country: '63beb746dbe9063bcab93820',
          region: '63beb746dbe9063bcab93821',
        };
        const user = await this.userService.createUser(newUser);
        const token = this.userService.generateJWT({
          id: user._id,
          email: user.email,
        });
        console.log(JSON.stringify(user));

        return { token, ...user };
      }
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException();
    }
  }
  async facebookLogin(accessToken: string) {
    try {
      const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
          fields: ['id', 'email', 'first_name', 'last_name', 'picture'].join(
            ',',
          ),
          access_token: accessToken,
        },
      });
      const { id, first_name, last_name, picture } = data;
      console.log(data); // { id, email, first_name, last_name,picture }

      const userExist = await this.userService.getUserByFacebookId(id);

      if (userExist) {
        const user = userExist.toObject({ getters: true });
        const token = this.userService.generateJWT({
          id: userExist._id,
          email: userExist.email,
        });
        return { token, ...user };
      } else {
        //create new user with default country and region
        const newUser = {
          fullName: first_name + ' ' + last_name,
          username: first_name,
          facebookId: id,
          image: picture.data.url,
          country: '63beb746dbe9063bcab93820',
          region: '63beb746dbe9063bcab93821',
        };
        const user = await this.userService.createUser(newUser);
        const token = this.userService.generateJWT({
          id: user._id,
          email: user.email,
        });
        console.log(JSON.stringify(user));

        return { token, ...user };
      }
    } catch (error) {
      console.log(error);

      throw new UnprocessableEntityException();
    }
  }

  async linkedinLogin(accessToken: string) {
    try {
      const urlToGetUserProfile =
        'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))';

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(urlToGetUserProfile, config);

      const { id, localizedFirstName, localizedLastName, profilePicture } =
        response.data;
      console.log('id is ' + id + ' ' + localizedFirstName + localizedLastName);
      console.log(
        JSON.stringify(
          profilePicture['displayImage~'].elements[0].identifiers[0].identifier,
        ),
      );

      const userExist = await this.userService.getUserByLinkedinId(id);

      if (userExist) {
        const user = userExist.toObject({ getters: true });
        const token = this.userService.generateJWT({
          id: userExist._id,
          email: userExist.email,
        });
        return { token, ...user };
      } else {
        //  create new user with default country and region
        const newUser = {
          fullName: localizedFirstName + ' ' + localizedLastName,
          username: localizedFirstName,
          linkedinId: id,
          image:
            profilePicture['displayImage~'].elements[0].identifiers[0]
              .identifier,
          country: '63beb746dbe9063bcab93820',
          region: '63beb746dbe9063bcab93821',
        };
        const user = await this.userService.createUser(newUser);
        const token = this.userService.generateJWT({
          id: user._id,
          email: user.email,
        });
        console.log(JSON.stringify(user));

        return { token, ...user };
      }
    } catch (error) {
      console.log(error);

      throw new UnprocessableEntityException();
    }
  }
}
