# What Happen Around The World

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command
4. create folder `src/public/images`

## steps to acces endpoint :

### Users

**login :**
`http://localhost:3000/api/login`

using body raw json with post request

```
{
	"fullname":"example username",
	"email": "example@mail.com"
}
```

**register :**
`http://localhost:3000/api/register`

using body raw json with post request

```
{
	"fullname":"example username",
	"email": "example@mail.com",
	"avatar": id avatar
}
```

**get all user :**
`http://localhost:3000/api/users`

### avatars

**post avatar :**
`http://localhost:3000/api/avatar`

using body form-data with post request

```
key-------------------
image * file *
price * text *
```

**get all avatars**
`http://localhost:3000/api/avatars`
