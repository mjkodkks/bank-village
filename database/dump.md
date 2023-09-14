```sh
### for dump and import db
pg_dump -h {host} -U {user} {name} -O -x > ~/dump.sql
psql -h {host} -U {user} {name} < dump.sql
```

```sh
### for dump for pg in docker
docker exec -t {your-db-container} pg_dumpall -c -U postgres > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

## restore
cat {your_dump.sql} | docker exec -i {your-db-container} psql -U {your-db-user} -d {your-db-name}
```