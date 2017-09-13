# Ono

Multi-user rss feed aggregator with trending and watch words functionality.

## Getting Started

```
git clone https://github.com/d-ban/ono.git

cd ono/ono_client
npm install
# edit src/vars.js to match your hostname (export default 'http://yourhostname:PORT';)
yarn build
cd ..
cp -R ono_client/build/ public/
npm start
```

#### Create new user

```
curl --request POST \
  --url http://yourhostname:PORT/users \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/json' \
  --data '{"strategy":"local","email":"dban@x.me","password":"dban"\n}'
```

#### Quick start video.
[![Quick Tour](https://img.youtube.com/vi/LH3x3Qr1ySo/0.jpg)](https://www.youtube.com/watch?v=LH3x3Qr1ySo)
## Built With

* [Feathersjs](https://github.com/feathersjs/feathers/) - An open source REST and realtime API layer for modern applications.
* [React](https://facebook.github.io/react/) - A JAVASCRIPT LIBRARY FOR BUILDING USER INTERFACES
* [Semantic UI React](https://react.semantic-ui.com/) - Semantic is a development framework that helps create beautiful, responsive layouts using human-friendly HTML.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
