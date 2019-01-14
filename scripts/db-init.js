/**
 * Created by sharanya.p on 11/20/2018.
 */
//db-init.js
var cassandra = require('cassandra-driver');
const CASSANDRA_IP = process.env.CASSANDRA_IP || '127.0.0.1';

var client = new cassandra.Client({contactPoints: [CASSANDRA_IP]});

/*
 * GET home page.
 */

const KEYSPACE_NAME = 'workshop247'

function init_cassandra(){

    client.connect()
        .then(function () {
            const query = `CREATE KEYSPACE IF NOT EXISTS ${KEYSPACE_NAME} WITH replication =
			  {'class': 'SimpleStrategy', 'replication_factor': '1' }`;
            return client.execute(query);
        })
        .then(function () {
            const query = `CREATE TABLE IF NOT EXISTS ${KEYSPACE_NAME}.products 
				 (id uuid, name text,  price int, PRIMARY KEY (id))`;
            return client.execute(query);
        })
        .then(function () {
            return client.metadata.getTable(KEYSPACE_NAME, 'products');
        })
        .then(function (table) {
            console.log('Table information');
            console.log('- Name: %s', table.name);
            console.log('- Columns:', table.columns);
            console.log('- Partition keys:', table.partitionKeys);
            console.log('- Clustering keys:', table.clusteringKeys);
        })
        .then(function () {
            console.log('Read cluster info');
            var str = '{"hosts": [';
            var i = 0;
            client.hosts.forEach(function (host) {
                i++;
                str += '{"address" : "' + host.address + '", "version" : "' + host.cassandraVersion + '", "rack" : "' + host.rack + '", "datacenter" : "' + host.datacenter + '"}';
                console.log("hosts.length: " + client.hosts.length);
                if (i < client.hosts.length)
                    str += ',';

            });
            str += ']}';
            console.log('JSON string: ' + str);
            var jsonHosts = JSON.parse(str);
            //res.render('cassandra', {page_title:"Cassandra Details", data: jsonHosts.hosts});
            console.log('initCassandra: success', jsonHosts);
        })
        .catch(function (err) {
            console.error('There was an error', err);
            //res.status(404).send({msg: err});
            return client.shutdown();
        });

};

init_cassandra()