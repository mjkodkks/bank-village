```sh
### for dump and import db
pg_dump -h {host} -U {user} {name} -O -x > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
psql -h {host} -U {user} {name} < dump.sql

# alternative dump
pg_dump --no-owner --dbname=postgresql://username:password@host:port/database > file.sql

# examples dump:
pg_dump -h localhost -U postgres -O -x > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
# examples restore:
psql -h localhost -p 5432 -U postgres < dump_20-09-2023_01_44_59.sql
```

```sh
### for dump for pg in docker
docker exec -t {your-db-container} pg_dumpall -c -U postgres > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

## restore
cat {your_dump.sql} | docker exec -i {your-db-container} psql -U {your-db-user} -d {your-db-name}
```