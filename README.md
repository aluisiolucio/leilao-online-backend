# Leilão API

1 - Criar VPC (Rede privada)
2 - Criar subnets pública (APP e API) e privada (Banco de dados)
4 - Criar ou importar chaves SSH
5 - Criar Security Groups
6 - Criar instâncias de EC2 para API, APP e DB
7 - Criar Internet Gateway
8 - Criar Nat Gateway para máquina privada
9 - Criar Route Tables para todas as instâncias de EC2

docker exec -e PGPASSWORD=postgres -t leilao-api-postgres-1 pg_dump -U postgres -F c -b -v -f "/tmp/auction.dump" auction

docker cp leilao-api-postgres-1:/tmp/auction.dump .

scp -i ~/.ssh/id_rsa auction.dump ubuntu@3.237.93.95:/home/ubuntu

scp -i ~/.ssh/id_rsa auction.dump ubuntu@10.0.0.150:/home/ubuntu

docker cp auction.dump postgres:/tmp/auction.dump

docker exec -e PGPASSWORD=postgres -t postgres pg_restore -U postgres -d auction -C -v "/tmp/auction.dump"
