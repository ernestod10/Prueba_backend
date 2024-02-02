# Prueba_backend

## Backend basico En node.js express y typescript
Start

```
npx ts-node src/index.ts
```

## Singup

```
http://localhost:3000/signup

Body(json):
{
    "username":"test",
    "email":"test@test.com",
    "password":"123456789",
    "password2":"123456789"
}
```

## Login

```
http://localhost:3000/login

Body(json):
{
    "username":"test",
    "password":"123456789"
}
```

## Logout

```
http://localhost:3000/login
```

## buscar Logged User

la busqueda se hace por el cookie.auth que se devuelve al login, se verifica que este logeado y que no este expirado y devuelve los datos del usuario

```
http://localhost:3000/user
```

## List All Users

```
http://localhost:3000/users
```
