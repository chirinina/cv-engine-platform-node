##

<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs,express,mysql" alt="Backend Stack" />
  </a>
</p>

---

### Levantar el servidor API

```bash
npm install
npm run dev
```

### Migra la base de Datos

```
npx sequelize-cli db:migrate
```

### Crear usuario Adminitrador

http://localhost:5000/api/auth/setup


```bash
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```
```json
{
  "name": "Aministrador",
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

> **Nota:** Recuerda configurar tu base de datos en el archivo `.env` y ejecutar las migraciones si es necesario.
