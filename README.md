### Launch application

To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

### posgresql

```sh
# download image docker
docker pull postgres
# create instance
docker run --name rplane-postgres -e POSTGRES_USER=rplane -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
# connect to pg
PGPASSWORD=mysecretpassword psql -U rplane -p 5432 -h  127.0.0.1
# create
CREATE DATABASE rplane;
# exit postgresql
cp .env.exemple .env
# alter .env DATABASE_URL with your config
npx prisma db push
```